package com.onecpharma.repository;

import com.onecpharma.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Prescription> findByVerifiedFalse();
}
