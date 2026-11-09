package com.katasphere.contest.dto;

import com.katasphere.contest.ContestSubmission;
import java.time.Instant;
import java.util.UUID;

public record ContestSubmissionDto(
    UUID id,
    UUID problemId,
    String problemSlug,
    String problemTitle,
    String language,
    String verdict,
    int passedTestCases,
    int totalTestCases,
    int pointsAwarded,
    Long executionTimeMs,
    Long memoryKb,
    String errorMessage,
    Instant createdAt,
    String studentName
) {
    public static ContestSubmissionDto fromEntity(ContestSubmission cs) {
        return new ContestSubmissionDto(
            cs.getId(),
            cs.getProblem().getId(),
            cs.getProblem().getSlug(),
            cs.getProblem().getTitle(),
            cs.getLanguage(),
            cs.getVerdict(),
            cs.getPassedTestCases(),
            cs.getTotalTestCases(),
            cs.getPointsAwarded(),
            cs.getExecutionTimeMs(),
            cs.getMemoryKb(),
            cs.getErrorMessage(),
            cs.getCreatedAt(),
            cs.getParticipant().getUser().getName()
        );
    }
}
