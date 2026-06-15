package com.onecpharma.service;

import com.onecpharma.dto.request.MedicineReminderRequest;
import com.onecpharma.dto.response.ElderlyDiscountResponse;
import com.onecpharma.dto.response.MedicineReminderResponse;
import com.onecpharma.dto.response.ProductResponse;
import com.onecpharma.exception.BadRequestException;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.ElderlyDiscount;
import com.onecpharma.model.MedicineReminder;
import com.onecpharma.model.User;
import com.onecpharma.repository.ElderlyDiscountRepository;
import com.onecpharma.repository.MedicineReminderRepository;
import com.onecpharma.repository.ProductRepository;
import com.onecpharma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ElderlyCareService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final MedicineReminderRepository medicineReminderRepository;
    private final ElderlyDiscountRepository elderlyDiscountRepository;

    public boolean checkElderlyCareEligibility(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return user.getIsElderly() != null && user.getIsElderly();
    }

    public List<ProductResponse> getElderlyCareProducts() {
        return productRepository.findByActiveTrueAndCategoryTargetAudience("ELDERLY").stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public MedicineReminderResponse createMedicineReminder(Long userId, MedicineReminderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        java.time.LocalTime parsedTime = request.getReminderTime() != null
                ? java.time.LocalTime.parse(request.getReminderTime())
                : java.time.LocalTime.of(8, 0);

        MedicineReminder reminder = MedicineReminder.builder()
                .user(user)
                .medicineName(request.getMedicineName())
                .dosage(request.getDosage())
                .frequency(request.getFrequency())
                .reminderTime(parsedTime)
                .active(true)
                .nextReminderAt(LocalDateTime.now().plusDays(1).withHour(parsedTime.getHour()).withMinute(parsedTime.getMinute()))
                .build();

        reminder = medicineReminderRepository.save(reminder);
        return mapToReminderResponse(reminder);
    }

    public List<MedicineReminderResponse> getUserReminders(Long userId) {
        return medicineReminderRepository.findByUserId(userId).stream()
                .map(this::mapToReminderResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteReminder(Long reminderId) {
        if (!medicineReminderRepository.existsById(reminderId)) {
            throw new ResourceNotFoundException("MedicineReminder", "id", reminderId);
        }
        medicineReminderRepository.deleteById(reminderId);
    }

    public List<ElderlyDiscountResponse> getDiscountHistory(Long userId) {
        return elderlyDiscountRepository.findByUserId(userId).stream()
                .map(ed -> ElderlyDiscountResponse.builder()
                        .id(ed.getId())
                        .userId(ed.getUser().getId())
                        .orderId(ed.getOrderId())
                        .discountPercentage(ed.getDiscountPercentage())
                        .originalAmount(ed.getOriginalAmount())
                        .discountedAmount(ed.getDiscountedAmount())
                        .appliedAt(ed.getAppliedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private MedicineReminderResponse mapToReminderResponse(MedicineReminder reminder) {
        return MedicineReminderResponse.builder()
                .id(reminder.getId())
                .userId(reminder.getUser().getId())
                .medicineName(reminder.getMedicineName())
                .dosage(reminder.getDosage())
                .frequency(reminder.getFrequency())
                .reminderTime(reminder.getReminderTime())
                .active(reminder.getActive())
                .nextReminderAt(reminder.getNextReminderAt())
                .build();
    }
}
