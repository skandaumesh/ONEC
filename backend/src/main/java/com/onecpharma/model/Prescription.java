package com.onecpharma.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String fileUrl;

    private String fileName;

    private String doctorName;

    private String notes;

    @Builder.Default
    private Boolean verified = false;

    private String verifiedBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime verifiedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
