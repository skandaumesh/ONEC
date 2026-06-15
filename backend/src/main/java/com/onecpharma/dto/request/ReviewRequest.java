package com.onecpharma.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReviewRequest {
    @NotNull(message = "Product ID is required")
    private Long productId;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private int rating;

    private String title;

    @NotBlank(message = "Review comment is required")
    private String comment;
}
