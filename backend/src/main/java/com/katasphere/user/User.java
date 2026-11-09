package com.katasphere.user;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(nullable = false)
    private String role = "USER";

    /** College the student is affiliated with (nullable for practice-only users). */
    @Column(name = "college_id")
    private UUID collegeId;

    @Column(name = "college_roll_number", length = 64)
    private String collegeRollNumber;

    @Column(name = "tenure_start_year")
    private Integer tenureStartYear;

    @Column(name = "tenure_end_year")
    private Integer tenureEndYear;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public User() {}

    public User(String name, String email, String avatarUrl) {
        this.name = name;
        this.email = email != null ? email.toLowerCase().trim() : null;
        this.avatarUrl = avatarUrl;
        this.role = "USER";
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email != null ? email.toLowerCase().trim() : null; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public UUID getCollegeId() { return collegeId; }
    public void setCollegeId(UUID collegeId) { this.collegeId = collegeId; }

    public String getCollegeRollNumber() { return collegeRollNumber; }
    public void setCollegeRollNumber(String collegeRollNumber) { this.collegeRollNumber = collegeRollNumber; }

    public Integer getTenureStartYear() { return tenureStartYear; }
    public void setTenureStartYear(Integer tenureStartYear) { this.tenureStartYear = tenureStartYear; }

    public Integer getTenureEndYear() { return tenureEndYear; }
    public void setTenureEndYear(Integer tenureEndYear) { this.tenureEndYear = tenureEndYear; }

    /**
     * Returns true if the student has a graduation/pass-out year (tenureEndYear)
     * that is strictly earlier than the current calendar year.
     */
    public boolean isTenureExpired() {
        int currentYear = java.time.Year.now().getValue();
        return tenureEndYear != null && tenureEndYear < currentYear;
    }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
