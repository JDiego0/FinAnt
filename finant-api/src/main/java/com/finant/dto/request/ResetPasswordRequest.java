package com.finant.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {

    @NotBlank(message = "El token es obligatorio")
    private String token;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "Mínimo 6 caracteres")
    private String newPassword;

    @NotBlank(message = "Confirma tu contraseña")
    private String confirmPassword;
}