package com.hcl.e_comerce.controller;

import com.hcl.e_comerce.dto.AuthResponse;
import com.hcl.e_comerce.dto.LoginRequest;
import com.hcl.e_comerce.dto.RegisterRequest;
import com.hcl.e_comerce.entity.User;
import com.hcl.e_comerce.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // Who am I? (needs token)
    @GetMapping("/me")
    public User me(Authentication authentication) {
        return authService.getByEmail(authentication.getName());
    }
}