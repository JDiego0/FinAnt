package com.finant.service;

import com.finant.dto.request.ForgotPasswordRequest;
import com.finant.dto.request.ResetPasswordRequest;
import com.finant.entity.PasswordResetToken;
import com.finant.entity.User;
import com.finant.repository.PasswordResetTokenRepository;
import com.finant.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.reset.token.expiration:30}")
    private int expirationMinutes;

    @Transactional
    public void requestReset(ForgotPasswordRequest request) {
        // Siempre responder igual para no revelar si el email existe
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            // Eliminar tokens anteriores del usuario
            tokenRepository.deleteByUserId(user.getId());

            String token = UUID.randomUUID().toString();

            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .user(user)
                    .token(token)
                    .expiresAt(LocalDateTime.now().plusMinutes(expirationMinutes))
                    .used(false)
                    .build();

            tokenRepository.save(resetToken);

            try {
                emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), token);
            } catch (Exception e) {
                log.error("No se pudo enviar correo de recuperación a {}: {}",
                        user.getEmail(), e.getMessage());
            }
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Las contraseñas no coinciden");
        }

        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Token inválido o expirado"));

        if (!resetToken.isValid()) {
            throw new RuntimeException("El enlace ha expirado o ya fue utilizado");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        log.info("Contraseña actualizada para: {}", user.getEmail());
    }

    // Validar token (para que el frontend verifique antes de mostrar el form)
    public boolean validateToken(String token) {
        return tokenRepository.findByToken(token)
                .map(PasswordResetToken::isValid)
                .orElse(false);
    }
}