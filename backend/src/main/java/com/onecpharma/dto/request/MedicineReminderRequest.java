package com.onecpharma.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MedicineReminderRequest {
    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    private String dosage;

    @NotBlank(message = "Frequency is required")
    private String frequency; // DAILY, TWICE_DAILY, THRICE_DAILY, WEEKLY

    private String reminderTime;  // HH:mm format
    private String reminderTime2; // For TWICE_DAILY
    private String reminderTime3; // For THRICE_DAILY
    private String notes;
}
