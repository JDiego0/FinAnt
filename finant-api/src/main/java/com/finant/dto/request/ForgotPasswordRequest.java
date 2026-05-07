package com.finant.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequest {

    @Email(message = "Correo inválido")
    @NotBlank(message = "El correo es obligatorio")
    private String email;
}