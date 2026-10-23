package com.katasphere.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Normalizes cloud database URLs (from Render, Supabase, Railway, etc.)
 * into Spring Boot's required spring.datasource.* properties before Hikari/Flyway boot.
 * Supports:
 * - postgresql://user:password@host:port/database
 * - postgres://user:password@host:port/database
 * - jdbc:postgresql://host:port/database
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String rawUrl = environment.getProperty("DATABASE_URL");
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = environment.getProperty("SUPABASE_DB_URL");
        }
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = environment.getProperty("DB_URL");
        }

        if (rawUrl == null || rawUrl.isBlank()) {
            return;
        }

        rawUrl = rawUrl.trim();
        Map<String, Object> props = new HashMap<>();

        if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
            try {
                String parseable = rawUrl.startsWith("postgres://")
                        ? "postgresql://" + rawUrl.substring("postgres://".length())
                        : rawUrl;
                URI uri = new URI(parseable);

                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath();
                if (path == null || path.isEmpty() || path.equals("/")) {
                    path = "/postgres";
                }

                String query = uri.getQuery();
                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                if (query != null && !query.isBlank()) {
                    jdbcUrl += "?" + query;
                } else if (!jdbcUrl.contains("sslmode=")) {
                    jdbcUrl += "?sslmode=require";
                }

                props.put("katasphere.datasource.jdbc-url", jdbcUrl);
                props.put("spring.datasource.url", jdbcUrl);

                if (uri.getUserInfo() != null && !uri.getUserInfo().isBlank()) {
                    String[] userInfo = uri.getUserInfo().split(":", 2);
                    String user = URLDecoder.decode(userInfo[0], StandardCharsets.UTF_8);
                    props.put("katasphere.datasource.username", user);
                    props.put("spring.datasource.username", user);

                    if (userInfo.length > 1) {
                        String pass = URLDecoder.decode(userInfo[1], StandardCharsets.UTF_8);
                        props.put("katasphere.datasource.password", pass);
                        props.put("spring.datasource.password", pass);
                    }
                }
                props.put("spring.datasource.driver-class-name", "org.postgresql.Driver");
            } catch (Exception e) {
                String fallback = rawUrl.startsWith("jdbc:") ? rawUrl : "jdbc:" + rawUrl;
                props.put("katasphere.datasource.jdbc-url", fallback);
                props.put("spring.datasource.url", fallback);
            }
        } else if (rawUrl.startsWith("jdbc:postgresql://")) {
            props.put("katasphere.datasource.jdbc-url", rawUrl);
            props.put("spring.datasource.url", rawUrl);
            props.put("spring.datasource.driver-class-name", "org.postgresql.Driver");
        }

        // Allow explicit username override
        String dbUser = environment.getProperty("DB_USERNAME");
        if (dbUser == null || dbUser.isBlank()) {
            dbUser = environment.getProperty("SUPABASE_DB_USERNAME");
        }
        if (dbUser != null && !dbUser.isBlank()) {
            props.put("katasphere.datasource.username", dbUser);
            props.put("spring.datasource.username", dbUser);
        }

        // Allow explicit password override
        String dbPass = environment.getProperty("DB_PASSWORD");
        if (dbPass == null || dbPass.isBlank()) {
            dbPass = environment.getProperty("SUPABASE_DB_PASSWORD");
        }
        if (dbPass != null && !dbPass.isBlank()) {
            props.put("katasphere.datasource.password", dbPass);
            props.put("spring.datasource.password", dbPass);
        }

        if (!props.isEmpty()) {
            environment.getPropertySources().addFirst(new MapPropertySource("cloudDatabaseProperties", props));
        }
    }
}
