package com.katasphere.auth;

import com.katasphere.college.CollegeDtos.LinkCollegeRequest;
import com.katasphere.college.CollegeDtos.RegisterCollegeRequest;
import com.katasphere.college.CollegeRepository;
import com.katasphere.college.CollegeService;
import com.katasphere.user.User;
import com.katasphere.user.UserDto;
import com.katasphere.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AuthIdentityRepository authIdentityRepository;
    private final PasswordEncoder passwordEncoder;
    private final CollegeService collegeService;
    private final CollegeRepository collegeRepository;

    public AuthService(
        UserRepository userRepository,
        AuthIdentityRepository authIdentityRepository,
        PasswordEncoder passwordEncoder,
        CollegeService collegeService,
        CollegeRepository collegeRepository
    ) {
        this.userRepository = userRepository;
        this.authIdentityRepository = authIdentityRepository;
        this.passwordEncoder = passwordEncoder;
        this.collegeService = collegeService;
        this.collegeRepository = collegeRepository;
    }

    @Transactional
    public UserDto register(RegisterRequest request) {
        String normalizedEmail = request.email().toLowerCase().trim();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        boolean isCollegeAdmin = "COLLEGE_ADMIN".equalsIgnoreCase(request.accountType());
        boolean isCollegeStudent = "COLLEGE_STUDENT".equalsIgnoreCase(request.accountType())
            || "STUDENT".equalsIgnoreCase(request.accountType());

        if (isCollegeAdmin) {
            if (request.collegeName() == null || request.collegeName().isBlank()) {
                throw new IllegalArgumentException("College name is required when registering to create contests");
            }
        } else if (isCollegeStudent) {
            if (request.collegeCode() == null || request.collegeCode().isBlank()) {
                throw new IllegalArgumentException("College Unique ID is mandatory for student registration");
            }
            if (request.rollNumber() == null || request.rollNumber().isBlank()) {
                throw new IllegalArgumentException("Roll number / Student ID is mandatory for student registration");
            }
            if (request.tenureEndYear() == null) {
                throw new IllegalArgumentException("Tenure / Passing Year is mandatory for student registration");
            }
        }

        User user = new User(request.name().trim(), normalizedEmail, null);
        if (isCollegeAdmin) {
            user.setRole("COLLEGE_ADMIN");
        } else if (isCollegeStudent) {
            user.setRole("COLLEGE_STUDENT");
        } else {
            user.setRole("USER");
        }
        user = userRepository.save(user);

        String passwordHash = passwordEncoder.encode(request.password());
        AuthIdentity authIdentity = new AuthIdentity(user, "LOCAL", null, passwordHash);
        authIdentityRepository.save(authIdentity);

        if (isCollegeAdmin) {
            String officialEmail = (request.officialCollegeEmail() != null && !request.officialCollegeEmail().isBlank())
                ? request.officialCollegeEmail().trim()
                : normalizedEmail;
            collegeService.register(user, new RegisterCollegeRequest(
                request.collegeName().trim(),
                officialEmail,
                request.expectedStudents(),
                request.department(),
                null, null, null, null, null, "India"
            ));
        } else if (isCollegeStudent || (request.collegeCode() != null && !request.collegeCode().isBlank())) {
            Integer startYear = request.tenureStartYear() != null
                ? request.tenureStartYear()
                : java.time.Year.now().getValue() - 2;
            Integer endYear = request.tenureEndYear() != null
                ? request.tenureEndYear()
                : java.time.Year.now().getValue() + 2;
            collegeService.linkStudent(user, new LinkCollegeRequest(
                request.collegeName() != null ? request.collegeName().trim() : null,
                request.collegeCode() != null ? request.collegeCode().trim() : "",
                request.rollNumber(),
                startYear,
                endYear
            ));
        }

        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto authenticate(LoginRequest request) {
        String normalizedEmail = request.email().toLowerCase().trim();

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        AuthIdentity authIdentity = authIdentityRepository.findByUserAndProvider(user, "LOCAL")
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), authIdentity.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Ensure stored role accurately reflects user, college student, or college admin
        boolean ownsCollege = collegeRepository.findByAdminUserId(user.getId()).isPresent();
        if (ownsCollege && !"COLLEGE_ADMIN".equalsIgnoreCase(user.getRole()) && !"ADMIN".equalsIgnoreCase(user.getRole())) {
            user.setRole("COLLEGE_ADMIN");
            user = userRepository.save(user);
        } else if (!ownsCollege && user.getCollegeId() != null && "USER".equalsIgnoreCase(user.getRole())) {
            user.setRole("COLLEGE_STUDENT");
            user = userRepository.save(user);
        }

        return UserDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return UserDto.fromEntity(user);
    }
}
