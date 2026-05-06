package com.finant.service;

import com.finant.dto.request.LoginRequest;
import com.finant.dto.request.RegisterRequest;
import com.finant.dto.response.AuthResponse;
import com.finant.entity.Account;
import com.finant.entity.User;
import com.finant.repository.AccountRepository;
import com.finant.repository.UserRepository;
import com.finant.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }
        if (userRepository.existsByDocument(request.getDocument())) {
            throw new RuntimeException("El documento ya está registrado");
        }

        // Crear usuario con contraseña encriptada
        User user = User.builder()
                .name(request.getName())
                .document(request.getDocument())
                .phone(request.getPhone())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .securityQuestion(request.getSecurityQuestion())
                .securityAnswer(request.getSecurityAnswer())
                .build();

        userRepository.save(user);

        // Crear las 3 cuentas automáticamente al registrar
        List<String> accountTypes = List.of("Efectivo", "Ahorros", "Inversiones");
        for (String type : accountTypes) {
            Account account = Account.builder()
                    .user(user)
                    .type(type)
                    .balance(BigDecimal.ZERO)
                    .build();
            accountRepository.save(account);
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getName(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getName(), user.getEmail());
    }
}