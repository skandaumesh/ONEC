package com.onecpharma.service;

import com.onecpharma.dto.request.CartItemRequest;
import com.onecpharma.dto.response.CartResponse;
import com.onecpharma.exception.BadRequestException;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.*;
import com.onecpharma.repository.CartRepository;
import com.onecpharma.repository.ProductRepository;
import com.onecpharma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartResponse getCart(String email) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse addItem(String email, CartItemRequest request) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock for " + product.getName());
        }

        // Check if product already in cart
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.addItem(newItem);
        }

        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse updateItemQuantity(String email, Long itemId, Integer quantity) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", "id", itemId));

        if (quantity <= 0) {
            cart.removeItem(item);
        } else {
            if (item.getProduct().getStock() < quantity) {
                throw new BadRequestException("Insufficient stock");
            }
            item.setQuantity(quantity);
        }

        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse removeItem(String email, Long itemId) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", "id", itemId));

        cart.removeItem(item);
        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse clearCart(String email) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);
        cart.clearItems();
        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart cart = Cart.builder().user(user).build();
                    return cartRepository.save(cart);
                });
    }

    private CartResponse mapToResponse(Cart cart) {
        BigDecimal subtotal = cart.getItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal deliveryFee = subtotal.compareTo(BigDecimal.valueOf(499)) >= 0 ?
                BigDecimal.ZERO : BigDecimal.valueOf(49);

        return CartResponse.builder()
                .id(cart.getId())
                .items(cart.getItems().stream().map(item ->
                        CartResponse.CartItemResponse.builder()
                                .id(item.getId())
                                .productId(item.getProduct().getId())
                                .productName(item.getProduct().getName())
                                .productImage(item.getProduct().getImageUrl())
                                .unitPrice(item.getProduct().getSellingPrice())
                                .mrp(item.getProduct().getMrp())
                                .quantity(item.getQuantity())
                                .subtotal(item.getSubtotal())
                                .prescriptionRequired(item.getProduct().getPrescriptionRequired())
                                .build()
                ).collect(Collectors.toList()))
                .subtotal(subtotal)
                .deliveryFee(deliveryFee)
                .discount(BigDecimal.ZERO)
                .total(subtotal.add(deliveryFee))
                .totalItems(cart.getItems().stream().mapToInt(CartItem::getQuantity).sum())
                .build();
    }
}
