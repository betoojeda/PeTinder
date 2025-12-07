package com.petmatch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PetDto {
    private Long id;

    @NotBlank(message = "El nombre de la mascota no puede estar vacío")
    @Size(max = 100, message = "El nombre no puede tener más de 100 caracteres")
    private String name;

    @NotBlank(message = "La especie no puede estar vacía")
    private String type; // species

    @NotBlank(message = "La raza no puede estar vacía")
    private String breed;

    @NotNull(message = "La edad no puede ser nula")
    private Integer age;

    @Size(max = 1000, message = "La descripción no puede tener más de 1000 caracteres")
    private String description;

    private List<String> photoUrls; // Cambiado a una lista

    private String size;
    private String gender;
    private String energyLevel;
    private String temperament;

    private boolean compatibleWithDogs;
    private boolean compatibleWithCats;
    private boolean compatibleWithChildren;

    private String specialNeeds;
    private String trainingLevel;

    private boolean vaccinated;
    private boolean dewormed;
    private boolean sterilized;

    private String history;

    @NotNull(message = "El ID del propietario no puede ser nulo")
    private Long ownerId;
}
