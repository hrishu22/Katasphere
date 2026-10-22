package com.katasphere.execution.dto;

import jakarta.validation.constraints.NotBlank;

public record SubmitCodeRequest(
    @NotBlank(message = "Problem slug is required")
    String problemSlug,

    @NotBlank(message = "Language is required")
    String language,

    @NotBlank(message = "Source code is required")
    String sourceCode
) {}
