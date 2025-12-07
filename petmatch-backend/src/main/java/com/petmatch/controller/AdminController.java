package com.petmatch.controller;

import com.petmatch.dto.PetDto;
import com.petmatch.dto.UserAdminDto;
import com.petmatch.dto.UserRegistrationStatsDto;
import com.petmatch.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private static final String ERROR_LOG_PATH = "./logs/ErroresPetmatchBack.log";

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

    @GetMapping(value = "/logs/errors", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> getErrorLog() {
        Resource resource = new FileSystemResource(ERROR_LOG_PATH);
        if (!resource.exists()) {
            return ResponseEntity.ok("El archivo de log de errores no existe o está vacío.");
        }
        try {
            // Leemos las últimas 200 líneas para no sobrecargar la respuesta
            List<String> lines = Files.readAllLines(Paths.get(ERROR_LOG_PATH));
            Collections.reverse(lines);
            String content = lines.stream().limit(200).collect(Collectors.joining("\n"));
            return ResponseEntity.ok(content);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error al leer el archivo de log: " + e.getMessage());
        }
    }
}
