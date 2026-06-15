package com.onecpharma.repository;

import com.onecpharma.model.CustomerFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomerFeedbackRepository extends JpaRepository<CustomerFeedback, Long> {
    List<CustomerFeedback> findByUserId(Long userId);
    List<CustomerFeedback> findByStatus(String status);
    long countByStatus(String status);
}
