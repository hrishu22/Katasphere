package com.katasphere.problem;

import com.katasphere.common.ApiResponse;
import com.katasphere.tag.TagDto;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping("/problems")
    public ResponseEntity<ApiResponse<Page<ProblemSummaryDto>>> getProblems(
        @RequestParam(required = false) String difficulty,
        @RequestParam(required = false) String tag,
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "title") String sortBy,
        @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Page<ProblemSummaryDto> problems = problemService.getProblems(
            difficulty, tag, search, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.ok("Problems retrieved successfully", problems));
    }

    @GetMapping("/problems/{slug}")
    public ResponseEntity<ApiResponse<ProblemDetailDto>> getProblemBySlug(@PathVariable String slug) {
        ProblemDetailDto problem = problemService.getProblemBySlug(slug);
        return ResponseEntity.ok(ApiResponse.ok("Problem retrieved successfully", problem));
    }

    @GetMapping("/tags")
    public ResponseEntity<ApiResponse<List<TagDto>>> getTags() {
        List<TagDto> tags = problemService.getAllTags();
        return ResponseEntity.ok(ApiResponse.ok("Tags retrieved successfully", tags));
    }
}
