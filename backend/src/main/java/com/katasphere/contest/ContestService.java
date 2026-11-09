package com.katasphere.contest;

import com.katasphere.contest.dto.*;
import com.katasphere.problem.Problem;
import com.katasphere.problem.ProblemRepository;
import com.katasphere.problem.TestCase;
import com.katasphere.problem.TestCaseRepository;
import com.katasphere.user.User;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
public class ContestService {

    private final ContestRepository contestRepository;
    private final ContestProblemRepository contestProblemRepository;
    private final ContestParticipantRepository contestParticipantRepository;
    private final ContestSubmissionRepository contestSubmissionRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;

    public ContestService(
        ContestRepository contestRepository,
        ContestProblemRepository contestProblemRepository,
        ContestParticipantRepository contestParticipantRepository,
        ContestSubmissionRepository contestSubmissionRepository,
        ProblemRepository problemRepository,
        TestCaseRepository testCaseRepository
    ) {
        this.contestRepository = contestRepository;
        this.contestProblemRepository = contestProblemRepository;
        this.contestParticipantRepository = contestParticipantRepository;
        this.contestSubmissionRepository = contestSubmissionRepository;
        this.problemRepository = problemRepository;
        this.testCaseRepository = testCaseRepository;
    }

    @Transactional
    public ContestDto createContest(CreateContestRequest req, User admin) {
        String slug = req.slug();
        if (slug == null || slug.isBlank()) {
            slug = req.title().toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "") + "-" + UUID.randomUUID().toString().substring(0, 6);
        }

        if (contestRepository.existsBySlug(slug)) {
            throw new IllegalArgumentException("Contest slug already exists: " + slug);
        }

        if (req.endTime().isBefore(req.startTime())) {
            throw new IllegalArgumentException("Contest end time must be after start time");
        }

        Contest contest = new Contest(
            req.collegeName(),
            req.title(),
            slug,
            req.description(),
            req.accessCode().trim(),
            req.startTime(),
            req.endTime(),
            req.durationMinutes() > 0 ? req.durationMinutes() : 90,
            req.scoringSystem() != null ? req.scoringSystem() : "POINTS",
            req.allowTabSwitch() != null ? req.allowTabSwitch() : true,
            req.maxTabSwitches() != null ? req.maxTabSwitches() : 3,
            req.isPublished() != null ? req.isPublished() : true,
            admin
        );

        contest = contestRepository.save(contest);

        if (req.problems() != null && !req.problems().isEmpty()) {
            int order = 1;
            for (var pConfig : req.problems()) {
                Problem problem = problemRepository.findById(pConfig.problemId())
                    .orElseThrow(() -> new IllegalArgumentException("Problem not found: " + pConfig.problemId()));

                ContestProblem cp = new ContestProblem(
                    contest,
                    problem,
                    pConfig.order() > 0 ? pConfig.order() : order++,
                    pConfig.points() > 0 ? pConfig.points() : 100
                );
                contestProblemRepository.save(cp);
            }
        }

