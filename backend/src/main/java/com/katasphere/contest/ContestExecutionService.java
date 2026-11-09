package com.katasphere.contest;

import com.katasphere.contest.dto.ContestSubmissionDto;
import com.katasphere.contest.dto.ContestSubmitCodeRequest;
import com.katasphere.execution.ExecutionRateLimiter;
import com.katasphere.execution.LocalExecutionEngine;
import com.katasphere.execution.dto.ExecutionResultDto;
import com.katasphere.execution.dto.RunCodeRequest;
import com.katasphere.problem.Problem;
import com.katasphere.problem.ProblemRepository;
import com.katasphere.problem.TestCase;
import com.katasphere.problem.TestCaseRepository;
import com.katasphere.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ContestExecutionService {

    private final ContestRepository contestRepository;
    private final ContestProblemRepository contestProblemRepository;
    private final ContestParticipantRepository contestParticipantRepository;
    private final ContestSubmissionRepository contestSubmissionRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final LocalExecutionEngine executionEngine;
    private final ExecutionRateLimiter rateLimiter;

    public ContestExecutionService(
        ContestRepository contestRepository,
        ContestProblemRepository contestProblemRepository,
        ContestParticipantRepository contestParticipantRepository,
        ContestSubmissionRepository contestSubmissionRepository,
        ProblemRepository problemRepository,
        TestCaseRepository testCaseRepository,
        LocalExecutionEngine executionEngine,
        ExecutionRateLimiter rateLimiter
    ) {
        this.contestRepository = contestRepository;
        this.contestProblemRepository = contestProblemRepository;
        this.contestParticipantRepository = contestParticipantRepository;
        this.contestSubmissionRepository = contestSubmissionRepository;
        this.problemRepository = problemRepository;
        this.testCaseRepository = testCaseRepository;
        this.executionEngine = executionEngine;
        this.rateLimiter = rateLimiter;
    }

    @Transactional
    public ExecutionResultDto runSampleCode(String slug, UUID problemId, RunCodeRequest request, User student) {
        Contest contest = contestRepository.findBySlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Contest not found"));

        ContestParticipant participant = contestParticipantRepository
            .findByContestAndUser(contest, student)
            .orElseThrow(() -> new IllegalStateException("Student has not joined this contest"));

        validateTimeWindowNotExpired(contest, participant);

        Problem problem = problemRepository.findById(problemId)
            .orElseThrow(() -> new IllegalArgumentException("Problem not found in contest"));

        List<TestCase> sampleCases = testCaseRepository.findByProblemAndIsHiddenFalseOrderByPositionAsc(problem);
        if (sampleCases.isEmpty()) {
            sampleCases = testCaseRepository.findByProblemOrderByPositionAsc(problem)
                .stream().limit(3).toList();
        }

        return executionEngine.execute(
            request.language().toUpperCase(),
            request.sourceCode(),
            sampleCases,
            problem.getSlug()
        );
    }

    @Transactional
    public ContestSubmissionDto submitCode(String slug, ContestSubmitCodeRequest request, User student) {
        Contest contest = contestRepository.findBySlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Contest not found"));

        ContestParticipant participant = contestParticipantRepository
            .findByContestAndUser(contest, student)
            .orElseThrow(() -> new IllegalStateException("Student has not joined this contest"));

        validateTimeWindowNotExpired(contest, participant);

        ContestProblem cp = contestProblemRepository
            .findByContestAndProblem(contest, problemRepository.findById(request.problemId())
                .orElseThrow(() -> new IllegalArgumentException("Problem not found in contest")))
            .orElseThrow(() -> new IllegalArgumentException("Problem is not part of this examination"));

        Problem problem = cp.getProblem();

        // Load all test cases (public + hidden)
        List<TestCase> allCases = testCaseRepository.findByProblemOrderByPositionAsc(problem);

        ExecutionResultDto execResult = executionEngine.execute(
            request.language().toUpperCase(),
            request.sourceCode(),
            allCases,
            problem.getSlug()
        );

        boolean isAccepted = "ACCEPTED".equalsIgnoreCase(execResult.verdict());
        int pointsAwarded = 0;

        // Check if student has already solved this problem in this contest
        if (isAccepted) {
            boolean alreadySolved = contestSubmissionRepository
                .findFirstByParticipantAndProblemAndVerdict(participant, problem, "ACCEPTED")
                .isPresent();

            if (!alreadySolved) {
                pointsAwarded = cp.getPoints();
                participant.setTotalScore(participant.getTotalScore() + pointsAwarded);

                // Penalty seconds: time elapsed from student start time to submit time
                long elapsedSeconds = Duration.between(participant.getStartedAt(), Instant.now()).getSeconds();
                participant.setPenaltySeconds((int) (participant.getPenaltySeconds() + elapsedSeconds));
                participant.setUpdatedAt(Instant.now());
                contestParticipantRepository.save(participant);
            }
        }

        ContestSubmission submission = new ContestSubmission(
            contest,
            participant,
            problem,
            request.language().toUpperCase(),
            request.sourceCode(),
            execResult.verdict(),
            execResult.passedTestCases(),
            execResult.totalTestCases(),
            pointsAwarded,
            execResult.runtimeMs(),
            execResult.memoryKb(),
            execResult.compileOutput() != null ? execResult.compileOutput() : execResult.errorMessage()
        );

        submission = contestSubmissionRepository.save(submission);
        return ContestSubmissionDto.fromEntity(submission);
    }

    private void validateTimeWindowNotExpired(Contest contest, ContestParticipant participant) {
        Instant now = Instant.now();

        if ("SUBMITTED".equalsIgnoreCase(participant.getStatus())) {
            throw new IllegalStateException("Your examination has already been completed and submitted.");
        }

        Instant durationExpiry = participant.getStartedAt().plus(Duration.ofMinutes(contest.getDurationMinutes()));
        if (now.isAfter(durationExpiry)) {
            participant.setStatus("SUBMITTED");
            participant.setSubmittedAt(durationExpiry);
            contestParticipantRepository.save(participant);
            throw new IllegalStateException("Your individual examination duration has expired. Examination submitted.");
        }
    }
}
