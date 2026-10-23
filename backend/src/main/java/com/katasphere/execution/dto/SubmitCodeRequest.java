package com.katasphere.execution.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SubmitCodeRequest(
    @NotBlank(message = "Problem slug is required")
    String problemSlug,

    @NotBlank(message = "Language is required")
    String language,

    @NotBlank(message = "Source code is required")
    @Size(max = 65536, message = "Source code exceeds maximum permitted size of 64KB")
    String sourceCode
) {}
