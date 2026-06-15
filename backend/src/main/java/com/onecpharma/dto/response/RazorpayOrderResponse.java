package com.onecpharma.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class RazorpayOrderResponse {
    private String keyId;
    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
    private String orderNumber;
    private Long orderId;
}
