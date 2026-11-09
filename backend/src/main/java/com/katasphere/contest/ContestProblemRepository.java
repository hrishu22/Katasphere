package com.katasphere.contest;

import com.katasphere.problem.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContestProblemRepository extends JpaRepository<ContestProblem, UUID> {

    @Query("SELECT cp FROM ContestProblem cp JOIN FETCH cp.problem WHERE cp.contest = :contest ORDER BY cp.problemOrder ASC")
    List<ContestProblem> findByContestWithProblemOrderByProblemOrderAsc(@Param("contest") Contest contest);

    Optional<ContestProblem> findByContestAndProblem(Contest contest, Problem problem);

    void deleteByContest(Contest contest);

    long countByContest(Contest contest);

    @Query("SELECT COALESCE(SUM(cp.points), 0) FROM ContestProblem cp WHERE cp.contest = :contest")
    int sumPointsByContest(@Param("contest") Contest contest);
}
