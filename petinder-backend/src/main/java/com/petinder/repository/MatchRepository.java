package com.petinder.repository;

import com.petinder.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    Optional<Match> findByPetAAndPetB(Long petA, Long petB);
    List<Match> findAllByPetAOrPetB(Long petIdA, Long petIdB);
    List<Match> findAllByPetAInOrPetBIn(Collection<Long> petAIds, Collection<Long> petBIds);
}
