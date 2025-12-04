package com.petinder.dto;

public class SwipeResponseDto {
    private boolean matched;
    private Long matchId;

    public SwipeResponseDto() {}
    public SwipeResponseDto(boolean matched, Long matchId) {
        this.matched = matched;
        this.matchId = matchId;
    }

    public boolean isMatched() { return matched; }
    public void setMatched(boolean matched) { this.matched = matched; }
    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }
}
