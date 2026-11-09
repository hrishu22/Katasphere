package com.katasphere.college;

import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** All request/response payloads for the college (tenant) module. */
public final class CollegeDtos {

    private CollegeDtos() {}

    public record RegisterCollegeRequest(
        @NotBlank(message = "College name is required") @Size(max = 255) String name,
        @NotBlank(message = "Official college email is required") @Email(message = "Enter a valid email") @Size(max = 255) String officialEmail,
        @Min(1) @Max(100000) Integer expectedStudents,
        @Size(max = 255) String department,
        @Size(max = 255) String website,
        @Size(max = 32) String phone,
        @Size(max = 500) String address,
        @Size(max = 120) String city,
        @Size(max = 120) String state,
        @Size(max = 120) String country,
        @Size(max = 40) String planCode
    ) {
        public RegisterCollegeRequest(
            String name, String officialEmail, Integer expectedStudents, String department,
            String website, String phone, String address, String city, String state, String country
        ) {
            this(name, officialEmail, expectedStudents, department, website, phone, address, city, state, country, null);
        }
    }

    /** Request to choose or extend a College Examination Plan. */
    public record SelectCollegePlanRequest(
        @NotBlank(message = "Plan code is required") String planCode
    ) {}

    /** Request to purchase extra contests on top of the existing plan. */
    public record TopUpContestsRequest(
        @NotNull(message = "Number of contests is required")
        @Min(value = 1, message = "Must purchase at least 1 contest")
        @Max(value = 200, message = "Maximum 200 contests per top-up")
        Integer additionalContests
    ) {}

    /** Plan option in the College Plan catalog. */
    public record CollegePlanOptionDto(
        String planCode,
        String name,
        int contestsIncluded,
        String periodLabel,
        int priceInr,
        int topUpPricePerContestInr,
        String description
    ) {}

    /**
     * Students must provide the college name, the College Unique ID, and their tenure
     * (start year + graduation/passing year) so passed-out candidates don't receive active college exams.
     */
    public record LinkCollegeRequest(
        @NotBlank(message = "College name is required") @Size(max = 255) String collegeName,
        @NotBlank(message = "College ID is required") @Size(max = 20) String collegeCode,
        @Size(max = 64) String rollNumber,
        @Min(1990) @Max(2050) Integer tenureStartYear,
        @NotNull(message = "Graduation / Passing year is required") @Min(1990) @Max(2055) Integer tenureEndYear
    ) {
        public LinkCollegeRequest(String collegeName, String collegeCode, String rollNumber) {
            this(collegeName, collegeCode, rollNumber, null, java.time.Year.now().getValue() + 1);
        }
    }

    /** Public suggestion item for candidate autocomplete when registering/linking a college. */
    public record CollegeSuggestionDto(
        UUID id,
        String collegeCode,
        String name,
        String department,
        String city,
        String state,
        String country,
        long linkedStudents,
        long totalContests
    ) {}

    /** Full view - returned to the college's own admin, including plan & contest quota state. */
    public record CollegeAdminDto(
        UUID id,
        String collegeCode,
        String name,
        String officialEmail,
        Integer expectedStudents,
        String department,
        String website,
        String phone,
        String address,
        String city,
        String state,
        String country,
        long linkedStudents,
        long totalContests,
        String planCode,
        String planName,
        int contestQuotaTotal,
        int contestsUsed,
        int contestsLeft,
        int topUpPricePerContestInr,
        Instant planExpiresAt,
        Instant createdAt
    ) {
        public static CollegeAdminDto from(College c, long linkedStudents, long totalContests) {
            int topUpRate = switch (c.getPlanCode() == null ? "NONE" : c.getPlanCode().toUpperCase()) {
                case "CAMPUS_YEARLY" -> 349;
                case "GROWTH_MONTHLY" -> 399;
                default -> 499;
            };
            return new CollegeAdminDto(
                c.getId(),
                c.getCollegeCode(),
                c.getName(),
                c.getOfficialEmail(),
                c.getExpectedStudents(),
                c.getDepartment(),
                c.getWebsite(),
                c.getPhone(),
                c.getAddress(),
                c.getCity(),
                c.getState(),
                c.getCountry(),
                linkedStudents,
                totalContests,
                c.getPlanCode(),
                c.getPlanName(),
                c.getContestQuotaTotal(),
                c.getContestsUsed(),
                c.getContestsLeft(),
                topUpRate,
                c.getPlanExpiresAt(),
                c.getCreatedAt()
            );
        }
    }

