package com.eyecare.dto.cart;

import java.math.BigDecimal;

public record CartItemResponse(
    Long productId,
    String productName,
    String imageUrl,
    BigDecimal price,
    BigDecimal oldPrice,
    Integer quantity,
    BigDecimal lineTotal
) {
}
