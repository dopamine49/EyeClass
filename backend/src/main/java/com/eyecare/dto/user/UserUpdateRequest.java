package com.eyecare.dto.user;

import jakarta.validation.constraints.NotBlank;

public record UserUpdateRequest(
    @NotBlank String name,
    String phone,
    String address
) {
}
