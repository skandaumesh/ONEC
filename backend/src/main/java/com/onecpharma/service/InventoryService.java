package com.onecpharma.service;

import com.onecpharma.dto.response.InventoryResponse;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.Inventory;
import com.onecpharma.model.Product;
import com.onecpharma.repository.InventoryRepository;
import com.onecpharma.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<InventoryResponse> getAllInventory() {
        // Ensure every product has an inventory record (lazy creation for robustness)
        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            if (!inventoryRepository.findByProductId(product.getId()).isPresent()) {
                Inventory inv = Inventory.builder()
                        .product(product)
                        .quantity(product.getStock() != null ? product.getStock() : 0)
                        .reorderLevel(10)
                        .batchNumber("BATCH-" + product.getId() + "A")
                        .manufacturingDate(LocalDate.now().minusMonths(3))
                        .expiryDate(LocalDate.now().plusMonths(9))
                        .supplier("ONEC General Supplier Ltd")
                        .supplierContact("+91 9999988888")
                        .lastRestocked(LocalDateTime.now())
                        .build();
                inventoryRepository.save(inv);
            }
        }

        return inventoryRepository.findAll().stream()
                .map(InventoryResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InventoryResponse getInventoryByProductId(Long productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for Product ID: " + productId));
        return new InventoryResponse(inventory);
    }

    @Transactional
    public InventoryResponse restockProduct(Long productId, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Restock quantity must be greater than zero");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseGet(() -> Inventory.builder()
                        .product(product)
                        .quantity(0)
                        .reorderLevel(10)
                        .batchNumber("BATCH-" + productId + "B")
                        .manufacturingDate(LocalDate.now().minusMonths(1))
                        .expiryDate(LocalDate.now().plusMonths(12))
                        .supplier("ONEC General Supplier Ltd")
                        .supplierContact("+91 9999988888")
                        .build());

        inventory.setQuantity(inventory.getQuantity() + quantity);
        inventory.setLastRestocked(LocalDateTime.now());
        Inventory saved = inventoryRepository.save(inventory);

        // Sync with Product stock field
        product.setStock(inventory.getQuantity());
        productRepository.save(product);

        return new InventoryResponse(saved);
    }

    @Transactional
    public InventoryResponse updateExpiryDate(Long productId, LocalDate expiryDate) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for Product ID: " + productId));

        inventory.setExpiryDate(expiryDate);
        Inventory saved = inventoryRepository.save(inventory);
        return new InventoryResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getLowStockItems() {
        return inventoryRepository.findLowStockItems().stream()
                .map(InventoryResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getExpiringSoonItems() {
        return inventoryRepository.findExpiringSoonItems().stream()
                .map(InventoryResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getExpiredItems() {
        return inventoryRepository.findExpiredItems().stream()
                .map(InventoryResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public java.util.Map<String, Object> getInventoryReport() {
        List<Inventory> all = inventoryRepository.findAll();
        List<Inventory> lowStock = inventoryRepository.findLowStockItems();
        List<Inventory> expired = inventoryRepository.findExpiredItems();
        List<Inventory> expiringSoon = inventoryRepository.findExpiringSoonItems();

        java.util.Map<String, Object> report = new java.util.HashMap<>();
        report.put("totalItemsCount", all.size());
        report.put("lowStockCount", lowStock.size());
        report.put("expiredCount", expired.size());
        report.put("expiringSoonCount", expiringSoon.size());
        report.put("totalQuantity", all.stream().mapToInt(Inventory::getQuantity).sum());
        return report;
    }

    @Transactional(readOnly = true)
    public InventoryResponse getBatchDetails(String batchNumber) {
        Inventory inventory = inventoryRepository.findByBatchNumber(batchNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for batch: " + batchNumber));
        return new InventoryResponse(inventory);
    }
}
