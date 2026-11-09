package com.katasphere.contest;

import com.katasphere.college.College;
import com.katasphere.college.CollegeService;
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
    private final CollegeService collegeService;

    public AdminContestController(
        ContestService contestService,
        UserRepository userRepository,
        CollegeService collegeService
    ) {
        this.contestService = contestService;
        this.userRepository = userRepository;
        this.collegeService = collegeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContestDto>>> getFacultyContests(HttpServletRequest httpRequest) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required"));
        }
        if (user.getCollegeId() != null && !"COLLEGE_ADMIN".equalsIgnoreCase(user.getRole()) && !"ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("College Admin access required"));
        }

        College college = collegeService.findAdminCollege(user).orElse(null);
        List<ContestDto> contests = contestService.getFacultyContests(user, college);
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

        College college = collegeService.findAdminCollege(user).orElse(null);
        if (college == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("Register your college before creating examinations."));
        }

        try {
            ContestDto contest = contestService.createContest(request, user, college);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Contest created successfully", contest));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{slug}")
    public ResponseEntity<ApiResponse<ContestDto>> updateOrRescheduleContest(
        @PathVariable String slug,
        @Valid @RequestBody CreateContestRequest request,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required to edit or reschedule examination"));
        }

        College college = collegeService.findAdminCollege(user).orElse(null);
        if (college == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("College Admin access required"));
        }

        try {
            ContestDto updated = contestService.updateOrRescheduleContest(slug, request, user, college);
            return ResponseEntity.ok(ApiResponse.ok("Contest updated and rescheduled successfully", updated));
        } catch (IllegalArgumentException | IllegalStateException e) {
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
        if (user.getCollegeId() != null && !"COLLEGE_ADMIN".equalsIgnoreCase(user.getRole()) && !"ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("College Admin access required"));
        }

        try {
            contestService.requireManageable(slug, user); // tenant isolation
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
        if (user.getCollegeId() != null && !"COLLEGE_ADMIN".equalsIgnoreCase(user.getRole()) && !"ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("College Admin access required"));
        }

        try {
            contestService.requireManageable(slug, user); // tenant isolation
            List<ContestLeaderboardEntryDto> leaderboard = contestService.getLeaderboard(slug);
            return ResponseEntity.ok(ApiResponse.ok("Contest leaderboard retrieved", leaderboard));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{slug}/participants")
    public ResponseEntity<ApiResponse<List<ContestParticipantDto>>> getParticipants(
        @PathVariable String slug,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required"));
        }
        if (user.getCollegeId() != null && !"COLLEGE_ADMIN".equalsIgnoreCase(user.getRole()) && !"ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("College Admin access required"));
        }

        try {
            contestService.requireManageable(slug, user); // tenant isolation
            List<ContestParticipantDto> participants = contestService.getParticipants(slug);
            return ResponseEntity.ok(ApiResponse.ok("Contest participants retrieved", participants));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping(value = "/{slug}/export-csv", produces = "text/csv")
    public ResponseEntity<String> exportGradebookCsv(
        @PathVariable String slug,
        HttpServletRequest httpRequest
    ) {
        User user = resolveCurrentUser(httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
        }

        try {
            contestService.requireManageable(slug, user); // tenant isolation
            String csvContent = contestService.generateGradebookCsv(slug);
            return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"gradebook-" + slug + ".csv\"")
                .header("Content-Type", "text/csv; charset=UTF-8")
                .body(csvContent);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
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
