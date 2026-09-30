package com.hcl.e_comerce.config;

import com.hcl.e_comerce.entity.User;
import com.hcl.e_comerce.enums.Role;
import com.hcl.e_comerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@shop.com")) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@shop.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println(">>> Admin created: admin@shop.com / admin123");
        }
    }
}