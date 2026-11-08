package com.katasphere.execution;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ExecutionRateLimiterTest {

    private ExecutionRateLimiter rateLimiter;

    @BeforeEach
    void setUp() {
        rateLimiter = new ExecutionRateLimiter();
    }

    @Test
    @DisplayName("Should allow requests within RUN limit (20 req/min)")
    void testRunRateLimitAllowed() {
        String clientId = "user:123";
        for (int i = 0; i < 20; i++) {
            var result = rateLimiter.tryAcquire(clientId, ExecutionRateLimiter.ExecutionType.RUN);
            assertTrue(result.allowed(), "Request " + (i + 1) + " should be allowed");
            assertEquals(20, result.limit());
            assertEquals(20 - (i + 1), result.remaining());
        }

        // 21st request should be rejected
        var rejected = rateLimiter.tryAcquire(clientId, ExecutionRateLimiter.ExecutionType.RUN);
        assertFalse(rejected.allowed());
        assertEquals(0, rejected.remaining());
        assertTrue(rejected.resetSeconds() > 0);
    }

    @Test
    @DisplayName("Should enforce SUBMIT limit independently (10 req/min)")
    void testSubmitRateLimitAllowed() {
        String clientId = "user:456";
        for (int i = 0; i < 10; i++) {
            var result = rateLimiter.tryAcquire(clientId, ExecutionRateLimiter.ExecutionType.SUBMIT);
            assertTrue(result.allowed(), "Submission " + (i + 1) + " should be allowed");
            assertEquals(10, result.limit());
        }

        // 11th submit should be rejected
        var rejected = rateLimiter.tryAcquire(clientId, ExecutionRateLimiter.ExecutionType.SUBMIT);
        assertFalse(rejected.allowed());
        assertEquals(0, rejected.remaining());

        // However, RUN should still be allowed under its separate bucket
        var runResult = rateLimiter.tryAcquire(clientId, ExecutionRateLimiter.ExecutionType.RUN);
        assertTrue(runResult.allowed());
    }

    @Test
    @DisplayName("Legacy tryAcquire should default to RUN quota")
    void testLegacyTryAcquire() {
        String ip = "192.168.1.100";
        for (int i = 0; i < 20; i++) {
            assertTrue(rateLimiter.tryAcquire(ip));
        }
        assertFalse(rateLimiter.tryAcquire(ip));
    }
}
