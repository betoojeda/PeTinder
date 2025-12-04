package com.petinder.controller;

import com.petinder.dto.PetDto;
import com.petinder.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<List<PetDto>> feed(@RequestParam(required = false) Long userId) {
        // obtenemos ids de pets swypeados del user (puedes mejorar paginación/filtros)
        List<Long> excluded = List.of(); // simple por ahora
        return ResponseEntity.ok(petService.feedForUser(userId, excluded));
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
