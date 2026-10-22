package com.katasphere.submission;

import com.katasphere.problem.Problem;
import com.katasphere.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {

    List<Submission> findByUserOrderByCreatedAtDesc(User user);

    Page<Submission> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    List<Submission> findByUserAndProblemOrderByCreatedAtDesc(User user, Problem problem);

    @Query("SELECT COUNT(DISTINCT s.problem.id) FROM Submission s WHERE s.user = :user AND s.verdict = 'ACCEPTED'")
    long countDistinctSolvedByUser(@Param("user") User user);

    @Query("SELECT COUNT(DISTINCT s.problem.id) FROM Submission s WHERE s.user = :user AND s.verdict = 'ACCEPTED' AND s.problem.difficulty = :difficulty")
    long countDistinctSolvedByUserAndDifficulty(@Param("user") User user, @Param("difficulty") String difficulty);
}
