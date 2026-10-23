package com.katasphere.user;

import java.time.Instant;
import java.util.UUID;

public record UserDto(
    UUID id,
    String name,
    String email,
    String avatarUrl,
    String role,
    boolean isPremium,
    Instant createdAt
) {
    public UserDto(UUID id, String name, String email, String avatarUrl, String role, Instant createdAt) {
        this(
            id,
            name,
            email,
            avatarUrl,
            role,
            "PREMIUM".equalsIgnoreCase(role) || "ADMIN".equalsIgnoreCase(role),
            createdAt
        );
    }

    public static UserDto fromEntity(User user) {
        boolean premium = "PREMIUM".equalsIgnoreCase(user.getRole()) || "ADMIN".equalsIgnoreCase(user.getRole());
        return new UserDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getAvatarUrl(),
            user.getRole(),
            premium,
            user.getCreatedAt()
        );
    }
}
