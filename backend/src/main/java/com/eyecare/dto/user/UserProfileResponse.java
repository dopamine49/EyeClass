package com.eyecare.dto.user;

import com.eyecare.model.Role;
import java.time.LocalDateTime;

public record UserProfileResponse(
    Long id,
    String email,
    String name,
    String phone,
    String address,
    Role role,
    LocalDateTime createdAt
) {
}
