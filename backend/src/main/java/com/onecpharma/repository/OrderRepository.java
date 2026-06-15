package com.onecpharma.repository;

import com.onecpharma.model.Order;
import com.onecpharma.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByStatus(OrderStatus status);
    long countByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != 'CANCELLED'")
    BigDecimal getTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.createdAt >= :startDate AND o.status != 'CANCELLED'")
    BigDecimal getRevenueFromDate(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate")
    long countOrdersFromDate(@Param("startDate") LocalDateTime startDate);

    Page<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);
}
