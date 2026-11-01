package com.katasphere.auth;

import com.katasphere.user.UserDto;

public record AuthResponse(
    UserDto user,
    String message,
    String token
) {
    public AuthResponse(UserDto user, String message) {
        this(user, message, null);
    }
}
