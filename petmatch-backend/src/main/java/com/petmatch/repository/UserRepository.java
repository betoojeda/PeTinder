package com.petmatch.repository;

import com.petmatch.dto.UserRegistrationStatsDto;
import com.petmatch.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT new com.petmatch.dto.UserRegistrationStatsDto(CAST(u.createdAt AS java.time.LocalDate), COUNT(u.id)) " +
           "FROM User u " +
           "WHERE CAST(u.createdAt AS java.time.LocalDate) >= FUNCTION('DATE_ADD', CURRENT_DATE, -30, 'DAY') " +
           "GROUP BY CAST(u.createdAt AS java.time.LocalDate) " +
           "ORDER BY CAST(u.createdAt AS java.time.LocalDate) ASC")
    List<UserRegistrationStatsDto> findUserRegistrationStatsForLast30Days();
}
