package com.katasphere.auth;

import com.katasphere.user.UserDto;

public record AuthResponse(
    UserDto user,
    String message
) {}
