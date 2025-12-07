package com.petmatch.service.impl;

import com.petmatch.dto.PetDto;
import com.petmatch.mapper.PetMapper;
import com.petmatch.model.Pet;
import com.petmatch.model.User;
import com.petmatch.repository.PetRepository;
import com.petmatch.repository.UserRepository;
import com.petmatch.service.CloudinaryService;
import com.petmatch.service.PetService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {

    private static final Logger log = LoggerFactory.getLogger(PetServiceImpl.class);

    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final PetMapper petMapper;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public PetDto createPet(PetDto dto) {
        log.info("Creating pet for owner with ID: {}", dto.getOwnerId());
        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> {
                    log.error("Owner not found with ID: {}", dto.getOwnerId());
                    return new RuntimeException("Owner not found");
                });

        Pet pet = Pet.builder()
                .name(dto.getName())
                .species(dto.getType())
                .breed(dto.getBreed())
                .age(dto.getAge())
                .description(dto.getDescription())
                .photoUrls(dto.getPhotoUrls() != null ? dto.getPhotoUrls() : new ArrayList<>())
                .size(dto.getSize())
                .gender(dto.getGender())
                .energyLevel(dto.getEnergyLevel())
                .temperament(dto.getTemperament())
                .compatibleWithDogs(dto.isCompatibleWithDogs())
                .compatibleWithCats(dto.isCompatibleWithCats())
                .compatibleWithChildren(dto.isCompatibleWithChildren())
                .specialNeeds(dto.getSpecialNeeds())
                .trainingLevel(dto.getTrainingLevel())
                .isVaccinated(dto.isVaccinated())
                .isDewormed(dto.isDewormed())
                .isSterilized(dto.isSterilized())
                .history(dto.getHistory())
                .owner(owner)
                .build();
        Pet savedPet = petRepository.save(pet);
        log.info("Pet created with ID: {}", savedPet.getId());
        return petMapper.toDto(savedPet);
    }

    @Override
    @Transactional
    public PetDto updatePet(Long id, PetDto petDto) {
        log.info("Updating pet with ID: {}", id);
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Pet not found with ID: {}", id);
                    return new RuntimeException("Pet not found");
                });
        
        checkOwnershipOrAdmin(pet);

        pet.setName(petDto.getName());
        pet.setSpecies(petDto.getType());
        pet.setBreed(petDto.getBreed());
        pet.setAge(petDto.getAge());
        pet.setDescription(petDto.getDescription());
        pet.setPhotoUrls(petDto.getPhotoUrls() != null ? petDto.getPhotoUrls() : new ArrayList<>());
        pet.setSize(petDto.getSize());
        pet.setGender(petDto.getGender());
        pet.setEnergyLevel(petDto.getEnergyLevel());
        pet.setTemperament(petDto.getTemperament());
        pet.setCompatibleWithDogs(petDto.isCompatibleWithDogs());
        pet.setCompatibleWithCats(petDto.isCompatibleWithCats());
        pet.setCompatibleWithChildren(petDto.isCompatibleWithChildren());
        pet.setSpecialNeeds(petDto.getSpecialNeeds());
        pet.setTrainingLevel(petDto.getTrainingLevel());
        pet.setVaccinated(petDto.isVaccinated());
        pet.setDewormed(petDto.isDewormed());
        pet.setSterilized(petDto.isSterilized());
        pet.setHistory(petDto.getHistory());

        Pet updatedPet = petRepository.save(pet);
        log.info("Pet with ID: {} updated successfully", updatedPet.getId());
        return petMapper.toDto(updatedPet);
    }

    @Override
    @Transactional
    public void deletePet(Long id) {
        log.info("Deleting pet with ID: {}", id);
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Pet not found with ID: {}", id);
                    return new RuntimeException("Pet not found");
                });
        
        checkOwnershipOrAdmin(pet);
        
        petRepository.deleteById(id);
        log.info("Pet with ID: {} deleted successfully", id);
    }

    @Override
    @Transactional(readOnly = true)
    public PetDto getPet(Long id) {
        log.info("Fetching pet with ID: {}", id);
        return petRepository.findById(id)
                .map(petMapper::toDto)
                .orElseThrow(() -> {
                    log.error("Pet not found with ID: {}", id);
                    return new RuntimeException("Pet not found");
                });
    }

    @Override
    @Transactional(readOnly = true)
    public List<PetDto> getAllPets() {
        log.info("Fetching all pets");
        List<PetDto> pets = petRepository.findAll().stream()
                .map(petMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} pets", pets.size());
        return pets;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PetDto> getPetsByOwner(Long ownerId) {
        log.info("Fetching pets for owner with ID: {}", ownerId);
        List<PetDto> pets = petRepository.findByOwnerId(ownerId).stream()
                .map(petMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} pets for owner with ID: {}", pets.size(), ownerId);
        return pets;
    }
    
    @Override
    @Transactional
    public PetDto addPhotoToPet(Long petId, MultipartFile file) throws IOException {
        log.info("Adding photo to pet with ID: {}", petId);
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        checkOwnershipOrAdmin(pet);

        String photoUrl = cloudinaryService.uploadFile(file);
        pet.getPhotoUrls().add(photoUrl);

        Pet updatedPet = petRepository.save(pet);
        log.info("Photo added to pet with ID: {}. New URL: {}", petId, photoUrl);
        return petMapper.toDto(updatedPet);
    }
    
    private void checkOwnershipOrAdmin(Pet pet) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!pet.getOwner().getId().equals(currentUser.getId()) && !currentUser.getRole().equals(User.Role.ADMIN)) {
            log.warn("User with ID: {} attempted to access pet with ID: {} without ownership or admin rights", currentUser.getId(), pet.getId());
            throw new SecurityException("No tienes permiso para realizar esta acción.");
        }
    }
}
