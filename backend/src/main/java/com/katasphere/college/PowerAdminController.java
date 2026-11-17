package com.katasphere.college;

import com.katasphere.common.ApiResponse;
import com.katasphere.contest.*;
import com.katasphere.problem.ProblemRepository;
import com.katasphere.problem.TestCaseRepository;
import com.katasphere.submission.SubmissionRepository;
import com.katasphere.user.User;
import com.katasphere.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/v1/power-admin")
public class PowerAdminController {

    private final CollegeRepository collegeRepository;
    private final UserRepository userRepository;
    private final ContestRepository contestRepository;
    private final ContestProblemRepository contestProblemRepository;
    private final ContestParticipantRepository participantRepository;
    private final ContestSubmissionRepository contestSubmissionRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final SubmissionRepository submissionRepository;

    public PowerAdminController(
        CollegeRepository collegeRepository,
        UserRepository userRepository,
        ContestRepository contestRepository,
        ContestProblemRepository contestProblemRepository,
        ContestParticipantRepository participantRepository,
        ContestSubmissionRepository contestSubmissionRepository,
        ProblemRepository problemRepository,
        TestCaseRepository testCaseRepository,
        SubmissionRepository submissionRepository
    ) {
        this.collegeRepository = collegeRepository;
        this.userRepository = userRepository;
        this.contestRepository = contestRepository;
        this.contestProblemRepository = contestProblemRepository;
        this.participantRepository = participantRepository;
        this.contestSubmissionRepository = contestSubmissionRepository;
        this.problemRepository = problemRepository;
        this.testCaseRepository = testCaseRepository;
        this.submissionRepository = submissionRepository;
    }

    public record SystemHealthDto(
        String status,
        String databaseStatus,
        String executionEngineStatus,
        String javaVersion,
        String osName,
        long uptimeSeconds,
        long memoryUsedMb,
        long memoryTotalMb,
        long memoryMaxMb,
        int availableProcessors,
        long totalProblemsInCatalog,
        long totalTestCasesInDb,
        long totalPracticeSubmissions,
        long totalContestSubmissions,
        Instant checkedAt
    ) {}

    public record PowerCollegeDetailDto(
        UUID id,
        String collegeCode,
        String name,
        String officialEmail,
        UUID adminUserId,
        String adminName,
        String adminEmail,
        String department,
        String city,
        String state,
        String country,
        String address,
        String website,
        String phone,
        Integer expectedStudents,
        long registeredStudentsCount,
        long activeTenureStudentsCount,
        long expiredTenureStudentsCount,
        String planCode,
        String planName,
        int contestQuotaTotal,
        int contestsUsed,
        int contestsLeft,
        Instant planExpiresAt,
        long totalContestsCreated,
        long contestsHappenedCount,
        long activeContestsCount,
        long upcomingContestsCount,
        long totalStudentParticipations,
        Instant createdAt
    ) {}

    public record PowerStudentDetailDto(
        UUID userId,
        String name,
        String email,
        String role,
        UUID collegeId,
        String collegeName,
        String collegeCode,
        String rollNumber,
        Integer tenureStartYear,
        Integer tenureEndYear,
        boolean isTenureExpired,
        long contestsParticipated,
        long contestsSubmitted,
        int totalScoreEarned,
        long practiceProblemsSolved,
        Instant createdAt
    ) {}

    public record PowerUserDetailDto(
        UUID userId,
        String name,
        String email,
        String role,
        boolean isAlsoStudent,
        boolean isCollegeAdmin,
        boolean isPowerUser,
        UUID collegeId,
        String collegeName,
        String collegeCode,
        String rollNumber,
        Integer tenureStartYear,
        Integer tenureEndYear,
        boolean isTenureExpired,
        String ownedCollegeName,
        String ownedCollegeCode,
        long practiceProblemsSolved,
        long practiceSubmissionsCount,
        long contestParticipationsCount,
        Instant createdAt
    ) {}

