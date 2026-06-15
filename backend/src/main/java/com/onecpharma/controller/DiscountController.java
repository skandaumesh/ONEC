package com.onecpharma.controller;

import com.onecpharma.dto.request.DiscountRequest;
import com.onecpharma.dto.response.ApiResponse;
import com.onecpharma.dto.response.DiscountResponse;
import com.onecpharma.service.DiscountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class DiscountController {

    private final DiscountService discountService;

    // Admin endpoints
    @PostMapping("/admin/discounts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DiscountResponse>> createDiscount(@Valid @RequestBody DiscountRequest request) {
        DiscountResponse response = discountService.createDiscount(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Discount created successfully", response));
    }

    @PutMapping("/admin/discounts/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DiscountResponse>> updateDiscount(@PathVariable Long id, @Valid @RequestBody DiscountRequest request) {
        DiscountResponse response = discountService.updateDiscount(id, request);
        return ResponseEntity.ok(ApiResponse.success("Discount updated successfully", response));
    }

    @GetMapping("/admin/discounts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<DiscountResponse>>> getAllDiscounts() {
        List<DiscountResponse> response = discountService.getAllDiscounts();
        return ResponseEntity.ok(ApiResponse.success("Discounts retrieved successfully", response));
    }

    @GetMapping("/admin/discounts/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DiscountResponse>> getDiscountById(@PathVariable Long id) {
        DiscountResponse response = discountService.getDiscountById(id);
        return ResponseEntity.ok(ApiResponse.success("Discount retrieved successfully", response));
    }

    @DeleteMapping("/admin/discounts/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDiscount(@PathVariable Long id) {
        discountService.deleteDiscount(id);
        return ResponseEntity.ok(ApiResponse.success("Discount deleted successfully", null));
    }

    // Public validation endpoint for checkout
    @GetMapping("/discounts/validate")
    public ResponseEntity<ApiResponse<DiscountResponse>> validateDiscount(
            @RequestParam String code,
            @RequestParam BigDecimal amount) {
        DiscountResponse response = discountService.validateDiscount(code, amount);
        return ResponseEntity.ok(ApiResponse.success("Coupon code is valid", response));
    }
}
