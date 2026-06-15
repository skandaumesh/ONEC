package com.onecpharma.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "elderly_discounts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ElderlyDiscount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "order_id")
    private Long orderId;

    @Builder.Default
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal discountPercentage = BigDecimal.valueOf(20.00);

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal originalAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountedAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal savingsAmount;

    private LocalDateTime appliedAt;

    @PrePersist
    protected void onCreate() {
        if (appliedAt == null) {
            appliedAt = LocalDateTime.now();
        }
        if (savingsAmount == null && originalAmount != null && discountedAmount != null) {
            savingsAmount = originalAmount.subtract(discountedAmount);
        }
    }
}
