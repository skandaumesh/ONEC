package com.onecpharma.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {
    @NotNull(message = "Shipping address ID is required")
    private Long shippingAddressId;

    private Long prescriptionId;

    private String paymentMethod; // COD, UPI, CARD

    private String couponCode;

    private String notes;
}
