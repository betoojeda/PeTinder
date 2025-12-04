package com.petinder.controller;

import com.petinder.dto.SwipeRequest;
import com.petinder.service.SwipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/swipes")
@RequiredArgsConstructor
public class SwipeController {

    private final SwipeService swipeService;

    @PostMapping
    public ResponseEntity<?> swipe(@RequestBody SwipeRequest r) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean matched = swipeService.swipe(userId, r.getPetId(), r.getType());
        return ResponseEntity.ok().body("{\"matched\":" + matched + "}");
    }
}
