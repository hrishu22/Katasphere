package com.katasphere.problem;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "problem_examples")
public class ProblemExample {

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

    @Column(columnDefinition = "TEXT")
    private String explanation;

    public ProblemExample() {}

    public ProblemExample(Problem problem, int position, String input, String expectedOutput, String explanation) {
        this.problem = problem;
        this.position = position;
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.explanation = explanation;
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

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
