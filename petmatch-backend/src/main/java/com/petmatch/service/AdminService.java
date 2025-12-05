package com.petmatch.service;

import com.petmatch.dto.PetDto;
import com.petmatch.dto.UserAdminDto;
import com.petmatch.dto.UserRegistrationStatsDto;

import java.util.List;

public interface AdminService {
    List<UserAdminDto> getAllUsers();
    List<PetDto> getAllPets();
    List<UserRegistrationStatsDto> getUserRegistrationStats();
}
