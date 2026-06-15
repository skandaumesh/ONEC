package com.onecpharma.dto.response;

import com.onecpharma.model.Discount;
import com.onecpharma.model.DiscountType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter
public class DiscountResponse {
    private Long id;
    private String code;
    private String description;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal minOrderAmount;
    private BigDecimal maxDiscountAmount;
    private Integer usageLimit;
    private Integer usedCount;
    private LocalDate validFrom;
    private LocalDate validUntil;
    private boolean active;

    public DiscountResponse(Discount discount) {
        this.id = discount.getId();
        this.code = discount.getCode();
        this.description = discount.getDescription();
        this.discountType = discount.getDiscountType();
        this.discountValue = discount.getDiscountValue();
        this.minOrderAmount = discount.getMinOrderAmount();
        this.maxDiscountAmount = discount.getMaxDiscountAmount();
        this.usageLimit = discount.getUsageLimit();
        this.usedCount = discount.getUsedCount();
        this.validFrom = discount.getValidFrom();
        this.validUntil = discount.getValidUntil();
        this.active = discount.getActive() != null && discount.getActive();
    }
}
