package com.onecpharma.dto.response;

import com.onecpharma.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal mrp;
    private BigDecimal sellingPrice;
    private Double discountPercent;
    private String manufacturer;
    private String saltComposition;
    private String uses;
    private String sideEffects;
    private String directions;
    private String imageUrl;
    private String imageUrl2;
    private String imageUrl3;
    private Boolean prescriptionRequired;
    private Boolean featured;
    private Integer stock;
    private Double rating;
    private Integer reviewCount;
    private String packSize;
    private String dosageForm;
    private Long categoryId;
    private String categoryName;
    private Boolean inStock;

    public ProductResponse(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.mrp = product.getMrp();
        this.sellingPrice = product.getSellingPrice();
        this.discountPercent = product.getDiscountPercent();
        this.manufacturer = product.getManufacturer();
        this.saltComposition = product.getSaltComposition();
        this.uses = product.getUses();
        this.sideEffects = product.getSideEffects();
        this.directions = product.getDirections();
        this.imageUrl = product.getImageUrl();
        this.imageUrl2 = product.getImageUrl2();
        this.imageUrl3 = product.getImageUrl3();
        this.prescriptionRequired = product.getPrescriptionRequired();
        this.featured = product.getFeatured();
        this.stock = product.getStock();
        this.rating = product.getRating();
        this.reviewCount = product.getReviewCount();
        this.packSize = product.getPackSize();
        this.dosageForm = product.getDosageForm();
        if (product.getCategory() != null) {
            this.categoryId = product.getCategory().getId();
            this.categoryName = product.getCategory().getName();
        }
        this.inStock = product.getStock() != null && product.getStock() > 0;
    }
}

