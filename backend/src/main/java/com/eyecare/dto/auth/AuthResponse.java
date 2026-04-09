package com.eyecare.dto.auth;

import com.eyecare.model.Role;

public record AuthResponse(
    String token,
    Long userId,
    String email,
    String name,
    Role role
) {
}
