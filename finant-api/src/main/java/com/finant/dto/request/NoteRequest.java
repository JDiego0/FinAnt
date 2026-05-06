package com.finant.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NoteRequest {

    @NotBlank(message = "El título es obligatorio")
    private String title;

    private String content;
}
