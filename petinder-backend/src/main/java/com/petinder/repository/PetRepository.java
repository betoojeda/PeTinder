package com.petinder.repository;

import com.petinder.model.Pet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PetRepository extends JpaRepository<Pet, Long> {

    @Query("""
        SELECT p FROM Pet p
        WHERE p.owner.id <> :userId
        AND p.id NOT IN (
            SELECT s.targetPet.id FROM Swipe s WHERE s.user.id = :userId
        )
        """)
    Page<Pet> getFeed(Long userId, Pageable pageable);

    @Repository
    public interface PetRepository extends JpaRepository<Pet, Long> {

        @Query("""
        SELECT p
        FROM Pet p
        WHERE p.owner.id <> :userId
          AND p.id NOT IN :excludedPetIds
    """)
        Page<Pet> findAvailableFeed(Long userId, Set<Long> excludedPetIds, Pageable pageable);
    }

}
