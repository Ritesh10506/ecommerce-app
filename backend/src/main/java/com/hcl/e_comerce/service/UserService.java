package com.hcl.e_comerce.service;

import com.hcl.e_comerce.entity.User;
import com.hcl.e_comerce.exception.ResourceNotFoundException;
import com.hcl.e_comerce.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    public void deleteUser(Long id) {
        getUserById(id);
        userRepository.deleteById(id);
    }
}