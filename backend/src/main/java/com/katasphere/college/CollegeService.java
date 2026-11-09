package com.katasphere.college;

import com.katasphere.college.CollegeDtos.*;
import com.katasphere.contest.Contest;
import com.katasphere.contest.ContestParticipant;
import com.katasphere.contest.ContestParticipantRepository;
import com.katasphere.contest.ContestProblemRepository;
import com.katasphere.contest.ContestRepository;
import com.katasphere.contest.ContestSubmissionRepository;
import com.katasphere.user.User;
import com.katasphere.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
public class CollegeService {

    // Unambiguous alphabet (no 0/O, 1/I/L) so IDs are easy to read out in a classroom
    private static final char[] CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789".toCharArray();
    private static final SecureRandom RANDOM = new SecureRandom();

    private final CollegeRepository collegeRepository;
    private final UserRepository userRepository;
    private final ContestRepository contestRepository;
    private final ContestProblemRepository contestProblemRepository;
    private final ContestParticipantRepository participantRepository;
    private final ContestSubmissionRepository submissionRepository;

    public CollegeService(
        CollegeRepository collegeRepository,
        UserRepository userRepository,
        ContestRepository contestRepository,
        ContestProblemRepository contestProblemRepository,
        ContestParticipantRepository participantRepository,
        ContestSubmissionRepository submissionRepository
    ) {
        this.collegeRepository = collegeRepository;
        this.userRepository = userRepository;
        this.contestRepository = contestRepository;
        this.contestProblemRepository = contestProblemRepository;
        this.participantRepository = participantRepository;
        this.submissionRepository = submissionRepository;
    }

    // ---------------------------------------------------------------- suggestions

