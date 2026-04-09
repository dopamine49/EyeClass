package com.eyecare.dto.cart;

import java.math.BigDecimal;
import java.util.List;

public record CartSummaryResponse(
    List<CartItemResponse> items,
    Integer totalItems,
    BigDecimal subtotal,
    BigDecimal discountTotal,
    BigDecimal payableTotal
) {
}
