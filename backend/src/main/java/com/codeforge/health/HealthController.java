package com.codeforge.health;

import com.codeforge.common.ApiResponse;
import com.codeforge.common.HealthResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @Value("${spring.profiles.active:local}")
    private String activeProfile;

    @GetMapping
    public ResponseEntity<ApiResponse<HealthResponse>> checkHealth() {
        HealthResponse response = new HealthResponse(
            "UP",
            "codeforge-backend",
            "1.0.0",
            activeProfile,
            Instant.now()
        );
        return ResponseEntity.ok(ApiResponse.ok("CodeForge service is operational", response));
    }
}
