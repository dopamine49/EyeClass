package com.eyecare.dto.cart;

import jakarta.validation.constraints.Min;

public record CartItemUpsertRequest(
    Long productId,
    @Min(1) Integer quantity
) {
}
