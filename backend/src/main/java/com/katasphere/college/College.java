package com.katasphere.college;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "colleges")
public class College {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "college_code", nullable = false, unique = true, length = 20)
    private String collegeCode;

    @Column(nullable = false)
    private String name;

    @Column(name = "official_email", nullable = false)
    private String officialEmail;

    @Column(name = "expected_students")
    private Integer expectedStudents = 100;

    private String department;
    private String website;
    private String phone;
    private String address;
    private String city;
    private String state;

    @Column(nullable = false)
    private String country = "India";

    @Column(name = "admin_user_id", nullable = false, unique = true)
    private UUID adminUserId;

    @Column(name = "plan_code", nullable = false, length = 40)
    private String planCode = "NONE";

    @Column(name = "plan_name", nullable = false, length = 120)
    private String planName = "No Active Plan";

    @Column(name = "contest_quota_total", nullable = false)
    private int contestQuotaTotal = 0;

    @Column(name = "contests_used", nullable = false)
    private int contestsUsed = 0;

    @Column(name = "plan_expires_at")
    private Instant planExpiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getCollegeCode() { return collegeCode; }
    public void setCollegeCode(String collegeCode) { this.collegeCode = collegeCode; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getOfficialEmail() { return officialEmail; }
    public void setOfficialEmail(String officialEmail) { this.officialEmail = officialEmail; }
    public Integer getExpectedStudents() { return expectedStudents; }
    public void setExpectedStudents(Integer expectedStudents) { this.expectedStudents = expectedStudents; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public UUID getAdminUserId() { return adminUserId; }
    public void setAdminUserId(UUID adminUserId) { this.adminUserId = adminUserId; }

    public String getPlanCode() { return planCode; }
    public void setPlanCode(String planCode) { this.planCode = planCode; }
    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }
    public int getContestQuotaTotal() { return contestQuotaTotal; }
    public void setContestQuotaTotal(int contestQuotaTotal) { this.contestQuotaTotal = contestQuotaTotal; }
    public int getContestsUsed() { return contestsUsed; }
    public void setContestsUsed(int contestsUsed) { this.contestsUsed = contestsUsed; }
    public Instant getPlanExpiresAt() { return planExpiresAt; }
    public void setPlanExpiresAt(Instant planExpiresAt) { this.planExpiresAt = planExpiresAt; }

    public int getContestsLeft() {
        return Math.max(0, contestQuotaTotal - contestsUsed);
    }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
