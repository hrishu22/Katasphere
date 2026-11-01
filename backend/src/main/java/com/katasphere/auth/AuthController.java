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
    private final TokenProvider tokenProvider;

    public AuthController(AuthService authService, AuthRateLimiter rateLimiter, TokenProvider tokenProvider) {
        this.authService = authService;
        this.rateLimiter = rateLimiter;
        this.tokenProvider = tokenProvider;
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
        String token = tokenProvider.createToken(user.id(), user.email(), user.role());

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Registration successful", new AuthResponse(user, "Account created successfully", token)));
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
        String token = tokenProvider.createToken(user.id(), user.email(), user.role());

        return ResponseEntity.ok(
            ApiResponse.ok("Login successful", new AuthResponse(user, "Authenticated successfully", token))
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
        UUID userId = null;
        Object attrUserId = httpRequest.getAttribute("USER_ID");
        if (attrUserId instanceof UUID uuid) {
            userId = uuid;
        } else {
            HttpSession session = httpRequest.getSession(false);
            if (session != null && session.getAttribute("USER_ID") != null) {
                userId = (UUID) session.getAttribute("USER_ID");
            }
        }

        if (userId == null) {
            return ResponseEntity.ok(ApiResponse.ok("No active session", null));
        }

        try {
            UserDto user = authService.getUserById(userId);
            return ResponseEntity.ok(ApiResponse.ok("User retrieved", user));
        } catch (IllegalArgumentException e) {
            HttpSession session = httpRequest.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            return ResponseEntity.ok(ApiResponse.ok("User session expired", null));
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
