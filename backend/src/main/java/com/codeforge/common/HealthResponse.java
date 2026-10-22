package com.codeforge.common;

import java.time.Instant;

public record HealthResponse(
    String status,
    String service,
    String version,
    String environment,
    Instant timestamp
) {}
