package com.eyecare.controller;

import com.eyecare.dto.cart.CartItemUpsertRequest;
import com.eyecare.dto.cart.CartSummaryResponse;
import com.eyecare.security.AppUserPrincipal;
import com.eyecare.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartSummaryResponse> getCart(@AuthenticationPrincipal AppUserPrincipal principal) {
        return ResponseEntity.ok(cartService.getCart(principal.getUserId()));
    }

    @PutMapping("/items")
    public ResponseEntity<CartSummaryResponse> upsertItem(
        @AuthenticationPrincipal AppUserPrincipal principal,
        @Valid @RequestBody CartItemUpsertRequest request
    ) {
        return ResponseEntity.ok(cartService.upsertItem(principal.getUserId(), request));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartSummaryResponse> removeItem(
        @AuthenticationPrincipal AppUserPrincipal principal,
        @PathVariable Long productId
    ) {
        return ResponseEntity.ok(cartService.removeItem(principal.getUserId(), productId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal AppUserPrincipal principal) {
        cartService.clearCart(principal.getUserId());
        return ResponseEntity.noContent().build();
    }
}
