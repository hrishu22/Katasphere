package com.katasphere.company;

import java.util.List;

public record CompanyDetailDto(
    CompanySummaryDto company,
    boolean isUnlocked,
    List<CompanyProblemDto> problems
) {}
