package com.onecpharma.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UdidUploadRequest {
    @NotBlank(message = "UDID certificate URL is required")
    private String udidCertificateUrl;

    @NotBlank(message = "UDID number is required")
    private String udidNumber;
}
