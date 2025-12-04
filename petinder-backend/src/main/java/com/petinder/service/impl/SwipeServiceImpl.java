package com.petinder.service.impl;

import com.petinder.model.Match;
import com.petinder.model.Pet;
import com.petinder.model.Swipe;
import com.petinder.model.User;
import com.petinder.repository.MatchRepository;
import com.petinder.repository.PetRepository;
import com.petinder.repository.SwipeRepository;
import com.petinder.repository.UserRepository;
import com.petinder.service.SwipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SwipeServiceImpl implements SwipeService {

    private final SwipeRepository swipeRepository;
    private final PetRepository petRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public boolean swipe(Long userId, Long petId, String type) {
        Optional<Swipe> existing = swipeRepository.findByUserIdAndPetId(userId, petId);
        if (existing.isPresent()) {
            // already swiped, ignore or update
            return false;
        }

        Swipe swipe = Swipe.builder()
                .userId(userId)
                .petId(petId)
                .type(type)
                .build();
        swipeRepository.save(swipe);

        if (!"LIKE".equalsIgnoreCase(type)) return false;

        // Simple reciprocity logic: if the pet owner swipes one of your pets with LIKE, make a match.
        Pet targetPet = petRepository.findById(petId).orElse(null);
        if (targetPet == null) return false;

        // Check if owner of targetPet (owner B) liked any of user A's pets
        User ownerOfTarget = targetPet.getOwner();
        User userA = userRepository.findById(userId).orElse(null);
        if (ownerOfTarget == null || userA == null) return false;

        // Find pets of userA and check if ownerOfTarget swiped any of them with LIKE
        for (Pet petOfA : petRepository.findAll()) {
            if (petOfA.getOwner() == null) continue;
            if (!petOfA.getOwner().getId().equals(userA.getId())) continue;

            Optional<Swipe> s = swipeRepository.findByUserIdAndPetId(ownerOfTarget.getId(), petOfA.getId());
            if (s.isPresent() && "LIKE".equalsIgnoreCase(s.get().getType())) {
                // create match between petOfA.id and targetPet.id
                Long aId = petOfA.getId();
                Long bId = targetPet.getId();
                // Normalize order for uniqueness (min, max)
                Long petA = Math.min(aId, bId);
                Long petB = Math.max(aId, bId);
                if (matchRepository.findByPetAAndPetB(petA, petB).isEmpty()) {
                    Match m = Match.builder().petA(petA).petB(petB).build();
                    matchRepository.save(m);
                }
                return true;
            }
        }
        return false;
    }
}
