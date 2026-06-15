package com.onecpharma.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiRecommendationResponse {
    private Long productId;
    private String productName;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String reason;
    private Double confidence;
    private String category;
    private String targetGroup;
}
