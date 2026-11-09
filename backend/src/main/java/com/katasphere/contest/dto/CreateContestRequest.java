package com.katasphere.contest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CreateContestRequest(
    @NotBlank(message = "College name is required")
    @Size(max = 255)
    String collegeName,

    @NotBlank(message = "Title is required")
    @Size(max = 255)
    String title,

    @Size(max = 255)
    String slug,

    String description,

    @NotBlank(message = "Access code is required")
    @Size(min = 3, max = 50)
    String accessCode,

    @NotNull(message = "Start time is required")
    Instant startTime,

    @NotNull(message = "End time is required")
    Instant endTime,

    int durationMinutes,

    String scoringSystem,

    Boolean allowTabSwitch,

    Integer maxTabSwitches,

    Boolean isPublished,

    List<ProblemConfig> problems
) {
    public record ProblemConfig(
        @NotNull UUID problemId,
        int points,
        int order
    ) {}
}
