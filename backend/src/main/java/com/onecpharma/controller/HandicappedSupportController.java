package com.onecpharma.controller;

import com.onecpharma.dto.request.UdidUploadRequest;
import com.onecpharma.dto.response.ApiResponse;
import com.onecpharma.dto.response.HandicappedDiscountResponse;
import com.onecpharma.dto.response.ProductResponse;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.User;
import com.onecpharma.repository.UserRepository;
import com.onecpharma.service.HandicappedSupportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/handicapped-support")
@RequiredArgsConstructor
public class HandicappedSupportController {

    private final HandicappedSupportService handicappedSupportService;
    private final UserRepository userRepository;

    @PostMapping("/udid/upload")
    public ResponseEntity<ApiResponse<Void>> uploadUdid(
            Authentication authentication,
            @Valid @RequestBody UdidUploadRequest request) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        handicappedSupportService.uploadUdidCertificate(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("UDID certificate uploaded. Verification is pending.", null));
    }

    @GetMapping("/udid/status")
    public ResponseEntity<ApiResponse<String>> checkUdidStatus(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String status = user.getUdidApprovalStatus() != null ? user.getUdidApprovalStatus().name() : "NOT_SUBMITTED";
        return ResponseEntity.ok(ApiResponse.success("UDID verification status retrieved", status));
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getHandicappedProducts() {
        return ResponseEntity.ok(ApiResponse.success(handicappedSupportService.getHandicappedCareProducts()));
    }

    @GetMapping("/discount-history")
    public ResponseEntity<ApiResponse<List<HandicappedDiscountResponse>>> getDiscountHistory(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(ApiResponse.success(handicappedSupportService.getDiscountHistory(user.getId())));
    }
}
