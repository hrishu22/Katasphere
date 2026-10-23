package com.katasphere.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AuthRateLimiterTest {

    private AuthRateLimiter rateLimiter;

    @BeforeEach
    void setUp() {
        rateLimiter = new AuthRateLimiter();
    }

    @Test
    @DisplayName("Login rate limiter permits up to 10 attempts and blocks the 11th")
    void testLoginRateLimit() {
        String ip = "192.168.1.100";
        for (int i = 0; i < 10; i++) {
            assertTrue(rateLimiter.tryAcquireLogin(ip), "Attempt " + (i + 1) + " should be allowed");
        }
        assertFalse(rateLimiter.tryAcquireLogin(ip), "11th attempt should be blocked");
    }

    @Test
    @DisplayName("Register rate limiter permits up to 5 attempts and blocks the 6th")
    void testRegisterRateLimit() {
        String ip = "192.168.1.200";
        for (int i = 0; i < 5; i++) {
            assertTrue(rateLimiter.tryAcquireRegister(ip), "Attempt " + (i + 1) + " should be allowed");
        }
        assertFalse(rateLimiter.tryAcquireRegister(ip), "6th attempt should be blocked");
    }

    @Test
    @DisplayName("Different IPs have isolated rate limits")
    void testIsolatedIpLimits() {
        String ip1 = "10.0.0.1";
        String ip2 = "10.0.0.2";

        for (int i = 0; i < 10; i++) {
            assertTrue(rateLimiter.tryAcquireLogin(ip1));
        }
        assertFalse(rateLimiter.tryAcquireLogin(ip1));

        // ip2 should still be allowed
        assertTrue(rateLimiter.tryAcquireLogin(ip2));
    }
}
