package com.katasphere.user;

import com.katasphere.execution.dto.SubmissionDto;

import java.util.List;

public record UserDashboardDto(
    long totalSolved,
    long totalProblems,
    long easySolved,
    long totalEasy,
    long mediumSolved,
    long totalMedium,
    long hardSolved,
    long totalHard,
    long totalSubmissions,
    long acceptedSubmissions,
    double acceptanceRate,
    List<SubmissionDto> recentSubmissions,
    List<String> solvedProblemSlugs
) {}
