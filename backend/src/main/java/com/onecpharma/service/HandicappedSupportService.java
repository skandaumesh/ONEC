package com.onecpharma.service;

import com.onecpharma.dto.request.UdidUploadRequest;
import com.onecpharma.dto.response.HandicappedDiscountResponse;
import com.onecpharma.dto.response.ProductResponse;
import com.onecpharma.dto.response.UserResponse;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.HandicappedDiscount;
import com.onecpharma.model.UdidVerificationStatus;
import com.onecpharma.model.User;
import com.onecpharma.repository.HandicappedDiscountRepository;
import com.onecpharma.repository.ProductRepository;
import com.onecpharma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HandicappedSupportService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final HandicappedDiscountRepository handicappedDiscountRepository;
    private final UserService userService;

    @Transactional
    public void uploadUdidCertificate(Long userId, UdidUploadRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setIsPhysicallyChallenged(true);
        user.setUdidCertificateUrl(request.getUdidCertificateUrl());
        user.setUdidNumber(request.getUdidNumber());
        user.setUdidApprovalStatus(UdidVerificationStatus.PENDING);
        user.setUdidVerified(false);

        userRepository.save(user);
    }

    @Transactional
    public void approveUdidCertificate(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setUdidApprovalStatus(UdidVerificationStatus.APPROVED);
        user.setUdidVerified(true);

        userRepository.save(user);
    }

    @Transactional
    public void rejectUdidCertificate(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setUdidApprovalStatus(UdidVerificationStatus.REJECTED);
        user.setUdidVerified(false);

        userRepository.save(user);
    }

    public List<ProductResponse> getHandicappedCareProducts() {
        return productRepository.findByActiveTrueAndCategoryTargetAudience("HANDICAPPED").stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    public List<HandicappedDiscountResponse> getDiscountHistory(Long userId) {
        return handicappedDiscountRepository.findByUserId(userId).stream()
                .map(hd -> HandicappedDiscountResponse.builder()
                        .id(hd.getId())
                        .userId(hd.getUser().getId())
                        .orderId(hd.getOrderId())
                        .discountPercentage(hd.getDiscountPercentage())
                        .udidNumber(hd.getUdidNumber())
                        .originalAmount(hd.getOriginalAmount())
                        .discountedAmount(hd.getDiscountedAmount())
                        .appliedAt(hd.getAppliedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public List<UserResponse> getPendingUdidVerifications() {
        return userRepository.findByUdidApprovalStatus(UdidVerificationStatus.PENDING).stream()
                .map(u -> userService.getUserProfile(u.getEmail()))
                .collect(Collectors.toList());
    }
}
