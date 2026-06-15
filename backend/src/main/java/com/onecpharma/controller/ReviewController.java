package com.onecpharma.controller;

import com.onecpharma.dto.request.ReviewRequest;
import com.onecpharma.dto.response.ApiResponse;
import com.onecpharma.dto.response.ReviewResponse;
import com.onecpharma.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // Public endpoint: Get reviews for a specific product
    @GetMapping("/reviews/product/{productId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getProductReviews(@PathVariable Long productId) {
        List<ReviewResponse> response = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved successfully", response));
    }

    // Authenticated endpoint: Submit a review
    @PostMapping("/reviews")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ReviewResponse>> submitReview(
            Principal principal,
            @Valid @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.submitReview(principal.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review submitted successfully", response));
    }

    // Admin endpoint: List all reviews
    @GetMapping("/admin/reviews")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getAllReviews() {
        List<ReviewResponse> response = reviewService.getAllReviews();
        return ResponseEntity.ok(ApiResponse.success("All reviews retrieved successfully", response));
    }

    // Admin endpoint: Moderate (delete) a review
    @DeleteMapping("/admin/reviews/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully", null));
    }
}
