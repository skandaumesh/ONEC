package com.onecpharma.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.CUSTOMER;

    @Builder.Default
    private Boolean enabled = true;

    // ===== Elderly Care Fields =====
    private LocalDate dateOfBirth;

    private Integer age;

    @Builder.Default
    private Boolean isElderly = false;

    @Column(columnDefinition = "TEXT")
    private String healthConditions; // Comma-separated health conditions

    // ===== Physically Handicapped Support Fields =====
    @Builder.Default
    private Boolean isPhysicallyChallenged = false;

    private String udidCertificateUrl;

    private String udidNumber;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private UdidVerificationStatus udidApprovalStatus = UdidVerificationStatus.PENDING;

    @Builder.Default
    private Boolean udidVerified = false;

    @Column(columnDefinition = "TEXT")
    private String accessibilityPreferences; // JSON string of preferences

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Address> addresses = new ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Cart cart;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Order> orders = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Prescription> prescriptions = new ArrayList<>();

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        computeAgeAndElderly();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        computeAgeAndElderly();
    }

    /**
     * Auto-compute age from dateOfBirth and set isElderly flag for users 65+
     */
    private void computeAgeAndElderly() {
        if (dateOfBirth != null) {
            this.age = Period.between(dateOfBirth, LocalDate.now()).getYears();
            this.isElderly = this.age >= 65;
        }
    }
}
