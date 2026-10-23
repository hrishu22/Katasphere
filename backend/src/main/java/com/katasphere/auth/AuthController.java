package com.katasphere.auth;

import com.katasphere.common.ApiResponse;
import com.katasphere.user.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthRateLimiter rateLimiter;

    public AuthController(AuthService authService, AuthRateLimiter rateLimiter) {
        this.authService = authService;
        this.rateLimiter = rateLimiter;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
        @Valid @RequestBody RegisterRequest request,
        HttpServletRequest httpRequest
    ) {
        String clientIp = resolveClientIp(httpRequest);
        if (!rateLimiter.tryAcquireRegister(clientIp)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(
                ApiResponse.error("Too many registration attempts. Please wait a minute before creating a new account.")
            );
        }

        UserDto user = authService.register(request);
        establishSession(httpRequest, user);

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Registration successful", new AuthResponse(user, "Account created successfully")));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
        @Valid @RequestBody LoginRequest request,
        HttpServletRequest httpRequest
    ) {
        String clientIp = resolveClientIp(httpRequest);
        if (!rateLimiter.tryAcquireLogin(clientIp)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(
                ApiResponse.error("Too many failed attempts. Please wait 60 seconds before trying again.")
            );
        }

        UserDto user = authService.authenticate(request);
        establishSession(httpRequest, user);

        return ResponseEntity.ok(
            ApiResponse.ok("Login successful", new AuthResponse(user, "Authenticated successfully"))
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("USER_ID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Not authenticated"));
        }

        UUID userId = (UUID) session.getAttribute("USER_ID");
        try {
            UserDto user = authService.getUserById(userId);
            return ResponseEntity.ok(ApiResponse.ok("User retrieved", user));
        } catch (IllegalArgumentException e) {
            session.invalidate();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("User session expired"));
        }
    }

    private void establishSession(HttpServletRequest httpRequest, UserDto user) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            httpRequest.changeSessionId();
        } else {
            session = httpRequest.getSession(true);
        }

        session.setAttribute("USER_ID", user.id());

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
            user.email(),
            null,
            List.of(new SimpleGrantedAuthority("ROLE_" + user.role()))
        );
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        session.setAttribute("SPRING_SECURITY_CONTEXT", context);
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
