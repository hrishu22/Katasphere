package com.katasphere.config;

import com.katasphere.auth.TokenAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;
    private final TokenAuthenticationFilter tokenAuthenticationFilter;

    public SecurityConfig(
        CorsConfigurationSource corsConfigurationSource,
        TokenAuthenticationFilter tokenAuthenticationFilter
    ) {
        this.corsConfigurationSource = corsConfigurationSource;
        this.tokenAuthenticationFilter = tokenAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName(null);

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .headers(headers -> headers
                .contentTypeOptions(Customizer.withDefaults())
                .frameOptions(frame -> frame.deny())
                .xssProtection(xss -> xss.disable())
                .referrerPolicy(ref -> ref.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                .permissionsPolicy(perm -> perm.policy("camera=(), microphone=(), geolocation=()"))
            )
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .csrfTokenRequestHandler(requestHandler)
                .ignoringRequestMatchers(
                    "/api/v1/health",
                    "/actuator/**",
                    "/api/v1/auth/**",
                    "/api/v1/users/**",
                    "/api/v1/admin/problems/**",
                    "/api/v1/submissions/**",
                    "/api/v1/contests/**",
                    "/api/v1/admin/contests/**",
                    "/api/v1/colleges/**"
                )
            )
            .addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/v1/health",
                    "/actuator/**",
                    "/api/v1/auth/**",
                    "/api/v1/problems/**",
                    "/api/v1/tags/**",
                    "/api/v1/companies/**",
                    "/api/v1/admin/problems/**",
                    "/api/v1/submissions/**",
                    "/api/v1/contests/**",
                    "/api/v1/admin/contests/**",
                    "/api/v1/colleges/suggestions",
                    "/error"
                ).permitAll()
                .requestMatchers("/api/v1/users/**", "/api/v1/colleges/**").authenticated()
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"type\":\"UNAUTHORIZED\",\"message\":\"Authentication required\"}");
                })
            );

        return http.build();
    }
}
