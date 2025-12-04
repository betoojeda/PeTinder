package com.petinder.controller;

import com.petinder.dto.AuthResponse;
import com.petinder.dto.LoginRequest;
import com.petinder.dto.RegisterRequest;
import com.petinder.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest r) {
        return ResponseEntity.ok(authService.register(r));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest r) {
        return ResponseEntity.ok(authService.login(r));
    }
}
