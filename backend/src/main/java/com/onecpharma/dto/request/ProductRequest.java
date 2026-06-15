package com.onecpharma.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "MRP is required")
    @DecimalMin(value = "0.01", message = "MRP must be greater than 0")
    private BigDecimal mrp;

    @NotNull(message = "Selling price is required")
    @DecimalMin(value = "0.01", message = "Selling price must be greater than 0")
    private BigDecimal sellingPrice;

    private String manufacturer;
    private String saltComposition;
    private String uses;
    private String sideEffects;
    private String directions;
    private String imageUrl;
    private String imageUrl2;
    private String imageUrl3;
    private Boolean prescriptionRequired = false;
    private Boolean featured = false;
    private Integer stock = 0;
    private String packSize;
    private String dosageForm;
    private Long categoryId;
}
