package com.eyecare.service;

import com.eyecare.dto.user.UserProfileResponse;
import com.eyecare.dto.user.UserUpdateRequest;
import com.eyecare.exception.ResourceNotFoundException;
import com.eyecare.model.Role;
import com.eyecare.model.User;
import com.eyecare.repository.UserRepository;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(String name, String email, String rawPassword, String phone, String address, Role role) {
        User user = new User();
        user.setName(name);
        user.setEmail(email.toLowerCase());
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setPhone(phone);
        user.setAddress(address);
        user.setRole(role);
        return userRepository.save(user);
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public User getById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email.toLowerCase());
    }

    public UserProfileResponse getProfile(Long userId) {
        return toProfile(getById(userId));
    }

    public UserProfileResponse updateProfile(Long userId, UserUpdateRequest request) {
        User user = getById(userId);
        user.setName(request.name());
        user.setPhone(request.phone());
        user.setAddress(request.address());
        return toProfile(userRepository.save(user));
    }

    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toProfile).toList();
    }

    public UserProfileResponse toProfile(User user) {
        return new UserProfileResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getPhone(),
            user.getAddress(),
            user.getRole(),
            user.getCreatedAt()
        );
    }
}
