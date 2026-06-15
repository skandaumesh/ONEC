package com.onecpharma.controller;

import com.onecpharma.dto.response.ApiResponse;
import com.onecpharma.dto.response.InventoryResponse;
import com.onecpharma.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/inventory")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getAllInventory() {
        List<InventoryResponse> response = inventoryService.getAllInventory();
        return ResponseEntity.ok(ApiResponse.success("Inventory retrieved successfully", response));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<InventoryResponse>> getInventoryByProductId(@PathVariable Long productId) {
        InventoryResponse response = inventoryService.getInventoryByProductId(productId);
        return ResponseEntity.ok(ApiResponse.success("Product inventory retrieved successfully", response));
    }

    @PutMapping("/{productId}/restock")
    public ResponseEntity<ApiResponse<InventoryResponse>> restockProduct(
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        InventoryResponse response = inventoryService.restockProduct(productId, quantity);
        return ResponseEntity.ok(ApiResponse.success("Product restocked successfully", response));
    }

    @PutMapping("/{productId}/expiry")
    public ResponseEntity<ApiResponse<InventoryResponse>> updateExpiryDate(
            @PathVariable Long productId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expiryDate) {
        InventoryResponse response = inventoryService.updateExpiryDate(productId, expiryDate);
        return ResponseEntity.ok(ApiResponse.success("Expiry date updated successfully", response));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getLowStockItems() {
        List<InventoryResponse> response = inventoryService.getLowStockItems();
        return ResponseEntity.ok(ApiResponse.success("Low stock items retrieved successfully", response));
    }

    @GetMapping("/expiring")
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getExpiringSoonItems() {
        List<InventoryResponse> response = inventoryService.getExpiringSoonItems();
        return ResponseEntity.ok(ApiResponse.success("Expiring items retrieved successfully", response));
    }

    @GetMapping("/expired")
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getExpiredItems() {
        List<InventoryResponse> response = inventoryService.getExpiredItems();
        return ResponseEntity.ok(ApiResponse.success("Expired items retrieved successfully", response));
    }
}
