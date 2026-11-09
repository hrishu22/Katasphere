package com.katasphere.contest;

import com.katasphere.user.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "contest_participants", uniqueConstraints = {
    @UniqueConstraint(name = "uk_contest_participant", columnNames = {"contest_id", "user_id"})
})
public class ContestParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "contest_id", nullable = false)
    private Contest contest;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt = Instant.now();

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @Column(name = "total_score", nullable = false)
    private int totalScore = 0;

    @Column(name = "penalty_seconds", nullable = false)
    private int penaltySeconds = 0;

    @Column(name = "tab_switch_count", nullable = false)
    private int tabSwitchCount = 0;

    @Column(nullable = false, length = 50)
    private String status = "IN_PROGRESS";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public ContestParticipant() {}

    public ContestParticipant(Contest contest, User user) {
        this.contest = contest;
        this.user = user;
        this.startedAt = Instant.now();
        this.status = "IN_PROGRESS";
        this.totalScore = 0;
        this.penaltySeconds = 0;
        this.tabSwitchCount = 0;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Contest getContest() { return contest; }
    public void setContest(Contest contest) { this.contest = contest; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }

    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }

    public int getTotalScore() { return totalScore; }
    public void setTotalScore(int totalScore) { this.totalScore = totalScore; }

    public int getPenaltySeconds() { return penaltySeconds; }
    public void setPenaltySeconds(int penaltySeconds) { this.penaltySeconds = penaltySeconds; }

    public int getTabSwitchCount() { return tabSwitchCount; }
    public void setTabSwitchCount(int tabSwitchCount) { this.tabSwitchCount = tabSwitchCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
