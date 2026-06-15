package com.onecpharma.controller;

import com.onecpharma.dto.request.AddressRequest;
import com.onecpharma.dto.response.ApiResponse;
import com.onecpharma.dto.response.UserResponse;
import com.onecpharma.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserProfile(authentication.getName())));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            Authentication authentication,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String phone) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated",
                userService.updateProfile(authentication.getName(), firstName, lastName, phone)));
    }

    @PostMapping("/me/addresses")
    public ResponseEntity<ApiResponse<UserResponse>> addAddress(
            Authentication authentication,
            @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Address added",
                userService.addAddress(authentication.getName(), request)));
    }

    @DeleteMapping("/me/addresses/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            Authentication authentication,
            @PathVariable Long addressId) {
        userService.deleteAddress(authentication.getName(), addressId);
        return ResponseEntity.ok(ApiResponse.success("Address deleted", null));
    }
}
