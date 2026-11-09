package com.katasphere.contest.dto;

import com.katasphere.contest.Contest;
import java.time.Instant;
import java.util.UUID;

public record ContestDto(
    UUID id,
    String collegeName,
    String title,
    String slug,
    String description,
    String accessCode,
    Instant startTime,
    Instant endTime,
    int durationMinutes,
    String scoringSystem,
    boolean allowTabSwitch,
    int maxTabSwitches,
    boolean isPublished,
    int totalProblems,
    long totalParticipants,
    String status // "UPCOMING", "ACTIVE", "PAST"
) {
    public static ContestDto fromEntity(Contest c, int problemCount, long participantCount) {
        Instant now = Instant.now();
        String status;
        if (now.isBefore(c.getStartTime())) {
            status = "UPCOMING";
        } else if (now.isAfter(c.getEndTime())) {
            status = "PAST";
        } else {
            status = "ACTIVE";
        }

        return new ContestDto(
            c.getId(),
            c.getCollegeName(),
            c.getTitle(),
            c.getSlug(),
            c.getDescription(),
            c.getAccessCode(),
            c.getStartTime(),
            c.getEndTime(),
            c.getDurationMinutes(),
            c.getScoringSystem(),
            c.isAllowTabSwitch(),
            c.getMaxTabSwitches(),
            c.isPublished(),
            problemCount,
            participantCount,
            status
        );
    }
}
