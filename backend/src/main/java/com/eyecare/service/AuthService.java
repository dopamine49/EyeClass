package com.eyecare.service;

import com.eyecare.dto.auth.AuthResponse;
import com.eyecare.dto.auth.LoginRequest;
import com.eyecare.dto.auth.RegisterRequest;
import com.eyecare.exception.BadRequestException;
import com.eyecare.model.Role;
import com.eyecare.model.User;
import com.eyecare.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserService userService, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userService.existsByEmail(request.email())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = userService.createUser(
            request.name(),
            request.email(),
            request.password(),
            request.phone(),
            request.address(),
            Role.USER
        );

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getName(), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password())
            );
        } catch (AuthenticationException ex) {
            throw new BadRequestException("Invalid email or password");
        }

        User user = userService.getByEmail(request.email());
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getName(), user.getRole());
    }
}
