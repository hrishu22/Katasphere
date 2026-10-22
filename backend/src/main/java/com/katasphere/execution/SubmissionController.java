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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/submissions")
public class SubmissionController {

    private final ExecutionService executionService;
    private final UserRepository userRepository;

    public SubmissionController(ExecutionService executionService, UserRepository userRepository) {
        this.executionService = executionService;
        this.userRepository = userRepository;
    }

    @PostMapping("/run")
    public ResponseEntity<ApiResponse<ExecutionResultDto>> runCode(@Valid @RequestBody RunCodeRequest request) {
        ExecutionResultDto result = executionService.runCode(request);
        return ResponseEntity.ok(ApiResponse.ok("Code execution completed", result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubmissionDto>> submitCode(
        @Valid @RequestBody SubmitCodeRequest request,
        HttpServletRequest httpRequest
    ) {
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
}
