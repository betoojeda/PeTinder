package com.petinder.service;

import com.petinder.dto.MatchDto;

import java.util.List;

public interface MatchService {
    List<MatchDto> getMatchesForUser(Long userId);
}
