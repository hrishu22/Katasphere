package com.katasphere.execution.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SubmitCodeRequest(
    @NotBlank(message = "Problem slug is required")
    @Size(max = 100, message = "Problem slug cannot exceed 100 characters")
    String problemSlug,

    @NotBlank(message = "Language is required")
    @Pattern(regexp = "(?i)^(JAVA|PYTHON|CPP|JAVASCRIPT)$", message = "Supported languages are JAVA, PYTHON, CPP, and JAVASCRIPT")
    String language,

    @NotBlank(message = "Source code is required")
    @Size(max = 65536, message = "Source code exceeds maximum permitted size of 64KB")
    String sourceCode
) {}
