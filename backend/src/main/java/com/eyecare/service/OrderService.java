package com.eyecare.service;

import com.eyecare.dto.order.CheckoutRequest;
import com.eyecare.dto.order.OrderItemResponse;
import com.eyecare.dto.order.OrderResponse;
import com.eyecare.exception.BadRequestException;
import com.eyecare.exception.ResourceNotFoundException;
import com.eyecare.model.CartItem;
import com.eyecare.model.Order;
import com.eyecare.model.OrderItem;
import com.eyecare.model.OrderStatus;
import com.eyecare.model.PaymentMethod;
import com.eyecare.model.PaymentStatus;
import com.eyecare.model.Product;
import com.eyecare.model.Role;
import com.eyecare.model.User;
import com.eyecare.repository.OrderRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final ProductService productService;
    private final UserService userService;

    public OrderService(
        OrderRepository orderRepository,
        CartService cartService,
        ProductService productService,
        UserService userService
    ) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.productService = productService;
        this.userService = userService;
    }

    public OrderResponse checkout(Long userId, CheckoutRequest request) {
        List<CartItem> cartItems = cartService.getCartItemsForCheckout(userId);
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        for (CartItem item : cartItems) {
            Product product = productService.getEntity(item.getProduct().getId());
            if (item.getQuantity() > product.getStock()) {
                throw new BadRequestException("Not enough stock for product: " + product.getName());
            }
        }

        User user = userService.getById(userId);

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);

        PaymentMethod paymentMethod = request.paymentMethod() == null ? PaymentMethod.COD : request.paymentMethod();
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus(paymentMethod == PaymentMethod.FAKE_PAY ? PaymentStatus.PAID : PaymentStatus.UNPAID);

        order.setShippingAddress(request.shippingAddress());
        order.setNote(request.note());

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal discountAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            if (product.getOldPrice() != null && product.getOldPrice().compareTo(product.getPrice()) > 0) {
                BigDecimal lineDiscount = product.getOldPrice()
                    .subtract(product.getPrice())
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
                discountAmount = discountAmount.add(lineDiscount);
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setOldUnitPrice(product.getOldPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setLineTotal(lineTotal);
            order.addItem(orderItem);

            productService.decreaseStock(product.getId(), cartItem.getQuantity());
        }

        BigDecimal shippingFee = request.shippingFee() == null ? BigDecimal.ZERO : request.shippingFee();

        order.setSubtotal(subtotal);
        order.setDiscountAmount(discountAmount);
        order.setShippingFee(shippingFee);
        order.setTotalPrice(subtotal.add(shippingFee));
        if (paymentMethod == PaymentMethod.FAKE_PAY) {
            order.setStatus(OrderStatus.PROCESSING);
        }

        Order saved = orderRepository.save(order);
        cartService.clearCart(userId);
        return toResponse(saved);
    }

    public List<OrderResponse> getMyOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(this::toResponse).toList();
    }

    public OrderResponse getOrderByIdForUser(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        User user = userService.getById(userId);
        if (!order.getUser().getId().equals(userId) && user.getRole() != Role.ADMIN) {
            throw new BadRequestException("You cannot access this order");
        }
        return toResponse(order);
    }

    public List<OrderResponse> getAllOrders(OrderStatus status) {
        List<Order> orders = (status == null)
            ? orderRepository.findAll()
            : orderRepository.findByStatusOrderByCreatedAtDesc(status);
        return orders.stream().map(this::toResponse).toList();
    }

    public OrderResponse updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(status);
        if (status == OrderStatus.COMPLETED) {
            order.setPaymentStatus(PaymentStatus.PAID);
        }
        return toResponse(orderRepository.save(order));
    }

    public OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream().map(item -> new OrderItemResponse(
            item.getProduct().getId(),
            item.getProductName(),
            item.getUnitPrice(),
            item.getOldUnitPrice(),
            item.getQuantity(),
            item.getLineTotal()
        )).toList();

        return new OrderResponse(
            order.getId(),
            order.getStatus(),
            order.getPaymentMethod(),
            order.getPaymentStatus(),
            order.getSubtotal(),
            order.getDiscountAmount(),
            order.getShippingFee(),
            order.getTotalPrice(),
            order.getShippingAddress(),
            order.getNote(),
            order.getCreatedAt(),
            items
        );
    }
}
