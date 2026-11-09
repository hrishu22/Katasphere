package com.katasphere.contest;

import com.katasphere.problem.Problem;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "contest_problems", uniqueConstraints = {
    @UniqueConstraint(name = "uk_contest_problem", columnNames = {"contest_id", "problem_id"})
})
public class ContestProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "contest_id", nullable = false)
    private Contest contest;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(name = "problem_order", nullable = false)
    private int problemOrder = 1;

    @Column(nullable = false)
    private int points = 100;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public ContestProblem() {}

    public ContestProblem(Contest contest, Problem problem, int problemOrder, int points) {
        this.contest = contest;
        this.problem = problem;
        this.problemOrder = problemOrder;
        this.points = points;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Contest getContest() { return contest; }
    public void setContest(Contest contest) { this.contest = contest; }

    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }

    public int getProblemOrder() { return problemOrder; }
    public void setProblemOrder(int problemOrder) { this.problemOrder = problemOrder; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public Instant getCreatedAt() { return createdAt; }
}
