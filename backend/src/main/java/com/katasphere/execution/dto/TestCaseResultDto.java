package com.katasphere.execution.dto;

public record TestCaseResultDto(
    int caseNumber,
    boolean passed,
    String input,
    String expectedOutput,
    String actualOutput,
    String error,
    Long executionTimeMs,
    Long memoryKb,
    String status,
    String stdout
) {
    public TestCaseResultDto(
        int caseNumber,
        boolean passed,
        String input,
        String expectedOutput,
        String actualOutput,
        String error,
        Long executionTimeMs,
        Long memoryKb,
        String status
    ) {
        this(caseNumber, passed, input, expectedOutput, actualOutput, error, executionTimeMs, memoryKb, status, null);
    }
}
