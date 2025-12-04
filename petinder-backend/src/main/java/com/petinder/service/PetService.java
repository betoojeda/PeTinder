package com.petinder.service;

import com.petinder.dto.PetDto;
import com.petinder.model.Pet;
import com.petinder.model.User;
import com.petinder.repository.PetRepository;
import com.petinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;

    public Pet createPet(PetDto dto) {
        User owner = userRepository.findById(1L) // FIXME: get owner from authenticated user
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        Pet p = Pet.builder()
                .name(dto.getName())
                .species(dto.getType())
                .age(dto.getAge())
                .owner(owner)
                .build();
        return petRepository.save(p);
    }

    public Page<Pet> getFeed(Long userId, int page, int size) {
        return petRepository.findAvailableFeed(userId, List.of(-1L), PageRequest.of(page, size));
    }
}
