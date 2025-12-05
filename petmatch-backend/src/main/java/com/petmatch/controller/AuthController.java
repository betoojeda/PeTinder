package com.petmatch.controller;

import com.petmatch.dto.*;
import com.petmatch.model.User;
import com.petmatch.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterRequestDto r, HttpServletResponse response) {
        LoginResponse loginResponse = authService.register(r);
        setTokenCookie(response, loginResponse.getToken());
        return ResponseEntity.ok(loginResponse.getUser());
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody LoginRequestDto r, HttpServletResponse response) {
        LoginResponse loginResponse = authService.login(r);
        setTokenCookie(response, loginResponse.getToken());
        return ResponseEntity.ok(loginResponse.getUser());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt-token", null);
        cookie.setPath("/api");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint para obtener los datos del usuario autenticado a partir de la cookie.
     */
    @GetMapping("/me")
    public ResponseEntity<UserDto> me(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build(); // No autorizado
        }
        return ResponseEntity.ok(UserDto.from(user));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        authService.forgotPassword(body.get("email"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordDto dto) {
        authService.resetPassword(dto.getToken(), dto.getNewPassword());
        return ResponseEntity.ok().build();
    }

    private void setTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("jwt-token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // En producción, asegúrate de que tu app corre sobre HTTPS
        cookie.setPath("/api");
        cookie.setMaxAge(24 * 60 * 60); // 24 horas
        response.addCookie(cookie);
    }
}
