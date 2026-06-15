package com.onecpharma.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryFormRequest {
    @NotBlank(message = "Category name is required")
    private String name;

    private String description;
    private String icon;
    private String imageUrl;
    private String formSchema; // JSON schema defining dynamic form fields
    private String targetAudience; // ELDERLY, BABY, WOMEN, MEN, ALL, HANDICAPPED
    private Boolean requiresPrescription;
    private String healthTags; // Comma-separated tags
    private Long parentId;
    private Integer displayOrder;
}
