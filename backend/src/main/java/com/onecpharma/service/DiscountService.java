package com.onecpharma.service;

import com.onecpharma.dto.request.DiscountRequest;
import com.onecpharma.dto.response.DiscountResponse;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.Discount;
import com.onecpharma.repository.DiscountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscountService {

    private final DiscountRepository discountRepository;

    @Transactional
    public DiscountResponse createDiscount(DiscountRequest request) {
        if (discountRepository.existsByCode(request.getCode().toUpperCase())) {
            throw new IllegalArgumentException("Discount code '" + request.getCode() + "' already exists");
        }

        Discount discount = Discount.builder()
                .code(request.getCode().toUpperCase())
                .description(request.getDescription())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minOrderAmount(request.getMinOrderAmount() != null ? request.getMinOrderAmount() : BigDecimal.ZERO)
                .maxDiscountAmount(request.getMaxDiscountAmount())
                .usageLimit(request.getUsageLimit())
                .usedCount(0)
                .validFrom(request.getValidFrom())
                .validUntil(request.getValidUntil())
                .active(request.isActive())
                .build();

        Discount saved = discountRepository.save(discount);
        return new DiscountResponse(saved);
    }

    @Transactional
    public DiscountResponse updateDiscount(Long id, DiscountRequest request) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found with ID: " + id));

        // If code is changed, make sure new code doesn't exist
        String newCode = request.getCode().toUpperCase();
        if (!discount.getCode().equals(newCode) && discountRepository.existsByCode(newCode)) {
            throw new IllegalArgumentException("Discount code '" + request.getCode() + "' already exists");
        }

        discount.setCode(newCode);
        discount.setDescription(request.getDescription());
        discount.setDiscountType(request.getDiscountType());
        discount.setDiscountValue(request.getDiscountValue());
        discount.setMinOrderAmount(request.getMinOrderAmount() != null ? request.getMinOrderAmount() : BigDecimal.ZERO);
        discount.setMaxDiscountAmount(request.getMaxDiscountAmount());
        discount.setUsageLimit(request.getUsageLimit());
        discount.setValidFrom(request.getValidFrom());
        discount.setValidUntil(request.getValidUntil());
        discount.setActive(request.isActive());

        Discount saved = discountRepository.save(discount);
        return new DiscountResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<DiscountResponse> getAllDiscounts() {
        return discountRepository.findAll().stream()
                .map(DiscountResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DiscountResponse getDiscountById(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found with ID: " + id));
        return new DiscountResponse(discount);
    }

    @Transactional
    public void deleteDiscount(Long id) {
        if (!discountRepository.existsById(id)) {
            throw new ResourceNotFoundException("Discount not found with ID: " + id);
        }
        discountRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public DiscountResponse validateDiscount(String code, BigDecimal orderAmount) {
        Discount discount = discountRepository.findByCode(code.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid coupon code"));

        if (!discount.getActive()) {
            throw new IllegalArgumentException("Coupon code has been deactivated");
        }

        LocalDate now = LocalDate.now();
        if (now.isBefore(discount.getValidFrom())) {
            throw new IllegalArgumentException("Coupon code is not valid yet");
        }
        if (now.isAfter(discount.getValidUntil())) {
            throw new IllegalArgumentException("Coupon code has expired");
        }

        if (discount.getUsageLimit() != null && discount.getUsedCount() >= discount.getUsageLimit()) {
            throw new IllegalArgumentException("Coupon usage limit exceeded");
        }

        if (orderAmount.compareTo(discount.getMinOrderAmount()) < 0) {
            throw new IllegalArgumentException("Minimum order amount of ₹" + discount.getMinOrderAmount() + " is required to use this coupon");
        }

        return new DiscountResponse(discount);
    }

    @Transactional
    public void incrementUsage(String code) {
        discountRepository.findByCode(code.toUpperCase()).ifPresent(discount -> {
            discount.setUsedCount(discount.getUsedCount() + 1);
            discountRepository.save(discount);
        });
    }
}
