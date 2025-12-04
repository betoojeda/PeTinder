package com.petinder.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "swipes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Swipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long petId;

    @Column(nullable = false)
    private String type;

    private Instant createdAt = Instant.now();
}
