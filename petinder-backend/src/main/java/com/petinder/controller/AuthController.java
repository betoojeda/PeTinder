package com.petinder.controller;

import com.petinder.dto.AuthResponseDto;
import com.petinder.dto.LoginRequestDto;
import com.petinder.dto.RegisterRequestDto;
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
    public ResponseEntity<AuthResponseDto> register(@RequestBody RegisterRequestDto r) {
        return ResponseEntity.ok(authService.register(r));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto r) {
        return ResponseEntity.ok(authService.login(r));
    }
}
