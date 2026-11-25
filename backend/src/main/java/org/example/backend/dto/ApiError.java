package org.example.backend.dto;

import java.util.Map;

public record ApiError(String message, Map<String, String> fieldErrors) { }
