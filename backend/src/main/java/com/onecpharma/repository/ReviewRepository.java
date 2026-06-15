package com.onecpharma.repository;

import com.onecpharma.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<Review> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);
    long countByProductId(Long productId);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    @Query("SELECT COUNT(r) FROM Review r")
    long getTotalReviewCount();

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r")
    Double getOverallAverageRating();
}
