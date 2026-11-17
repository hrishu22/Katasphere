package com.katasphere.auth;

import com.katasphere.user.User;
import com.katasphere.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
public class PowerUserInitializer {

    private static final Logger log = LoggerFactory.getLogger(PowerUserInitializer.class);
    public static final String POWER_USER_EMAIL = "hrishu22@gmail.com";

    private final UserRepository userRepository;
    private final AuthIdentityRepository authIdentityRepository;
    private final PasswordEncoder passwordEncoder;

    public PowerUserInitializer(
        UserRepository userRepository,
        AuthIdentityRepository authIdentityRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.authIdentityRepository = authIdentityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void ensurePowerUserExists() {
        try {
            Optional<User> existing = userRepository.findByEmailIgnoreCase(POWER_USER_EMAIL);
            if (existing.isPresent()) {
                User user = existing.get();
                if (!"POWER_USER".equalsIgnoreCase(user.getRole())) {
                    user.setRole("POWER_USER");
                    userRepository.save(user);
                    log.info("Upgraded existing account {} to POWER_USER role", POWER_USER_EMAIL);
                }
                if (authIdentityRepository.findByUserAndProvider(user, "LOCAL").isEmpty()) {
                    AuthIdentity identity = new AuthIdentity(
                        user,
                        "LOCAL",
                        null,
                        passwordEncoder.encode("password123")
                    );
                    authIdentityRepository.save(identity);
                }
            } else {
                User owner = new User("Hrishikesh (Platform Owner)", POWER_USER_EMAIL, null);
                owner.setRole("POWER_USER");
                owner = userRepository.save(owner);
                AuthIdentity identity = new AuthIdentity(
                    owner,
                    "LOCAL",
                    null,
                    passwordEncoder.encode("password123")
                );
                authIdentityRepository.save(identity);
                log.info("Seeded Power User owner account {}", POWER_USER_EMAIL);
            }
        } catch (Exception e) {
            log.warn("Could not initialize Power User {}: {}", POWER_USER_EMAIL, e.getMessage());
        }
    }
}
