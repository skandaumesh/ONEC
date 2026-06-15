package com.onecpharma.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private String status;
    private List<OrderItemResponse> items;
    private BigDecimal subtotal;
    private BigDecimal deliveryFee;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String paymentStatus;
    private String couponCode;
    private String notes;
    private AddressResponse shippingAddress;
    private LocalDateTime createdAt;
    private LocalDateTime deliveredAt;
    private Integer totalItems;

    private BigDecimal elderlyDiscount;
    private BigDecimal handicappedDiscount;
    private Boolean priorityDelivery;
    private String discountType;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String productImage;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressResponse {
        private Long id;
        private String fullName;
        private String phone;
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String state;
        private String pincode;
        private String addressType;
    }
}
