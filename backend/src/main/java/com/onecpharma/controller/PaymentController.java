package com.onecpharma.controller;

import com.onecpharma.dto.request.PaymentVerifyRequest;
import com.onecpharma.dto.response.ApiResponse;
import com.onecpharma.dto.response.OrderResponse;
import com.onecpharma.dto.response.RazorpayOrderResponse;
import com.onecpharma.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<RazorpayOrderResponse>> createRazorpayOrder(@RequestParam Long orderId) {
        RazorpayOrderResponse response = paymentService.createRazorpayOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success("Razorpay order initiated", response));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<OrderResponse>> verifySignature(@Valid @RequestBody PaymentVerifyRequest request) {
        OrderResponse response = paymentService.verifySignature(request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified and order placed successfully", response));
    }

    @PostMapping("/cod")
    public ResponseEntity<ApiResponse<OrderResponse>> completeCod(@RequestParam Long orderId) {
        OrderResponse response = paymentService.completeCod(orderId);
        return ResponseEntity.ok(ApiResponse.success("Order confirmed under Cash on Delivery", response));
    }
}
