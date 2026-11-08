package com.katasphere.execution;

import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * High-performance sliding-window rate limiter.
 * Protects execution and submission endpoints against abuse and DoS surges.
 * Distinguishes between RUN (20 req/min) and SUBMIT (10 req/min) operations.
 */
@Component
public class ExecutionRateLimiter {

    public enum ExecutionType {
        RUN(20),
        SUBMIT(10);

        private final int maxPerMinute;

        ExecutionType(int maxPerMinute) {
            this.maxPerMinute = maxPerMinute;
        }

        public int getMaxPerMinute() {
            return maxPerMinute;
        }
    }

    public record RateLimitResult(
        boolean allowed,
        int limit,
        int remaining,
        long resetSeconds
    ) {}

    private static final long WINDOW_MS = 60_000L;
    private static final long CLEANUP_INTERVAL_MS = 120_000L;

    private final Map<String, Deque<Long>> requestHistory = new ConcurrentHashMap<>();
    private volatile long lastCleanupTime = System.currentTimeMillis();

    /**
     * Checks if an action is permitted under the sliding-window rate limit.
     *
     * @param clientIdentifier IP address or user ID
     * @param type RUN or SUBMIT execution type
     * @return RateLimitResult with decision, remaining quota, and reset timestamp
     */
    public RateLimitResult tryAcquire(String clientIdentifier, ExecutionType type) {
        if (clientIdentifier == null || clientIdentifier.isBlank()) {
            clientIdentifier = "anonymous";
        }

        int limit = type != null ? type.getMaxPerMinute() : ExecutionType.RUN.getMaxPerMinute();
        String bucketKey = (type != null ? type.name() : "RUN") + ":" + clientIdentifier;
        long now = System.currentTimeMillis();

        maybeCleanup(now);

        Deque<Long> timestamps = requestHistory.computeIfAbsent(bucketKey, k -> new ArrayDeque<>());

        synchronized (timestamps) {
            // Evict requests outside the sliding 60-second window
            while (!timestamps.isEmpty() && now - timestamps.peekFirst() > WINDOW_MS) {
                timestamps.pollFirst();
            }

            int currentCount = timestamps.size();
            long oldestTimestamp = timestamps.isEmpty() ? now : timestamps.peekFirst();
            long resetSeconds = Math.max(1L, (WINDOW_MS - (now - oldestTimestamp)) / 1000L);

            if (currentCount >= limit) {
                return new RateLimitResult(false, limit, 0, resetSeconds);
            }

            timestamps.addLast(now);
            int remaining = Math.max(0, limit - (currentCount + 1));
            return new RateLimitResult(true, limit, remaining, resetSeconds);
        }
    }

    /**
     * Legacy single-argument check for backward compatibility. Defaults to RUN limit.
     */
    public boolean tryAcquire(String clientIdentifier) {
        return tryAcquire(clientIdentifier, ExecutionType.RUN).allowed();
    }

    public int getMaxRequestsPerMinute() {
        return ExecutionType.RUN.getMaxPerMinute();
    }

    public int getMaxSubmissionsPerMinute() {
        return ExecutionType.SUBMIT.getMaxPerMinute();
    }

    /**
     * Periodically evicts stale keys from the map to prevent unbounded memory growth.
     */
    private void maybeCleanup(long now) {
        if (now - lastCleanupTime > CLEANUP_INTERVAL_MS) {
            synchronized (this) {
                if (now - lastCleanupTime > CLEANUP_INTERVAL_MS) {
                    lastCleanupTime = now;
                    Iterator<Map.Entry<String, Deque<Long>>> it = requestHistory.entrySet().iterator();
                    while (it.hasNext()) {
                        Map.Entry<String, Deque<Long>> entry = it.next();
                        Deque<Long> queue = entry.getValue();
                        synchronized (queue) {
                            while (!queue.isEmpty() && now - queue.peekFirst() > WINDOW_MS) {
                                queue.pollFirst();
                            }
                            if (queue.isEmpty()) {
                                it.remove();
                            }
                        }
                    }
                }
            }
        }
    }
}