    /** Enriched college + student tenure view displayed on the candidate's profile. */
    public record StudentCollegeDto(
        UUID id,
        String collegeCode,
        String name,
        String officialEmail,
        String department,
        String website,
        String phone,
        String address,
        String city,
        String state,
        String country,
        Integer expectedStudents,
        long linkedStudents,
        long totalContests,
        String rollNumber,
        Integer tenureStartYear,
        Integer tenureEndYear,
        boolean isTenureExpired,
        Instant createdAt
    ) {}

    /** What the signed-in user is, relative to colleges. Used by navbar + profile. */
    public record CollegeContextDto(
        CollegeAdminDto adminCollege,
        StudentCollegeDto studentCollege
    ) {}

    public record ExamSummaryDto(
        UUID contestId,
        String slug,
        String title,
        String collegeName,
        Instant startTime,
        Instant endTime,
        int durationMinutes,
        String status,          // UPCOMING | ACTIVE | PAST
        int totalProblems,
        int maxScore,
        String participationStatus,
        Integer score,
        Integer rank,
        Long totalParticipants,
        Integer tabSwitchCount,
        Integer solvedProblems
    ) {}

    public record StudentExamDashboardDto(
        StudentCollegeDto college,
        boolean isTenureExpired,
        List<ExamSummaryDto> upcoming,
        List<ExamSummaryDto> active,
        List<ExamSummaryDto> past,
        List<ExamSummaryDto> collegeHistory,
        int examsAttempted,
        Integer bestRank,
        double averageScorePercent
    ) {}

    // ======================== DEDICATED COLLEGE ADMIN DASHBOARD DTOs ========================

    public record AdminContestSummaryDto(
        UUID contestId,
        String slug,
        String title,
        String status,
        Instant startTime,
        Instant endTime,
        int durationMinutes,
        int totalProblems,
        int maxScore,
        long totalParticipants,
        long submittedCount,
        long flaggedCheatersCount,
        long totalTabSwitches,
        double averageScorePercent,
        String topScorerName,
        Integer topScore
    ) {}

    public record AdminParticipantDetailDto(
        UUID participantId,
        UUID contestId,
        String contestSlug,
        String contestTitle,
        String contestStatus,
        int maxScore,
        UUID userId,
        String studentName,
        String studentEmail,
        String rollNumber,
        Integer tenureStartYear,
        Integer tenureEndYear,
        boolean isTenureExpired,
        int rank,
        long totalParticipants,
        int totalScore,
        double scorePercent,
        int solvedProblems,
        int totalProblems,
        int penaltySeconds,
        String status,
        int tabSwitchCount,
        int maxTabSwitches,
        boolean isCheaterFlagged,
        String cheatSeverity,       // "CRITICAL" | "WARNING" | "CLEAN"
        Instant startedAt,
        Instant submittedAt
    ) {}

    public record AdminCheatIncidentDto(
        UUID participantId,
        UUID contestId,
        String contestSlug,
        String contestTitle,
        UUID userId,
        String studentName,
        String studentEmail,
        String rollNumber,
        Integer tenureStartYear,
        Integer tenureEndYear,
        int tabSwitchCount,
        int maxTabSwitches,
        String status,
        String severity,            // "CRITICAL_DISQUALIFIED" | "WARNING_TAB_SWITCH"
        String violationSummary,
        int totalScore,
        int maxScore,
        int rank,
        Instant startedAt,
        Instant lastUpdatedAt
    ) {}

    public record AdminEnrolledStudentDto(
        UUID userId,
        String name,
        String email,
        String rollNumber,
        Integer tenureStartYear,
        Integer tenureEndYear,
        boolean isTenureExpired,
        int examsAttempted,
        Integer bestRank,
        double averageScorePercent,
        int totalTabSwitches,
        int flaggedViolationsCount,
        Instant joinedAt
    ) {}

    public record CollegeAdminDashboardDto(
        CollegeAdminDto college,
        long totalLinkedStudents,
        long activeTenureStudents,
        long passedOutStudents,
        long totalContestsConducted,
        long activeContestsCount,
        long upcomingContestsCount,
        long completedContestsCount,
        long totalParticipations,
        double averageScorePercent,
        long totalCheatIncidents,
        long criticalDisqualifiedCount,
        long totalTabSwitchesRecorded,
        List<AdminContestSummaryDto> contests,
        List<AdminParticipantDetailDto> participantsAndRankings,
        List<AdminCheatIncidentDto> cheatIncidents,
        List<AdminEnrolledStudentDto> enrolledStudents
    ) {}
}
