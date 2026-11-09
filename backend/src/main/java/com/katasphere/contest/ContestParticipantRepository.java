package com.katasphere.contest;

import com.katasphere.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContestParticipantRepository extends JpaRepository<ContestParticipant, UUID> {

    Optional<ContestParticipant> findByContestAndUser(Contest contest, User user);

    boolean existsByContestAndUser(Contest contest, User user);

    long countByContest(Contest contest);

    long countByContestAndStatus(Contest contest, String status);

    @Query("SELECT cp FROM ContestParticipant cp JOIN FETCH cp.user WHERE cp.contest = :contest ORDER BY cp.totalScore DESC, cp.penaltySeconds ASC")
    List<ContestParticipant> findLeaderboardByContest(@Param("contest") Contest contest);
}
