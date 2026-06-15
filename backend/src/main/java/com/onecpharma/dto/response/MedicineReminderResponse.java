package com.onecpharma.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineReminderResponse {
    private Long id;
    private Long userId;
    private String medicineName;
    private String dosage;
    private String frequency;
    private LocalTime reminderTime;
    private Boolean active;
    private LocalDateTime nextReminderAt;
}
