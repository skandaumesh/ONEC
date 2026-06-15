package com.onecpharma.repository;

import com.onecpharma.model.MedicineReminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicineReminderRepository extends JpaRepository<MedicineReminder, Long> {
    List<MedicineReminder> findByUserId(Long userId);
    List<MedicineReminder> findByUserIdAndActiveTrue(Long userId);
}
