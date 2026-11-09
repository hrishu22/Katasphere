package com.katasphere.contest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record ContestSubmitCodeRequest(
    @NotNull(message = "Problem ID is required")
    UUID problemId,

    @NotBlank(message = "Language is required")
    @Pattern(
        regexp = "^(PYTHON|JAVA|CPP|JAVASCRIPT)$",
        message = "Unsupported language. Allowed: PYTHON, JAVA, CPP, JAVASCRIPT"
    )
    String language,

    @NotBlank(message = "Source code is required")
    @Size(max = 65536, message = "Code size must not exceed 64 KB")
    String sourceCode
) {}
