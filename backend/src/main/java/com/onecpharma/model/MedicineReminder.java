package com.onecpharma.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "medicine_reminders")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MedicineReminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String medicineName;

    private String dosage;

    @Column(nullable = false)
    private String frequency; // DAILY, TWICE_DAILY, THRICE_DAILY, WEEKLY, CUSTOM

    private LocalTime reminderTime;

    private LocalTime reminderTime2; // For TWICE_DAILY

    private LocalTime reminderTime3; // For THRICE_DAILY

    @Builder.Default
    private Boolean active = true;

    private LocalDateTime nextReminderAt;

    private String notes;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
