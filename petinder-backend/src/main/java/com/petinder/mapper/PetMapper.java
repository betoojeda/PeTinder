@Component
public class PetMapper {

    public PetDto toDto(Pet pet) {
        PetDto dto = new PetDto();
        dto.setId(pet.getId());
        dto.setName(pet.getName());
        dto.setType(pet.getType());
        dto.setAge(pet.getAge());
        dto.setPhotoUrl(pet.getPhotoUrl());
        return dto;
    }

    public List<PetDto> toDtoList(List<Pet> pets) {
        return pets.stream().map(this::toDto).toList();
    }
}
