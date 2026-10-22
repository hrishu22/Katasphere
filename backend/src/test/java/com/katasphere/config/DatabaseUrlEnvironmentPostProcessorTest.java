package com.katasphere.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class DatabaseUrlEnvironmentPostProcessorTest {

    private final DatabaseUrlEnvironmentPostProcessor processor = new DatabaseUrlEnvironmentPostProcessor();

    @Test
    void shouldParseStandardSupabaseUri() {
        ConfigurableEnvironment env = new StandardEnvironment();
        Map<String, Object> initial = new HashMap<>();
        initial.put("DATABASE_URL", "postgresql://postgres:mysecretpass@db.xyzcompany.supabase.co:5432/postgres");
        env.getPropertySources().addFirst(new MapPropertySource("testProps", initial));

        processor.postProcessEnvironment(env, new SpringApplication());

        assertEquals("jdbc:postgresql://db.xyzcompany.supabase.co:5432/postgres?sslmode=require", env.getProperty("spring.datasource.url"));
        assertEquals("postgres", env.getProperty("spring.datasource.username"));
        assertEquals("mysecretpass", env.getProperty("spring.datasource.password"));
    }

    @Test
    void shouldParseRenderInternalPostgresUrl() {
        ConfigurableEnvironment env = new StandardEnvironment();
        Map<String, Object> initial = new HashMap<>();
        initial.put("DATABASE_URL", "postgres://user_123:pass_456@dpg-abc123-a.oregon-postgres.render.com/katasphere_db");
        env.getPropertySources().addFirst(new MapPropertySource("testProps", initial));

        processor.postProcessEnvironment(env, new SpringApplication());

        assertEquals("jdbc:postgresql://dpg-abc123-a.oregon-postgres.render.com:5432/katasphere_db?sslmode=require", env.getProperty("spring.datasource.url"));
        assertEquals("user_123", env.getProperty("spring.datasource.username"));
        assertEquals("pass_456", env.getProperty("spring.datasource.password"));
    }

    @Test
    void shouldAcceptJdbcUrlDirectly() {
        ConfigurableEnvironment env = new StandardEnvironment();
        Map<String, Object> initial = new HashMap<>();
        initial.put("DB_URL", "jdbc:postgresql://db.xyzcompany.supabase.co:5432/postgres?sslmode=require");
        initial.put("DB_USERNAME", "postgres");
        initial.put("DB_PASSWORD", "secret123");
        env.getPropertySources().addFirst(new MapPropertySource("testProps", initial));

        processor.postProcessEnvironment(env, new SpringApplication());

        assertEquals("jdbc:postgresql://db.xyzcompany.supabase.co:5432/postgres?sslmode=require", env.getProperty("spring.datasource.url"));
        assertEquals("postgres", env.getProperty("spring.datasource.username"));
        assertEquals("secret123", env.getProperty("spring.datasource.password"));
    }
}
