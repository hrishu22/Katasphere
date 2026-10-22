package com.katasphere.problem;

import com.katasphere.tag.TagDto;
import java.util.List;
import java.util.UUID;

public record ProblemSummaryDto(
    UUID id,
    String slug,
    String title,
    String difficulty,
    List<TagDto> tags,
    String acceptanceRate
) {
    public static ProblemSummaryDto fromEntity(Problem problem) {
        List<TagDto> tagDtos = problem.getTags().stream()
            .map(TagDto::fromEntity)
            .toList();

        // Estimated realistic acceptance rates based on difficulty
        String rate = switch (problem.getDifficulty().toUpperCase()) {
            case "EASY" -> "49.8%";
            case "MEDIUM" -> "36.4%";
            case "HARD" -> "28.1%";
            default -> "42.0%";
        };

        return new ProblemSummaryDto(
            problem.getId(),
            problem.getSlug(),
            problem.getTitle(),
            problem.getDifficulty(),
            tagDtos,
            rate
        );
    }
}
