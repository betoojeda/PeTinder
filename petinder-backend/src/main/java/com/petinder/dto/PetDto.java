package com.petinder.dto;

import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PetDto {
    private Long id;
    private String name;
    private String type;
    private Integer age;
    private String photoUrl;
}
