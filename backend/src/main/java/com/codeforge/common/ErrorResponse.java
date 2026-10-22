package com.codeforge.common;

import java.time.Instant;
import java.util.Map;

public record ErrorResponse(
    String type,
    String message,
    Map<String, String> fieldErrors,
    String requestId,
    Instant timestamp
) {
    public static ErrorResponse of(String type, String message, String requestId) {
        return new ErrorResponse(type, message, Map.of(), requestId, Instant.now());
    }

    public static ErrorResponse validation(String message, Map<String, String> fieldErrors, String requestId) {
        return new ErrorResponse("VALIDATION_ERROR", message, fieldErrors, requestId, Instant.now());
    }
}
