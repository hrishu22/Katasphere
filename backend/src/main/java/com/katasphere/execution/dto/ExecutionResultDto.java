package com.katasphere.execution.dto;

import java.time.Instant;
import java.util.List;

public record ExecutionResultDto(
    String verdict,               // ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, COMPILATION_ERROR, RUNTIME_ERROR, INTERNAL_ERROR
    int totalTestCases,
    int passedTestCases,
    Long runtimeMs,
    Long memoryKb,
    String compileOutput,
    String errorMessage,
    List<TestCaseResultDto> testCases,
    Instant timestamp
) {}
