package com.katasphere.problem;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "test_cases")
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(nullable = false)
    private int position = 1;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String input;

    @Column(name = "expected_output", columnDefinition = "TEXT", nullable = false)
    private String expectedOutput;

    @Column(name = "is_hidden", nullable = false)
    private boolean isHidden = false;

    public TestCase() {}

    public TestCase(Problem problem, int position, String input, String expectedOutput, boolean isHidden) {
        this.problem = problem;
        this.position = position;
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.isHidden = isHidden;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }

    public String getInput() { return input; }
    public void setInput(String input) { this.input = input; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public boolean isHidden() { return isHidden; }
    public void setHidden(boolean hidden) { isHidden = hidden; }
}
