package com.katasphere.problem;

import com.katasphere.common.ApiResponse;
import com.katasphere.problem.dto.CreateProblemRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/problems")
public class ProblemAdminController {

    private final ProblemAdminService problemAdminService;

    @Value("${katasphere.admin.api-key:${KATASPHERE_ADMIN_KEY:katasphere-admin-secret-2026}}")
    private String configuredAdminKey;

    public ProblemAdminController(ProblemAdminService problemAdminService) {
        this.problemAdminService = problemAdminService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProblemDetailDto>> createOrUpdateProblem(
        @Valid @RequestBody CreateProblemRequest request,
        HttpServletRequest httpRequest
    ) {
        if (!isAuthorizedAdmin(httpRequest)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("Access denied. Admin privileges or valid X-Admin-Key required."));
        }

        ProblemDetailDto problem = problemAdminService.createOrUpdateProblem(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Problem saved successfully", problem));
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<ProblemDetailDto>>> importBatch(
        @RequestBody List<CreateProblemRequest> requests,
        HttpServletRequest httpRequest
    ) {
        if (!isAuthorizedAdmin(httpRequest)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("Access denied. Admin privileges or valid X-Admin-Key required."));
        }

        List<ProblemDetailDto> problems = problemAdminService.importProblemsBatch(requests);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(problems.size() + " problems imported successfully", problems));
    }

    private boolean isAuthorizedAdmin(HttpServletRequest request) {
        String adminKey = request.getHeader("X-Admin-Key");
        if (adminKey != null && !adminKey.isBlank() && adminKey.equals(configuredAdminKey)) {
            return true;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }

        return false;
    }
}
