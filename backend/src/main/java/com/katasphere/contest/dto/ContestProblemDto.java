package com.katasphere.contest.dto;

import com.katasphere.contest.ContestProblem;
import com.katasphere.problem.TestCase;

import java.util.List;
import java.util.UUID;

public record ContestProblemDto(
    UUID problemId,
    String slug,
    String title,
    String difficulty,
    String description,
    String constraintsText,
    String starterCode,
    String inputFormat,
    String outputFormat,
    int points,
    int problemOrder,
    List<PublicTestCaseDto> publicTestCases
) {
    public record PublicTestCaseDto(
        int caseNumber,
        String input,
        String expectedOutput
    ) {}

    /** Pre-exam placeholder: reveals only difficulty and points, never the problem identity. */
    public static ContestProblemDto redacted(ContestProblem cp, int index) {
        return new ContestProblemDto(
            null, null, "Problem " + (char) ('A' + index), cp.getProblem().getDifficulty(),
            null, null, null, null, null, cp.getPoints(), cp.getProblemOrder(), List.of()
        );
    }

    public static ContestProblemDto fromEntity(ContestProblem cp, List<TestCase> publicCases) {
        var p = cp.getProblem();
        List<PublicTestCaseDto> sampleDtos = publicCases != null
            ? publicCases.stream()
                .filter(tc -> !tc.isHidden())
                .map(tc -> new PublicTestCaseDto(tc.getPosition(), tc.getInput(), tc.getExpectedOutput()))
                .toList()
            : List.of();

        return new ContestProblemDto(
            p.getId(),
            p.getSlug(),
            p.getTitle(),
            p.getDifficulty(),
            p.getDescription(),
            p.getConstraintsText(),
            p.getStarterCode(),
            p.getInputFormat(),
            p.getOutputFormat(),
            cp.getPoints(),
            cp.getProblemOrder(),
            sampleDtos
        );
    }
}
