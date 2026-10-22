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
    String status
) {}
