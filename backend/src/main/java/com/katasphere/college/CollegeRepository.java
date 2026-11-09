package com.katasphere.college;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CollegeRepository extends JpaRepository<College, UUID> {

    Optional<College> findByAdminUserId(UUID adminUserId);

    Optional<College> findByCollegeCode(String collegeCode);

    boolean existsByCollegeCode(String collegeCode);

    List<College> findAllByOrderByNameAsc();
}
