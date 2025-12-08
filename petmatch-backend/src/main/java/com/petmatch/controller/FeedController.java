package com.petmatch.controller;

import com.petmatch.dto.PetDto;
import com.petmatch.model.User;
import com.petmatch.repository.UserRepository;
import com.petmatch.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;
    private final UserRepository userRepository; // Inyectar para buscar al usuario

    @GetMapping
    public Page<PetDto> getFeed(
            @AuthenticationPrincipal UserDetails userDetails, // Obtener el usuario autenticado
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        // Buscar nuestro objeto User a partir del email del principal
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return feedService.getFeed(user.getId(), page, size);
    }
}
