package com.onecpharma.dto.response;

import com.onecpharma.model.Review;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class ReviewResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String userName;
    private String userEmail;
    private int rating;
    private String title;
    private String comment;
    private boolean verifiedPurchase;
    private int helpful;
    private LocalDateTime createdAt;

    public ReviewResponse(Review review) {
        this.id = review.getId();
        if (review.getProduct() != null) {
            this.productId = review.getProduct().getId();
            this.productName = review.getProduct().getName();
        }
        if (review.getUser() != null) {
            this.userName = review.getUser().getFirstName() + " " + review.getUser().getLastName();
            this.userEmail = review.getUser().getEmail();
        }
        this.rating = review.getRating();
        this.title = review.getTitle();
        this.comment = review.getComment();
        this.verifiedPurchase = review.getVerifiedPurchase() != null && review.getVerifiedPurchase();
        this.helpful = review.getHelpful();
        this.createdAt = review.getCreatedAt();
    }
}
