package com.onecpharma.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "discounts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DiscountType discountType = DiscountType.PERCENTAGE;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal minOrderAmount = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Builder.Default
    private Integer usageLimit = 0; // 0 = unlimited

    @Builder.Default
    private Integer usedCount = 0;

    private LocalDate validFrom;

    private LocalDate validUntil;

    @Builder.Default
    private Boolean active = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isValid() {
        if (!active) return false;
        LocalDate today = LocalDate.now();
        if (validFrom != null && today.isBefore(validFrom)) return false;
        if (validUntil != null && today.isAfter(validUntil)) return false;
        if (usageLimit > 0 && usedCount >= usageLimit) return false;
        return true;
    }

    public BigDecimal calculateDiscount(BigDecimal orderAmount) {
        if (minOrderAmount != null && orderAmount.compareTo(minOrderAmount) < 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal discount;
        if (discountType == DiscountType.PERCENTAGE) {
            discount = orderAmount.multiply(discountValue).divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
        } else {
            discount = discountValue;
        }
        if (maxDiscountAmount != null && discount.compareTo(maxDiscountAmount) > 0) {
            discount = maxDiscountAmount;
        }
        return discount;
    }
}
