package com.katasphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@SpringBootApplication
public class KatasphereApplication {

    public static void main(String[] args) {
        normalizeDatabaseProperties();
        SpringApplication.run(KatasphereApplication.class, args);
    }

    private static void normalizeDatabaseProperties() {
        String rawUrl = System.getenv("DATABASE_URL");
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = System.getenv("SUPABASE_DB_URL");
        }
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = System.getenv("DB_URL");
        }
        if (rawUrl == null || rawUrl.isBlank()) {
            return;
        }
        rawUrl = rawUrl.trim();

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

                System.setProperty("spring.datasource.url", jdbcUrl);

                if (uri.getUserInfo() != null && !uri.getUserInfo().isBlank()) {
                    String[] userInfo = uri.getUserInfo().split(":", 2);
                    String user = URLDecoder.decode(userInfo[0], StandardCharsets.UTF_8);
                    System.setProperty("spring.datasource.username", user);

                    if (userInfo.length > 1) {
                        String pass = URLDecoder.decode(userInfo[1], StandardCharsets.UTF_8);
                        System.setProperty("spring.datasource.password", pass);
                    }
                }
                System.setProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");
            } catch (Exception e) {
                if (!rawUrl.startsWith("jdbc:")) {
                    System.setProperty("spring.datasource.url", "jdbc:" + rawUrl);
                }
            }
        } else if (rawUrl.startsWith("jdbc:postgresql://")) {
            System.setProperty("spring.datasource.url", rawUrl);
            System.setProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");
        }

        String dbUser = System.getenv("DB_USERNAME");
        if (dbUser == null || dbUser.isBlank()) {
            dbUser = System.getenv("SUPABASE_DB_USERNAME");
        }
        if (dbUser != null && !dbUser.isBlank()) {
            System.setProperty("spring.datasource.username", dbUser);
        }

        String dbPass = System.getenv("DB_PASSWORD");
        if (dbPass == null || dbPass.isBlank()) {
            dbPass = System.getenv("SUPABASE_DB_PASSWORD");
        }
        if (dbPass != null && !dbPass.isBlank()) {
            System.setProperty("spring.datasource.password", dbPass);
        }
    }
}
