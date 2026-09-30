package com.hcl.e_comerce.dto;

public record AuthResponse(
        String token,
        Long userId,
        String name,
        String email,
        String role
) {}