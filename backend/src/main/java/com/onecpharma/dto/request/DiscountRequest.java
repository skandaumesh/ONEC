package com.onecpharma.dto.request;

import com.onecpharma.model.DiscountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter
public class DiscountRequest {
    @NotBlank(message = "Discount code is required")
    private String code;

    private String description;

    @NotNull(message = "Discount type is required")
    private DiscountType discountType;

    @NotNull(message = "Discount value is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Discount value must be greater than 0")
    private BigDecimal discountValue;

    @DecimalMin(value = "0.0", message = "Minimum order amount cannot be negative")
    private BigDecimal minOrderAmount;

    private BigDecimal maxDiscountAmount;

    private Integer usageLimit;

    @NotNull(message = "Valid from date is required")
    private LocalDate validFrom;

    @NotNull(message = "Valid until date is required")
    private LocalDate validUntil;

    private boolean active = true;
}
