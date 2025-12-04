package com.petinder.service;

import com.petinder.model.MatchEntity;
import com.petinder.model.Swipe;
import com.petinder.model.Pet;
import com.petinder.model.User;
import com.petinder.repository.MatchRepository;
import com.petinder.repository.PetRepository;
import com.petinder.repository.SwipeRepository;
import com.petinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SwipeService {

    private final SwipeRepository swipeRepository;
    private final PetRepository petRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    @Transactional
    public boolean swipe(Long userId, Long petId, String type) {
        Optional<Swipe> existing = swipeRepository.findByUserIdAndPetId(userId, petId);
        if (existing.isPresent()) {
            // ya swipeado, ignorar o actualizar
            return false;
        }

        Swipe swipe = Swipe.builder()
                .userId(userId)
                .petId(petId)
                .type(type)
                .build();
        swipeRepository.save(swipe);

        if (!"LIKE".equalsIgnoreCase(type)) return false;

        // Lógica simple de reciprocidad: si el dueño de la mascota swapea una de tus mascotas con LIKE, hacer match.
        Pet targetPet = petRepository.findById(petId).orElse(null);
        if (targetPet == null) return false;

        // buscar si owner de targetPet (dueño B) hizo LIKE a alguna mascota del usuario A
        User ownerOfTarget = targetPet.getOwner();
        User userA = userRepository.findById(userId).orElse(null);
        if (ownerOfTarget == null || userA == null) return false;

        // buscar pets del userA y ver si existe swipe de ownerOfTarget hacia alguna de esas pets con LIKE
        for (Pet petOfA : petRepository.findAll()) {
            if (petOfA.getOwner() == null) continue;
            if (!petOfA.getOwner().getId().equals(userA.getId())) continue;

            Optional<Swipe> s = swipeRepository.findByUserIdAndPetId(ownerOfTarget.getId(), petOfA.getId());
            if (s.isPresent() && "LIKE".equalsIgnoreCase(s.get().getType())) {
                // creamos match entre petOfA.id y targetPet.id
                Long aId = petOfA.getId();
                Long bId = targetPet.getId();
                // Normalizar orden para unicidad (menor, mayor)
                Long petA = Math.min(aId, bId);
                Long petB = Math.max(aId, bId);
                if (matchRepository.findByPetAAndPetB(petA, petB).isEmpty()) {
                    MatchEntity m = MatchEntity.builder().petA(petA).petB(petB).build();
                    matchRepository.save(m);
                }
                return true;
            }
        }
        return false;
    }
}
