package com.katasphere.contest;

import com.katasphere.common.ApiResponse;
import com.katasphere.contest.dto.*;
import com.katasphere.execution.ExecutionRateLimiter;
import com.katasphere.execution.dto.ExecutionResultDto;
import com.katasphere.execution.dto.RunCodeRequest;
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
@RequestMapping("/api/v1/contests")
public class ContestController {

    private final ContestService contestService;
    private final ContestExecutionService executionService;
    private final UserRepository userRepository;
    private final ExecutionRateLimiter rateLimiter;

    public ContestController(
        ContestService contestService,
        ContestExecutionService executionService,
        UserRepository userRepository,
        ExecutionRateLimiter rateLimiter
    ) {
        this.contestService = contestService;
        this.executionService = executionService;
        this.userRepository = userRepository;
        this.rateLimiter = rateLimiter;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContestDto>>> getPublishedContests() {
        List<ContestDto> contests = contestService.getAllPublishedContests();
        return ResponseEntity.ok(ApiResponse.ok("Contests retrieved", contests));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<ContestDetailDto>> getContestDetail(@PathVariable String slug) {
        try {
            ContestDetailDto detail = contestService.getContestDetail(slug);
            return ResponseEntity.ok(ApiResponse.ok("Contest details retrieved", detail));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{slug}/status")
    public ResponseEntity<ApiResponse<ContestParticipantDto>> getParticipantState(
        @PathVariable String slug,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required"));
        }

        var opt = contestService.getStudentParticipantState(slug, user);
        return opt.map(dto -> ResponseEntity.ok(ApiResponse.ok("Participant state retrieved", dto)))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Student has not entered this contest yet")));
    }

    @PostMapping("/{slug}/join")
    public ResponseEntity<ApiResponse<ContestParticipantDto>> joinContest(
        @PathVariable String slug,
        @Valid @RequestBody JoinContestRequest request,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required to join examination"));
        }

        try {
            ContestParticipantDto participant = contestService.joinContest(slug, request, user);
            return ResponseEntity.ok(ApiResponse.ok("Successfully entered examination", participant));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{slug}/run/{problemId}")
    public ResponseEntity<ApiResponse<ExecutionResultDto>> runSampleCode(
        @PathVariable String slug,
        @PathVariable UUID problemId,
        @Valid @RequestBody RunCodeRequest request,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required to run code"));
        }

        String clientId = "contest-run:" + user.getId();
        var rateResult = rateLimiter.tryAcquire(clientId, ExecutionRateLimiter.ExecutionType.RUN);
        if (!rateResult.allowed()) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error("Execution rate limit exceeded. Please wait " + rateResult.resetSeconds() + "s."));
        }

        try {
            ExecutionResultDto result = executionService.runSampleCode(slug, problemId, request, user);
            return ResponseEntity.ok(ApiResponse.ok("Sample run completed", result));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{slug}/submit")
    public ResponseEntity<ApiResponse<ContestSubmissionDto>> submitCode(
        @PathVariable String slug,
        @Valid @RequestBody ContestSubmitCodeRequest request,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required to submit code"));
        }

        String clientId = "contest-submit:" + user.getId();
        var rateResult = rateLimiter.tryAcquire(clientId, ExecutionRateLimiter.ExecutionType.SUBMIT);
        if (!rateResult.allowed()) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error("Submission rate limit exceeded. Please wait " + rateResult.resetSeconds() + "s."));
        }

        try {
            ContestSubmissionDto result = executionService.submitCode(slug, request, user);
            return ResponseEntity.ok(ApiResponse.ok("Code submitted successfully", result));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{slug}/tab-switch")
    public ResponseEntity<ApiResponse<ContestParticipantDto>> recordTabSwitch(
        @PathVariable String slug,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required"));
        }

        try {
            ContestParticipantDto participant = contestService.recordTabSwitch(slug, user);
            return ResponseEntity.ok(ApiResponse.ok("Tab switch recorded", participant));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{slug}/finish")
    public ResponseEntity<ApiResponse<ContestParticipantDto>> finishExam(
        @PathVariable String slug,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required"));
        }

        try {
            ContestParticipantDto participant = contestService.finishExam(slug, user);
            return ResponseEntity.ok(ApiResponse.ok("Examination finalized successfully", participant));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{slug}/leaderboard")
    public ResponseEntity<ApiResponse<List<ContestLeaderboardEntryDto>>> getLeaderboard(@PathVariable String slug) {
        try {
            List<ContestLeaderboardEntryDto> leaderboard = contestService.getLeaderboard(slug);
            return ResponseEntity.ok(ApiResponse.ok("Leaderboard retrieved", leaderboard));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{slug}/submissions/me")
    public ResponseEntity<ApiResponse<List<ContestSubmissionDto>>> getStudentSubmissions(
        @PathVariable String slug,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required"));
        }

        List<ContestSubmissionDto> submissions = contestService.getStudentSubmissions(slug, user);
        return ResponseEntity.ok(ApiResponse.ok("Student submissions retrieved", submissions));
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
}
