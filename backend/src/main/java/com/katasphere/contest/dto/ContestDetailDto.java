package com.katasphere.contest.dto;

import com.katasphere.contest.Contest;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ContestDetailDto(
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
    String status,
    long serverTimeMs,
    List<ContestProblemDto> problems
) {
    public static ContestDetailDto fromEntity(Contest c, List<ContestProblemDto> problems) {
        Instant now = Instant.now();
        String status;
        if (now.isBefore(c.getStartTime())) {
            status = "UPCOMING";
        } else if (now.isAfter(c.getEndTime())) {
            status = "PAST";
        } else {
            status = "ACTIVE";
        }

        return new ContestDetailDto(
            c.getId(),
            c.getCollegeName(),
            c.getTitle(),
            c.getSlug(),
            c.getDescription(),
            null, // access code is never sent to clients in the detail view
            c.getStartTime(),
            c.getEndTime(),
            c.getDurationMinutes(),
            c.getScoringSystem(),
            c.isAllowTabSwitch(),
            c.getMaxTabSwitches(),
            c.isPublished(),
            status,
            now.toEpochMilli(),
            problems != null ? problems : List.of()
        );
    }
}
