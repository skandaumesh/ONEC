package com.onecpharma.service;

import com.onecpharma.dto.request.CategoryFormRequest;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.Category;
import com.onecpharma.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CategoryManagementService {

    private final CategoryRepository categoryRepository;

    @Transactional
    public Category createCategoryWithForm(CategoryFormRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .icon(request.getIcon())
                .imageUrl(request.getImageUrl())
                .formSchema(request.getFormSchema())
                .targetAudience(request.getTargetAudience())
                .requiresPrescription(request.getRequiresPrescription() != null ? request.getRequiresPrescription() : false)
                .healthTags(request.getHealthTags())
                .active(true)
                .build();

        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategoryForm(Long id, CategoryFormRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        if (request.getName() != null) category.setName(request.getName());
        if (request.getDescription() != null) category.setDescription(request.getDescription());
        if (request.getIcon() != null) category.setIcon(request.getIcon());
        if (request.getImageUrl() != null) category.setImageUrl(request.getImageUrl());
        if (request.getFormSchema() != null) category.setFormSchema(request.getFormSchema());
        if (request.getTargetAudience() != null) category.setTargetAudience(request.getTargetAudience());
        if (request.getRequiresPrescription() != null) category.setRequiresPrescription(request.getRequiresPrescription());
        if (request.getHealthTags() != null) category.setHealthTags(request.getHealthTags());

        return categoryRepository.save(category);
    }

    public String getCategoryFormSchema(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return category.getFormSchema();
    }
}
