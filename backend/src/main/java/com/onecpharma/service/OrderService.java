package com.onecpharma.service;

import com.onecpharma.dto.request.OrderRequest;
import com.onecpharma.dto.response.OrderResponse;
import com.onecpharma.exception.BadRequestException;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.*;
import com.onecpharma.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ElderlyDiscountRepository elderlyDiscountRepository;
    private final HandicappedDiscountRepository handicappedDiscountRepository;

    @Transactional
    public OrderResponse placeOrder(String email, OrderRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Address shippingAddress = user.getAddresses().stream()
                .filter(a -> a.getId().equals(request.getShippingAddressId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", request.getShippingAddressId()));

        // Calculate totals
        BigDecimal subtotal = cart.getItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Apply Automatic Elderly / Handicapped Discounts
        BigDecimal elderlyDiscountAmount = BigDecimal.ZERO;
        BigDecimal handicappedDiscountAmount = BigDecimal.ZERO;
        String discountType = "NONE";
        BigDecimal discount = BigDecimal.ZERO;

        if (user.getIsPhysicallyChallenged() != null && user.getIsPhysicallyChallenged() && user.getUdidVerified() != null && user.getUdidVerified()) {
            handicappedDiscountAmount = subtotal.multiply(BigDecimal.valueOf(0.35));
            discountType = "HANDICAPPED";
            discount = handicappedDiscountAmount;
        } else if (user.getIsElderly() != null && user.getIsElderly()) {
            elderlyDiscountAmount = subtotal.multiply(BigDecimal.valueOf(0.20));
            discountType = "ELDERLY";
            discount = elderlyDiscountAmount;
        }

        Boolean priorityDelivery = (user.getIsPhysicallyChallenged() != null && user.getIsPhysicallyChallenged()) || (user.getIsElderly() != null && user.getIsElderly());

        BigDecimal deliveryFee = subtotal.compareTo(BigDecimal.valueOf(499)) >= 0 ?
                BigDecimal.ZERO : BigDecimal.valueOf(49);

        BigDecimal totalAmount = subtotal.subtract(discount).add(deliveryFee);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        // Create order
        Order order = Order.builder()
                .user(user)
                .shippingAddress(shippingAddress)
                .subtotal(subtotal)
                .deliveryFee(deliveryFee)
                .discount(discount)
                .elderlyDiscount(elderlyDiscountAmount)
                .handicappedDiscount(handicappedDiscountAmount)
                .priorityDelivery(priorityDelivery)
                .discountType(discountType)
                .couponCode(request.getCouponCode())
                .notes(request.getNotes())
                .status(OrderStatus.PLACED)
                .totalAmount(totalAmount)
                .build();

        // Add order items and reduce stock
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for " + product.getName());
            }

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(product.getName())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(product.getSellingPrice())
                    .totalPrice(cartItem.getSubtotal())
                    .build();
            order.getItems().add(orderItem);

            // Reduce stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        // Create payment
        Payment payment = Payment.builder()
                .order(order)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD")
                .amount(totalAmount)
                .status(PaymentStatus.PENDING)
                .build();
        order.setPayment(payment);

        order = orderRepository.save(order);

        // Record discount details
        if ("ELDERLY".equals(discountType)) {
            ElderlyDiscount ed = ElderlyDiscount.builder()
                    .user(user)
                    .orderId(order.getId())
                    .discountPercentage(BigDecimal.valueOf(20))
                    .originalAmount(subtotal)
                    .discountedAmount(subtotal.subtract(discount))
                    .appliedAt(java.time.LocalDateTime.now())
                    .build();
            elderlyDiscountRepository.save(ed);
        } else if ("HANDICAPPED".equals(discountType)) {
            HandicappedDiscount hd = HandicappedDiscount.builder()
                    .user(user)
                    .orderId(order.getId())
                    .discountPercentage(BigDecimal.valueOf(35))
                    .udidNumber(user.getUdidNumber())
                    .originalAmount(subtotal)
                    .discountedAmount(subtotal.subtract(discount))
                    .appliedAt(java.time.LocalDateTime.now())
                    .build();
            handicappedDiscountRepository.save(hd);
        }

        // Clear cart
        cart.clearItems();
        cartRepository.save(cart);

        return mapToResponse(order);
    }

    public Page<OrderResponse> getUserOrders(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(this::mapToResponse);
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        return mapToResponse(order);
    }

    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        order.setStatus(status);
        if (status == OrderStatus.DELIVERED) {
            order.setDeliveredAt(java.time.LocalDateTime.now());
        }
        order = orderRepository.save(order);
        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long id, String email) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel order that is already shipped or delivered");
        }

        order.setStatus(OrderStatus.CANCELLED);

        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order = orderRepository.save(order);
        return mapToResponse(order);
    }

    // Admin methods
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::mapToResponse);
    }

    public Page<OrderResponse> getOrdersByStatus(OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable).map(this::mapToResponse);
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus().name())
                .items(order.getItems().stream().map(item ->
                        OrderResponse.OrderItemResponse.builder()
                                .id(item.getId())
                                .productId(item.getProduct().getId())
                                .productName(item.getProductName())
                                .productImage(item.getProduct().getImageUrl())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .totalPrice(item.getTotalPrice())
                                .build()
                ).collect(Collectors.toList()))
                .subtotal(order.getSubtotal())
                .deliveryFee(order.getDeliveryFee())
                .discount(order.getDiscount())
                .totalAmount(order.getTotalAmount())
                .elderlyDiscount(order.getElderlyDiscount())
                .handicappedDiscount(order.getHandicappedDiscount())
                .priorityDelivery(order.getPriorityDelivery())
                .discountType(order.getDiscountType())
                .paymentMethod(order.getPayment() != null ? order.getPayment().getPaymentMethod() : null)
                .paymentStatus(order.getPayment() != null ? order.getPayment().getStatus().name() : null)
                .couponCode(order.getCouponCode())
                .notes(order.getNotes())
                .shippingAddress(order.getShippingAddress() != null ?
                        OrderResponse.AddressResponse.builder()
                                .id(order.getShippingAddress().getId())
                                .fullName(order.getShippingAddress().getFullName())
                                .phone(order.getShippingAddress().getPhone())
                                .addressLine1(order.getShippingAddress().getAddressLine1())
                                .addressLine2(order.getShippingAddress().getAddressLine2())
                                .city(order.getShippingAddress().getCity())
                                .state(order.getShippingAddress().getState())
                                .pincode(order.getShippingAddress().getPincode())
                                .addressType(order.getShippingAddress().getAddressType())
                                .build() : null)
                .createdAt(order.getCreatedAt())
                .deliveredAt(order.getDeliveredAt())
                .totalItems(order.getItems().stream().mapToInt(OrderItem::getQuantity).sum())
                .build();
    }
}
