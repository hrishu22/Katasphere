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

    // ---------------------------------------------------------------- admin side

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
        c = collegeRepository.save(c);
        return CollegeAdminDto.from(c, 0, 0);
    }

    @Transactional
    public CollegeAdminDto update(User admin, RegisterCollegeRequest req) {
        College c = collegeRepository.findByAdminUserId(admin.getId())
            .orElseThrow(() -> new IllegalArgumentException("No college registered for this account"));
        apply(c, req);
        c = collegeRepository.save(c);
        return toAdminDto(c);
    }

    @Transactional(readOnly = true)
    public Optional<College> findAdminCollege(User user) {
        return collegeRepository.findByAdminUserId(user.getId());
    }

    // -------------------------------------------------------------- student side

    @Transactional
    public StudentCollegeDto linkStudent(User student, LinkCollegeRequest req) {
        if (collegeRepository.findByAdminUserId(student.getId()).isPresent()) {
            throw new IllegalStateException("College administrator accounts cannot enrol as students.");
        }

        String code = req.collegeCode().trim().toUpperCase(Locale.ROOT);
        College c = collegeRepository.findByCollegeCode(code)
            // Same message for "unknown ID" and "name mismatch" so IDs can't be probed for names
            .filter(col -> normalize(col.getName()).equals(normalize(req.collegeName())))
            .orElseThrow(() -> new IllegalArgumentException(
                "College name and College ID do not match. Please check the details shared by your college."));

        student.setCollegeId(c.getId());
        student.setCollegeRollNumber(blankToNull(req.rollNumber()));
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
     * Student exam dashboard: every published exam of the student's college plus any
     * other exam the student actually took, bucketed into upcoming / active / past,
     * each enriched with the student's own score and rank.
     */
    @Transactional(readOnly = true)
    public StudentExamDashboardDto getStudentExamDashboard(User student) {
        StudentCollegeDto collegeDto = student.getCollegeId() == null ? null
            : collegeRepository.findById(student.getCollegeId()).map(c -> toStudentDto(c, student)).orElse(null);

        Map<UUID, ContestParticipant> myParticipation = new HashMap<>();
        for (ContestParticipant p : participantRepository.findByUserWithContest(student)) {
            myParticipation.put(p.getContest().getId(), p);
        }

        LinkedHashMap<UUID, Contest> contests = new LinkedHashMap<>();
        if (student.getCollegeId() != null) {
            contestRepository.findPublishedByTenant(student.getCollegeId()).forEach(c -> contests.put(c.getId(), c));
        }
        myParticipation.values().forEach(p -> contests.putIfAbsent(p.getContest().getId(), p.getContest()));

        Instant now = Instant.now();
        List<ExamSummaryDto> upcoming = new ArrayList<>();
        List<ExamSummaryDto> active = new ArrayList<>();
        List<ExamSummaryDto> past = new ArrayList<>();

        int attempted = 0;
        Integer bestRank = null;
        double pctSum = 0;
        int pctCount = 0;

        for (Contest c : contests.values()) {
            String status = now.isBefore(c.getStartTime()) ? "UPCOMING" : now.isAfter(c.getEndTime()) ? "PAST" : "ACTIVE";
            int totalProblems = (int) contestProblemRepository.countByContest(c);
            int maxScore = contestProblemRepository.sumPointsByContest(c);

            ContestParticipant p = myParticipation.get(c.getId());
            Integer score = null, rank = null, tabs = null, solved = null;
            Long participants = null;
            String partStatus = null;

            if (p != null) {
                attempted++;
                score = p.getTotalScore();
                tabs = p.getTabSwitchCount();
                partStatus = p.getStatus();
                participants = participantRepository.countByContest(c);
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
                partStatus, score, rank, participants, tabs, solved
            );

            switch (status) {
                case "UPCOMING" -> upcoming.add(dto);
                case "ACTIVE" -> active.add(dto);
                default -> past.add(dto);
            }
        }

        upcoming.sort(Comparator.comparing(ExamSummaryDto::startTime));
        active.sort(Comparator.comparing(ExamSummaryDto::endTime));
        past.sort(Comparator.comparing(ExamSummaryDto::endTime).reversed());

        double avg = pctCount == 0 ? 0 : Math.round((pctSum / pctCount) * 10.0) / 10.0;
        return new StudentExamDashboardDto(collegeDto, upcoming, active, past, attempted, bestRank, avg);
    }

    // ------------------------------------------------------------------- helpers

    private CollegeAdminDto toAdminDto(College c) {
        return CollegeAdminDto.from(c, userRepository.countByCollegeId(c.getId()), contestRepository.countByTenantId(c.getId()));
    }

    private StudentCollegeDto toStudentDto(College c, User student) {
        return new StudentCollegeDto(c.getId(), c.getCollegeCode(), c.getName(), c.getDepartment(),
            c.getCity(), c.getState(), student.getCollegeRollNumber());
    }

    private void apply(College c, RegisterCollegeRequest req) {
        c.setName(req.name().trim());
        c.setOfficialEmail(req.officialEmail().trim().toLowerCase(Locale.ROOT));
        c.setExpectedStudents(req.expectedStudents());
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
