package com.onecpharma.controller;

import com.onecpharma.dto.request.CartItemRequest;
import com.onecpharma.dto.response.ApiResponse;
import com.onecpharma.dto.response.CartResponse;
import com.onecpharma.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(cartService.getCart(authentication.getName())));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(
            Authentication authentication,
            @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cartService.addItem(authentication.getName(), request)));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateItemQuantity(
            Authentication authentication,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(ApiResponse.success(cartService.updateItemQuantity(authentication.getName(), itemId, quantity)));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            Authentication authentication,
            @PathVariable Long itemId) {
        return ResponseEntity.ok(ApiResponse.success(cartService.removeItem(authentication.getName(), itemId)));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<CartResponse>> clearCart(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", cartService.clearCart(authentication.getName())));
    }
}
