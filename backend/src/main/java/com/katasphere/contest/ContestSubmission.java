package com.katasphere.contest;

import com.katasphere.problem.Problem;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "contest_submissions")
public class ContestSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "contest_id", nullable = false)
    private Contest contest;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_id", nullable = false)
    private ContestParticipant participant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(nullable = false, length = 50)
    private String language;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String code;

    @Column(nullable = false, length = 50)
    private String verdict;

    @Column(name = "passed_test_cases", nullable = false)
    private int passedTestCases = 0;

    @Column(name = "total_test_cases", nullable = false)
    private int totalTestCases = 0;

    @Column(name = "points_awarded", nullable = false)
    private int pointsAwarded = 0;

    @Column(name = "execution_time_ms")
    private Long executionTimeMs;

    @Column(name = "memory_kb")
    private Long memoryKb;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public ContestSubmission() {}

    public ContestSubmission(
        Contest contest,
        ContestParticipant participant,
        Problem problem,
        String language,
        String code,
        String verdict,
        int passedTestCases,
        int totalTestCases,
        int pointsAwarded,
        Long executionTimeMs,
        Long memoryKb,
        String errorMessage
    ) {
        this.contest = contest;
        this.participant = participant;
        this.problem = problem;
        this.language = language;
        this.code = code;
        this.verdict = verdict;
        this.passedTestCases = passedTestCases;
        this.totalTestCases = totalTestCases;
        this.pointsAwarded = pointsAwarded;
        this.executionTimeMs = executionTimeMs;
        this.memoryKb = memoryKb;
        this.errorMessage = errorMessage;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Contest getContest() { return contest; }
    public void setContest(Contest contest) { this.contest = contest; }

    public ContestParticipant getParticipant() { return participant; }
    public void setParticipant(ContestParticipant participant) { this.participant = participant; }

    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }

    public int getPassedTestCases() { return passedTestCases; }
    public void setPassedTestCases(int passedTestCases) { this.passedTestCases = passedTestCases; }

    public int getTotalTestCases() { return totalTestCases; }
    public void setTotalTestCases(int totalTestCases) { this.totalTestCases = totalTestCases; }

    public int getPointsAwarded() { return pointsAwarded; }
    public void setPointsAwarded(int pointsAwarded) { this.pointsAwarded = pointsAwarded; }

    public Long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(Long executionTimeMs) { this.executionTimeMs = executionTimeMs; }

    public Long getMemoryKb() { return memoryKb; }
    public void setMemoryKb(Long memoryKb) { this.memoryKb = memoryKb; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public Instant getCreatedAt() { return createdAt; }
}
