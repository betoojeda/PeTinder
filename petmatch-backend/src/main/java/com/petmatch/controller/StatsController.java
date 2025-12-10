package com.petmatch.controller;

import com.petmatch.dto.PublicStatsDto;
import com.petmatch.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/public")
    public PublicStatsDto getPublicStats() {
        return statsService.getPublicStats();
    }
}
