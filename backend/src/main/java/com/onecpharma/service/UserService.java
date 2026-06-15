package com.onecpharma.service;

import com.onecpharma.dto.request.AddressRequest;
import com.onecpharma.dto.response.UserResponse;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.Address;
import com.onecpharma.model.User;
import com.onecpharma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return mapToResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String email, String firstName, String lastName, String phone) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (phone != null) user.setPhone(phone);

        user = userRepository.save(user);
        return mapToResponse(user);
    }

    @Transactional
    public UserResponse addAddress(String email, AddressRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Address address = Address.builder()
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .landmark(request.getLandmark())
                .addressType(request.getAddressType())
                .isDefault(request.getIsDefault())
                .user(user)
                .build();

        if (request.getIsDefault()) {
            user.getAddresses().forEach(a -> a.setIsDefault(false));
        }

        user.getAddresses().add(address);
        user = userRepository.save(user);
        return mapToResponse(user);
    }

    @Transactional
    public void deleteAddress(String email, Long addressId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        user.getAddresses().removeIf(a -> a.getId().equals(addressId));
        userRepository.save(user);
    }

    // Admin methods
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateUserRole(Long id, com.onecpharma.model.Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setRole(role);
        user = userRepository.save(user);
        return mapToResponse(user);
    }

    @Transactional
    public UserResponse toggleUserEnabled(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setEnabled(user.getEnabled() == null ? true : !user.getEnabled());
        user = userRepository.save(user);
        return mapToResponse(user);
    }

    @Transactional
    public UserResponse updateElderlyProfile(String email, com.onecpharma.dto.request.ElderlyProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        if (request.getHealthConditions() != null) {
            user.setHealthConditions(request.getHealthConditions());
        }
        if (request.getAccessibilityPreferences() != null) {
            user.setAccessibilityPreferences(request.getAccessibilityPreferences());
        }
        
        user = userRepository.save(user);
        return mapToResponse(user);
    }

    @Transactional
    public UserResponse updateHandicappedProfile(String email, com.onecpharma.dto.request.UdidUploadRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        user.setIsPhysicallyChallenged(true);
        if (request.getUdidCertificateUrl() != null) {
            user.setUdidCertificateUrl(request.getUdidCertificateUrl());
        }
        if (request.getUdidNumber() != null) {
            user.setUdidNumber(request.getUdidNumber());
        }
        user.setUdidApprovalStatus(com.onecpharma.model.UdidVerificationStatus.PENDING);
        user.setUdidVerified(false);
        
        user = userRepository.save(user);
        return mapToResponse(user);
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .enabled(user.getEnabled())
                .dateOfBirth(user.getDateOfBirth())
                .age(user.getAge())
                .isElderly(user.getIsElderly())
                .isPhysicallyChallenged(user.getIsPhysicallyChallenged())
                .udidCertificateUrl(user.getUdidCertificateUrl())
                .udidNumber(user.getUdidNumber())
                .udidApprovalStatus(user.getUdidApprovalStatus() != null ? user.getUdidApprovalStatus().name() : null)
                .udidVerified(user.getUdidVerified())
                .healthConditions(user.getHealthConditions())
                .accessibilityPreferences(user.getAccessibilityPreferences())
                .addresses(user.getAddresses().stream().map(addr ->
                        UserResponse.AddressResponse.builder()
                                .id(addr.getId())
                                .fullName(addr.getFullName())
                                .phone(addr.getPhone())
                                .addressLine1(addr.getAddressLine1())
                                .addressLine2(addr.getAddressLine2())
                                .city(addr.getCity())
                                .state(addr.getState())
                                .pincode(addr.getPincode())
                                .landmark(addr.getLandmark())
                                .addressType(addr.getAddressType())
                                .isDefault(addr.getIsDefault())
                                .build()
                ).collect(Collectors.toList()))
                .build();
    }
}
