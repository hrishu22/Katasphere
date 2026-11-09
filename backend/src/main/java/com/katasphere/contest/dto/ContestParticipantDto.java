package com.katasphere.contest.dto;

import com.katasphere.contest.Contest;
import com.katasphere.contest.ContestParticipant;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

public record ContestParticipantDto(
    UUID id,
    UUID contestId,
    UUID userId,
    String studentName,
    String studentEmail,
    Instant startedAt,
    Instant submittedAt,
    int totalScore,
    int penaltySeconds,
    int tabSwitchCount,
    String status,
    long timeRemainingSeconds
) {
    public static ContestParticipantDto fromEntity(ContestParticipant cp) {
        Contest c = cp.getContest();
        Instant now = Instant.now();

        // Server authoritative remaining time calculation:
        // Expiration is min(started_at + duration_minutes, contest.end_time)
        Instant durationExpiry = cp.getStartedAt().plus(Duration.ofMinutes(c.getDurationMinutes()));
        Instant hardExpiry = c.getEndTime();
        Instant effectiveExpiry = durationExpiry.isBefore(hardExpiry) ? durationExpiry : hardExpiry;

        long remainingSec = 0;
        // A flagged candidate keeps writing; the flag is for faculty review, not an ejection.
        boolean live = "IN_PROGRESS".equalsIgnoreCase(cp.getStatus()) || "FLAGGED_VIOLATION".equalsIgnoreCase(cp.getStatus());
        if (live && now.isBefore(effectiveExpiry)) {
            remainingSec = Duration.between(now, effectiveExpiry).getSeconds();
        }

        return new ContestParticipantDto(
            cp.getId(),
            c.getId(),
            cp.getUser().getId(),
            cp.getUser().getName(),
            cp.getUser().getEmail(),
            cp.getStartedAt(),
            cp.getSubmittedAt(),
            cp.getTotalScore(),
            cp.getPenaltySeconds(),
            cp.getTabSwitchCount(),
            cp.getStatus(),
            remainingSec
        );
    }
}
