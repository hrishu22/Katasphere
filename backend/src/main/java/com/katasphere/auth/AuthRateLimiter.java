package com.katasphere.auth;

import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AuthRateLimiter {

    private static final int MAX_LOGIN_ATTEMPTS_PER_MIN = 10;
    private static final int MAX_REGISTER_ATTEMPTS_PER_MIN = 5;
    private static final long WINDOW_MS = 60_000L;

    private final Map<String, Deque<Long>> loginHistory = new ConcurrentHashMap<>();
    private final Map<String, Deque<Long>> registerHistory = new ConcurrentHashMap<>();

    /**
     * Attempts to acquire a login attempt slot.
     * @param clientIp client IP address
     * @return true if permitted, false if rate limited
     */
    public boolean tryAcquireLogin(String clientIp) {
        return checkLimit(loginHistory, clientIp, MAX_LOGIN_ATTEMPTS_PER_MIN);
    }

    /**
     * Attempts to acquire an account creation slot.
     * @param clientIp client IP address
     * @return true if permitted, false if rate limited
     */
    public boolean tryAcquireRegister(String clientIp) {
        return checkLimit(registerHistory, clientIp, MAX_REGISTER_ATTEMPTS_PER_MIN);
    }

    private boolean checkLimit(Map<String, Deque<Long>> map, String clientIp, int maxAllowed) {
        if (clientIp == null || clientIp.isBlank()) {
            clientIp = "anonymous";
        }

        long now = System.currentTimeMillis();
        Deque<Long> timestamps = map.computeIfAbsent(clientIp, k -> new ArrayDeque<>());

        synchronized (timestamps) {
            while (!timestamps.isEmpty() && now - timestamps.peekFirst() > WINDOW_MS) {
                timestamps.pollFirst();
            }

            if (timestamps.size() >= maxAllowed) {
                return false;
            }

            timestamps.addLast(now);
            return true;
        }
    }
}
