package com.katasphere.contest;

import com.katasphere.user.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "contests")
public class Contest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id")
    private UUID tenantId;

    @Column(name = "college_name", nullable = false)
    private String collegeName;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "access_code", nullable = false, length = 50)
    private String accessCode;

    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Column(name = "duration_minutes", nullable = false)
    private int durationMinutes = 90;

    @Column(name = "scoring_system", nullable = false, length = 50)
    private String scoringSystem = "POINTS";

    @Column(name = "allow_tab_switch", nullable = false)
    private boolean allowTabSwitch = true;

    @Column(name = "max_tab_switches", nullable = false)
    private int maxTabSwitches = 3;

    @Column(name = "is_published", nullable = false)
    private boolean isPublished = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "contest", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("problemOrder ASC")
    private List<ContestProblem> problems = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public Contest() {}

    public Contest(
        String collegeName,
        String title,
        String slug,
        String description,
        String accessCode,
        Instant startTime,
        Instant endTime,
        int durationMinutes,
        String scoringSystem,
        boolean allowTabSwitch,
        int maxTabSwitches,
        boolean isPublished,
        User createdBy
    ) {
        this.collegeName = collegeName;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.accessCode = accessCode;
        this.startTime = startTime;
        this.endTime = endTime;
        this.durationMinutes = durationMinutes;
        this.scoringSystem = scoringSystem != null ? scoringSystem : "POINTS";
        this.allowTabSwitch = allowTabSwitch;
        this.maxTabSwitches = maxTabSwitches;
        this.isPublished = isPublished;
        this.createdBy = createdBy;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAccessCode() { return accessCode; }
    public void setAccessCode(String accessCode) { this.accessCode = accessCode; }

    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }

    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getScoringSystem() { return scoringSystem; }
    public void setScoringSystem(String scoringSystem) { this.scoringSystem = scoringSystem; }

    public boolean isAllowTabSwitch() { return allowTabSwitch; }
    public void setAllowTabSwitch(boolean allowTabSwitch) { this.allowTabSwitch = allowTabSwitch; }

    public int getMaxTabSwitches() { return maxTabSwitches; }
    public void setMaxTabSwitches(int maxTabSwitches) { this.maxTabSwitches = maxTabSwitches; }

    public boolean isPublished() { return isPublished; }
    public void setPublished(boolean published) { isPublished = published; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public List<ContestProblem> getProblems() { return problems; }
    public void setProblems(List<ContestProblem> problems) { this.problems = problems; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
