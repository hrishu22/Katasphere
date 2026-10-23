package com.katasphere.execution;

import com.katasphere.common.ApiResponse;
import com.katasphere.execution.dto.ExecutionResultDto;
import com.katasphere.execution.dto.RunCodeRequest;
import com.katasphere.execution.dto.SubmissionDto;
import com.katasphere.execution.dto.SubmitCodeRequest;
import com.katasphere.user.User;
import com.katasphere.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/submissions")
public class SubmissionController {

    private final ExecutionService executionService;
    private final UserRepository userRepository;
    private final ExecutionRateLimiter rateLimiter;

    public SubmissionController(
        ExecutionService executionService,
        UserRepository userRepository,
        ExecutionRateLimiter rateLimiter
    ) {
        this.executionService = executionService;
        this.userRepository = userRepository;
        this.rateLimiter = rateLimiter;
    }

    @PostMapping("/run")
    public ResponseEntity<ApiResponse<ExecutionResultDto>> runCode(
        @Valid @RequestBody RunCodeRequest request,
        HttpServletRequest httpRequest
    ) {
        String clientIp = resolveClientIp(httpRequest);
        if (!rateLimiter.tryAcquire(clientIp)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(
                ApiResponse.error("Rate limit exceeded. Please wait before executing code again (limit: "
                    + rateLimiter.getMaxRequestsPerMinute() + " requests/min).")
            );
        }

        ExecutionResultDto result = executionService.runCode(request);
        return ResponseEntity.ok(ApiResponse.ok("Code execution completed", result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubmissionDto>> submitCode(
        @Valid @RequestBody SubmitCodeRequest request,
        HttpServletRequest httpRequest
    ) {
        String clientIp = resolveClientIp(httpRequest);
        if (!rateLimiter.tryAcquire(clientIp)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(
                ApiResponse.error("Rate limit exceeded. Please wait before submitting code again (limit: "
                    + rateLimiter.getMaxRequestsPerMinute() + " requests/min).")
            );
        }

        User user = resolveCurrentUser(httpRequest);
        SubmissionDto submission = executionService.submitCode(request, user);
        return ResponseEntity.ok(ApiResponse.ok("Code submitted successfully", submission));
    }

    @GetMapping("/problem/{slug}")
    public ResponseEntity<ApiResponse<List<SubmissionDto>>> getProblemSubmissions(
        @PathVariable String slug,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        List<SubmissionDto> submissions = executionService.getProblemSubmissions(user, slug);
        return ResponseEntity.ok(ApiResponse.ok("Submissions retrieved", submissions));
    }

    private User resolveCurrentUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("USER_ID") != null) {
            UUID userId = (UUID) session.getAttribute("USER_ID");
            return userRepository.findById(userId).orElse(null);
        }
        return null;
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
