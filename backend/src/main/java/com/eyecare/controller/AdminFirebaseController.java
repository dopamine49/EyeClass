package com.eyecare.controller;

import com.eyecare.service.FirebaseSyncService;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/firebase")
public class AdminFirebaseController {

    private final FirebaseSyncService firebaseSyncService;

    public AdminFirebaseController(FirebaseSyncService firebaseSyncService) {
        this.firebaseSyncService = firebaseSyncService;
    }

    @PostMapping("/sync/products")
    public ResponseEntity<Map<String, Object>> syncProducts() throws Exception {
        int count = firebaseSyncService.syncProducts();
        return ResponseEntity.ok(response("products", count));
    }

    @PostMapping("/sync/users")
    public ResponseEntity<Map<String, Object>> syncUsers() throws Exception {
        int count = firebaseSyncService.syncUsers();
        return ResponseEntity.ok(response("users", count));
    }

    @PostMapping("/sync/orders")
    public ResponseEntity<Map<String, Object>> syncOrders() throws Exception {
        int count = firebaseSyncService.syncOrders();
        return ResponseEntity.ok(response("orders", count));
    }

    @PostMapping("/sync/all")
    public ResponseEntity<Map<String, Object>> syncAll() throws Exception {
        return ResponseEntity.ok(firebaseSyncService.syncAll());
    }

    private Map<String, Object> response(String collection, int count) {
        Map<String, Object> result = new HashMap<>();
        result.put("collection", collection);
        result.put("synced", count);
        return result;
    }
}
