package com.petinder.controller;

import com.petinder.dto.PetDto;
import com.petinder.model.Pet;
import com.petinder.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody PetDto dto) {
        return ResponseEntity.ok(petService.createPet(dto));
    }

    @GetMapping("/feed")
    public Page<Pet> getFeed(
            @RequestParam Long userId,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return petService.getFeed(userId, page, size);
    }
}
