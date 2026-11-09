package com.katasphere.contest;

import com.katasphere.college.College;
import com.katasphere.college.CollegeRepository;
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
    private final CollegeRepository collegeRepository;

    public ContestService(
        ContestRepository contestRepository,
        ContestProblemRepository contestProblemRepository,
        ContestParticipantRepository contestParticipantRepository,
        ContestSubmissionRepository contestSubmissionRepository,
        ProblemRepository problemRepository,
        TestCaseRepository testCaseRepository,
        CollegeRepository collegeRepository
    ) {
        this.contestRepository = contestRepository;
        this.contestProblemRepository = contestProblemRepository;
        this.contestParticipantRepository = contestParticipantRepository;
        this.contestSubmissionRepository = contestSubmissionRepository;
        this.problemRepository = problemRepository;
        this.testCaseRepository = testCaseRepository;
        this.collegeRepository = collegeRepository;
    }

    @Transactional
    public ContestDto createContest(CreateContestRequest req, User admin, College college) {
        if (admin == null || (!"COLLEGE_ADMIN".equalsIgnoreCase(admin.getRole()) && !"ADMIN".equalsIgnoreCase(admin.getRole()))) {
            throw new IllegalStateException("Only a registered College Admin can create a contest.");
        }

        if (college == null || !admin.getId().equals(college.getAdminUserId())) {
            throw new IllegalStateException("Only the registered Admin of a college can create contests for that institution.");
        }

        boolean hasPurchasedPlan = college.getPlanCode() != null
            && !"NONE".equalsIgnoreCase(college.getPlanCode())
            && college.getContestQuotaTotal() > 0;

        if (!hasPurchasedPlan) {
            throw new IllegalStateException(
                "Only a College Admin with a valid purchased plan can create a contest. Please purchase a plan (3/month, 6/month, or 20/year) or top-up contests first."
            );
        }

        if (college.getPlanExpiresAt() != null && college.getPlanExpiresAt().isBefore(Instant.now())) {
            throw new IllegalStateException(
                "Your college contest plan has expired. Please renew or extend your plan to schedule new contests."
            );
        }

        if (college.getContestsLeft() <= 0) {
            throw new IllegalStateException(
                "Contest quota exhausted (0 of " + college.getContestQuotaTotal()
                + " contests left). Please extend your plan or purchase additional contests to schedule a new contest."
            );
        }

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
            // College name always comes from the registered college, never from the client
            college != null ? college.getName() : req.collegeName(),
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
        if (college != null) {
            contest.setTenantId(college.getId());
            college.setContestsUsed(college.getContestsUsed() + 1);
            collegeRepository.save(college);
        }

        contest = contestRepository.save(contest);

        if (req.problems() != null && !req.problems().isEmpty()) {
            int order = 1;
            for (var pConfig : req.problems()) {
                Problem problem = problemRepository.findById(pConfig.problemId())
                    .orElseThrow(() -> new IllegalArgumentException("Problem not found: " + pConfig.problemId()));

                ContestProblem cp = new ContestProblem(
                    contest,
                    problem,
                    pConfig.resolvedOrder(order++),
                    pConfig.points() > 0 ? pConfig.points() : 100
                );
                contestProblemRepository.save(cp);
            }
        }

        return ContestDto.fromEntity(contest, req.problems() != null ? req.problems().size() : 0, 0);
    }

    // ------------------------------------------------------------ tenant access rules

    /**
     * Contests are only visible to signed-in users who have an active registered/linked college.
     * Passed-out candidates (isTenureExpired == true) cannot view upcoming or active contests
     * of their passed-out college, though they can still view past contests for history/leaderboard.
     */
    public boolean canView(Contest c, User viewer) {
        if (viewer == null) return false;
        if (isAdminOfTenant(c, viewer) || canManage(c, viewer)) return true;

        boolean hasActiveStudentCollege = viewer.getCollegeId() != null && !viewer.isTenureExpired();
        boolean isPastContest = Instant.now().isAfter(c.getEndTime());

        if (c.getTenantId() != null) {
            if (!c.getTenantId().equals(viewer.getCollegeId())) return false;
            return !viewer.isTenureExpired() || isPastContest;
        }
        return hasActiveStudentCollege;
    }

    public boolean canManage(Contest c, User user) {
        if (user == null) return false;
        if (c.getCreatedBy() != null && user.getId().equals(c.getCreatedBy().getId())) return true;
        return isAdminOfTenant(c, user);
    }

    private boolean isAdminOfTenant(Contest c, User user) {
        return c.getTenantId() != null && collegeRepository.findByAdminUserId(user.getId())
            .map(col -> col.getId().equals(c.getTenantId()))
            .orElse(false);
    }

    /** Same "not found" message for missing and forbidden, so slugs of other colleges can't be probed. */
    @Transactional(readOnly = true)
    public Contest requireManageable(String slug, User user) {
        Contest c = contestRepository.findBySlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Contest not found"));
        if (!canManage(c, user)) throw new IllegalArgumentException("Contest not found");
        return c;
    }

    private Contest requireVisible(String slug, User viewer) {
        Contest c = contestRepository.findBySlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Contest not found"));
        if (!canView(c, viewer)) throw new IllegalArgumentException("Contest not found");
        return c;
    }

    private ContestDto toDto(Contest c) {
        return ContestDto.fromEntity(c, (int) contestProblemRepository.countByContest(c), contestParticipantRepository.countByContest(c));
    }

    @Transactional(readOnly = true)
    public List<ContestDto> getAllPublishedContests(User viewer) {
        if (viewer == null) {
            return List.of();
        }

        // 1. If the user is a College Admin, show their college's contests
        Optional<College> adminCollege = collegeRepository.findByAdminUserId(viewer.getId());
        if (adminCollege.isPresent()) {
            College col = adminCollege.get();
            return contestRepository.findPublishedByCollege(col.getId(), col.getName()).stream()
                .map(c -> toDto(c).withoutAccessCode())
                .toList();
        }

        // 2. If the user is a Student without a college, or has passed out (tenure expired), show no contests
        if (viewer.getCollegeId() == null || viewer.isTenureExpired()) {
            return List.of();
        }

        // 3. Active student linked to a college: show their college's published contests
        String colName = collegeRepository.findById(viewer.getCollegeId()).map(College::getName).orElse("");
        return contestRepository.findPublishedByCollege(viewer.getCollegeId(), colName).stream()
            .map(c -> toDto(c).withoutAccessCode())
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ContestDto> getFacultyContests(User admin, College college) {
        List<Contest> list = college != null
            ? contestRepository.findByTenantIdOrderByStartTimeDesc(college.getId())
            : contestRepository.findByCreatedByOrderByCreatedAtDesc(admin);
        return list.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public ContestDetailDto getContestDetail(String slug, User viewer) {
        Contest contest = requireVisible(slug, viewer);

        // Problem statements are only revealed to enrolled candidates once the exam has started
        // (or to the managing faculty). Everyone else sees only difficulty + points.
        boolean started = !Instant.now().isBefore(contest.getStartTime());
        boolean enrolled = viewer != null && contestParticipantRepository.existsByContestAndUser(contest, viewer);
        boolean reveal = canManage(contest, viewer) || (started && enrolled);

        List<ContestProblem> cpList = contestProblemRepository.findByContestWithProblemOrderByProblemOrderAsc(contest);
        List<ContestProblemDto> problemDtos = new ArrayList<>();
        for (int i = 0; i < cpList.size(); i++) {
            ContestProblem cp = cpList.get(i);
            if (reveal) {
                List<TestCase> cases = testCaseRepository.findByProblemOrderByPositionAsc(cp.getProblem());
                problemDtos.add(ContestProblemDto.fromEntity(cp, cases));
            } else {
                problemDtos.add(ContestProblemDto.redacted(cp, i));
            }
        }

        return ContestDetailDto.fromEntity(contest, problemDtos);
    }

    @Transactional
    public ContestParticipantDto joinContest(String slug, JoinContestRequest req, User student) {
        Contest contest = contestRepository.findBySlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Contest not found with slug: " + slug));

        if (student.getCollegeId() == null) {
            throw new IllegalStateException("Please link your college in your Profile before entering a college examination.");
        }

        if (student.isTenureExpired()) {
            throw new IllegalStateException("Your college tenure (Graduated " + student.getTenureEndYear()
                + ") has completed. Passed-out candidates cannot join active college examinations.");
        }

        if (contest.getTenantId() != null && !contest.getTenantId().equals(student.getCollegeId())) {
            throw new IllegalStateException("This examination is restricted to students of " + contest.getCollegeName()
                + ". Link your college (name + College ID) in your profile first.");
        }

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

    /** Public leaderboard: tenant-scoped and with student emails masked. */
    @Transactional(readOnly = true)
    public List<ContestLeaderboardEntryDto> getPublicLeaderboard(String slug, User viewer) {
        requireVisible(slug, viewer);
        return getLeaderboard(slug).stream().map(ContestLeaderboardEntryDto::withoutEmail).toList();
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
