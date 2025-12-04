package com.petinder.repository;

import com.petinder.model.Swipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface SwipeRepository extends JpaRepository<Swipe, Long> {

    @Query("""
        SELECT s.petId
        FROM Swipe s
        WHERE s.userId = :userId
    """)
    Set<Long> findAllSwipedPetIdsByUser(Long userId);

    Optional<Swipe> findByUserIdAndPetId(Long userId, Long petId);
}
