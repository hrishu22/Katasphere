package com.katasphere.execution;

import com.katasphere.common.ApiResponse;
import com.katasphere.execution.dto.ExecutionResultDto;
import com.katasphere.execution.dto.RunCodeRequest;
import com.katasphere.execution.dto.SubmissionDto;
import com.katasphere.execution.dto.SubmitCodeRequest;
import com.katasphere.submission.SubmissionRepository;
import com.katasphere.user.User;
import com.katasphere.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private final SubmissionRepository submissionRepository;
    private final ExecutionRateLimiter rateLimiter;

    public SubmissionController(
        ExecutionService executionService,
        UserRepository userRepository,
        SubmissionRepository submissionRepository,
        ExecutionRateLimiter rateLimiter
    ) {
        this.executionService = executionService;
        this.userRepository = userRepository;
        this.submissionRepository = submissionRepository;
        this.rateLimiter = rateLimiter;
    }

    @PostMapping("/run")
    public ResponseEntity<ApiResponse<ExecutionResultDto>> runCode(
        @Valid @RequestBody RunCodeRequest request,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.error("Authentication required. Please sign in to run code.")
            );
        }

        String clientId = resolveClientIdentifier(user, httpRequest);
        ExecutionRateLimiter.RateLimitResult rateResult =
            rateLimiter.tryAcquire(clientId, ExecutionRateLimiter.ExecutionType.RUN);

        if (!rateResult.allowed()) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .header("X-RateLimit-Limit", String.valueOf(rateResult.limit()))
                .header("X-RateLimit-Remaining", "0")
                .header("X-RateLimit-Reset", String.valueOf(rateResult.resetSeconds()))
                .header("Retry-After", String.valueOf(Math.max(1L, rateResult.resetSeconds())))
                .body(ApiResponse.error("Rate limit exceeded. Please wait " + rateResult.resetSeconds()
                    + "s before executing code again (limit: " + rateResult.limit() + " requests/min)."));
        }

        ExecutionResultDto result = executionService.runCode(request);
        return ResponseEntity.ok()
            .header("X-RateLimit-Limit", String.valueOf(rateResult.limit()))
            .header("X-RateLimit-Remaining", String.valueOf(rateResult.remaining()))
            .header("X-RateLimit-Reset", String.valueOf(rateResult.resetSeconds()))
            .body(ApiResponse.ok("Code execution completed", result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubmissionDto>> submitCode(
        @Valid @RequestBody SubmitCodeRequest request,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.error("Authentication required. Please sign in to submit code.")
            );
        }

        String clientId = resolveClientIdentifier(user, httpRequest);
        ExecutionRateLimiter.RateLimitResult rateResult =
            rateLimiter.tryAcquire(clientId, ExecutionRateLimiter.ExecutionType.SUBMIT);

        if (!rateResult.allowed()) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .header("X-RateLimit-Limit", String.valueOf(rateResult.limit()))
                .header("X-RateLimit-Remaining", "0")
                .header("X-RateLimit-Reset", String.valueOf(rateResult.resetSeconds()))
                .header("Retry-After", String.valueOf(Math.max(1L, rateResult.resetSeconds())))
                .body(ApiResponse.error("Rate limit exceeded. Please wait " + rateResult.resetSeconds()
                    + "s before submitting code again (limit: " + rateResult.limit() + " requests/min)."));
        }

        SubmissionDto submission = executionService.submitCode(request, user);
        return ResponseEntity.ok()
            .header("X-RateLimit-Limit", String.valueOf(rateResult.limit()))
            .header("X-RateLimit-Remaining", String.valueOf(rateResult.remaining()))
            .header("X-RateLimit-Reset", String.valueOf(rateResult.resetSeconds()))
            .body(ApiResponse.ok("Code submitted successfully", submission));
    }

    @GetMapping("/problem/{slug}")
    public ResponseEntity<ApiResponse<List<SubmissionDto>>> getProblemSubmissions(
        @PathVariable String slug,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.error("Authentication required. Please sign in to view submissions.")
            );
        }

        List<SubmissionDto> submissions = executionService.getProblemSubmissions(user, slug);
        return ResponseEntity.ok(ApiResponse.ok("Submissions retrieved", submissions));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubmissionDto>>> getUserSubmissions(
        @RequestParam(defaultValue = "20") int limit,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.error("Authentication required. Please sign in to view submissions.")
            );
        }

        Pageable pageable = PageRequest.of(0, Math.min(Math.max(1, limit), 100));
        List<SubmissionDto> submissions = submissionRepository
            .findByUserWithProblemOrderByCreatedAtDesc(user, pageable)
            .stream()
            .map(SubmissionDto::fromEntity)
            .toList();

        return ResponseEntity.ok(ApiResponse.ok("Submissions retrieved", submissions));
    }

    private User resolveCurrentUser(HttpServletRequest request) {
        Object attrUserId = request.getAttribute("USER_ID");
        if (attrUserId instanceof UUID uuid) {
            return userRepository.findById(uuid).orElse(null);
        }
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("USER_ID") != null) {
            UUID userId = (UUID) session.getAttribute("USER_ID");
            return userRepository.findById(userId).orElse(null);
        }
        return null;
    }

    private String resolveClientIdentifier(User user, HttpServletRequest request) {
        if (user != null && user.getId() != null) {
            return "user:" + user.getId();
        }
        return "ip:" + resolveClientIp(request);
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
