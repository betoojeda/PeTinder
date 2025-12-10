package com.petmatch.service;

import com.petmatch.dto.PetDto;
import com.petmatch.mapper.PetMapper;
import com.petmatch.model.Pet;
import com.petmatch.model.User;
import com.petmatch.repository.PetRepository;
import com.petmatch.repository.SwipeRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FeedService {

    private static final Logger log = LoggerFactory.getLogger(FeedService.class);

    private final PetRepository petRepository;
    private final SwipeRepository swipeRepository;
    private final PetMapper petMapper;

    /**
     * Obtiene un feed personalizado para un usuario autenticado, excluyendo sus propias mascotas
     * y las que ya ha "swiped".
     */
    public Page<PetDto> getFeedForUser(User user, int page, int size) {
        Long userId = user.getId();
        log.info("Fetching personalized feed for user ID: {}, page: {}, size: {}", userId, page, size);

        // Obtener los IDs de las mascotas en las que el usuario ya ha interactuado
        // Lo convertimos a un HashSet para asegurarnos de que sea mutable.
        Set<Long> swipedPetIds = new HashSet<>(swipeRepository.findAllSwipedPetIdsByUser(userId));
        log.debug("User ID: {} has swiped on {} pets", userId, swipedPetIds.size());

        // Si el conjunto está vacío, añadimos un valor que no existirá para evitar errores SQL
        if (swipedPetIds.isEmpty()) {
            swipedPetIds.add(-1L);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        // Buscar mascotas que no pertenezcan al usuario y en las que no haya interactuado
        Page<Pet> pets = petRepository.findAvailableFeed(userId, swipedPetIds, pageable);
        log.info("Found {} pets for personalized feed for user ID: {}", pets.getTotalElements(), userId);

        return pets.map(petMapper::toDto);
    }

    /**
     * Obtiene un feed público y genérico para usuarios no autenticados.
     * Simplemente muestra todas las mascotas disponibles.
     */
    public Page<PetDto> getPublicFeed(int page, int size) {
        log.info("Fetching public feed for anonymous user, page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        // Buscar todas las mascotas sin filtros de usuario
        Page<Pet> pets = petRepository.findAll(pageable);
        log.info("Found {} pets for public feed", pets.getTotalElements());

        return pets.map(petMapper::toDto);
    }
}
