package com.onecpharma.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private Long id;
    private List<CartItemResponse> items;
    private BigDecimal subtotal;
    private BigDecimal deliveryFee;
    private BigDecimal discount;
    private BigDecimal total;
    private Integer totalItems;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String productImage;
        private BigDecimal unitPrice;
        private BigDecimal mrp;
        private Integer quantity;
        private BigDecimal subtotal;
        private Boolean prescriptionRequired;
    }
}
