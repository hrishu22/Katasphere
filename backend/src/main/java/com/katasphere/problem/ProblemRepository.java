package com.katasphere.problem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, UUID>, JpaSpecificationExecutor<Problem> {
    Optional<Problem> findBySlug(String slug);

    @Query("SELECT COUNT(p) FROM Problem p WHERE UPPER(p.difficulty) = UPPER(:difficulty)")
    long countByDifficulty(@Param("difficulty") String difficulty);
}
