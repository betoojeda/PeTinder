package com.petmatch.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String species;
    private String breed;
    private int age;
    private String description;

    @ElementCollection(fetch = FetchType.EAGER) // Cargar las fotos junto con la mascota
    @CollectionTable(name = "pet_photos", joinColumns = @JoinColumn(name = "pet_id"))
    @Column(name = "photo_url")
    @Builder.Default
    private List<String> photoUrls = new ArrayList<>();

    private String size;
    private String gender;
    private String energyLevel;
    private String temperament;

    private boolean compatibleWithDogs;
    private boolean compatibleWithCats;
    private boolean compatibleWithChildren;

    private String specialNeeds;
    private String trainingLevel;

    private boolean isVaccinated;
    private boolean isDewormed;
    private boolean isSterilized;

    private String history;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
}
