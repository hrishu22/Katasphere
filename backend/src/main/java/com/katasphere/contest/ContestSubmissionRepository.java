package com.katasphere.contest;

import com.katasphere.problem.Problem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContestSubmissionRepository extends JpaRepository<ContestSubmission, UUID> {

    @Query("SELECT cs FROM ContestSubmission cs JOIN FETCH cs.problem JOIN FETCH cs.participant p JOIN FETCH p.user WHERE cs.contest = :contest ORDER BY cs.createdAt DESC")
    List<ContestSubmission> findRecentSubmissionsWithDetails(@Param("contest") Contest contest, Pageable pageable);

    @Query("SELECT cs FROM ContestSubmission cs JOIN FETCH cs.problem WHERE cs.contest = :contest AND cs.participant = :participant ORDER BY cs.createdAt DESC")
    List<ContestSubmission> findByContestAndParticipant(@Param("contest") Contest contest, @Param("participant") ContestParticipant participant);

    List<ContestSubmission> findByParticipantAndProblemOrderByCreatedAtDesc(ContestParticipant participant, Problem problem);

    Optional<ContestSubmission> findFirstByParticipantAndProblemAndVerdict(ContestParticipant participant, Problem problem, String verdict);

    long countByContest(Contest contest);

    long countByContestAndVerdict(Contest contest, String verdict);

    @Query("SELECT COUNT(DISTINCT cs.problem) FROM ContestSubmission cs WHERE cs.participant = :participant AND cs.verdict = 'ACCEPTED'")
    long countSolvedProblems(@Param("participant") ContestParticipant participant);
}
