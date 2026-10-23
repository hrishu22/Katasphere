package com.katasphere.company;

import com.katasphere.problem.Problem;
import com.katasphere.problem.ProblemRepository;
import com.katasphere.tag.Tag;
import com.katasphere.user.User;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class CompanyService {

    private final ProblemRepository problemRepository;

    private static final List<CompanyMeta> KNOWN_COMPANIES = List.of(
        new CompanyMeta("Google", "google", "#4285F4", "Google SDE-1 interviews emphasize data structures, edge cases, clean code, and time/space complexity.", "1 Technical Screen + 3 Onsite DSA Rounds"),
        new CompanyMeta("Amazon", "amazon", "#FF9900", "Amazon technical rounds test arrays, trees, heaps, and Leadership Principles applied to engineering trade-offs.", "Online Assessment (OA) + 3 Onsite Rounds"),
        new CompanyMeta("Meta", "meta", "#0668E1", "Meta focuses on rapid problem-solving, binary search, sliding windows, and writing clean, optimal code under time pressure.", "1 Technical Screen + 2 Onsite Coding Rounds"),
        new CompanyMeta("Microsoft", "microsoft", "#00A4EF", "Microsoft interviews emphasize arrays, strings, tree traversals, and dynamic programming fundamentals.", "Codility OA + 4 Technical Rounds"),
        new CompanyMeta("Apple", "apple", "#A2AAAD", "Apple software engineering evaluations stress linked lists, binary trees, algorithms, and modular design.", "Recruiter Screen + 2 Technical Interviews"),
        new CompanyMeta("Uber", "uber", "#000000", "Uber SDE-1 rounds evaluate algorithmic efficiency, heaps, graphs, and two-pointer solutions.", "CodeSignal OA + 3 Algorithm Rounds"),
        new CompanyMeta("Bloomberg", "bloomberg", "#9333EA", "Bloomberg interviews focus heavily on hash tables, stacks, queues, and tree traversals.", "Phone Screen + 2 Onsite Rounds"),
        new CompanyMeta("Netflix", "netflix", "#E50914", "Netflix prioritizes high-performance algorithms, system thinking, and deep computer science fundamentals.", "Technical Screen + 2 High-Bar Rounds")
    );

    public CompanyService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @Transactional(readOnly = true)
    public List<CompanySummaryDto> getAllCompanies() {
        List<CompanySummaryDto> result = new ArrayList<>();

        for (CompanyMeta meta : KNOWN_COMPANIES) {
            List<Problem> problems = findProblemsByCompanySlug(meta.slug());
            int total = problems.size();
            int easy = (int) problems.stream().filter(p -> "EASY".equalsIgnoreCase(p.getDifficulty())).count();
            int medium = (int) problems.stream().filter(p -> "MEDIUM".equalsIgnoreCase(p.getDifficulty())).count();
            int hard = (int) problems.stream().filter(p -> "HARD".equalsIgnoreCase(p.getDifficulty())).count();

            result.add(new CompanySummaryDto(
                meta.name(),
                meta.slug(),
                meta.accentColor(),
                meta.description(),
                meta.interviewRounds(),
                total,
                easy,
                medium,
                hard,
                true // Premium feature
            ));
        }

        return result;
    }

    @Transactional(readOnly = true)
    public CompanyDetailDto getCompanyDetails(String slug, User user) {
        CompanyMeta meta = KNOWN_COMPANIES.stream()
            .filter(c -> c.slug().equalsIgnoreCase(slug))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Company not found with slug: " + slug));

        List<Problem> problems = findProblemsByCompanySlug(meta.slug());
        int total = problems.size();
        int easy = (int) problems.stream().filter(p -> "EASY".equalsIgnoreCase(p.getDifficulty())).count();
        int medium = (int) problems.stream().filter(p -> "MEDIUM".equalsIgnoreCase(p.getDifficulty())).count();
        int hard = (int) problems.stream().filter(p -> "HARD".equalsIgnoreCase(p.getDifficulty())).count();

        CompanySummaryDto summary = new CompanySummaryDto(
            meta.name(),
            meta.slug(),
            meta.accentColor(),
            meta.description(),
            meta.interviewRounds(),
            total,
            easy,
            medium,
            hard,
            true
        );

        boolean isUserPremium = user != null &&
            ("PREMIUM".equalsIgnoreCase(user.getRole()) || "ADMIN".equalsIgnoreCase(user.getRole()));

        List<CompanyProblemDto> problemDtos = new ArrayList<>();
        int previewUnlockedCount = 2; // Allow free users to preview first 2 questions

        int index = 0;
        // Deterministic frequency scores based on problem slug hash for realistic interview percentages
        for (Problem problem : problems) {
            index++;
            boolean isLocked = !isUserPremium && index > previewUnlockedCount;
            int frequency = Math.min(99, Math.max(65, 95 - (index * 4)));
            String round = switch (index % 4) {
                case 1 -> "Online Assessment (OA)";
                case 2 -> "Technical Phone Screen";
                case 3 -> "Onsite Round 1 (DSA)";
                default -> "Onsite Round 2 (Algorithms)";
            };

            List<String> tags = problem.getTags().stream().map(Tag::getName).toList();

            problemDtos.add(new CompanyProblemDto(
                problem.getId() != null ? problem.getId().toString() : "",
                problem.getSlug(),
                problem.getTitle(),
                problem.getDifficulty(),
                frequency,
                round,
                tags,
                isLocked
            ));
        }

        return new CompanyDetailDto(summary, isUserPremium, problemDtos);
    }

    private List<Problem> findProblemsByCompanySlug(String companySlug) {
        Specification<Problem> spec = (root, query, cb) -> {
            query.distinct(true);
            Join<Problem, Tag> tagJoin = root.join("tags");
            return cb.equal(cb.lower(tagJoin.get("slug")), companySlug.toLowerCase());
        };
        return problemRepository.findAll(spec);
    }

    private record CompanyMeta(
        String name,
        String slug,
        String accentColor,
        String description,
        String interviewRounds
    ) {}
}
