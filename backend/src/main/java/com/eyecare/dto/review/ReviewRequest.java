package com.eyecare.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record ReviewRequest(
    @Min(1) @Max(5) Integer rating,
    String comment
) {
}
