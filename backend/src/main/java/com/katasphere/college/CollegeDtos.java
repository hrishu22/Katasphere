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
        @NotNull(message = "Expected number of students is required") @Min(1) @Max(100000) Integer expectedStudents,
        @Size(max = 255) String department,
        @Size(max = 255) String website,
        @Size(max = 32) String phone,
        @Size(max = 500) String address,
        @Size(max = 120) String city,
        @Size(max = 120) String state,
        @Size(max = 120) String country
    ) {}

    /** Students must provide BOTH the college name and the College Unique ID. */
    public record LinkCollegeRequest(
        @NotBlank(message = "College name is required") @Size(max = 255) String collegeName,
        @NotBlank(message = "College ID is required") @Size(max = 20) String collegeCode,
        @Size(max = 64) String rollNumber
    ) {}

    /** Full view - only ever returned to the college's own admin. */
    public record CollegeAdminDto(
        UUID id,
        String collegeCode,
        String name,
        String officialEmail,
        int expectedStudents,
        String department,
        String website,
        String phone,
        String address,
        String city,
        String state,
        String country,
        long linkedStudents,
        long totalContests,
        Instant createdAt
    ) {
        public static CollegeAdminDto from(College c, long linkedStudents, long totalContests) {
            return new CollegeAdminDto(
                c.getId(), c.getCollegeCode(), c.getName(), c.getOfficialEmail(), c.getExpectedStudents(),
                c.getDepartment(), c.getWebsite(), c.getPhone(), c.getAddress(), c.getCity(), c.getState(),
                c.getCountry(), linkedStudents, totalContests, c.getCreatedAt()
            );
        }
    }

    /** Minimal view for a linked student (no admin contact data). */
    public record StudentCollegeDto(
        UUID id,
        String collegeCode,
        String name,
        String department,
        String city,
        String state,
        String rollNumber
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
        // Participation (null when the student never entered)
        String participationStatus,
        Integer score,
        Integer rank,
        Long totalParticipants,
        Integer tabSwitchCount,
        Integer solvedProblems
    ) {}

    public record StudentExamDashboardDto(
        StudentCollegeDto college,
        List<ExamSummaryDto> upcoming,
        List<ExamSummaryDto> active,
        List<ExamSummaryDto> past,
        int examsAttempted,
        Integer bestRank,
        double averageScorePercent
    ) {}
}
