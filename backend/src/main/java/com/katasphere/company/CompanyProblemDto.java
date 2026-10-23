package com.katasphere.company;

import java.util.List;

public record CompanyProblemDto(
    String id,
    String slug,
    String title,
    String difficulty,
    int frequencyPercent,
    String typicalRound,
    List<String> tags,
    boolean isLocked
) {}
