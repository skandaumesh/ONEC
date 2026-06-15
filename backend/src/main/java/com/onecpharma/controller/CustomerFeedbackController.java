package com.onecpharma.controller;

import com.onecpharma.dto.request.CustomerFeedbackRequest;
import com.onecpharma.dto.response.ApiResponse;
import com.onecpharma.dto.response.CustomerFeedbackResponse;
import com.onecpharma.service.CustomerFeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/feedback")
@RequiredArgsConstructor
public class CustomerFeedbackController {

    private final CustomerFeedbackService customerFeedbackService;

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerFeedbackResponse>> submitFeedback(
            Authentication authentication,
            @Valid @RequestBody CustomerFeedbackRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Feedback submitted successfully",
                customerFeedbackService.submitFeedback(authentication.getName(), request)));
    }

    @GetMapping("/my-feedback")
    public ResponseEntity<ApiResponse<List<CustomerFeedbackResponse>>> getMyFeedback(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                customerFeedbackService.getFeedbackByUser(authentication.getName())));
    }
}
