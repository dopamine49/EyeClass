package com.eyecare.service;

import com.eyecare.dto.product.ProductRequest;
import com.eyecare.dto.product.ProductResponse;
import com.eyecare.exception.ResourceNotFoundException;
import com.eyecare.model.Product;
import com.eyecare.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final FirebaseSyncService firebaseSyncService;

    public ProductService(ProductRepository productRepository, FirebaseSyncService firebaseSyncService) {
        this.productRepository = productRepository;
        this.firebaseSyncService = firebaseSyncService;
    }

    public Page<ProductResponse> searchProducts(
        String keyword,
        String category,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        String sortBy,
        String sortDir,
        int page,
        int size
    ) {
        String safeSortBy = (sortBy == null || sortBy.isBlank()) ? "createdAt" : sortBy;
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(direction, safeSortBy));

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));

            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.trim().toLowerCase()));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec, pageable).map(this::toResponse);
    }

    public ProductResponse getProduct(Long id) {
        return toResponse(productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found")));
    }

    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        applyRequest(product, request);
        Product saved = productRepository.save(product);
        firebaseSyncService.upsertProduct(saved);
        return toResponse(saved);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        applyRequest(product, request);
        Product saved = productRepository.save(product);
        firebaseSyncService.upsertProduct(saved);
        return toResponse(saved);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setActive(false);
        productRepository.save(product);
        firebaseSyncService.deleteProduct(id);
    }

    public Product getEntity(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    public void decreaseStock(Long productId, int quantity) {
        Product product = getEntity(productId);
        product.setStock(Math.max(0, product.getStock() - quantity));
        Product saved = productRepository.save(product);
        firebaseSyncService.upsertProduct(saved);
    }

    private void applyRequest(Product product, ProductRequest request) {
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setOldPrice(request.oldPrice());
        product.setCategory(request.category());
        product.setImageUrl(request.imageUrl());
        product.setStock(request.stock() == null ? 0 : request.stock());
        product.setActive(request.active() == null || request.active());
    }

    public ProductResponse toResponse(Product product) {
        Integer discountPercent = 0;
        if (product.getOldPrice() != null && product.getOldPrice().compareTo(BigDecimal.ZERO) > 0
            && product.getOldPrice().compareTo(product.getPrice()) > 0) {
            BigDecimal diff = product.getOldPrice().subtract(product.getPrice());
            discountPercent = diff
                .multiply(BigDecimal.valueOf(100))
                .divide(product.getOldPrice(), 0, RoundingMode.HALF_UP)
                .intValue();
        }

        return new ProductResponse(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            product.getOldPrice(),
            discountPercent,
            product.getCategory(),
            product.getImageUrl(),
            product.getStock(),
            product.isActive()
        );
    }
}
