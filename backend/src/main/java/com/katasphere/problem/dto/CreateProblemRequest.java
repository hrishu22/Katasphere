package com.katasphere.problem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import java.util.Map;

public record CreateProblemRequest(
    String slug,

    @NotBlank(message = "Title is required")
    String title,

    @NotBlank(message = "Description is required")
    String description,

    @NotBlank(message = "Difficulty is required")
    @Pattern(regexp = "EASY|MEDIUM|HARD", message = "Difficulty must be EASY, MEDIUM, or HARD")
    String difficulty,

    @NotBlank(message = "Constraints are required")
    String constraintsText,

    String inputFormat,
    String outputFormat,
    List<String> tags,
    Map<String, String> starterCode,
    List<ExampleInput> examples,
    List<TestCaseInput> testCases
) {
    public record ExampleInput(
        int position,
        String input,
        String expectedOutput,
        String explanation
    ) {}

    public record TestCaseInput(
        int position,
        String input,
        String expectedOutput,
        boolean isHidden
    ) {}
}
