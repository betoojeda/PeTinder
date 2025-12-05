package com.petmatch.controller;

import com.petmatch.dto.PetDto;
import com.petmatch.dto.UserAdminDto;
import com.petmatch.dto.UserRegistrationStatsDto;
import com.petmatch.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Asegurar que solo los admins puedan acceder
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public List<UserAdminDto> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/pets")
    public List<PetDto> getAllPets() {
        return adminService.getAllPets();
    }

    @GetMapping("/stats/user-registrations")
    public List<UserRegistrationStatsDto> getUserRegistrationStats() {
        return adminService.getUserRegistrationStats();
    }
}
