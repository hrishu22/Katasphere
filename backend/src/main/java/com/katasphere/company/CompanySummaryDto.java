package com.katasphere.company;

public record CompanySummaryDto(
    String name,
    String slug,
    String accentColor,
    String description,
    String interviewRounds,
    int totalProblems,
    int easyCount,
    int mediumCount,
    int hardCount,
    boolean isPremium
) {}
