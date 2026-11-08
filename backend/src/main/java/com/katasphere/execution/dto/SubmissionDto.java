package com.katasphere.execution.dto;

import com.katasphere.submission.Submission;
import java.time.Instant;
import java.util.UUID;

public record SubmissionDto(
    UUID id,
    String problemSlug,
    String problemTitle,
    String language,
    String verdict,
    int passedTestCases,
    int totalTestCases,
    Long executionTimeMs,
    Long memoryKb,
    String errorMessage,
    Instant createdAt,
    TestCaseResultDto failedTestCase
) {
    public static SubmissionDto fromEntity(Submission s, TestCaseResultDto failedTestCase) {
        return new SubmissionDto(
            s.getId(),
            s.getProblem().getSlug(),
            s.getProblem().getTitle(),
            s.getLanguage(),
            s.getVerdict(),
            s.getPassedTestCases(),
            s.getTotalTestCases(),
            s.getExecutionTimeMs(),
            s.getMemoryKb(),
            s.getErrorMessage(),
            s.getCreatedAt(),
            failedTestCase
        );
    }

    public static SubmissionDto fromEntity(Submission s) {
        return fromEntity(s, null);
    }
}
