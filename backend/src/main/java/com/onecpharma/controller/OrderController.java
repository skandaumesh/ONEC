package com.onecpharma.controller;

import com.onecpharma.dto.request.OrderRequest;
import com.onecpharma.dto.response.ApiResponse;
import com.onecpharma.dto.response.OrderResponse;
import com.onecpharma.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
            Authentication authentication,
            @Valid @RequestBody OrderRequest request) {
        OrderResponse response = orderService.placeOrder(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getUserOrders(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.getUserOrders(authentication.getName(), PageRequest.of(page, size))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(id)));
    }

    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponse>> trackOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderByNumber(orderNumber)));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Order cancelled", orderService.cancelOrder(id, authentication.getName())));
    }
}
