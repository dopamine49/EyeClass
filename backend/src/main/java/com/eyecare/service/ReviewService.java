package com.eyecare.service;

import com.eyecare.dto.review.ReviewRequest;
import com.eyecare.dto.review.ReviewResponse;
import com.eyecare.model.Product;
import com.eyecare.model.Review;
import com.eyecare.model.User;
import com.eyecare.repository.ReviewRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;
    private final UserService userService;

    public ReviewService(ReviewRepository reviewRepository, ProductService productService, UserService userService) {
        this.reviewRepository = reviewRepository;
        this.productService = productService;
        this.userService = userService;
    }

    public List<ReviewResponse> getByProduct(Long productId) {
        return reviewRepository.findByProductIdAndApprovedTrueOrderByCreatedAtDesc(productId)
            .stream().map(this::toResponse).toList();
    }

    public ReviewResponse create(Long userId, Long productId, ReviewRequest request) {
        User user = userService.getById(userId);
        Product product = productService.getEntity(productId);

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.rating());
        review.setComment(request.comment());
        review.setApproved(true);

        return toResponse(reviewRepository.save(review));
    }

    private ReviewResponse toResponse(Review review) {
        return new ReviewResponse(
            review.getId(),
            review.getProduct().getId(),
            review.getUser().getId(),
            review.getUser().getName(),
            review.getRating(),
            review.getComment(),
            review.getCreatedAt()
        );
    }
}
