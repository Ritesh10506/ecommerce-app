package com.hcl.e_comerce.service;

import com.hcl.e_comerce.dto.AuthResponse;
import com.hcl.e_comerce.dto.LoginRequest;
import com.hcl.e_comerce.dto.RegisterRequest;
import com.hcl.e_comerce.entity.User;
import com.hcl.e_comerce.enums.Role;
import com.hcl.e_comerce.exception.BadRequestException;
import com.hcl.e_comerce.exception.ResourceNotFoundException;
import com.hcl.e_comerce.exception.UnauthorizedException;
import com.hcl.e_comerce.repository.UserRepository;
import com.hcl.e_comerce.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));   // encrypted
        user.setRole(Role.CUSTOMER);
        userRepository.save(user);

        return buildResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        return buildResponse(user);
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private AuthResponse buildResponse(User user) {
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}