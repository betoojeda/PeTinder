package com.petinder.dto;

public class SwipeRequestDto {
    private String type; // "LIKE" or "DISLIKE"
    private Long fromPetId; // optional

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getFromPetId() { return fromPetId; }
    public void setFromPetId(Long fromPetId) { this.fromPetId = fromPetId; }
}
