package com.onecpharma.repository;

import com.onecpharma.model.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {
    Optional<Discount> findByCode(String code);
    List<Discount> findByActiveTrue();
    boolean existsByCode(String code);
    long countByActiveTrue();
}
