package com.onecpharma.repository;

import com.onecpharma.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProductId(Long productId);

    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.reorderLevel")
    List<Inventory> findLowStockItems();

    @Query("SELECT i FROM Inventory i WHERE i.expiryDate <= CURRENT_DATE")
    List<Inventory> findExpiredItems();

    @Query("SELECT i FROM Inventory i WHERE i.expiryDate BETWEEN CURRENT_DATE AND CURRENT_DATE + 90 day")
    List<Inventory> findExpiringSoonItems();

    Optional<Inventory> findByBatchNumber(String batchNumber);
}
