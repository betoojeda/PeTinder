package com.petinder.repository;

import com.petinder.model.Pet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {

    @Query("""
            SELECT p FROM Pet p
            WHERE p.owner.id <> :userId
            AND p.id NOT IN :excludedPetIds
            """)
    Page<Pet> findAvailableFeed(Long userId, Collection<Long> excludedPetIds, Pageable pageable);
}
