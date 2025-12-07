package com.petmatch.mapper;

import com.petmatch.dto.PetDto;
import com.petmatch.model.Pet;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PetMapper {

    public PetDto toDto(Pet pet) {
        if (pet == null) {
            return null;
        }

        PetDto dto = new PetDto();
        dto.setId(pet.getId());
        dto.setName(pet.getName());
        dto.setType(pet.getSpecies());
        dto.setBreed(pet.getBreed());
        dto.setAge(pet.getAge());
        dto.setDescription(pet.getDescription());
        dto.setPhotoUrls(pet.getPhotoUrls()); // Mapear la lista de fotos
        dto.setSize(pet.getSize());
        dto.setGender(pet.getGender());
        dto.setEnergyLevel(pet.getEnergyLevel());
        dto.setTemperament(pet.getTemperament());
        dto.setCompatibleWithDogs(pet.isCompatibleWithDogs());
        dto.setCompatibleWithCats(pet.isCompatibleWithCats());
        dto.setCompatibleWithChildren(pet.isCompatibleWithChildren());
        dto.setSpecialNeeds(pet.getSpecialNeeds());
        dto.setTrainingLevel(pet.getTrainingLevel());
        dto.setVaccinated(pet.isVaccinated());
        dto.setDewormed(pet.isDewormed());
        dto.setSterilized(pet.isSterilized());
        dto.setHistory(pet.getHistory());
        
        if (pet.getOwner() != null) {
            dto.setOwnerId(pet.getOwner().getId());
        }

        return dto;
    }

    public List<PetDto> toDtoList(List<Pet> pets) {
        return pets.stream().map(this::toDto).toList();
    }
}
