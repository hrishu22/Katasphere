package com.katasphere.contest.dto;

import com.katasphere.contest.ContestParticipant;
import java.util.UUID;

public record ContestLeaderboardEntryDto(
    int rank,
    UUID participantId,
    String studentName,
    String studentEmail,
    int totalScore,
    int penaltySeconds,
    String status,
    int tabSwitchCount
) {
    public static ContestLeaderboardEntryDto fromEntity(ContestParticipant cp, int rank) {
        return new ContestLeaderboardEntryDto(
            rank,
            cp.getId(),
            cp.getUser().getName(),
            cp.getUser().getEmail(),
            cp.getTotalScore(),
            cp.getPenaltySeconds(),
            cp.getStatus(),
            cp.getTabSwitchCount()
        );
    }
}
