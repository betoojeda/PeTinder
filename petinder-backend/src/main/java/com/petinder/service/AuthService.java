package com.petinder.service;

import com.petinder.dto.AuthResponseDto;
import com.petinder.dto.LoginRequestDto;
import com.petinder.dto.RegisterRequestDto;
import com.petinder.model.User;
import com.petinder.repository.UserRepository;
import com.petinder.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDto register(RegisterRequestDto r) {
        if (userRepository.findByEmail(r.getEmail()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado.");
        }
        User newUser = User.builder()
                .name(r.getName())
                .email(r.getEmail())
                .password(passwordEncoder.encode(r.getPassword()))
                .role(User.Role.USER) // Asignar rol por defecto
                .build();
        userRepository.save(newUser);

        // Autenticar y generar token
        return login(new LoginRequestDto(r.getEmail(), r.getPassword()));
    }

    public AuthResponseDto login(LoginRequestDto r) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(r.getEmail(), r.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponseDto(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
