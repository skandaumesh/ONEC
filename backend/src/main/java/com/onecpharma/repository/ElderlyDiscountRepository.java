package com.onecpharma.repository;

import com.onecpharma.model.ElderlyDiscount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ElderlyDiscountRepository extends JpaRepository<ElderlyDiscount, Long> {
    List<ElderlyDiscount> findByUserId(Long userId);
    Optional<ElderlyDiscount> findByOrderId(Long orderId);
}
