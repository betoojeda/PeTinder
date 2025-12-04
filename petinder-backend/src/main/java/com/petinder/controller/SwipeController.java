package com.petinder.controller;

import com.petinder.dto.SwipeRequest;
import com.petinder.service.SwipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class SwipeController {
    private final SwipeService swipeService;

    @PostMapping("/{petId}/swipe")
    public ResponseEntity<?> swipe(@PathVariable Long petId,
                                   @RequestBody SwipeRequest r,
                                   @RequestHeader(value = "Authorization", required = false) String authHeader) {
        // el JwtFilter coloca userId como principal en SecurityContext
        Long userId = (Long) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean matched = swipeService.swipe(userId, petId, r.getType());
        return ResponseEntity.ok().body("{\"matched\":" + matched + "}");
    }
}
