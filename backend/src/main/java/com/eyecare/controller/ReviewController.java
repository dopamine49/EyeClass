package com.eyecare.controller;

import com.eyecare.dto.review.ReviewRequest;
import com.eyecare.dto.review.ReviewResponse;
import com.eyecare.security.AppUserPrincipal;
import com.eyecare.service.ReviewService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getByProduct(productId));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<ReviewResponse> createReview(
        @AuthenticationPrincipal AppUserPrincipal principal,
        @PathVariable Long productId,
        @Valid @RequestBody ReviewRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(reviewService.create(principal.getUserId(), productId, request));
    }
}
