package com.katasphere.company;

import com.katasphere.common.ApiResponse;
import com.katasphere.user.User;
import com.katasphere.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/companies")
public class CompanyController {

    private final CompanyService companyService;
    private final UserRepository userRepository;

    public CompanyController(CompanyService companyService, UserRepository userRepository) {
        this.companyService = companyService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CompanySummaryDto>>> getCompanies() {
        List<CompanySummaryDto> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(ApiResponse.ok("Company interview sets retrieved", companies));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<CompanyDetailDto>> getCompanyDetails(
        @PathVariable String slug,
        HttpServletRequest request
    ) {
        User user = resolveCurrentUser(request);
        CompanyDetailDto detail = companyService.getCompanyDetails(slug, user);
        return ResponseEntity.ok(ApiResponse.ok("Company details retrieved", detail));
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
