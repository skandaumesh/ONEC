package com.onecpharma.service;

import com.onecpharma.dto.request.ReviewRequest;
import com.onecpharma.dto.response.ReviewResponse;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.Product;
import com.onecpharma.model.Review;
import com.onecpharma.model.User;
import com.onecpharma.repository.ProductRepository;
import com.onecpharma.repository.ReviewRepository;
import com.onecpharma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse submitReview(String userEmail, ReviewRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + request.getProductId()));

        // Check if user already reviewed this product
        if (reviewRepository.findByUserIdAndProductId(user.getId(), product.getId()).isPresent()) {
            throw new IllegalArgumentException("You have already reviewed this product");
        }

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .title(request.getTitle())
                .comment(request.getComment())
                .verifiedPurchase(true) // assume verified for simplicity
                .helpful(0)
                .build();

        Review saved = reviewRepository.save(review);

        // Update product average rating and review count
        updateProductRatingMetrics(product);

        return new ReviewResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(ReviewResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(ReviewResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + id));

        Product product = review.getProduct();
        reviewRepository.delete(review);

        if (product != null) {
            updateProductRatingMetrics(product);
        }
    }

    private void updateProductRatingMetrics(Product product) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(product.getId());
        int count = reviews.size();

        if (count > 0) {
            double sum = reviews.stream().mapToInt(Review::getRating).sum();
            double avg = Math.round((sum / count) * 10.0) / 10.0;
            product.setRating(avg);
            product.setReviewCount(count);
        } else {
            product.setRating(0.0);
            product.setReviewCount(0);
        }

        productRepository.save(product);
    }
}
