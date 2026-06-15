package com.onecpharma.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerFeedbackResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private String subject;
    private String message;
    private Integer rating;
    private String category;
    private String status;
    private String adminResponse;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
