package com.petinder.dto;

import lombok.Data;

@Data
public class MessageDto {
    private Long matchId;
    private Long senderUserId;
    private String text;
}
