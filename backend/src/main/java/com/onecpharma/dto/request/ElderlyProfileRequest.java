package com.onecpharma.dto.request;

import lombok.Data;

@Data
public class ElderlyProfileRequest {
    private String healthConditions; // Comma-separated: "diabetes,hypertension,arthritis"
    private String accessibilityPreferences; // JSON string
}
