package com.onecpharma.controller;

import com.onecpharma.dto.request.MedicineReminderRequest;
import com.onecpharma.dto.response.ApiResponse;
import com.onecpharma.dto.response.ElderlyDiscountResponse;
import com.onecpharma.dto.response.MedicineReminderResponse;
import com.onecpharma.dto.response.ProductResponse;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.User;
import com.onecpharma.repository.UserRepository;
import com.onecpharma.service.ElderlyCareService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/elderly-care")
@RequiredArgsConstructor
public class ElderlyCareController {

    private final ElderlyCareService elderlyCareService;
    private final UserRepository userRepository;

    @GetMapping("/eligibility")
    public ResponseEntity<ApiResponse<Boolean>> checkEligibility(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(ApiResponse.success(elderlyCareService.checkElderlyCareEligibility(user.getId())));
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getElderlyProducts() {
        return ResponseEntity.ok(ApiResponse.success(elderlyCareService.getElderlyCareProducts()));
    }

    @PostMapping("/reminders")
    public ResponseEntity<ApiResponse<MedicineReminderResponse>> createReminder(
            Authentication authentication,
            @Valid @RequestBody MedicineReminderRequest request) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(ApiResponse.success("Reminder created",
                elderlyCareService.createMedicineReminder(user.getId(), request)));
    }

    @GetMapping("/reminders")
    public ResponseEntity<ApiResponse<List<MedicineReminderResponse>>> getReminders(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(ApiResponse.success(elderlyCareService.getUserReminders(user.getId())));
    }

    @DeleteMapping("/reminders/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReminder(@PathVariable Long id) {
        elderlyCareService.deleteReminder(id);
        return ResponseEntity.ok(ApiResponse.success("Reminder deleted", null));
    }

    @GetMapping("/discount-history")
    public ResponseEntity<ApiResponse<List<ElderlyDiscountResponse>>> getDiscountHistory(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(ApiResponse.success(elderlyCareService.getDiscountHistory(user.getId())));
    }
}
