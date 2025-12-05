package com.petmatch.service.impl;

import com.petmatch.dto.PetDto;
import com.petmatch.dto.UserAdminDto;
import com.petmatch.dto.UserRegistrationStatsDto;
import com.petmatch.mapper.PetMapper;
import com.petmatch.model.User;
import com.petmatch.repository.PetRepository;
import com.petmatch.repository.UserRepository;
import com.petmatch.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminServiceImpl.class);

    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final PetMapper petMapper;

    @Override
    public List<UserAdminDto> getAllUsers() {
        log.info("Fetching all users for admin");
        List<UserAdminDto> users = userRepository.findAll().stream()
                .map(this::toUserAdminDto)
                .collect(Collectors.toList());
        log.info("Found {} users", users.size());
        return users;
    }

    @Override
    public List<PetDto> getAllPets() {
        log.info("Fetching all pets for admin");
        List<PetDto> pets = petRepository.findAll().stream()
                .map(petMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} pets", pets.size());
        return pets;
    }

    @Override
    public List<UserRegistrationStatsDto> getUserRegistrationStats() {
        log.info("Fetching user registration stats for admin dashboard");
        return userRepository.findUserRegistrationStatsForLast30Days();
    }

    private UserAdminDto toUserAdminDto(User user) {
        return new UserAdminDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getLastName(),
                user.getGender(),
                user.getNumberOfPets(),
                user.getProfileDescription(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
