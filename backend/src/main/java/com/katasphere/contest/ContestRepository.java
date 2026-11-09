package com.katasphere.contest;

import com.katasphere.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContestRepository extends JpaRepository<Contest, UUID> {

    Optional<Contest> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Contest> findByCreatedByOrderByCreatedAtDesc(User createdBy);

    List<Contest> findAllByOrderByStartTimeDesc();

    List<Contest> findByTenantIdOrderByStartTimeDesc(UUID tenantId);

    @Query("SELECT c FROM Contest c WHERE c.isPublished = true AND c.tenantId = :tenantId ORDER BY c.startTime DESC")
    List<Contest> findPublishedByTenant(@Param("tenantId") UUID tenantId);

    long countByTenantId(UUID tenantId);

    /** Public catalogue: open contests plus (optionally) the viewer's own college contests. */
    @Query("SELECT c FROM Contest c WHERE c.isPublished = true AND (c.tenantId IS NULL OR c.tenantId = :tenantId) ORDER BY c.startTime DESC")
    List<Contest> findVisiblePublished(@Param("tenantId") UUID tenantId);

    @Query("SELECT c FROM Contest c WHERE c.isPublished = true AND c.startTime <= :now AND c.endTime >= :now ORDER BY c.endTime ASC")
    List<Contest> findActiveContests(@Param("now") Instant now);

    @Query("SELECT c FROM Contest c WHERE c.isPublished = true AND c.startTime > :now ORDER BY c.startTime ASC")
    List<Contest> findUpcomingContests(@Param("now") Instant now);

    @Query("SELECT c FROM Contest c WHERE c.isPublished = true AND c.endTime < :now ORDER BY c.endTime DESC")
    List<Contest> findPastContests(@Param("now") Instant now);
}
