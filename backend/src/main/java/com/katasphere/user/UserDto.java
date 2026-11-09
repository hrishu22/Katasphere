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
            "PREMIUM".equalsIgnoreCase(role) || "ADMIN".equalsIgnoreCase(role),
            "COLLEGE_ADMIN".equalsIgnoreCase(role) || "ADMIN".equalsIgnoreCase(role),
            null,
            null,
            null,
            null,
            false,
            createdAt
        );
    }

    public static UserDto fromEntity(User user) {
        String r = user.getRole() != null ? user.getRole() : "USER";
        boolean premium = "PREMIUM".equalsIgnoreCase(r) || "ADMIN".equalsIgnoreCase(r);
        boolean collegeAdmin = "COLLEGE_ADMIN".equalsIgnoreCase(r) || "ADMIN".equalsIgnoreCase(r);
        return new UserDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getAvatarUrl(),
            r,
            premium,
            collegeAdmin,
            user.getCollegeId(),
            user.getCollegeRollNumber(),
            user.getTenureStartYear(),
            user.getTenureEndYear(),
            user.isTenureExpired(),
            user.getCreatedAt()
        );
    }
}
