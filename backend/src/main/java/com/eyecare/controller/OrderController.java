package com.eyecare.controller;

import com.eyecare.dto.order.CheckoutRequest;
import com.eyecare.dto.order.OrderResponse;
import com.eyecare.security.AppUserPrincipal;
import com.eyecare.service.OrderService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(
        @AuthenticationPrincipal AppUserPrincipal principal,
        @RequestBody CheckoutRequest request
    ) {
        return ResponseEntity.ok(orderService.checkout(principal.getUserId(), request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> myOrders(@AuthenticationPrincipal AppUserPrincipal principal) {
        return ResponseEntity.ok(orderService.getMyOrders(principal.getUserId()));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(
        @AuthenticationPrincipal AppUserPrincipal principal,
        @PathVariable Long orderId
    ) {
        return ResponseEntity.ok(orderService.getOrderByIdForUser(principal.getUserId(), orderId));
    }
}
