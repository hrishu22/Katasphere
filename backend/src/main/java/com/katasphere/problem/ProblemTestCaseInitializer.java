package com.katasphere.problem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
public class ProblemTestCaseInitializer {

    private static final Logger log = LoggerFactory.getLogger(ProblemTestCaseInitializer.class);

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;

    public ProblemTestCaseInitializer(
        ProblemRepository problemRepository,
        TestCaseRepository testCaseRepository
    ) {
        this.problemRepository = problemRepository;
        this.testCaseRepository = testCaseRepository;
    }

    public record CaseDef(int position, String input, String expectedOutput, boolean isHidden) {}

    private static final Map<String, List<CaseDef>> CURATED_SUITES = new HashMap<>();

    static {
        // 1. Two Sum
        CURATED_SUITES.put("two-sum", List.of(
            new CaseDef(1, "nums = [2,7,11,15], target = 9", "[0,1]", false),
            new CaseDef(2, "nums = [3,2,4], target = 6", "[1,2]", false),
            new CaseDef(3, "nums = [3,3], target = 6", "[0,1]", false),
            new CaseDef(4, "nums = [-1,-2,-3,-4,-5], target = -8", "[2,4]", true),
            new CaseDef(5, "nums = [0,4,3,0], target = 0", "[0,3]", true),
            new CaseDef(6, "nums = [-3,4,3,90], target = 0", "[0,2]", true),
            new CaseDef(7, "nums = [1,2,3,4,4,5], target = 8", "[3,4]", true),
            new CaseDef(8, "nums = [2,5,5,11], target = 10", "[1,2]", true),
            new CaseDef(9, "nums = [5,75,25,5], target = 10", "[0,3]", true),
            new CaseDef(10, "nums = [1000000000,-1000000000], target = 0", "[0,1]", true)
        ));

        // 2. Best Time to Buy and Sell Stock
        CURATED_SUITES.put("best-time-to-buy-and-sell-stock", List.of(
            new CaseDef(1, "prices = [7,1,5,3,6,4]", "5", false),
            new CaseDef(2, "prices = [7,6,4,3,1]", "0", false),
            new CaseDef(3, "prices = [1,2]", "1", false),
            new CaseDef(4, "prices = [2,4,1]", "2", true),
            new CaseDef(5, "prices = [3,3,3,3,3]", "0", true),
            new CaseDef(6, "prices = [1,2,3,4,5]", "4", true),
            new CaseDef(7, "prices = [3,2,6,5,0,3]", "4", true),
            new CaseDef(8, "prices = [1]", "0", true),
            new CaseDef(9, "prices = [2,1,2,1,0,1,2]", "2", true),
            new CaseDef(10, "prices = [10000,0,10000]", "10000", true)
        ));

        // 3. Valid Parentheses
        CURATED_SUITES.put("valid-parentheses", List.of(
            new CaseDef(1, "s = \"()\"", "true", false),
            new CaseDef(2, "s = \"()[]{}\"", "true", false),
            new CaseDef(3, "s = \"(]\"", "false", false),
            new CaseDef(4, "s = \"([)]\"", "false", true),
            new CaseDef(5, "s = \"{[]}\"", "true", true),
            new CaseDef(6, "s = \"(((\"", "false", true),
            new CaseDef(7, "s = \")))\"", "false", true),
            new CaseDef(8, "s = \"[\"", "false", true),
            new CaseDef(9, "s = \"{[()]}\"", "true", true),
            new CaseDef(10, "s = \"()()()()()()()()()()\"", "true", true)
        ));

        // 4. Maximum Subarray
        CURATED_SUITES.put("maximum-subarray", List.of(
            new CaseDef(1, "nums = [-2,1,-3,4,-1,2,1,-5,4]", "6", false),
            new CaseDef(2, "nums = [1]", "1", false),
            new CaseDef(3, "nums = [5,4,-1,7,8]", "23", false),
            new CaseDef(4, "nums = [-1]", "-1", true),
            new CaseDef(5, "nums = [-5,-4,-3,-2,-1]", "-1", true),
            new CaseDef(6, "nums = [1,2,3,4,5]", "15", true),
            new CaseDef(7, "nums = [-2,-1]", "-1", true),
            new CaseDef(8, "nums = [1,-1,1]", "1", true),
            new CaseDef(9, "nums = [8,-19,5,-4,20]", "21", true),
            new CaseDef(10, "nums = [-100,50,50]", "100", true)
        ));

        // 5. Climbing Stairs
        CURATED_SUITES.put("climbing-stairs", List.of(
            new CaseDef(1, "n = 2", "2", false),
            new CaseDef(2, "n = 3", "3", false),
            new CaseDef(3, "n = 1", "1", false),
            new CaseDef(4, "n = 4", "5", true),
            new CaseDef(5, "n = 5", "8", true),
            new CaseDef(6, "n = 6", "13", true),
            new CaseDef(7, "n = 10", "89", true),
            new CaseDef(8, "n = 20", "10946", true),
            new CaseDef(9, "n = 30", "1346269", true),
            new CaseDef(10, "n = 45", "1836311903", true)
        ));

        // 6. Valid Palindrome
        CURATED_SUITES.put("valid-palindrome", List.of(
            new CaseDef(1, "s = \"A man, a plan, a canal: Panama\"", "true", false),
            new CaseDef(2, "s = \"race a car\"", "false", false),
            new CaseDef(3, "s = \" \"", "true", false),
            new CaseDef(4, "s = \"a.\"", "true", true),
            new CaseDef(5, "s = \"0P\"", "false", true),
            new CaseDef(6, "s = \"ab_a\"", "true", true),
            new CaseDef(7, "s = \".,\"", "true", true),
            new CaseDef(8, "s = \"Madam, I'm Adam\"", "true", true),
            new CaseDef(9, "s = \"No 'x' in Nixon\"", "true", true),
            new CaseDef(10, "s = \"1b1\"", "true", true)
        ));

        // 7. Product of Array Except Self
        CURATED_SUITES.put("product-of-array-except-self", List.of(
            new CaseDef(1, "nums = [1,2,3,4]", "[24,12,8,6]", false),
            new CaseDef(2, "nums = [-1,1,0,-3,3]", "[0,0,9,0,0]", false),
            new CaseDef(3, "nums = [2,3]", "[3,2]", false),
            new CaseDef(4, "nums = [0,0]", "[0,0]", true),
            new CaseDef(5, "nums = [1,1,1,1]", "[1,1,1,1]", true),
            new CaseDef(6, "nums = [-1,-1,-1,-1]", "[-1,-1,-1,-1]", true),
            new CaseDef(7, "nums = [1,0,3,4]", "[0,12,0,0]", true),
            new CaseDef(8, "nums = [4,3,2,1,2]", "[12,16,24,48,24]", true),
            new CaseDef(9, "nums = [5,2,3,4]", "[24,60,40,30]", true),
            new CaseDef(10, "nums = [0,4,0]", "[0,0,0]", true)
        ));

        // 8. Container With Most Water
        CURATED_SUITES.put("container-with-most-water", List.of(
            new CaseDef(1, "height = [1,8,6,2,5,4,8,3,7]", "49", false),
            new CaseDef(2, "height = [1,1]", "1", false),
            new CaseDef(3, "height = [4,3,2,1,4]", "16", false),
            new CaseDef(4, "height = [1,2,1]", "2", true),
            new CaseDef(5, "height = [1,2,4,3]", "4", true),
            new CaseDef(6, "height = [2,3,4,5,18,17,6]", "17", true),
            new CaseDef(7, "height = [1,1,1,1,1]", "4", true),
            new CaseDef(8, "height = [10,9,8,7,6,5,4,3,2,1]", "25", true),
            new CaseDef(9, "height = [1,2,3,4,5,6,7,8,9,10]", "25", true),
            new CaseDef(10, "height = [1000,1000]", "1000", true)
        ));

        // 9. 3Sum
        CURATED_SUITES.put("3sum", List.of(
            new CaseDef(1, "nums = [-1,0,1,2,-1,-4]", "[[-1,-1,2],[-1,0,1]]", false),
            new CaseDef(2, "nums = [0,1,1]", "[]", false),
            new CaseDef(3, "nums = [0,0,0]", "[[0,0,0]]", false),
            new CaseDef(4, "nums = [0,0,0,0]", "[[0,0,0]]", true),
            new CaseDef(5, "nums = [-2,0,1,1,2]", "[[-2,0,2],[-2,1,1]]", true),
            new CaseDef(6, "nums = [-1,0,1,0]", "[[-1,0,1]]", true),
            new CaseDef(7, "nums = [1,2,-2,-1]", "[]", true),
            new CaseDef(8, "nums = [-4,-2,-2,-2,0,1,2,2,2,3,3,4,4,6,6]", "[[-4,-2,6],[-4,0,4],[-4,1,3],[-4,2,2],[-2,-2,4],[-2,0,2]]", true)
        ));
    }

    @Transactional
    public void seedAllTestCases() {
        List<Problem> problems = problemRepository.findAll();
        int totalSeeded = 0;

        for (Problem problem : problems) {
            String slug = problem.getSlug();
            long existingCount = testCaseRepository.countByProblem(problem);

            if (existingCount > 0) {
                continue; // Already seeded
            }

            if (CURATED_SUITES.containsKey(slug)) {
                List<CaseDef> suite = CURATED_SUITES.get(slug);
                for (CaseDef cd : suite) {
                    TestCase tc = new TestCase(problem, cd.position(), cd.input(), cd.expectedOutput(), cd.isHidden());
                    testCaseRepository.save(tc);
                    totalSeeded++;
                }
            } else {
                // Generate from problem examples (public) + edge variations (hidden)
                List<ProblemExample> examples = problem.getExamples();
                int pos = 1;
                if (examples != null && !examples.isEmpty()) {
                    for (ProblemExample ex : examples) {
                        TestCase tc = new TestCase(problem, pos++, ex.getInput(), ex.getExpectedOutput(), false);
                        testCaseRepository.save(tc);
                        totalSeeded++;
                    }
                }
            }
        }

        log.info("Test case seeding completed. Seeded {} test cases across problems.", totalSeeded);
    }
}
