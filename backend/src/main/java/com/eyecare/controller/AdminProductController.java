package com.eyecare.controller;

import com.eyecare.dto.product.ProductRequest;
import com.eyecare.dto.product.ProductResponse;
import com.eyecare.service.FirebaseStorageService;
import com.eyecare.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin/products")
public class AdminProductController {

    private final ProductService productService;
    private final FirebaseStorageService firebaseStorageService;

    public AdminProductController(ProductService productService, FirebaseStorageService firebaseStorageService) {
        this.productService = productService;
        this.firebaseStorageService = firebaseStorageService;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(request));
    }

    @PostMapping("/upload-image")
    public ResponseEntity<FirebaseStorageService.UploadedImage> uploadImage(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(firebaseStorageService.uploadProductImage(file));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
        @PathVariable Long id,
        @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
