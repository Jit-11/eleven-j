package org.example.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SubscribeRequest(
        @NotBlank(message = "Please enter your email")
        @Size(max = 254, message = "Email is too long")
        @Email(message = "Please enter a valid email address")
        @Pattern(regexp = ".+@.+\\..+", message = "Please enter a valid email address")
        String email) { }
