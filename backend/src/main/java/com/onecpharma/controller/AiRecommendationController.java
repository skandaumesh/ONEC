package com.onecpharma.controller;

import com.onecpharma.dto.response.AiRecommendationResponse;
import com.onecpharma.dto.response.ApiResponse;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.User;
import com.onecpharma.repository.UserRepository;
import com.onecpharma.service.AiRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiRecommendationController {

    private final AiRecommendationService aiRecommendationService;
    private final UserRepository userRepository;

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<AiRecommendationResponse>>> getPersonalizedRecommendations(
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(ApiResponse.success(
                aiRecommendationService.getPersonalizedRecommendations(user.getId())));
    }

    @GetMapping("/frequently-bought-together/{productId}")
    public ResponseEntity<ApiResponse<List<AiRecommendationResponse>>> getFrequentlyBoughtTogether(
            @PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(
                aiRecommendationService.getFrequentlyBoughtTogether(productId)));
    }
}
