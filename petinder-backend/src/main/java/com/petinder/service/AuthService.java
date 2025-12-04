package com.petinder.service;

import com.petinder.dto.AuthResponseDto;
import com.petinder.dto.LoginRequestDto;
import com.petinder.dto.RegisterRequestDto;
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

    public AuthResponseDto register(RegisterRequestDto r) {
        if (userRepository.findByEmail(r.getEmail()).isPresent()) {
            throw new RuntimeException("Email ya registrado");
        }
        User u = User.builder()
                .email(r.getEmail())
                .password(passwordEncoder.encode(r.getPassword()))
                .name(r.getName())
                .build();
        User saved = userRepository.save(u);
        String token = jwtUtil.generateToken(saved.getEmail());
        return new AuthResponseDto(token);
    }

    public AuthResponseDto login(LoginRequestDto r) {
        Optional<User> ou = userRepository.findByEmail(r.getEmail());
        if (ou.isEmpty()) throw new RuntimeException("Credenciales inválidas");
        User u = ou.get();
        if (!passwordEncoder.matches(r.getPassword(), u.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }
        String token = jwtUtil.generateToken(u.getEmail());
        return new AuthResponseDto(token);
    }
}
