package com.eyecare.dto.order;

import com.eyecare.model.OrderStatus;

public record UpdateOrderStatusRequest(OrderStatus status) {
}
