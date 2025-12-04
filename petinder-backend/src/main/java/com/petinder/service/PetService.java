package com.petinder.service;

import com.petinder.dto.PetDto;
import com.petinder.model.Pet;
import com.petinder.model.User;
import com.petinder.repository.PetRepository;
import com.petinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;

    public Pet createPet(PetDto dto) {
        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        Pet p = Pet.builder()
                .name(dto.getName())
                .species(dto.getSpecies())
                .breed(dto.getBreed())
                .age(dto.getAge())
                .gender(dto.getGender())
                .bio(dto.getBio())
                .owner(owner)
                .build();
        return petRepository.save(p);
    }

    public List<PetDto> feedForUser(Long userId, List<Long> excludedPetIds) {
        List<Pet> pets;
        if (excludedPetIds == null || excludedPetIds.isEmpty()) {
            pets = petRepository.findAll();
        } else {
            pets = petRepository.findByIdNotIn(excludedPetIds);
        }
        return pets.stream().map(this::toDto).collect(Collectors.toList());
    }

    public PetDto toDto(Pet p) {
        PetDto d = new PetDto();
        d.setId(p.getId());
        d.setName(p.getName());
        d.setSpecies(p.getSpecies());
        d.setBreed(p.getBreed());
        d.setAge(p.getAge());
        d.setGender(p.getGender());
        d.setBio(p.getBio());
        d.setOwnerId(p.getOwner() != null ? p.getOwner().getId() : null);
        return d;
    }

    public Page<Pet> getFeed(Long userId, int page, int size) {
        return petRepository.getFeed(userId, PageRequest.of(page, size));
    }
}
