package com.onecpharma.service;

import com.onecpharma.dto.request.CustomerFeedbackRequest;
import com.onecpharma.dto.response.CustomerFeedbackResponse;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.CustomerFeedback;
import com.onecpharma.model.User;
import com.onecpharma.repository.CustomerFeedbackRepository;
import com.onecpharma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerFeedbackService {

    private final CustomerFeedbackRepository customerFeedbackRepository;
    private final UserRepository userRepository;

    @Transactional
    public CustomerFeedbackResponse submitFeedback(String email, CustomerFeedbackRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        CustomerFeedback feedback = CustomerFeedback.builder()
                .user(user)
                .subject(request.getSubject())
                .message(request.getMessage())
                .rating(request.getRating())
                .category(request.getCategory())
                .status("OPEN")
                .build();

        feedback = customerFeedbackRepository.save(feedback);
        return mapToResponse(feedback);
    }

    public List<CustomerFeedbackResponse> getFeedbackByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return customerFeedbackRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CustomerFeedbackResponse> getAllFeedback() {
        return customerFeedbackRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CustomerFeedbackResponse respondToFeedback(Long id, String adminResponse) {
        CustomerFeedback feedback = customerFeedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerFeedback", "id", id));

        feedback.setAdminResponse(adminResponse);
        feedback.setStatus("RESOLVED");
        feedback = customerFeedbackRepository.save(feedback);

        return mapToResponse(feedback);
    }

    @Transactional
    public CustomerFeedbackResponse updateStatus(Long id, String status) {
        CustomerFeedback feedback = customerFeedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerFeedback", "id", id));

        feedback.setStatus(status);
        feedback = customerFeedbackRepository.save(feedback);

        return mapToResponse(feedback);
    }

    private CustomerFeedbackResponse mapToResponse(CustomerFeedback feedback) {
        return CustomerFeedbackResponse.builder()
                .id(feedback.getId())
                .userId(feedback.getUser().getId())
                .userEmail(feedback.getUser().getEmail())
                .subject(feedback.getSubject())
                .message(feedback.getMessage())
                .rating(feedback.getRating())
                .category(feedback.getCategory())
                .status(feedback.getStatus())
                .adminResponse(feedback.getAdminResponse())
                .createdAt(feedback.getCreatedAt())
                .updatedAt(feedback.getUpdatedAt())
                .build();
    }
}
