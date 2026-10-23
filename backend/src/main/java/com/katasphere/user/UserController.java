package com.katasphere.user;

import com.katasphere.auth.AuthService;
import com.katasphere.common.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public UserController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getProfile(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("USER_ID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required"));
        }

        UUID userId = (UUID) session.getAttribute("USER_ID");
        try {
            UserDto user = authService.getUserById(userId);
            return ResponseEntity.ok(ApiResponse.ok("Profile retrieved", user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Session expired"));
        }
    }

    @PostMapping("/upgrade-premium")
    public ResponseEntity<ApiResponse<UserDto>> upgradeToPremium(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("USER_ID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required to upgrade to Premium"));
        }

        UUID userId = (UUID) session.getAttribute("USER_ID");
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setRole("PREMIUM");
        user = userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.ok("Successfully upgraded to Katasphere Pro / Premium!", UserDto.fromEntity(user)));
    }

    @PostMapping("/toggle-premium")
    public ResponseEntity<ApiResponse<UserDto>> togglePremium(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("USER_ID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required"));
        }

        UUID userId = (UUID) session.getAttribute("USER_ID");
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if ("PREMIUM".equalsIgnoreCase(user.getRole())) {
            user.setRole("USER");
        } else {
            user.setRole("PREMIUM");
        }
        user = userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.ok("Subscription status toggled", UserDto.fromEntity(user)));
    }
}
