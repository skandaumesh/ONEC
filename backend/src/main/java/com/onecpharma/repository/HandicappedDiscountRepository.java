package com.onecpharma.repository;

import com.onecpharma.model.HandicappedDiscount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HandicappedDiscountRepository extends JpaRepository<HandicappedDiscount, Long> {
    List<HandicappedDiscount> findByUserId(Long userId);
    Optional<HandicappedDiscount> findByOrderId(Long orderId);
}
