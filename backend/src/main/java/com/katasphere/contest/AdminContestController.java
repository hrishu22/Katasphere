package com.katasphere.contest;

import com.katasphere.common.ApiResponse;
import com.katasphere.contest.dto.*;
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
@RequestMapping("/api/v1/admin/contests")
public class AdminContestController {

    private final ContestService contestService;
    private final UserRepository userRepository;

    public AdminContestController(
        ContestService contestService,
        UserRepository userRepository
    ) {
        this.contestService = contestService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContestDto>>> getFacultyContests(HttpServletRequest httpRequest) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required"));
        }

        List<ContestDto> contests = contestService.getFacultyContests(user);
        return ResponseEntity.ok(ApiResponse.ok("Faculty contests retrieved", contests));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ContestDto>> createContest(
        @Valid @RequestBody CreateContestRequest request,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required to create examination"));
        }

        try {
            ContestDto contest = contestService.createContest(request, user);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Contest created successfully", contest));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{slug}/submissions")
    public ResponseEntity<ApiResponse<List<ContestSubmissionDto>>> getLiveSubmissions(
        @PathVariable String slug,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required"));
        }

        try {
            List<ContestSubmissionDto> submissions = contestService.getRecentContestSubmissions(slug);
            return ResponseEntity.ok(ApiResponse.ok("Contest submissions retrieved", submissions));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{slug}/leaderboard")
    public ResponseEntity<ApiResponse<List<ContestLeaderboardEntryDto>>> getAdminLeaderboard(
        @PathVariable String slug,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required"));
        }

        try {
            List<ContestLeaderboardEntryDto> leaderboard = contestService.getLeaderboard(slug);
            return ResponseEntity.ok(ApiResponse.ok("Contest leaderboard retrieved", leaderboard));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
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