        return ContestDto.fromEntity(contest, req.problems() != null ? req.problems().size() : 0, 0);
    }

    @Transactional(readOnly = true)
    public List<ContestDto> getAllPublishedContests() {
        return contestRepository.findAllByOrderByStartTimeDesc().stream()
            .filter(Contest::isPublished)
            .map(c -> {
                int pCount = contestProblemRepository.findByContestWithProblemOrderByProblemOrderAsc(c).size();
                long partCount = contestParticipantRepository.countByContest(c);
                return ContestDto.fromEntity(c, pCount, partCount);
            })
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ContestDto> getFacultyContests(User admin) {
        return contestRepository.findByCreatedByOrderByCreatedAtDesc(admin).stream()
            .map(c -> {
                int pCount = contestProblemRepository.findByContestWithProblemOrderByProblemOrderAsc(c).size();
                long partCount = contestParticipantRepository.countByContest(c);
                return ContestDto.fromEntity(c, pCount, partCount);
            })
            .toList();
    }

    @Transactional(readOnly = true)
    public ContestDetailDto getContestDetail(String slug) {
        Contest contest = contestRepository.findBySlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Contest not found with slug: " + slug));

        List<ContestProblem> cpList = contestProblemRepository.findByContestWithProblemOrderByProblemOrderAsc(contest);
        List<ContestProblemDto> problemDtos = cpList.stream()
            .map(cp -> {
                List<TestCase> publicCases = testCaseRepository.findByProblemOrderByPositionAsc(cp.getProblem());
                return ContestProblemDto.fromEntity(cp, publicCases);
            })
            .toList();

        return ContestDetailDto.fromEntity(contest, problemDtos);
    }

    @Transactional
    public ContestParticipantDto joinContest(String slug, JoinContestRequest req, User student) {
        Contest contest = contestRepository.findBySlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Contest not found with slug: " + slug));

        if (!contest.isPublished()) {
            throw new IllegalStateException("This examination is not published yet.");
        }

        Instant now = Instant.now();
        if (now.isBefore(contest.getStartTime())) {
            throw new IllegalStateException("The examination has not started yet. Please wait in the waiting room.");
        }

        if (now.isAfter(contest.getEndTime())) {
            throw new IllegalStateException("The examination window has already closed.");
        }

        if (!contest.getAccessCode().equalsIgnoreCase(req.accessCode().trim())) {
            throw new IllegalArgumentException("Invalid access code for this examination.");
        }

        ContestParticipant participant = contestParticipantRepository
            .findByContestAndUser(contest, student)
            .orElseGet(() -> {
                ContestParticipant newParticipant = new ContestParticipant(contest, student);
                return contestParticipantRepository.save(newParticipant);
            });

        return ContestParticipantDto.fromEntity(participant);
    }

    @Transactional(readOnly = true)
    public Optional<ContestParticipantDto> getStudentParticipantState(String slug, User student) {
        Contest contest = contestRepository.findBySlug(slug).orElse(null);
        if (contest == null) return Optional.empty();

        return contestParticipantRepository.findByContestAndUser(contest, student)
            .map(ContestParticipantDto::fromEntity);
    }

    @Transactional
    public ContestParticipantDto recordTabSwitch(String slug, User student) {
        Contest contest = contestRepository.findBySlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Contest not found"));

        ContestParticipant participant = contestParticipantRepository
            .findByContestAndUser(contest, student)
            .orElseThrow(() -> new IllegalStateException("Student is not registered in this contest"));

        participant.setTabSwitchCount(participant.getTabSwitchCount() + 1);
        participant.setUpdatedAt(Instant.now());

        if (contest.isAllowTabSwitch() && participant.getTabSwitchCount() > contest.getMaxTabSwitches()) {
            participant.setStatus("FLAGGED_VIOLATION");
        }

        participant = contestParticipantRepository.save(participant);
        return ContestParticipantDto.fromEntity(participant);
    }

    @Transactional
    public ContestParticipantDto finishExam(String slug, User student) {
        Contest contest = contestRepository.findBySlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Contest not found"));

        ContestParticipant participant = contestParticipantRepository
            .findByContestAndUser(contest, student)
            .orElseThrow(() -> new IllegalStateException("Student is not registered in this contest"));

        participant.setStatus("SUBMITTED");
        participant.setSubmittedAt(Instant.now());
        participant.setUpdatedAt(Instant.now());

        participant = contestParticipantRepository.save(participant);
        return ContestParticipantDto.fromEntity(participant);
    }

    @Transactional(readOnly = true)
    public List<ContestLeaderboardEntryDto> getLeaderboard(String slug) {
        Contest contest = contestRepository.findBySlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Contest not found"));

        List<ContestParticipant> participants = contestParticipantRepository.findLeaderboardByContest(contest);
        List<ContestLeaderboardEntryDto> leaderboard = new ArrayList<>();
        int rank = 1;
        for (ContestParticipant cp : participants) {
            leaderboard.add(ContestLeaderboardEntryDto.fromEntity(cp, rank++));
        }
        return leaderboard;
    }

    @Transactional(readOnly = true)
    public List<ContestSubmissionDto> getRecentContestSubmissions(String slug) {
        Contest contest = contestRepository.findBySlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Contest not found"));

        return contestSubmissionRepository.findRecentSubmissionsWithDetails(contest, PageRequest.of(0, 50))
            .stream()
            .map(ContestSubmissionDto::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ContestSubmissionDto> getStudentSubmissions(String slug, User student) {
        Contest contest = contestRepository.findBySlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Contest not found"));

        ContestParticipant participant = contestParticipantRepository
            .findByContestAndUser(contest, student)
            .orElse(null);

        if (participant == null) return List.of();

        return contestSubmissionRepository.findByContestAndParticipant(contest, participant)
            .stream()
            .map(ContestSubmissionDto::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ContestParticipantDto> getParticipants(String slug) {
        Contest contest = contestRepository.findBySlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Contest not found"));

        return contestParticipantRepository.findLeaderboardByContest(contest)
            .stream()
            .map(ContestParticipantDto::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public String generateGradebookCsv(String slug) {
        Contest contest = contestRepository.findBySlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Contest not found"));

        List<ContestParticipant> participants = contestParticipantRepository.findLeaderboardByContest(contest);
        StringBuilder csv = new StringBuilder();
        csv.append("Rank,Student Name,Student Email,Score,Penalty Seconds,Tab Switches,Proctor Status,Started At,Submitted At\n");

        int rank = 1;
        for (ContestParticipant cp : participants) {
            String name = cp.getUser() != null && cp.getUser().getName() != null
                ? "\"" + cp.getUser().getName().replace("\"", "\"\"") + "\""
                : "\"\"";
            String email = cp.getUser() != null && cp.getUser().getEmail() != null
                ? "\"" + cp.getUser().getEmail().replace("\"", "\"\"") + "\""
                : "\"\"";
            String started = cp.getStartedAt() != null ? cp.getStartedAt().toString() : "";
            String submitted = cp.getSubmittedAt() != null ? cp.getSubmittedAt().toString() : "";

            csv.append(rank++)
                .append(",").append(name)
                .append(",").append(email)
                .append(",").append(cp.getTotalScore())
                .append(",").append(cp.getPenaltySeconds())
                .append(",").append(cp.getTabSwitchCount())
                .append(",").append("\"").append(cp.getStatus()).append("\"")
                .append(",").append("\"").append(started).append("\"")
                .append(",").append("\"").append(submitted).append("\"\n");
        }

        return csv.toString();
    }
}
