package com.eyecare.service;

import com.eyecare.model.Order;
import com.eyecare.model.OrderItem;
import com.eyecare.model.Product;
import com.eyecare.model.User;
import com.eyecare.repository.OrderRepository;
import com.eyecare.repository.ProductRepository;
import com.eyecare.repository.UserRepository;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FirebaseSyncService {

    private final Firestore firestore;
    private final FirebaseApp firebaseApp;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public FirebaseSyncService(
        Firestore firestore,
        FirebaseApp firebaseApp,
        ProductRepository productRepository,
        UserRepository userRepository,
        OrderRepository orderRepository
    ) {
        this.firestore = firestore;
        this.firebaseApp = firebaseApp;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public int syncProducts() throws ExecutionException, InterruptedException {
        List<Product> products = productRepository.findAll();
        for (Product p : products) {
            Map<String, Object> doc = mapProduct(p);
            firestore.collection("products")
                .document(String.valueOf(p.getId()))
                .set(doc)
                .get();
        }
        return products.size();
    }

    public void upsertProduct(Product product) {
        try {
            firestore.collection("products")
                .document(String.valueOf(product.getId()))
                .set(mapProduct(product))
                .get();
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Interrupted while syncing product to Firebase", ex);
        } catch (ExecutionException ex) {
            throw new IllegalStateException("Failed to sync product to Firebase", ex);
        }
    }

    public void deleteProduct(Long productId) {
        try {
            firestore.collection("products")
                .document(String.valueOf(productId))
                .delete()
                .get();
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Interrupted while deleting product in Firebase", ex);
        } catch (ExecutionException ex) {
            throw new IllegalStateException("Failed to delete product in Firebase", ex);
        }
    }

    @Transactional(readOnly = true)
    public int syncUsers() throws ExecutionException, InterruptedException {
        List<User> users = userRepository.findAll();
        for (User u : users) {
            Map<String, Object> doc = new HashMap<>();
            doc.put("id", u.getId());
            doc.put("email", u.getEmail());
            doc.put("name", u.getName());
            doc.put("phone", u.getPhone());
            doc.put("address", u.getAddress());
            doc.put("role", String.valueOf(u.getRole()));
            doc.put("enabled", u.isEnabled());
            doc.put("createdAt", String.valueOf(u.getCreatedAt()));
            doc.put("updatedAt", String.valueOf(u.getUpdatedAt()));

            firestore.collection("users")
                .document(String.valueOf(u.getId()))
                .set(doc)
                .get();
        }
        return users.size();
    }

    @Transactional(readOnly = true)
    public int syncOrders() throws ExecutionException, InterruptedException {
        List<Order> orders = orderRepository.findAll();
        for (Order o : orders) {
            Map<String, Object> doc = new HashMap<>();
            doc.put("id", o.getId());
            doc.put("userId", o.getUser().getId());
            doc.put("status", String.valueOf(o.getStatus()));
            doc.put("paymentMethod", String.valueOf(o.getPaymentMethod()));
            doc.put("paymentStatus", String.valueOf(o.getPaymentStatus()));
            doc.put("subtotal", toNumber(o.getSubtotal()));
            doc.put("discountAmount", toNumber(o.getDiscountAmount()));
            doc.put("shippingFee", toNumber(o.getShippingFee()));
            doc.put("totalPrice", toNumber(o.getTotalPrice()));
            doc.put("shippingAddress", o.getShippingAddress());
            doc.put("note", o.getNote());
            doc.put("createdAt", String.valueOf(o.getCreatedAt()));
            doc.put("updatedAt", String.valueOf(o.getUpdatedAt()));

            List<Map<String, Object>> items = o.getItems().stream().map(this::mapOrderItem).toList();
            doc.put("items", items);

            firestore.collection("orders")
                .document(String.valueOf(o.getId()))
                .set(doc)
                .get();
        }
        return orders.size();
    }

    public Map<String, Object> syncAll() throws ExecutionException, InterruptedException {
        Map<String, Object> result = new HashMap<>();
        result.put("projectId", firebaseApp.getOptions().getProjectId());
        result.put("products", syncProducts());
        result.put("users", syncUsers());
        result.put("orders", syncOrders());
        return result;
    }

    private Map<String, Object> mapOrderItem(OrderItem item) {
        Map<String, Object> result = new HashMap<>();
        result.put("productId", item.getProduct().getId());
        result.put("productName", item.getProductName());
        result.put("unitPrice", toNumber(item.getUnitPrice()));
        result.put("oldUnitPrice", toNumber(item.getOldUnitPrice()));
        result.put("quantity", item.getQuantity());
        result.put("lineTotal", toNumber(item.getLineTotal()));
        return result;
    }

    private Map<String, Object> mapProduct(Product p) {
        Map<String, Object> doc = new HashMap<>();
        doc.put("id", p.getId());
        doc.put("name", p.getName());
        doc.put("description", p.getDescription());
        doc.put("price", toNumber(p.getPrice()));
        doc.put("oldPrice", toNumber(p.getOldPrice()));
        doc.put("category", p.getCategory());
        doc.put("imageUrl", p.getImageUrl());
        doc.put("stock", p.getStock());
        doc.put("active", p.isActive());
        doc.put("createdAt", String.valueOf(p.getCreatedAt()));
        doc.put("updatedAt", String.valueOf(p.getUpdatedAt()));
        return doc;
    }

    private Double toNumber(BigDecimal value) {
        return value == null ? null : value.doubleValue();
    }
}
