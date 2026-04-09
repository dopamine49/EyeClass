package com.eyecare.dto.order;

import com.eyecare.model.OrderStatus;
import com.eyecare.model.PaymentMethod;
import com.eyecare.model.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
    Long orderId,
    OrderStatus status,
    PaymentMethod paymentMethod,
    PaymentStatus paymentStatus,
    BigDecimal subtotal,
    BigDecimal discountAmount,
    BigDecimal shippingFee,
    BigDecimal totalPrice,
    String shippingAddress,
    String note,
    LocalDateTime createdAt,
    List<OrderItemResponse> items
) {
}
