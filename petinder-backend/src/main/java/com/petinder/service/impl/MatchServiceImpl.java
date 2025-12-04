package com.petinder.service.impl;

import com.petinder.dto.MatchDto;
import com.petinder.mapper.PetMapper;
import com.petinder.model.Pet;
import com.petinder.repository.MatchRepository;
import com.petinder.repository.PetRepository;
import com.petinder.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;
    private final PetRepository petRepository;
    private final PetMapper petMapper;

    @Override
    public List<MatchDto> getMatchesForUser(Long userId) {
        // 1. Encontrar todas las mascotas del usuario
        List<Pet> userPets = petRepository.findByOwnerId(userId);
        List<Long> userPetIds = userPets.stream().map(Pet::getId).collect(Collectors.toList());

        // 2. Encontrar todos los matches donde participa alguna de sus mascotas
        // Usamos un Stream para evitar duplicados si un match es entre dos mascotas del mismo usuario
        return matchRepository.findAllByPetAInOrPetBIn(userPetIds, userPetIds).stream()
                .distinct()
                .map(matchEntity -> {
                    // 3. Cargar los datos completos de ambas mascotas
                    Pet petA = petRepository.findById(matchEntity.getPetA()).orElse(null);
                    Pet petB = petRepository.findById(matchEntity.getPetB()).orElse(null);

                    // 4. Construir y devolver el DTO
                    if (petA == null || petB == null) return null;

                    MatchDto dto = new MatchDto();
                    dto.setId(matchEntity.getId());
                    dto.setPetA(petMapper.toDto(petA));
                    dto.setPetB(petMapper.toDto(petB));
                    return dto;
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }
}
