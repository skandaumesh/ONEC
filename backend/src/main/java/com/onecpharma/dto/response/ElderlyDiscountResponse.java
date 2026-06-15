package com.onecpharma.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElderlyDiscountResponse {
    private Long id;
    private Long userId;
    private Long orderId;
    private BigDecimal discountPercentage;
    private BigDecimal originalAmount;
    private BigDecimal discountedAmount;
    private LocalDateTime appliedAt;
}
