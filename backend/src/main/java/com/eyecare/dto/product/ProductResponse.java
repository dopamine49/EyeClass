package com.eyecare.dto.product;

import java.math.BigDecimal;

public record ProductResponse(
    Long id,
    String name,
    String description,
    BigDecimal price,
    BigDecimal oldPrice,
    Integer discountPercent,
    String category,
    String imageUrl,
    Integer stock,
    boolean active
) {
}
