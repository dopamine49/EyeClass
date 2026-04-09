package com.eyecare.service;

import com.eyecare.dto.cart.CartItemResponse;
import com.eyecare.dto.cart.CartItemUpsertRequest;
import com.eyecare.dto.cart.CartSummaryResponse;
import com.eyecare.exception.BadRequestException;
import com.eyecare.model.CartItem;
import com.eyecare.model.Product;
import com.eyecare.model.User;
import com.eyecare.repository.CartItemRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductService productService;
    private final UserService userService;

    public CartService(CartItemRepository cartItemRepository, ProductService productService, UserService userService) {
        this.cartItemRepository = cartItemRepository;
        this.productService = productService;
        this.userService = userService;
    }

    public CartSummaryResponse getCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return toSummary(items);
    }

    public CartSummaryResponse upsertItem(Long userId, CartItemUpsertRequest request) {
        if (request.productId() == null) {
            throw new BadRequestException("productId is required");
        }

        Product product = productService.getEntity(request.productId());
        if (!product.isActive()) {
            throw new BadRequestException("Product is inactive");
        }
        if (request.quantity() == null || request.quantity() <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }
        if (request.quantity() > product.getStock()) {
            throw new BadRequestException("Quantity exceeds stock");
        }

        User user = userService.getById(userId);
        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, request.productId())
            .orElseGet(CartItem::new);

        item.setUser(user);
        item.setProduct(product);
        item.setQuantity(request.quantity());
        cartItemRepository.save(item);

        return getCart(userId);
    }

    public CartSummaryResponse removeItem(Long userId, Long productId) {
        cartItemRepository.findByUserIdAndProductId(userId, productId)
            .ifPresent(cartItemRepository::delete);
        return getCart(userId);
    }

    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    public List<CartItem> getCartItemsForCheckout(Long userId) {
        return cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private CartSummaryResponse toSummary(List<CartItem> items) {
        List<CartItemResponse> mapped = items.stream().map(item -> {
            BigDecimal lineTotal = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            return new CartItemResponse(
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getImageUrl(),
                item.getProduct().getPrice(),
                item.getProduct().getOldPrice(),
                item.getQuantity(),
                lineTotal
            );
        }).toList();

        int totalItems = mapped.stream().mapToInt(CartItemResponse::quantity).sum();
        BigDecimal subtotal = mapped.stream()
            .map(CartItemResponse::lineTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discountTotal = items.stream().map(item -> {
            Product product = item.getProduct();
            if (product.getOldPrice() == null || product.getOldPrice().compareTo(product.getPrice()) <= 0) {
                return BigDecimal.ZERO;
            }
            return product.getOldPrice()
                .subtract(product.getPrice())
                .multiply(BigDecimal.valueOf(item.getQuantity()));
        }).reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartSummaryResponse(mapped, totalItems, subtotal, discountTotal, subtotal);
    }
}
