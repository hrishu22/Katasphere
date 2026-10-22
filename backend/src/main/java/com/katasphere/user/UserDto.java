package com.katasphere.user;

import java.time.Instant;
import java.util.UUID;

public record UserDto(
    UUID id,
    String name,
    String email,
    String avatarUrl,
    String role,
    Instant createdAt
) {
    public static UserDto fromEntity(User user) {
        return new UserDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getAvatarUrl(),
            user.getRole(),
            user.getCreatedAt()
        );
    }
}
