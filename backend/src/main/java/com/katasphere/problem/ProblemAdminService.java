package com.katasphere.problem;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.katasphere.problem.dto.CreateProblemRequest;
import com.katasphere.tag.Tag;
import com.katasphere.tag.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ProblemAdminService {

    private final ProblemRepository problemRepository;
    private final TagRepository tagRepository;
    private final TestCaseRepository testCaseRepository;
    private final ObjectMapper objectMapper;

    public ProblemAdminService(
        ProblemRepository problemRepository,
        TagRepository tagRepository,
        TestCaseRepository testCaseRepository,
        ObjectMapper objectMapper
    ) {
        this.problemRepository = problemRepository;
        this.tagRepository = tagRepository;
        this.testCaseRepository = testCaseRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public ProblemDetailDto createOrUpdateProblem(CreateProblemRequest request) {
        String slug = (request.slug() != null && !request.slug().isBlank())
            ? toKebabCase(request.slug())
            : toKebabCase(request.title());

        Problem problem = problemRepository.findBySlug(slug).orElseGet(Problem::new);
        problem.setSlug(slug);
        problem.setTitle(request.title().trim());
        problem.setDescription(request.description().trim());
        problem.setDifficulty(request.difficulty().toUpperCase().trim());
        problem.setConstraintsText(request.constraintsText().trim());
        problem.setInputFormat(request.inputFormat());
        problem.setOutputFormat(request.outputFormat());

        // Process Tags (Auto-create tags if not existing)
        Set<Tag> tags = new HashSet<>();
        if (request.tags() != null) {
            for (String tagStr : request.tags()) {
                String cleanTagSlug = toKebabCase(tagStr);
                Tag tag = tagRepository.findBySlug(cleanTagSlug).orElseGet(() -> {
                    Tag newTag = new Tag(capitalize(tagStr), cleanTagSlug);
                    return tagRepository.save(newTag);
                });
                tags.add(tag);
            }
        }
        problem.setTags(tags);

        // Process Starter Code with Fallbacks for All Supported Languages
        Map<String, String> starterCodeMap = new HashMap<>();
        if (request.starterCode() != null) {
            starterCodeMap.putAll(request.starterCode());
        }
        ensureStarterCodes(starterCodeMap, slug);

        try {
            problem.setStarterCode(objectMapper.writeValueAsString(starterCodeMap));
        } catch (JsonProcessingException e) {
            problem.setStarterCode("{}");
        }

        // Save Problem
        problem = problemRepository.save(problem);

        // Process Examples
        problem.getExamples().clear();
        if (request.examples() != null) {
            int pos = 1;
            for (CreateProblemRequest.ExampleInput ex : request.examples()) {
                ProblemExample example = new ProblemExample(
                    problem,
                    ex.position() > 0 ? ex.position() : pos++,
                    ex.input(),
                    ex.expectedOutput(),
                    ex.explanation()
                );
                problem.getExamples().add(example);
            }
        }

        // Process Test Cases
        if (request.testCases() != null) {
            int pos = 1;
            for (CreateProblemRequest.TestCaseInput tc : request.testCases()) {
                TestCase testCase = new TestCase(
                    problem,
                    tc.position() > 0 ? tc.position() : pos++,
                    tc.input(),
                    tc.expectedOutput(),
                    tc.isHidden()
                );
                testCaseRepository.save(testCase);
            }
        }

        return ProblemDetailDto.fromEntity(problemRepository.save(problem));
    }

    @Transactional
    public List<ProblemDetailDto> importProblemsBatch(List<CreateProblemRequest> requests) {
        List<ProblemDetailDto> results = new ArrayList<>();
        for (CreateProblemRequest req : requests) {
            results.add(createOrUpdateProblem(req));
        }
        return results;
    }

    private void ensureStarterCodes(Map<String, String> starterCodeMap, String slug) {
        String camelCaseName = toCamelCase(slug);

        if (!starterCodeMap.containsKey("PYTHON")) {
            starterCodeMap.put("PYTHON", "def " + camelCaseName + "(*args):\n    # Write your solution here\n    pass");
        }
        if (!starterCodeMap.containsKey("JAVA")) {
            starterCodeMap.put("JAVA", "class Solution {\n    public void " + camelCaseName + "() {\n        // Write your solution here\n    }\n}");
        }
        if (!starterCodeMap.containsKey("CPP")) {
            starterCodeMap.put("CPP", "#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    void " + camelCaseName + "() {\n        // Write your solution here\n    }\n};");
        }
        if (!starterCodeMap.containsKey("JAVASCRIPT")) {
            starterCodeMap.put("JAVASCRIPT", "function " + camelCaseName + "() {\n    // Write your solution here\n}");
        }
    }

    private String toKebabCase(String input) {
        return input.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-")
            .replaceAll("-+", "-")
            .replaceAll("^-|-$", "");
    }

    private String toCamelCase(String slug) {
        StringBuilder sb = new StringBuilder();
        boolean capitalizeNext = false;
        for (char c : slug.toCharArray()) {
            if (c == '-' || c == '_') {
                capitalizeNext = true;
            } else if (capitalizeNext) {
                sb.append(Character.toUpperCase(c));
                capitalizeNext = false;
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}
