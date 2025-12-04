package com.petinder.service;

import com.petinder.model.MatchEntity;
import com.petinder.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService {
    private final MatchRepository matchRepository;

    public List<MatchEntity> findAllByPetId(Long petId) {
        return matchRepository.findAllByPetAOrPetB(petId, petId);
    }
}
