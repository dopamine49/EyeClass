package com.eyecare.dto.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public record ProductRequest(
    @NotBlank String name,
    String description,
    @DecimalMin(value = "0.0", inclusive = false) BigDecimal price,
    BigDecimal oldPrice,
    @NotBlank String category,
    String imageUrl,
    @Min(0) Integer stock,
    Boolean active
) {
}
