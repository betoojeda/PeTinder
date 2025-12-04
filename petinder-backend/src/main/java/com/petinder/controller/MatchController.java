package com.petinder.controller;

import com.petinder.model.Match;
import com.petinder.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {
    private final MatchService matchService;

    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<Match>> matchesForPet(@PathVariable Long petId) {
        return ResponseEntity.ok(matchService.findAllByPetId(petId));
    }
}
