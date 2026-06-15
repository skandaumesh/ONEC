package com.onecpharma.dto.response;

import com.onecpharma.model.Inventory;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
public class InventoryResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productCode;
    private Integer quantity;
    private Integer reorderLevel;
    private String batchNumber;
    private LocalDate manufacturingDate;
    private LocalDate expiryDate;
    private String supplier;
    private String supplierContact;
    private LocalDateTime lastRestocked;
    private boolean lowStock;
    private boolean expiringSoon;
    private boolean expired;

    public InventoryResponse(Inventory inventory) {
        this.id = inventory.getId();
        if (inventory.getProduct() != null) {
            this.productId = inventory.getProduct().getId();
            this.productName = inventory.getProduct().getName();
            this.productCode = "ONEC-" + inventory.getProduct().getId();
        }
        this.quantity = inventory.getQuantity();
        this.reorderLevel = inventory.getReorderLevel();
        this.batchNumber = inventory.getBatchNumber();
        this.manufacturingDate = inventory.getManufacturingDate();
        this.expiryDate = inventory.getExpiryDate();
        this.supplier = inventory.getSupplier();
        this.supplierContact = inventory.getSupplierContact();
        this.lastRestocked = inventory.getLastRestocked();
        this.lowStock = inventory.isLowStock();
        this.expiringSoon = inventory.isExpiringSoon();
        this.expired = inventory.isExpired();
    }
}