    @Transactional(readOnly = true)
    public List<CollegeSuggestionDto> getSuggestions(String query) {
        String q = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);
        return collegeRepository.findAllByOrderByNameAsc().stream()
            .filter(c -> q.isEmpty()
                || c.getName().toLowerCase(Locale.ROOT).contains(q)
                || c.getCollegeCode().toLowerCase(Locale.ROOT).contains(q)
                || (c.getCity() != null && c.getCity().toLowerCase(Locale.ROOT).contains(q))
                || (c.getState() != null && c.getState().toLowerCase(Locale.ROOT).contains(q))
                || (c.getDepartment() != null && c.getDepartment().toLowerCase(Locale.ROOT).contains(q))
            )
            .limit(25)
            .map(c -> new CollegeSuggestionDto(
                c.getId(),
                c.getCollegeCode(),
                c.getName(),
                c.getDepartment(),
                c.getCity(),
                c.getState(),
                c.getCountry(),
                userRepository.countByCollegeId(c.getId()),
                contestRepository.countByCollege(c.getId(), c.getName())
            ))
            .toList();
    }

    // ---------------------------------------------------------------- admin side

    public List<CollegePlanOptionDto> getPlanCatalog() {
        return List.of(
            new CollegePlanOptionDto(
                "STARTER_MONTHLY",
                "Starter Plan (3 Contests / Month)",
                3,
                "per month",
                1499,
                499,
                "Ideal for departmental quizzes and monthly coding labs. Includes 3 proctored examinations per month."
            ),
            new CollegePlanOptionDto(
                "GROWTH_MONTHLY",
                "Growth Plan (6 Contests / Month)",
                6,
                "per month",
                2499,
                399,
                "Designed for active placement cells and weekly coding assessments. Includes 6 examinations per month."
            ),
            new CollegePlanOptionDto(
                "CAMPUS_YEARLY",
                "Campus Annual Plan (20 Contests / Year)",
                20,
                "per year",
                6999,
                349,
                "Full academic year coverage for mid-sems, finals, and placement drives. Includes 20 examinations per year."
            )
        );
    }

    @Transactional
    public CollegeAdminDto register(User admin, RegisterCollegeRequest req) {
        if (collegeRepository.findByAdminUserId(admin.getId()).isPresent()) {
            throw new IllegalStateException("You have already registered a college. Edit it from your profile.");
        }
        if (admin.getCollegeId() != null) {
            throw new IllegalStateException("This account is linked to a college as a student. Use a separate faculty account to register a college.");
        }

        College c = new College();
        c.setCollegeCode(generateUniqueCode());
        c.setAdminUserId(admin.getId());
        apply(c, req);
        if (req.planCode() != null && !req.planCode().isBlank() && !"NONE".equalsIgnoreCase(req.planCode())) {
            applyPlanSelection(c, req.planCode());
        }
        c = collegeRepository.save(c);

        if (!"ADMIN".equalsIgnoreCase(admin.getRole())) {
            admin.setRole("COLLEGE_ADMIN");
            userRepository.save(admin);
        }
        return CollegeAdminDto.from(c, 0, 0);
    }

    @Transactional
    public CollegeAdminDto update(User admin, RegisterCollegeRequest req) {
        College c = collegeRepository.findByAdminUserId(admin.getId())
            .orElseThrow(() -> new IllegalArgumentException("No college registered for this account"));
        apply(c, req);
        if (req.planCode() != null && !req.planCode().isBlank()
                && !"NONE".equalsIgnoreCase(req.planCode())
                && c.getContestQuotaTotal() == 0) {
            applyPlanSelection(c, req.planCode());
        }
        c = collegeRepository.save(c);
        return toAdminDto(c);
    }

    @Transactional
    public CollegeAdminDto selectOrExtendPlan(User admin, SelectCollegePlanRequest req) {
        College c = collegeRepository.findByAdminUserId(admin.getId())
            .orElseThrow(() -> new IllegalArgumentException("Please register your college first before selecting a plan."));
        applyPlanSelection(c, req.planCode());
        c = collegeRepository.save(c);
        return toAdminDto(c);
    }

    @Transactional
    public CollegeAdminDto topUpContests(User admin, TopUpContestsRequest req) {
        College c = collegeRepository.findByAdminUserId(admin.getId())
            .orElseThrow(() -> new IllegalArgumentException("Please register your college first before purchasing contests."));
        int add = req.additionalContests() != null ? req.additionalContests() : 0;
        if (add < 1) {
            throw new IllegalArgumentException("Please enter at least 1 contest to purchase.");
        }
        c.setContestQuotaTotal(c.getContestQuotaTotal() + add);
        if ("NONE".equalsIgnoreCase(c.getPlanCode()) || c.getPlanCode() == null) {
            c.setPlanCode("CUSTOM_TOPUP");
            c.setPlanName("Pay-As-You-Go Contest Pack");
            c.setPlanExpiresAt(Instant.now().plus(Duration.ofDays(365)));
        }
        c = collegeRepository.save(c);
        return toAdminDto(c);
    }

    private void applyPlanSelection(College c, String rawPlanCode) {
        String code = rawPlanCode == null ? "" : rawPlanCode.trim().toUpperCase(Locale.ROOT);
        Instant baseExpiry = (c.getPlanExpiresAt() != null && c.getPlanExpiresAt().isAfter(Instant.now()))
            ? c.getPlanExpiresAt()
            : Instant.now();

        switch (code) {
            case "STARTER_MONTHLY" -> {
                c.setPlanCode("STARTER_MONTHLY");
                c.setPlanName("Starter Plan (3 Contests / Month)");
                c.setContestQuotaTotal(c.getContestQuotaTotal() + 3);
                c.setPlanExpiresAt(baseExpiry.plus(Duration.ofDays(30)));
            }
            case "GROWTH_MONTHLY" -> {
                c.setPlanCode("GROWTH_MONTHLY");
                c.setPlanName("Growth Plan (6 Contests / Month)");
                c.setContestQuotaTotal(c.getContestQuotaTotal() + 6);
                c.setPlanExpiresAt(baseExpiry.plus(Duration.ofDays(30)));
            }
            case "CAMPUS_YEARLY" -> {
                c.setPlanCode("CAMPUS_YEARLY");
                c.setPlanName("Campus Annual Plan (20 Contests / Year)");
                c.setContestQuotaTotal(c.getContestQuotaTotal() + 20);
                c.setPlanExpiresAt(baseExpiry.plus(Duration.ofDays(365)));
            }
            default -> throw new IllegalArgumentException("Invalid college plan code: " + rawPlanCode);
        }
    }

    @Transactional(readOnly = true)
    public Optional<College> findAdminCollege(User user) {
        return collegeRepository.findByAdminUserId(user.getId());
    }

    /**
     * Dedicated Admin Dashboard strictly scoped to the signed-in admin's own college.
     * Aggregates all college metrics, student participation details, rankings/results,
     * and anti-cheat violation incidents (who cheated, in which contest, and how many tab switches).
     */
    @Transactional(readOnly = true)
    public CollegeAdminDashboardDto getAdminDashboard(User admin) {
        College college = collegeRepository.findByAdminUserId(admin.getId())
            .orElseThrow(() -> new IllegalArgumentException("Admin access required: No college registered with this account."));

        CollegeAdminDto collegeDto = toAdminDto(college);
        List<User> enrolledUsers = userRepository.findByCollegeIdOrderByCreatedAtDesc(college.getId());
        List<Contest> collegeContests = contestRepository.findPublishedByCollege(college.getId(), college.getName());

        long activeTenureStudents = enrolledUsers.stream().filter(u -> !u.isTenureExpired()).count();
        long passedOutStudents = enrolledUsers.size() - activeTenureStudents;

        Instant now = Instant.now();
        long activeContestsCount = 0;
        long upcomingContestsCount = 0;
        long completedContestsCount = 0;

        long totalParticipations = 0;
        double totalScorePctSum = 0;
        long totalScorePctCount = 0;

        long totalCheatIncidents = 0;
        long criticalDisqualifiedCount = 0;
        long totalTabSwitchesRecorded = 0;

        List<AdminContestSummaryDto> contestSummaries = new ArrayList<>();
        List<AdminParticipantDetailDto> participantsAndRankings = new ArrayList<>();
        List<AdminCheatIncidentDto> cheatIncidents = new ArrayList<>();

        // Track per-student stats across this college's contests
        Map<UUID, List<AdminParticipantDetailDto>> studentParticipationMap = new HashMap<>();

        for (Contest c : collegeContests) {
            String status = now.isBefore(c.getStartTime()) ? "UPCOMING" : now.isAfter(c.getEndTime()) ? "PAST" : "ACTIVE";
            switch (status) {
                case "ACTIVE" -> activeContestsCount++;
                case "UPCOMING" -> upcomingContestsCount++;
                default -> completedContestsCount++;
            }

            int totalProblems = (int) contestProblemRepository.countByContest(c);
            int maxScore = contestProblemRepository.sumPointsByContest(c);
            List<ContestParticipant> lb = participantRepository.findLeaderboardByContest(c);

            long cSubmitted = 0;
            long cFlagged = 0;
            long cTabSwitches = 0;
            double cPctSum = 0;
            String topScorerName = lb.isEmpty() ? null : lb.get(0).getUser().getName();
            Integer topScore = lb.isEmpty() ? null : lb.get(0).getTotalScore();

            int rankCounter = 1;
            for (ContestParticipant cp : lb) {
                totalParticipations++;
                User stu = cp.getUser();
                int solved = (int) submissionRepository.countSolvedProblems(cp);
                int score = cp.getTotalScore();
                double scorePct = maxScore > 0 ? Math.round(((100.0 * score) / maxScore) * 10.0) / 10.0 : 0.0;

                cPctSum += scorePct;
                totalScorePctSum += scorePct;
                totalScorePctCount++;

                if ("SUBMITTED".equalsIgnoreCase(cp.getStatus())) {
                    cSubmitted++;
                }

                int tabs = cp.getTabSwitchCount();
                int maxTabs = c.getMaxTabSwitches();
                cTabSwitches += tabs;
                totalTabSwitchesRecorded += tabs;

                boolean isCritical = "FLAGGED_VIOLATION".equalsIgnoreCase(cp.getStatus())
                    || (c.isAllowTabSwitch() && tabs > maxTabs);
                boolean isCheater = isCritical || tabs > 0;
                String cheatSeverity = isCritical ? "CRITICAL" : (tabs > 0 ? "WARNING" : "CLEAN");

                if (isCheater) {
                    cFlagged++;
                    totalCheatIncidents++;
                    if (isCritical) {
                        criticalDisqualifiedCount++;
                    }
                    String summary = isCritical
                        ? "Auto-flagged violation: switched tabs/windows " + tabs + " times (limit: " + maxTabs + ")"
                        : "Suspicious focus loss: switched tabs/windows " + tabs + " time(s) during exam (limit: " + maxTabs + ")";

                    cheatIncidents.add(new AdminCheatIncidentDto(
                        cp.getId(),
                        c.getId(),
                        c.getSlug(),
                        c.getTitle(),
                        stu.getId(),
                        stu.getName(),
                        stu.getEmail(),
                        stu.getCollegeRollNumber(),
                        stu.getTenureStartYear(),
                        stu.getTenureEndYear(),
                        tabs,
                        maxTabs,
                        cp.getStatus(),
                        isCritical ? "CRITICAL_DISQUALIFIED" : "WARNING_TAB_SWITCH",
                        summary,
                        score,
                        maxScore,
                        rankCounter,
                        cp.getStartedAt(),
                        cp.getUpdatedAt()
                    ));
                }

                AdminParticipantDetailDto detail = new AdminParticipantDetailDto(
                    cp.getId(),
                    c.getId(),
                    c.getSlug(),
                    c.getTitle(),
                    status,
                    maxScore,
                    stu.getId(),
                    stu.getName(),
                    stu.getEmail(),
                    stu.getCollegeRollNumber(),
                    stu.getTenureStartYear(),
                    stu.getTenureEndYear(),
                    stu.isTenureExpired(),
                    rankCounter,
                    lb.size(),
                    score,
                    scorePct,
                    solved,
                    totalProblems,
                    cp.getPenaltySeconds(),
                    cp.getStatus(),
                    tabs,
                    maxTabs,
                    isCheater,
                    cheatSeverity,
                    cp.getStartedAt(),
                    cp.getSubmittedAt()
                );

                participantsAndRankings.add(detail);
                studentParticipationMap.computeIfAbsent(stu.getId(), k -> new ArrayList<>()).add(detail);
                rankCounter++;
            }

            double cAvg = lb.isEmpty() ? 0.0 : Math.round((cPctSum / lb.size()) * 10.0) / 10.0;
            contestSummaries.add(new AdminContestSummaryDto(
                c.getId(),
                c.getSlug(),
                c.getTitle(),
                status,
                c.getStartTime(),
                c.getEndTime(),
                c.getDurationMinutes(),
                totalProblems,
                maxScore,
                lb.size(),
                cSubmitted,
                cFlagged,
                cTabSwitches,
                cAvg,
                topScorerName,
                topScore
            ));
        }

        // Sort cheat incidents so CRITICAL violations with highest tab-switch count appear first
        cheatIncidents.sort(
            Comparator.comparing((AdminCheatIncidentDto a) -> !"CRITICAL_DISQUALIFIED".equals(a.severity()))
                .thenComparing(Comparator.comparingInt(AdminCheatIncidentDto::tabSwitchCount).reversed())
        );

        List<AdminEnrolledStudentDto> enrolledDtos = new ArrayList<>();
        for (User stu : enrolledUsers) {
            List<AdminParticipantDetailDto> attempts = studentParticipationMap.getOrDefault(stu.getId(), List.of());
            int examsAttempted = attempts.size();
            Integer bestRank = attempts.stream().map(AdminParticipantDetailDto::rank).min(Integer::compareTo).orElse(null);
            double avgPct = attempts.isEmpty()
                ? 0.0
                : Math.round(attempts.stream().mapToDouble(AdminParticipantDetailDto::scorePercent).average().orElse(0.0) * 10.0) / 10.0;
            int totalTabs = attempts.stream().mapToInt(AdminParticipantDetailDto::tabSwitchCount).sum();
            int flaggedCount = (int) attempts.stream().filter(AdminParticipantDetailDto::isCheaterFlagged).count();

            enrolledDtos.add(new AdminEnrolledStudentDto(
                stu.getId(),
                stu.getName(),
                stu.getEmail(),
                stu.getCollegeRollNumber(),
                stu.getTenureStartYear(),
                stu.getTenureEndYear(),
                stu.isTenureExpired(),
                examsAttempted,
                bestRank,
                avgPct,
                totalTabs,
                flaggedCount,
                stu.getCreatedAt()
            ));
        }

        double overallAvgPct = totalScorePctCount == 0
            ? 0.0
            : Math.round((totalScorePctSum / totalScorePctCount) * 10.0) / 10.0;

        return new CollegeAdminDashboardDto(
            collegeDto,
            enrolledUsers.size(),
            activeTenureStudents,
            passedOutStudents,
            collegeContests.size(),
            activeContestsCount,
            upcomingContestsCount,
            completedContestsCount,
            totalParticipations,
            overallAvgPct,
            totalCheatIncidents,
            criticalDisqualifiedCount,
            totalTabSwitchesRecorded,
            contestSummaries,
            participantsAndRankings,
            cheatIncidents,
            enrolledDtos
        );
    }

    // -------------------------------------------------------------- student side

    @Transactional
    public StudentCollegeDto linkStudent(User student, LinkCollegeRequest req) {
        if (collegeRepository.findByAdminUserId(student.getId()).isPresent()) {
            throw new IllegalStateException("College administrator accounts cannot enrol as students.");
        }

        if (req.rollNumber() == null || req.rollNumber().isBlank()) {
            throw new IllegalArgumentException("Roll No. / Student ID is mandatory to register as a student.");
        }
        if (req.tenureEndYear() == null) {
            throw new IllegalArgumentException("Please provide your Graduation / Tenure Passing Year.");
        }
        if (req.tenureStartYear() != null && req.tenureEndYear() < req.tenureStartYear()) {
            throw new IllegalArgumentException("Graduation / Passing Year cannot be earlier than Admission / Start Year.");
        }

        String code = req.collegeCode() != null ? req.collegeCode().trim().toUpperCase(Locale.ROOT) : "";
        College c;
        if (!code.isEmpty()) {
            c = collegeRepository.findByCollegeCode(code)
                .filter(col -> normalize(col.getName()).equals(normalize(req.collegeName())))
                .orElseThrow(() -> new IllegalArgumentException(
                    "College name and College ID do not match. Please select a college from the suggestions or check the details shared by your college."));
        } else {
            String targetName = normalize(req.collegeName());
            c = collegeRepository.findAllByOrderByNameAsc().stream()
                .filter(col -> normalize(col.getName()).equals(targetName))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                    "College not found in registered institutions. Please select your college from the registered suggestions or enter your College ID."));
        }

        student.setCollegeId(c.getId());
        student.setCollegeRollNumber(blankToNull(req.rollNumber()));
        student.setTenureStartYear(req.tenureStartYear());
        student.setTenureEndYear(req.tenureEndYear());
        if (!"ADMIN".equalsIgnoreCase(student.getRole()) && !"COLLEGE_ADMIN".equalsIgnoreCase(student.getRole())) {
            student.setRole("COLLEGE_STUDENT");
        }
        userRepository.save(student);
        return toStudentDto(c, student);
    }

    @Transactional(readOnly = true)
    public CollegeContextDto getContext(User user) {
        CollegeAdminDto admin = collegeRepository.findByAdminUserId(user.getId()).map(this::toAdminDto).orElse(null);
        StudentCollegeDto student = user.getCollegeId() == null ? null
            : collegeRepository.findById(user.getCollegeId()).map(c -> toStudentDto(c, user)).orElse(null);
        return new CollegeContextDto(admin, student);
    }

    /**
     * Student exam dashboard:
     * - If the student has passed out (isTenureExpired == true), upcoming and active contests
     *   of the passed-out college are NOT shown.
     * - Always includes collegeHistory (all past examinations conducted by the student's college)
     *   plus the student's own past examination results and ranks.
     */
    @Transactional(readOnly = true)
    public StudentExamDashboardDto getStudentExamDashboard(User student) {
        StudentCollegeDto collegeDto = student.getCollegeId() == null ? null
            : collegeRepository.findById(userCollegeId(student)).map(c -> toStudentDto(c, student)).orElse(null);

        boolean tenureExpired = student.isTenureExpired();
        // Candidate profile works only during the candidate's active college tenure period
        if (tenureExpired) {
            return new StudentExamDashboardDto(
                collegeDto, true, List.of(), List.of(), List.of(), List.of(), 0, null, 0.0
            );
        }

        Map<UUID, ContestParticipant> myParticipation = new HashMap<>();
        for (ContestParticipant p : participantRepository.findByUserWithContest(student)) {
            myParticipation.put(p.getContest().getId(), p);
        }

        List<Contest> collegeContests = collegeDto != null
            ? contestRepository.findPublishedByCollege(collegeDto.id(), collegeDto.name())
            : List.of();

        LinkedHashMap<UUID, Contest> allRelevantContests = new LinkedHashMap<>();
        for (Contest c : collegeContests) {
            allRelevantContests.put(c.getId(), c);
        }
        myParticipation.values().forEach(p -> allRelevantContests.putIfAbsent(p.getContest().getId(), p.getContest()));

        Instant now = Instant.now();
        List<ExamSummaryDto> upcoming = new ArrayList<>();
        List<ExamSummaryDto> active = new ArrayList<>();
        List<ExamSummaryDto> past = new ArrayList<>();
        List<ExamSummaryDto> collegeHistory = new ArrayList<>();

        Set<UUID> collegeContestIds = new HashSet<>();
        for (Contest c : collegeContests) {
            collegeContestIds.add(c.getId());
        }

        int attempted = 0;
        Integer bestRank = null;
        double pctSum = 0;
        int pctCount = 0;

        for (Contest c : allRelevantContests.values()) {
            String status = now.isBefore(c.getStartTime()) ? "UPCOMING" : now.isAfter(c.getEndTime()) ? "PAST" : "ACTIVE";
            int totalProblems = (int) contestProblemRepository.countByContest(c);
            int maxScore = contestProblemRepository.sumPointsByContest(c);
            long totalParticipants = participantRepository.countByContest(c);

            ContestParticipant p = myParticipation.get(c.getId());
            Integer score = null, rank = null, tabs = null, solved = null;
            String partStatus = null;

            if (p != null) {
                attempted++;
                score = p.getTotalScore();
                tabs = p.getTabSwitchCount();
                partStatus = p.getStatus();
                rank = (int) participantRepository.countAhead(c, p.getTotalScore(), p.getPenaltySeconds()) + 1;
                solved = (int) submissionRepository.countSolvedProblems(p);
                if ("PAST".equals(status)) {
                    bestRank = bestRank == null ? rank : Math.min(bestRank, rank);
                    if (maxScore > 0) {
                        pctSum += (100.0 * score) / maxScore;
                        pctCount++;
                    }
                }
            } else if ("PAST".equals(status)) {
                partStatus = "ABSENT";
            }

            ExamSummaryDto dto = new ExamSummaryDto(
                c.getId(), c.getSlug(), c.getTitle(), c.getCollegeName(), c.getStartTime(), c.getEndTime(),
                c.getDurationMinutes(), status, totalProblems, maxScore,
                partStatus, score, rank, totalParticipants, tabs, solved
            );

            // If the candidate has passed out (tenureExpired), hide UPCOMING and ACTIVE contests of their passed-out college
            switch (status) {
                case "UPCOMING" -> {
                    if (!tenureExpired) upcoming.add(dto);
                }
                case "ACTIVE" -> {
                    if (!tenureExpired) active.add(dto);
                }
                default -> {
                    past.add(dto);
                    if (collegeContestIds.contains(c.getId())) {
                        collegeHistory.add(dto);
                    }
                }
            }
        }

        upcoming.sort(Comparator.comparing(ExamSummaryDto::startTime));
        active.sort(Comparator.comparing(ExamSummaryDto::endTime));
        past.sort(Comparator.comparing(ExamSummaryDto::endTime).reversed());
        collegeHistory.sort(Comparator.comparing(ExamSummaryDto::endTime).reversed());

        double avg = pctCount == 0 ? 0 : Math.round((pctSum / pctCount) * 10.0) / 10.0;
        return new StudentExamDashboardDto(
            collegeDto, tenureExpired, upcoming, active, past, collegeHistory, attempted, bestRank, avg
        );
    }

    // ------------------------------------------------------------------- helpers

    private UUID userCollegeId(User student) {
        return student.getCollegeId();
    }

    private CollegeAdminDto toAdminDto(College c) {
        return CollegeAdminDto.from(c, userRepository.countByCollegeId(c.getId()), contestRepository.countByCollege(c.getId(), c.getName()));
    }

    private StudentCollegeDto toStudentDto(College c, User student) {
        long linkedStudents = userRepository.countByCollegeId(c.getId());
        long totalContests = contestRepository.countByCollege(c.getId(), c.getName());
        return new StudentCollegeDto(
            c.getId(),
            c.getCollegeCode(),
            c.getName(),
            c.getOfficialEmail(),
            c.getDepartment(),
            c.getWebsite(),
            c.getPhone(),
            c.getAddress(),
            c.getCity(),
            c.getState(),
            c.getCountry(),
            c.getExpectedStudents(),
            linkedStudents,
            totalContests,
            student.getCollegeRollNumber(),
            student.getTenureStartYear(),
            student.getTenureEndYear(),
            student.isTenureExpired(),
            c.getCreatedAt()
        );
    }

    private void apply(College c, RegisterCollegeRequest req) {
        c.setName(req.name().trim());
        c.setOfficialEmail(req.officialEmail().trim().toLowerCase(Locale.ROOT));
        if (req.expectedStudents() != null && req.expectedStudents() > 0) {
            c.setExpectedStudents(req.expectedStudents());
        } else if (c.getExpectedStudents() == null) {
            c.setExpectedStudents(100);
        }
        c.setDepartment(blankToNull(req.department()));
        c.setWebsite(blankToNull(req.website()));
        c.setPhone(blankToNull(req.phone()));
        c.setAddress(blankToNull(req.address()));
        c.setCity(blankToNull(req.city()));
        c.setState(blankToNull(req.state()));
        c.setCountry(req.country() == null || req.country().isBlank() ? "India" : req.country().trim());
    }

    private String generateUniqueCode() {
        for (int attempt = 0; attempt < 20; attempt++) {
            StringBuilder sb = new StringBuilder("KS-");
            for (int i = 0; i < 6; i++) sb.append(CODE_ALPHABET[RANDOM.nextInt(CODE_ALPHABET.length)]);
            String code = sb.toString();
            if (!collegeRepository.existsByCollegeCode(code)) return code;
        }
        throw new IllegalStateException("Could not allocate a unique college ID, please retry");
    }

    static String normalize(String s) {
        return s == null ? "" : s.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
