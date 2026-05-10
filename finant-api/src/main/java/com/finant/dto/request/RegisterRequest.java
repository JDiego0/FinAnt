package com.finant.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "El documento es obligatorio")
    private String document;

    private String phone;

    @Email(message = "Correo inválido")
    @NotBlank(message = "El correo es obligatorio")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "Mínimo 6 caracteres")
    private String password;
}