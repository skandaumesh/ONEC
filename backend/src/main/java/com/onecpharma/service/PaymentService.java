package com.onecpharma.service;

import com.onecpharma.dto.request.PaymentVerifyRequest;
import com.onecpharma.dto.response.RazorpayOrderResponse;
import com.onecpharma.exception.BadRequestException;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.*;
import com.onecpharma.repository.OrderRepository;
import com.onecpharma.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Value("${app.razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key-secret}")
    private String razorpayKeySecret;

    @Transactional
    public RazorpayOrderResponse createRazorpayOrder(Long orderId) {
        com.onecpharma.model.Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        BigDecimal amountInPaise = order.getTotalAmount().multiply(new BigDecimal(100));
        int amountInt = amountInPaise.intValue();

        String razorpayOrderId = null;

        // Try creating Razorpay Order using SDK
        try {
            if (razorpayKeyId != null && !razorpayKeyId.contains("demo_key")) {
                RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", amountInt); // Amount in paise
                orderRequest.put("currency", "INR");
                orderRequest.put("receipt", order.getOrderNumber());
                orderRequest.put("payment_capture", 1); // Auto capture

                Order razorpayOrder = client.orders.create(orderRequest);
                razorpayOrderId = razorpayOrder.get("id");
            }
        } catch (Exception e) {
            log.error("Failed to create Razorpay Order via SDK, falling back to simulated order ID. Error: {}", e.getMessage());
        }

        // Fallback to simulated Order ID if Razorpay fails or is in demo mode
        if (razorpayOrderId == null) {
            razorpayOrderId = "order_sim_" + System.currentTimeMillis();
        }

        // Save Razorpay order details inside Payment entity
        Payment payment = order.getPayment();
        if (payment == null) {
            payment = Payment.builder()
                    .order(order)
                    .amount(order.getTotalAmount())
                    .build();
        }
        payment.setPaymentMethod("ONLINE");
        payment.setTransactionId(razorpayOrderId);
        payment.setStatus(PaymentStatus.PENDING);
        paymentRepository.save(payment);

        order.setPayment(payment);
        orderRepository.save(order);

        return RazorpayOrderResponse.builder()
                .keyId(razorpayKeyId)
                .razorpayOrderId(razorpayOrderId)
                .amount(order.getTotalAmount())
                .currency("INR")
                .orderNumber(order.getOrderNumber())
                .orderId(order.getId())
                .build();
    }

    @Transactional
    public com.onecpharma.dto.response.OrderResponse verifySignature(PaymentVerifyRequest request) {
        com.onecpharma.model.Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        Payment payment = order.getPayment();
        if (payment == null) {
            throw new BadRequestException("No payment details associated with this order");
        }

        boolean signatureValid = false;

        // Check if signature is valid (using HmacSHA256)
        try {
            if (request.getRazorpaySignature().equals("simulated_signature") ||
                request.getRazorpayOrderId().startsWith("order_sim_")) {
                // Allow simulated signatures for local demo UPI/QR testing
                signatureValid = true;
                log.info("Simulated payment signature verified for Order ID: {}", order.getId());
            } else {
                String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
                signatureValid = verifyHmacSha256(payload, request.getRazorpaySignature(), razorpayKeySecret);
            }
        } catch (Exception e) {
            log.error("Failed to verify HMAC signature: {}", e.getMessage());
        }

        if (!signatureValid) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new BadRequestException("Invalid payment signature or verification failed");
        }

        // Signature verified successfully! Update payment and order details
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setTransactionId(request.getRazorpayPaymentId());
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        order.setStatus(OrderStatus.PLACED);
        orderRepository.save(order);

        log.info("Order ID {} paid successfully with Transaction ID {}", order.getId(), request.getRazorpayPaymentId());

        return mapToResponse(order);
    }

    @Transactional
    public com.onecpharma.dto.response.OrderResponse completeCod(Long orderId) {
        com.onecpharma.model.Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        Payment payment = order.getPayment();
        if (payment == null) {
            payment = Payment.builder()
                    .order(order)
                    .amount(order.getTotalAmount())
                    .build();
        }
        payment.setPaymentMethod("COD");
        payment.setStatus(PaymentStatus.PENDING);
        paymentRepository.save(payment);

        order.setPayment(payment);
        order.setStatus(OrderStatus.PLACED);
        orderRepository.save(order);

        log.info("Order ID {} completed via Cash on Delivery.", order.getId());

        return mapToResponse(order);
    }

    private boolean verifyHmacSha256(String data, String signature, String secret) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
        
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString().equals(signature);
    }

    // Helper mapper to keep response consistent with OrderService response mapping
    private com.onecpharma.dto.response.OrderResponse mapToResponse(com.onecpharma.model.Order order) {
        return com.onecpharma.dto.response.OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus().name())
                .items(order.getItems().stream().map(item ->
                        com.onecpharma.dto.response.OrderResponse.OrderItemResponse.builder()
                                .id(item.getId())
                                .productId(item.getProduct().getId())
                                .productName(item.getProductName())
                                .productImage(item.getProduct().getImageUrl())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .totalPrice(item.getTotalPrice())
                                .build()
                ).collect(java.util.stream.Collectors.toList()))
                .subtotal(order.getSubtotal())
                .deliveryFee(order.getDeliveryFee())
                .discount(order.getDiscount())
                .totalAmount(order.getTotalAmount())
                .paymentMethod(order.getPayment() != null ? order.getPayment().getPaymentMethod() : null)
                .paymentStatus(order.getPayment() != null ? order.getPayment().getStatus().name() : null)
                .couponCode(order.getCouponCode())
                .notes(order.getNotes())
                .shippingAddress(order.getShippingAddress() != null ?
                        com.onecpharma.dto.response.OrderResponse.AddressResponse.builder()
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
