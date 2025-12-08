package com.petmatch.controller;

import com.petmatch.dto.MatchDto;
import com.petmatch.model.User;
import com.petmatch.repository.UserRepository;
import com.petmatch.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {
    private final MatchService matchService;
    private final UserRepository userRepository; // Inyectar para buscar al usuario

    @GetMapping
    public ResponseEntity<List<MatchDto>> getMyMatches(@AuthenticationPrincipal UserDetails userDetails) {
        // Buscar nuestro objeto User a partir del email del principal
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return ResponseEntity.ok(matchService.getMatchesForUser(user.getId()));
    }
}
