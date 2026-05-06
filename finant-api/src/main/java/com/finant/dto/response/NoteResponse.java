package com.finant.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NoteResponse {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
}