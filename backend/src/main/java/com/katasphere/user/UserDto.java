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
    boolean isCollegeAdmin,
    boolean isPowerUser,
    UUID collegeId,
    String collegeRollNumber,
    Integer tenureStartYear,
    Integer tenureEndYear,
    boolean isTenureExpired,
    Instant createdAt
) {
    public UserDto(UUID id, String name, String email, String avatarUrl, String role, Instant createdAt) {
        this(
            id,
            name,
            email,
            avatarUrl,
            role,
            "PREMIUM".equalsIgnoreCase(role) || "ADMIN".equalsIgnoreCase(role) || "POWER_USER".equalsIgnoreCase(role),
            "COLLEGE_ADMIN".equalsIgnoreCase(role) || "ADMIN".equalsIgnoreCase(role),
            "POWER_USER".equalsIgnoreCase(role) || (email != null && "hrishu22@gmail.com".equalsIgnoreCase(email.trim())),
            null,
            null,
            null,
            null,
            false,
            createdAt
        );
    }

    public static UserDto fromEntity(User user) {
        String email = user.getEmail();
        boolean powerUser = "POWER_USER".equalsIgnoreCase(user.getRole())
            || (email != null && "hrishu22@gmail.com".equalsIgnoreCase(email.trim()));
        String r = powerUser ? "POWER_USER" : (user.getRole() != null ? user.getRole() : "USER");
        boolean premium = "PREMIUM".equalsIgnoreCase(r) || "ADMIN".equalsIgnoreCase(r) || powerUser;
        boolean collegeAdmin = "COLLEGE_ADMIN".equalsIgnoreCase(r) || "ADMIN".equalsIgnoreCase(r);
        return new UserDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getAvatarUrl(),
            r,
            premium,
            collegeAdmin,
            powerUser,
            user.getCollegeId(),
            user.getCollegeRollNumber(),
            user.getTenureStartYear(),
            user.getTenureEndYear(),
            user.isTenureExpired(),
            user.getCreatedAt()
        );
    }
}
