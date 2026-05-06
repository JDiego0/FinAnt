package com.finant.service;

import com.finant.dto.response.AccountResponse;
import com.finant.dto.request.AdjustBalanceRequest;
import com.finant.entity.Account;
import com.finant.entity.User;
import com.finant.repository.AccountRepository;
import com.finant.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public List<AccountResponse> getAccountsByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return accountRepository.findByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AccountResponse adjustBalance(Long accountId, AdjustBalanceRequest request, String email) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        // Verificar que la cuenta pertenece al usuario autenticado
        if (!account.getUser().getEmail().equals(email)) {
            throw new RuntimeException("No autorizado");
        }

        account.setBalance(request.getNewBalance());
        accountRepository.save(account);
        return toResponse(account);
    }

    private AccountResponse toResponse(Account account) {
        AccountResponse response = new AccountResponse();
        response.setId(account.getId());
        response.setType(account.getType());
        response.setBalance(account.getBalance());
        return response;
    }
}