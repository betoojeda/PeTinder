package com.petinder.service;

import com.petinder.dto.AuthResponse;
import com.petinder.dto.LoginRequest;
import com.petinder.dto.RegisterRequest;
import com.petinder.model.User;
import com.petinder.repository.UserRepository;
import com.petinder.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest r) {
        if (userRepository.findByEmail(r.getEmail()).isPresent()) {
            throw new RuntimeException("Email ya registrado");
        }
        User u = User.builder()
                .email(r.getEmail())
                .password(passwordEncoder.encode(r.getPassword()))
                .name(r.getName())
                .build();
        User saved = userRepository.save(u);
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getId());
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest r) {
        Optional<User> ou = userRepository.findByEmail(r.getEmail());
        if (ou.isEmpty()) throw new RuntimeException("Credenciales inválidas");
        User u = ou.get();
        if (!passwordEncoder.matches(r.getPassword(), u.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }
        String token = jwtUtil.generateToken(u.getEmail(), u.getId());
        return new AuthResponse(token);
    }
}
