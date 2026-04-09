package com.eyecare.dto.feedback;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record FeedbackRequest(
    @NotBlank String name,
    @NotBlank @Email String email,
    @NotBlank String message
) {
}
