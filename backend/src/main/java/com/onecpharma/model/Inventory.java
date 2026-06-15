package com.onecpharma.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 0;

    @Builder.Default
    private Integer reorderLevel = 10;

    private String batchNumber;

    private LocalDate manufacturingDate;

    private LocalDate expiryDate;

    private String supplier;

    private String supplierContact;

    private LocalDateTime lastRestocked;

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

    public boolean isLowStock() {
        return quantity <= reorderLevel;
    }

    public boolean isExpiringSoon() {
        if (expiryDate == null) return false;
        return expiryDate.isBefore(LocalDate.now().plusMonths(3));
    }

    public boolean isExpired() {
        if (expiryDate == null) return false;
        return expiryDate.isBefore(LocalDate.now());
    }
}
