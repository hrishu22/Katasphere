package com.katasphere.execution;

import com.katasphere.execution.dto.ExecutionResultDto;
import com.katasphere.execution.dto.RunCodeRequest;
import com.katasphere.execution.dto.SubmissionDto;
import com.katasphere.execution.dto.SubmitCodeRequest;
import com.katasphere.problem.*;
import com.katasphere.submission.Submission;
import com.katasphere.submission.SubmissionRepository;
import com.katasphere.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExecutionService {

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final SubmissionRepository submissionRepository;
    private final CodeExecutionProvider executionProvider;

    public ExecutionService(
        ProblemRepository problemRepository,
        TestCaseRepository testCaseRepository,
        SubmissionRepository submissionRepository,
        CodeExecutionProvider executionProvider
    ) {
        this.problemRepository = problemRepository;
        this.testCaseRepository = testCaseRepository;
        this.submissionRepository = submissionRepository;
        this.executionProvider = executionProvider;
    }

    /**
     * Runs code against sample test cases (or custom input) without persisting as an official submission.
     */
    @Transactional
    public ExecutionResultDto runCode(RunCodeRequest request) {
        Problem problem = problemRepository.findBySlug(request.problemSlug())
            .orElseThrow(() -> new IllegalArgumentException("Problem not found: " + request.problemSlug()));

        List<TestCase> testCasesToRun;
        if (request.customInput() != null && !request.customInput().isBlank()) {
            TestCase customCase = new TestCase(problem, 1, request.customInput(), "", false);
            testCasesToRun = List.of(customCase);
        } else {
            testCasesToRun = testCaseRepository.findByProblemAndIsHiddenFalseOrderByPositionAsc(problem);
            if (testCasesToRun.isEmpty()) {
                // Fallback to sample public examples
                testCasesToRun = new ArrayList<>();
                for (ProblemExample ex : problem.getExamples()) {
                    testCasesToRun.add(new TestCase(problem, ex.getPosition(), ex.getInput(), ex.getExpectedOutput(), false));
                }
            }
        }

        return executionProvider.execute(request.language(), request.sourceCode(), testCasesToRun, problem.getSlug());
    }

    /**
     * Evaluates code against full test suites and saves submission record.
     */
    @Transactional
    public SubmissionDto submitCode(SubmitCodeRequest request, User user) {
        Problem problem = problemRepository.findBySlug(request.problemSlug())
            .orElseThrow(() -> new IllegalArgumentException("Problem not found: " + request.problemSlug()));

        List<TestCase> allTestCases = testCaseRepository.findByProblemOrderByPositionAsc(problem);
        if (allTestCases.isEmpty()) {
            allTestCases = new ArrayList<>();
            for (ProblemExample ex : problem.getExamples()) {
                allTestCases.add(new TestCase(problem, ex.getPosition(), ex.getInput(), ex.getExpectedOutput(), false));
            }
        }

        ExecutionResultDto execResult = executionProvider.execute(
            request.language(),
            request.sourceCode(),
            allTestCases,
            problem.getSlug()
        );

        Submission submission = new Submission(
            user,
            problem,
            request.language(),
            request.sourceCode(),
            execResult.verdict(),
            execResult.passedTestCases(),
            execResult.totalTestCases(),
            execResult.runtimeMs(),
            execResult.memoryKb(),
            execResult.errorMessage()
        );

        submission = submissionRepository.save(submission);
        return SubmissionDto.fromEntity(submission);
    }

    @Transactional(readOnly = true)
    public List<SubmissionDto> getProblemSubmissions(User user, String problemSlug) {
        if (user == null) return List.of();
        Problem problem = problemRepository.findBySlug(problemSlug).orElse(null);
        if (problem == null) return List.of();

        return submissionRepository.findByUserAndProblemOrderByCreatedAtDesc(user, problem)
            .stream()
            .map(SubmissionDto::fromEntity)
            .toList();
    }
}
