package com.katasphere.college;

import com.katasphere.college.CollegeDtos.*;
import com.katasphere.common.ApiResponse;
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
@RequestMapping("/api/v1/colleges")
public class CollegeController {

    private final CollegeService collegeService;
    private final UserRepository userRepository;

    public CollegeController(CollegeService collegeService, UserRepository userRepository) {
        this.collegeService = collegeService;
        this.userRepository = userRepository;
    }

    /** Public/student autocomplete directory of registered colleges with their College Unique IDs. */
    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<CollegeSuggestionDto>>> suggestions(
        @RequestParam(name = "q", required = false) String query
    ) {
        return ResponseEntity.ok(
            ApiResponse.ok("College suggestions retrieved", collegeService.getSuggestions(query))
        );
    }

    /** Navbar/profile: is this user a college admin, a linked student, or neither? */
    @GetMapping("/me/context")
    public ResponseEntity<ApiResponse<CollegeContextDto>> context(HttpServletRequest request) {
        User user = resolveCurrentUser(request);
        if (user == null) return unauthorized();
        return ResponseEntity.ok(ApiResponse.ok("College context retrieved", collegeService.getContext(user)));
    }

    /** Register a new college; caller becomes its admin. */
    @PostMapping
    public ResponseEntity<ApiResponse<CollegeAdminDto>> register(
        @Valid @RequestBody RegisterCollegeRequest req, HttpServletRequest request
    ) {
        User user = resolveCurrentUser(request);
        if (user == null) return unauthorized();
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("College registered successfully", collegeService.register(user, req)));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Admin edits/adds college details. */
    @PutMapping("/mine")
    public ResponseEntity<ApiResponse<CollegeAdminDto>> update(
        @Valid @RequestBody RegisterCollegeRequest req, HttpServletRequest request
    ) {
        User user = resolveCurrentUser(request);
        if (user == null) return unauthorized();
        try {
            return ResponseEntity.ok(ApiResponse.ok("College updated", collegeService.update(user, req)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Student links profile to a college using name + College Unique ID. */
    @PutMapping("/me/link")
    public ResponseEntity<ApiResponse<StudentCollegeDto>> link(
        @Valid @RequestBody LinkCollegeRequest req, HttpServletRequest request
    ) {
        User user = resolveCurrentUser(request);
        if (user == null) return unauthorized();
        try {
            return ResponseEntity.ok(ApiResponse.ok("College linked to your profile", collegeService.linkStudent(user, req)));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Student: upcoming / live / past exams with own score and rank. */
    @GetMapping("/me/exams")
    public ResponseEntity<ApiResponse<StudentExamDashboardDto>> exams(HttpServletRequest request) {
        User user = resolveCurrentUser(request);
        if (user == null) return unauthorized();
        return ResponseEntity.ok(ApiResponse.ok("Exam dashboard retrieved", collegeService.getStudentExamDashboard(user)));
    }

    private <T> ResponseEntity<ApiResponse<T>> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Authentication required"));
    }

    private User resolveCurrentUser(HttpServletRequest request) {
        Object attrUserId = request.getAttribute("USER_ID");
        if (attrUserId instanceof UUID uuid) {
            return userRepository.findById(uuid).orElse(null);
        }
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("USER_ID") instanceof UUID userId) {
            return userRepository.findById(userId).orElse(null);
        }
        return null;
    }
}
