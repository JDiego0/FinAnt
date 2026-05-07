package com.finant.controller;

import com.finant.dto.request.ForgotPasswordRequest;
import com.finant.dto.request.ResetPasswordRequest;
import com.finant.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.requestReset(request);
        // Siempre responder 200 para no revelar si el email existe
        return ResponseEntity.ok(Map.of(
                "message", "Si el correo existe, recibirás un enlace de recuperación"
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada correctamente"));
    }

    @GetMapping("/validate-token")
    public ResponseEntity<Map<String, Boolean>> validateToken(@RequestParam String token) {
        boolean valid = passwordResetService.validateToken(token);
        return ResponseEntity.ok(Map.of("valid", valid));
    }
}