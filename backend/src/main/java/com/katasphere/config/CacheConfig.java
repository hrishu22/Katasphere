package com.katasphere.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * In-process cache for read-heavy, rarely-changing data (problem catalogue, tags).
 * Single-instance friendly; swap for Redis when the backend is scaled horizontally.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    public static final String PROBLEM_LIST = "problemList";
    public static final String PROBLEM_DETAIL = "problemDetail";
    public static final String TAGS = "tags";

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager(PROBLEM_LIST, PROBLEM_DETAIL, TAGS);
        manager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(2_000)
            .expireAfterWrite(Duration.ofMinutes(10))
            .recordStats());
        return manager;
    }
}
