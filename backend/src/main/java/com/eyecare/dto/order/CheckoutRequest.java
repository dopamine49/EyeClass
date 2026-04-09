package com.eyecare.dto.order;

import com.eyecare.model.PaymentMethod;
import java.math.BigDecimal;

public record CheckoutRequest(
    PaymentMethod paymentMethod,
    String shippingAddress,
    String note,
    BigDecimal shippingFee
) {
}
