package com.onecpharma.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal mrp;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal sellingPrice;

    private Double discountPercent;

    private String manufacturer;

    private String saltComposition;

    @Column(columnDefinition = "TEXT")
    private String uses;

    @Column(columnDefinition = "TEXT")
    private String sideEffects;

    @Column(columnDefinition = "TEXT")
    private String directions;

    private String imageUrl;

    private String imageUrl2;

    private String imageUrl3;

    @Builder.Default
    private Boolean prescriptionRequired = false;

    @Builder.Default
    private Boolean featured = false;

    @Builder.Default
    private Boolean active = true;

    @Builder.Default
    private Integer stock = 0;

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer reviewCount = 0;

    private String packSize;

    private String dosageForm; // Tablet, Capsule, Syrup, Cream, etc.

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL)
    private Inventory inventory;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (mrp != null && sellingPrice != null && mrp.compareTo(BigDecimal.ZERO) > 0) {
            discountPercent = mrp.subtract(sellingPrice)
                    .divide(mrp, 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (mrp != null && sellingPrice != null && mrp.compareTo(BigDecimal.ZERO) > 0) {
            discountPercent = mrp.subtract(sellingPrice)
                    .divide(mrp, 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }
    }
}
