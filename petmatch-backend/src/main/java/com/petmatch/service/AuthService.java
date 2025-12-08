package com.petmatch.service;

import com.petmatch.dto.LoginRequestDto;
import com.petmatch.dto.LoginResponse;
import com.petmatch.dto.RegisterRequestDto;
import com.petmatch.dto.UserDto;
import com.petmatch.model.PasswordResetToken;
import com.petmatch.model.User;
import com.petmatch.repository.PasswordResetTokenRepository;
import com.petmatch.repository.UserRepository;
import com.petmatch.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    public LoginResponse register(RegisterRequestDto r) {
        log.info("Attempting to register user with email: {}", r.getEmail());
        if (userRepository.findByEmail(r.getEmail()).isPresent()) {
            log.warn("Registration failed: Email {} already registered.", r.getEmail());
            throw new RuntimeException("El correo ya está registrado.");
        }

        User newUser = User.builder()
                .name(r.getName())
                .lastName(r.getLastName())
                .gender(r.getGender())
                .numberOfPets(r.getNumberOfPets())
                .profileDescription(r.getProfileDescription())
                .email(r.getEmail())
                .password(passwordEncoder.encode(r.getPassword()))
                .role(User.Role.USER)
                .build();
        
        try {
            userRepository.save(newUser);
            log.info("User {} registered successfully.", newUser.getEmail());
        } catch (DataIntegrityViolationException e) {
            log.error("Error saving new user due to data integrity violation: {}", e.getMessage());
            throw new RuntimeException("El correo electrónico ya está registrado. Por favor, utiliza otro.");
        }

        return login(new LoginRequestDto(r.getEmail(), r.getPassword()));
    }

    public LoginResponse login(LoginRequestDto r) {
        log.info("Attempting to log in user with email: {}", r.getEmail());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(r.getEmail(), r.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado después de la autenticación."));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        log.info("User {} logged in successfully.", user.getEmail());
        
        return LoginResponse.builder()
                .token(token)
                .user(UserDto.from(user))
                .build();
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        String token = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken(token, user);
        tokenRepository.save(passwordResetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido."));

        if (resetToken.getExpiryDate().isBefore(Instant.now())) {
            throw new RuntimeException("El token ha expirado.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }
}
