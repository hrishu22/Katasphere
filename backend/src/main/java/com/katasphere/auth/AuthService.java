package com.katasphere.auth;

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

    public AuthService(
        UserRepository userRepository,
        AuthIdentityRepository authIdentityRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.authIdentityRepository = authIdentityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserDto register(RegisterRequest request) {
        String normalizedEmail = request.email().toLowerCase().trim();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        User user = new User(request.name().trim(), normalizedEmail, null);
        user = userRepository.save(user);

        String passwordHash = passwordEncoder.encode(request.password());
        AuthIdentity authIdentity = new AuthIdentity(user, "LOCAL", null, passwordHash);
        authIdentityRepository.save(authIdentity);

        return UserDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public UserDto authenticate(LoginRequest request) {
        String normalizedEmail = request.email().toLowerCase().trim();

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        AuthIdentity authIdentity = authIdentityRepository.findByUserAndProvider(user, "LOCAL")
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), authIdentity.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return UserDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(UUID userId) {
        return userRepository.findById(userId)
            .map(UserDto::fromEntity)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