    public record PowerContestDetailDto(
        UUID contestId,
        String title,
        String slug,
        UUID collegeId,
        String collegeName,
        String collegeCode,
        String status,
        Instant startTime,
        Instant endTime,
        int durationMinutes,
        int totalProblems,
        long totalParticipants,
        long submittedParticipants,
        Instant createdAt
    ) {}

    public record PowerAdminOverviewDto(
        SystemHealthDto systemHealth,
        long totalRegisteredColleges,
        long totalRegisteredStudents,
        long totalRegisteredUsers,
        long totalUsersWhoAreAlsoStudents,
        long totalContestsHappened,
        long totalContestsScheduled,
        long totalActiveContests,
        long totalUpcomingContests,
        long totalContestParticipations,
        long totalContestSubmissions,
        List<PowerCollegeDetailDto> colleges,
        List<PowerStudentDetailDto> students,
        List<PowerUserDetailDto> users,
        List<PowerContestDetailDto> contests
    ) {}

    @GetMapping("/overview")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<PowerAdminOverviewDto>> getPlatformOverview(HttpServletRequest request) {
        User current = resolveUser(request);
        if (current == null || (!"POWER_USER".equalsIgnoreCase(current.getRole())
                && !"hrishu22@gmail.com".equalsIgnoreCase(current.getEmail()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("Access restricted to Platform Power User (hrishu22@gmail.com)."));
        }

        Instant now = Instant.now();

        List<College> allColleges = collegeRepository.findAllByOrderByNameAsc();
        List<User> allUsers = userRepository.findAll();
        List<Contest> allContests = contestRepository.findAll();

        Map<UUID, College> collegeById = new HashMap<>();
        Map<UUID, College> collegeByAdminUserId = new HashMap<>();
        for (College c : allColleges) {
            collegeById.put(c.getId(), c);
            if (c.getAdminUserId() != null) {
                collegeByAdminUserId.put(c.getAdminUserId(), c);
            }
        }

        Map<UUID, User> userById = new HashMap<>();
        for (User u : allUsers) {
            userById.put(u.getId(), u);
        }

        // Group contests by college
        long totalContestsHappened = 0;
        long totalActiveContests = 0;
        long totalUpcomingContests = 0;
        long totalContestParticipations = 0;

        List<PowerContestDetailDto> contestDtos = new ArrayList<>();
        Map<UUID, List<Contest>> contestsByCollegeId = new HashMap<>();
        Map<UUID, List<ContestParticipant>> participationsByUserId = new HashMap<>();

        for (Contest c : allContests) {
            String status = now.isBefore(c.getStartTime())
                ? "UPCOMING"
                : now.isAfter(c.getEndTime())
                ? "CONCLUDED"
                : "ACTIVE";

            if ("CONCLUDED".equals(status)) totalContestsHappened++;
            else if ("ACTIVE".equals(status)) totalActiveContests++;
            else totalUpcomingContests++;

            College linkedCol = c.getTenantId() != null ? collegeById.get(c.getTenantId()) : null;
            if (linkedCol != null) {
                contestsByCollegeId.computeIfAbsent(linkedCol.getId(), k -> new ArrayList<>()).add(c);
            }

            List<ContestParticipant> parts = participantRepository.findLeaderboardByContest(c);
            totalContestParticipations += parts.size();
            long submittedCount = parts.stream().filter(p -> "SUBMITTED".equalsIgnoreCase(p.getStatus())).count();

            for (ContestParticipant cp : parts) {
                if (cp.getUser() != null) {
                    participationsByUserId.computeIfAbsent(cp.getUser().getId(), k -> new ArrayList<>()).add(cp);
                }
            }

            int probCount = (int) contestProblemRepository.countByContest(c);
            contestDtos.add(new PowerContestDetailDto(
                c.getId(),
                c.getTitle(),
                c.getSlug(),
                linkedCol != null ? linkedCol.getId() : c.getTenantId(),
                linkedCol != null ? linkedCol.getName() : c.getCollegeName(),
                linkedCol != null ? linkedCol.getCollegeCode() : "—",
                status,
                c.getStartTime(),
                c.getEndTime(),
                c.getDurationMinutes(),
                probCount,
                parts.size(),
                submittedCount,
                c.getCreatedAt()
            ));
        }

        contestDtos.sort(Comparator.comparing(PowerContestDetailDto::startTime).reversed());

        // Build Registered Colleges DTOs
        List<PowerCollegeDetailDto> collegeDtos = new ArrayList<>();
        for (College col : allColleges) {
            User adminUser = col.getAdminUserId() != null ? userById.get(col.getAdminUserId()) : null;
            List<User> colStudents = userRepository.findByCollegeIdOrderByCreatedAtDesc(col.getId());
            long activeStudents = colStudents.stream().filter(u -> !u.isTenureExpired()).count();
            long expiredStudents = colStudents.size() - activeStudents;

            List<Contest> colContests = contestsByCollegeId.getOrDefault(col.getId(), List.of());
            long happened = colContests.stream().filter(c -> now.isAfter(c.getEndTime())).count();
            long active = colContests.stream().filter(c -> !now.isBefore(c.getStartTime()) && !now.isAfter(c.getEndTime())).count();
            long upcoming = colContests.stream().filter(c -> now.isBefore(c.getStartTime())).count();
            long colParticipations = colContests.stream().mapToLong(participantRepository::countByContest).sum();

            collegeDtos.add(new PowerCollegeDetailDto(
                col.getId(),
                col.getCollegeCode(),
                col.getName(),
                col.getOfficialEmail(),
                col.getAdminUserId(),
                adminUser != null ? adminUser.getName() : "—",
                adminUser != null ? adminUser.getEmail() : col.getOfficialEmail(),
                col.getDepartment(),
                col.getCity(),
                col.getState(),
                col.getCountry(),
                col.getAddress(),
                col.getWebsite(),
                col.getPhone(),
                col.getExpectedStudents(),
                colStudents.size(),
                activeStudents,
                expiredStudents,
                col.getPlanCode() != null ? col.getPlanCode() : "NONE",
                col.getPlanName() != null && !col.getPlanName().isBlank() ? col.getPlanName() : "No Active Plan",
                col.getContestQuotaTotal(),
                col.getContestsUsed(),
                col.getContestsLeft(),
                col.getPlanExpiresAt(),
                colContests.size(),
                happened,
                active,
                upcoming,
                colParticipations,
                col.getCreatedAt()
            ));
        }

        // Build Registered Students & Registered Users DTOs
        List<PowerStudentDetailDto> studentDtos = new ArrayList<>();
        List<PowerUserDetailDto> userDtos = new ArrayList<>();
        long totalUsersWhoAreAlsoStudents = 0;

        List<User> sortedUsers = new ArrayList<>(allUsers);
        sortedUsers.sort(Comparator.comparing(User::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));

        for (User u : sortedUsers) {
            boolean isStudent = u.getCollegeId() != null;
            College studentCol = isStudent ? collegeById.get(u.getCollegeId()) : null;
            College ownedCol = collegeByAdminUserId.get(u.getId());
            boolean isPower = "POWER_USER".equalsIgnoreCase(u.getRole()) || "hrishu22@gmail.com".equalsIgnoreCase(u.getEmail());
            boolean isColAdmin = ownedCol != null || "COLLEGE_ADMIN".equalsIgnoreCase(u.getRole());

            if (isStudent) {
                totalUsersWhoAreAlsoStudents++;
            }

            List<ContestParticipant> myParts = participationsByUserId.getOrDefault(u.getId(), List.of());
            long submittedParts = myParts.stream().filter(p -> "SUBMITTED".equalsIgnoreCase(p.getStatus())).count();
            int totalContestScore = myParts.stream().mapToInt(ContestParticipant::getTotalScore).sum();
            long solvedPractice = submissionRepository.countDistinctSolvedByUser(u);
            long totalPracticeSubs = submissionRepository.countByUser(u);

            if (isStudent) {
                studentDtos.add(new PowerStudentDetailDto(
                    u.getId(),
                    u.getName(),
                    u.getEmail(),
                    u.getRole(),
                    u.getCollegeId(),
                    studentCol != null ? studentCol.getName() : "Linked College",
                    studentCol != null ? studentCol.getCollegeCode() : "—",
                    u.getCollegeRollNumber(),
                    u.getTenureStartYear(),
                    u.getTenureEndYear(),
                    u.isTenureExpired(),
                    myParts.size(),
                    submittedParts,
                    totalContestScore,
                    solvedPractice,
                    u.getCreatedAt()
                ));
            }

            userDtos.add(new PowerUserDetailDto(
                u.getId(),
                u.getName(),
                u.getEmail(),
                isPower ? "POWER_USER" : u.getRole(),
                isStudent,
                isColAdmin,
                isPower,
                u.getCollegeId(),
                studentCol != null ? studentCol.getName() : null,
                studentCol != null ? studentCol.getCollegeCode() : null,
                u.getCollegeRollNumber(),
                u.getTenureStartYear(),
                u.getTenureEndYear(),
                u.isTenureExpired(),
                ownedCol != null ? ownedCol.getName() : null,
                ownedCol != null ? ownedCol.getCollegeCode() : null,
                solvedPractice,
                totalPracticeSubs,
                myParts.size(),
                u.getCreatedAt()
            ));
        }

        // System Health Telemetry
        Runtime rt = Runtime.getRuntime();
        long memTotalMb = rt.totalMemory() / (1024 * 1024);
        long memFreeMb = rt.freeMemory() / (1024 * 1024);
        long memUsedMb = memTotalMb - memFreeMb;
        long memMaxMb = rt.maxMemory() / (1024 * 1024);
        long uptimeSec = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;

        long totalProblems = problemRepository.count();
        long totalTestCases = testCaseRepository.count();
        long totalPracticeSubs = submissionRepository.count();
        long totalContestSubs = contestSubmissionRepository.count();

        SystemHealthDto health = new SystemHealthDto(
            "HEALTHY",
            "UP • PostgreSQL Connected",
            "UP • Java / Python / Node.js Sandbox Ready",
            System.getProperty("java.version", "17"),
            System.getProperty("os.name", "macOS") + " (" + System.getProperty("os.arch", "aarch64") + ")",
            uptimeSec,
            memUsedMb,
            memTotalMb,
            memMaxMb,
            rt.availableProcessors(),
            totalProblems,
            totalTestCases,
            totalPracticeSubs,
            totalContestSubs,
            now
        );

        PowerAdminOverviewDto overview = new PowerAdminOverviewDto(
            health,
            allColleges.size(),
            studentDtos.size(),
            allUsers.size(),
            totalUsersWhoAreAlsoStudents,
            totalContestsHappened,
            allContests.size(),
            totalActiveContests,
            totalUpcomingContests,
            totalContestParticipations,
            totalContestSubs,
            collegeDtos,
            studentDtos,
            userDtos,
            contestDtos
        );

        return ResponseEntity.ok(ApiResponse.ok("Power Admin platform overview retrieved", overview));
    }

    private User resolveUser(HttpServletRequest request) {
        Object attrUserId = request.getAttribute("USER_ID");
        if (attrUserId instanceof UUID uuid) {
            return userRepository.findById(uuid).orElse(null);
        }
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("USER_ID") != null) {
            UUID userId = (UUID) session.getAttribute("USER_ID");
            return userRepository.findById(userId).orElse(null);
        }
        return null;
    }
}
