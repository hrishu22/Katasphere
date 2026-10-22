package com.katasphere.problem;

import com.katasphere.tag.TagDto;
import java.util.List;
import java.util.UUID;

public record ProblemDetailDto(
    UUID id,
    String slug,
    String title,
    String description,
    String difficulty,
    String constraintsText,
    String starterCode,
    String inputFormat,
    String outputFormat,
    List<TagDto> tags,
    List<ProblemExampleDto> examples
) {
    public static ProblemDetailDto fromEntity(Problem problem) {
        List<TagDto> tagDtos = problem.getTags().stream()
            .map(TagDto::fromEntity)
            .toList();

        List<ProblemExampleDto> exampleDtos = problem.getExamples().stream()
            .map(ProblemExampleDto::fromEntity)
            .toList();

        return new ProblemDetailDto(
            problem.getId(),
            problem.getSlug(),
            problem.getTitle(),
            problem.getDescription(),
            problem.getDifficulty(),
            problem.getConstraintsText(),
            problem.getStarterCode(),
            problem.getInputFormat(),
            problem.getOutputFormat(),
            tagDtos,
            exampleDtos
        );
    }
}
