package com.katasphere.problem;

public record ProblemExampleDto(
    int position,
    String input,
    String expectedOutput,
    String explanation
) {
    public static ProblemExampleDto fromEntity(ProblemExample example) {
        return new ProblemExampleDto(
            example.getPosition(),
            example.getInput(),
            example.getExpectedOutput(),
            example.getExplanation()
        );
    }
}
