package com.onecpharma.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerFeedbackRequest {
    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Message is required")
    private String message;

    @Min(1) @Max(5)
    private Integer rating = 5;

    private String category; // GENERAL, DELIVERY, PRODUCT, SERVICE, APP, OTHER
}
