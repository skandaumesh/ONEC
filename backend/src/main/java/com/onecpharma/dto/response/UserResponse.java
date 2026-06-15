package com.onecpharma.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String avatarUrl;
    private String role;
    private Boolean enabled;
    private List<AddressResponse> addresses;

    private java.time.LocalDate dateOfBirth;
    private Integer age;
    private Boolean isElderly;
    private Boolean isPhysicallyChallenged;
    private String udidCertificateUrl;
    private String udidNumber;
    private String udidApprovalStatus;
    private Boolean udidVerified;
    private String healthConditions;
    private String accessibilityPreferences;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressResponse {
        private Long id;
        private String fullName;
        private String phone;
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String state;
        private String pincode;
        private String landmark;
        private String addressType;
        private Boolean isDefault;
    }
}
