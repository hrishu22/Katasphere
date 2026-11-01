package com.katasphere.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.UUID;

@Component
public class TokenProvider {

    private static final String HMAC_ALGO = "HmacSHA256";
    private final byte[] secretKeyBytes;
    private final long tokenValidityMs;

    public TokenProvider(
        @Value("${katasphere.auth.jwt-secret:katasphere-super-secure-production-secret-key-32chars-min}") String secret,
        @Value("${katasphere.auth.token-validity-seconds:604800}") long validitySeconds
    ) {
        this.secretKeyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.tokenValidityMs = validitySeconds * 1000L;
    }

    public record TokenUser(UUID userId, String email, String role) {}

    public String createToken(UUID userId, String email, String role) {
        long expiry = System.currentTimeMillis() + tokenValidityMs;
        String payload = userId.toString() + ":" + (email != null ? email : "") + ":" + (role != null ? role : "USER") + ":" + expiry;
        String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String signature = sign(encodedPayload);
        return encodedPayload + "." + signature;
    }

    public TokenUser validateToken(String token) {
        if (token == null || token.isBlank()) return null;
        int dot = token.indexOf('.');
        if (dot == -1) return null;

        String encodedPayload = token.substring(0, dot);
        String signature = token.substring(dot + 1);

        String expectedSignature = sign(encodedPayload);
        if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8), signature.getBytes(StandardCharsets.UTF_8))) {
            return null; // Tampered or invalid signature
        }

        try {
            String payload = new String(Base64.getUrlDecoder().decode(encodedPayload), StandardCharsets.UTF_8);
            String[] parts = payload.split(":");
            if (parts.length < 4) return null;

            UUID userId = UUID.fromString(parts[0]);
            String email = parts[1];
            String role = parts[2];
            long expiry = Long.parseLong(parts[3]);

            if (System.currentTimeMillis() > expiry) {
                return null; // Expired
            }

            return new TokenUser(userId, email, role);
        } catch (Exception e) {
            return null;
        }
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGO);
            mac.init(new SecretKeySpec(secretKeyBytes, HMAC_ALGO));
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate HMAC signature", e);
        }
    }
}
