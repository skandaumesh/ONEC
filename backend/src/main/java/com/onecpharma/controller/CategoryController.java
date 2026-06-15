package com.onecpharma.controller;

import com.onecpharma.dto.response.ApiResponse;
import com.onecpharma.model.Category;
import com.onecpharma.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final com.onecpharma.service.CategoryManagementService categoryManagementService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> categories = categoryRepository.findByParentIsNullAndActiveTrue();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new com.onecpharma.exception.ResourceNotFoundException("Category", "id", id));
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    @GetMapping("/{id}/form-schema")
    public ResponseEntity<ApiResponse<String>> getCategoryFormSchema(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Form schema retrieved", categoryManagementService.getCategoryFormSchema(id)));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> createCategory(@jakarta.validation.Valid @RequestBody com.onecpharma.dto.request.CategoryFormRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Category created", categoryManagementService.createCategoryWithForm(request)));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> updateCategory(@PathVariable Long id, @jakarta.validation.Valid @RequestBody com.onecpharma.dto.request.CategoryFormRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Category updated", categoryManagementService.updateCategoryForm(id, request)));
    }
}
