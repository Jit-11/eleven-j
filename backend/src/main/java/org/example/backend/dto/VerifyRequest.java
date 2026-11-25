package org.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VerifyRequest(
        @NotBlank(message = "Token is required")
        @Size(max = 200, message = "Token is too long")
        String token) { }
