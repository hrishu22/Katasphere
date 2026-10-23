package com.katasphere.execution;

import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ExecutionRateLimiter {

    private static final int MAX_REQUESTS_PER_MINUTE = 20;
    private static final long WINDOW_MS = 60_000L;

    private final Map<String, Deque<Long>> requestHistory = new ConcurrentHashMap<>();

    /**
     * Checks if a client is allowed to run code under the rate limit.
     * @param clientIdentifier IP address or user ID
     * @return true if permitted, false if rate limited
     */
    public boolean tryAcquire(String clientIdentifier) {
        if (clientIdentifier == null || clientIdentifier.isBlank()) {
            clientIdentifier = "anonymous";
        }

        long now = System.currentTimeMillis();
        Deque<Long> timestamps = requestHistory.computeIfAbsent(clientIdentifier, k -> new ArrayDeque<>());

        synchronized (timestamps) {
            // Evict requests outside the 60-second window
            while (!timestamps.isEmpty() && now - timestamps.peekFirst() > WINDOW_MS) {
                timestamps.pollFirst();
            }

            if (timestamps.size() >= MAX_REQUESTS_PER_MINUTE) {
                return false;
            }

            timestamps.addLast(now);
            return true;
        }
    }

    public int getMaxRequestsPerMinute() {
        return MAX_REQUESTS_PER_MINUTE;
    }
}
