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
    private final UserRepository userRepository;

    @GetMapping
    public Page<PetDto> getFeed(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        if (userDetails != null) {
            // Si el usuario está autenticado, obtenemos su feed personalizado
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado en la base de datos"));
            return feedService.getFeedForUser(user, page, size);
        } else {
            // Si no hay usuario, devolvemos un feed público y genérico
            return feedService.getPublicFeed(page, size);
        }
    }
}
