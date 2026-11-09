package com.katasphere.contest.dto;

import jakarta.validation.constraints.NotBlank;

public record JoinContestRequest(
    @NotBlank(message = "Access code is required to join the examination")
    String accessCode
) {}
