package com.petinder.service;

import com.petinder.dto.PetDto;
import com.petinder.mapper.PetMapper;
import com.petinder.model.Pet;
import com.petinder.repository.PetRepository;
import com.petinder.repository.SwipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class FeedService {

    private final PetRepository petRepository;
    private final SwipeRepository swipeRepository;
    private final PetMapper petMapper;

    public Page<PetDto> getFeed(Long userId, int page, int size) {

        // mascotas que el usuario ya swapeó
        Set<Long> swipedPetIds = swipeRepository.findAllSwipedPetIdsByUser(userId);

        if (swipedPetIds.isEmpty()) {
            // evita error en SQL con "NOT IN ()"
            swipedPetIds = Set.of(-1L);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<Pet> pets = petRepository.findAvailableFeed(userId, swipedPetIds, pageable);

        return pets.map(petMapper::toDto);
    }
}
