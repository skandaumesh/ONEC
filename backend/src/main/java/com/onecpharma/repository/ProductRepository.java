package com.onecpharma.repository;

import com.onecpharma.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.manufacturer) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.saltComposition) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Product> searchProducts(@Param("query") String query, Pageable pageable);

    List<Product> findByFeaturedTrueAndActiveTrue();

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.sellingPrice BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice, Pageable pageable);

    Page<Product> findByPrescriptionRequiredAndActiveTrue(Boolean prescriptionRequired, Pageable pageable);

    List<Product> findTop10ByActiveTrueOrderByRatingDesc();

    long countByActiveTrue();

    @Query("SELECT p FROM Product p WHERE p.stock <= 10 AND p.active = true")
    List<Product> findLowStockProducts();

    List<Product> findByCategoryNameAndActiveTrue(String categoryName);
    List<Product> findByActiveTrueAndCategoryTargetAudience(String targetAudience);
}
