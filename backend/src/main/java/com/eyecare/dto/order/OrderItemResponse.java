package com.eyecare.dto.order;

import java.math.BigDecimal;

public record OrderItemResponse(
    Long productId,
    String productName,
    BigDecimal unitPrice,
    BigDecimal oldUnitPrice,
    Integer quantity,
    BigDecimal lineTotal
) {
}
