package com.katasphere.problem;

import com.katasphere.common.ApiResponse;
import com.katasphere.problem.dto.CreateProblemRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/problems")
public class ProblemAdminController {

    private final ProblemAdminService problemAdminService;

    public ProblemAdminController(ProblemAdminService problemAdminService) {
        this.problemAdminService = problemAdminService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProblemDetailDto>> createOrUpdateProblem(
        @Valid @RequestBody CreateProblemRequest request
    ) {
        ProblemDetailDto problem = problemAdminService.createOrUpdateProblem(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Problem saved successfully", problem));
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<ProblemDetailDto>>> importBatch(
        @RequestBody List<CreateProblemRequest> requests
    ) {
        List<ProblemDetailDto> problems = problemAdminService.importProblemsBatch(requests);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(problems.size() + " problems imported successfully", problems));
    }
}
