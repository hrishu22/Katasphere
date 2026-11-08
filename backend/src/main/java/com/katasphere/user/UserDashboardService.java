package com.katasphere.user;

import com.katasphere.execution.dto.SubmissionDto;
import com.katasphere.problem.ProblemRepository;
import com.katasphere.submission.SubmissionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserDashboardService {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;

    public UserDashboardService(
        SubmissionRepository submissionRepository,
        ProblemRepository problemRepository
    ) {
        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
    }

    @Transactional(readOnly = true)
    public UserDashboardDto getUserDashboard(User user) {
        long totalSolved = submissionRepository.countDistinctSolvedByUser(user);
        long totalProblems = problemRepository.count();
        long easySolved = submissionRepository.countDistinctSolvedByUserAndDifficulty(user, "EASY");
        long totalEasy = problemRepository.countByDifficulty("EASY");
        long mediumSolved = submissionRepository.countDistinctSolvedByUserAndDifficulty(user, "MEDIUM");
        long totalMedium = problemRepository.countByDifficulty("MEDIUM");
        long hardSolved = submissionRepository.countDistinctSolvedByUserAndDifficulty(user, "HARD");
        long totalHard = problemRepository.countByDifficulty("HARD");

        long totalSubmissions = submissionRepository.countByUser(user);
        long acceptedSubmissions = submissionRepository.countByUserAndVerdict(user, "ACCEPTED");
        double acceptanceRate = totalSubmissions > 0
            ? Math.round(((double) acceptedSubmissions / totalSubmissions * 100.0) * 10.0) / 10.0
            : 0.0;

        Pageable recentLimit = PageRequest.of(0, 20);
        List<SubmissionDto> recentSubmissions = submissionRepository
            .findByUserWithProblemOrderByCreatedAtDesc(user, recentLimit)
            .stream()
            .map(SubmissionDto::fromEntity)
            .toList();

        List<String> solvedProblemSlugs = submissionRepository.findDistinctSolvedProblemSlugsByUser(user);

        return new UserDashboardDto(
            totalSolved,
            totalProblems,
            easySolved,
            totalEasy,
            mediumSolved,
            totalMedium,
            hardSolved,
            totalHard,
            totalSubmissions,
            acceptedSubmissions,
            acceptanceRate,
            recentSubmissions,
            solvedProblemSlugs
        );
    }
}
