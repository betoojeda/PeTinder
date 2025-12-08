package com.petmatch.controller;

import com.petmatch.dto.PetDto;
import com.petmatch.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public PetDto create(@Valid @RequestBody PetDto pet) {
        return petService.createPet(pet);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public PetDto update(@PathVariable Long id, @Valid @RequestBody PetDto pet) {
        return petService.updatePet(id, pet);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        petService.deletePet(id);
    }

    @GetMapping("/{id}")
    public PetDto get(@PathVariable Long id) {
        return petService.getPet(id);
    }

    @GetMapping
    public List<PetDto> getAll() {
        return petService.getAllPets();
    }

    @GetMapping("/owner/{ownerId}")
    public List<PetDto> byOwner(@PathVariable Long ownerId) {
        return petService.getPetsByOwner(ownerId);
    }

    @PostMapping("/{petId}/photos")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PetDto> uploadPhoto(
            @PathVariable Long petId,
            @RequestParam("file") MultipartFile file) {
        try {
            PetDto updatedPet = petService.addPhotoToPet(petId, file);
            return ResponseEntity.ok(updatedPet);
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }
}
