package com.finant.service;

import com.finant.dto.request.TransactionRequest;
import com.finant.dto.response.TransactionResponse;
import com.finant.entity.Account;
import com.finant.entity.Transaction;
import com.finant.entity.User;
import com.finant.repository.AccountRepository;
import com.finant.repository.TransactionRepository;
import com.finant.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public List<TransactionResponse> getTransactionsByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Long> accountIds = accountRepository.findByUserId(user.getId())
                .stream().map(Account::getId).collect(Collectors.toList());

        return transactionRepository.findByAccountIdInOrderByDateDescIdDesc(accountIds)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request, String email) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        // Seguridad: verificar que la cuenta es del usuario
        if (!account.getUser().getEmail().equals(email)) {
            throw new RuntimeException("No autorizado");
        }

        // ── Traslado entre cuentas ──
        if ("transfer".equals(request.getType())) {
            return createTransfer(request, account, email);
        }

        Transaction transaction = Transaction.builder()
                .account(account)
                .type(request.getType())
                .date(request.getDate())
                .description(request.getDescription())
                .amount(request.getAmount())
                .applied(request.getApplied())
                .build();

        // Si se crea ya aplicada, afecta el saldo inmediatamente
        if (Boolean.TRUE.equals(request.getApplied())) {
            applyToBalance(account, transaction);
            accountRepository.save(account);
        }

        transactionRepository.save(transaction);
        return toResponse(transaction);
    }

    /**
     * Crea un traslado atómico: egreso en cuenta origen e ingreso en cuenta destino.
     */
    private TransactionResponse createTransfer(TransactionRequest request, Account origin, String email) {
        if (request.getDestinationAccountId() == null) {
            throw new RuntimeException("La cuenta destino es obligatoria para traslados");
        }
        if (request.getDestinationAccountId().equals(request.getAccountId())) {
            throw new RuntimeException("La cuenta destino debe ser diferente a la cuenta origen");
        }

        Account destination = accountRepository.findById(request.getDestinationAccountId())
                .orElseThrow(() -> new RuntimeException("Cuenta destino no encontrada"));

        // Verificar que la cuenta destino pertenece al mismo usuario
        if (!destination.getUser().getEmail().equals(email)) {
            throw new RuntimeException("No autorizado: la cuenta destino no pertenece al usuario");
        }

        String description = "Traslado entre cuentas";

        // Un solo registro: traslado desde origen hacia destino
        Transaction transfer = Transaction.builder()
                .account(origin)
                .type("transfer")
                .destinationAccountId(destination.getId())
                .date(request.getDate())
                .description(description)
                .amount(request.getAmount())
                .applied(true)
                .build();

        // Actualizar saldos de ambas cuentas
        origin.setBalance(origin.getBalance().subtract(request.getAmount()));
        destination.setBalance(destination.getBalance().add(request.getAmount()));

        accountRepository.save(origin);
        accountRepository.save(destination);
        transactionRepository.save(transfer);

        return toResponse(transfer);
    }

    @Transactional
    public TransactionResponse toggleApplied(Long transactionId, String email) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado"));

        // No permitir toggle en traslados
        if ("transfer".equals(transaction.getType())) {
            throw new RuntimeException("Los traslados no pueden cambiar de estado");
        }

        Account account = transaction.getAccount();

        if (!account.getUser().getEmail().equals(email)) {
            throw new RuntimeException("No autorizado");
        }

        boolean wasApplied = Boolean.TRUE.equals(transaction.getApplied());

        // Revertir o aplicar según estado actual
        if (wasApplied) {
            revertFromBalance(account, transaction);
        } else {
            applyToBalance(account, transaction);
        }

        transaction.setApplied(!wasApplied);
        accountRepository.save(account);
        transactionRepository.save(transaction);

        return toResponse(transaction);
    }

    @Transactional
    public void deleteTransaction(Long transactionId, String email) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado"));

        if (!transaction.getAccount().getUser().getEmail().equals(email)) {
            throw new RuntimeException("No autorizado");
        }

        transactionRepository.delete(transaction);
    }

    // --- Métodos privados de lógica financiera ---

    private void applyToBalance(Account account, Transaction transaction) {
        if ("income".equals(transaction.getType())) {
            account.setBalance(account.getBalance().add(transaction.getAmount()));
        } else {
            account.setBalance(account.getBalance().subtract(transaction.getAmount()));
        }
    }

    private void revertFromBalance(Account account, Transaction transaction) {
        if ("income".equals(transaction.getType())) {
            account.setBalance(account.getBalance().subtract(transaction.getAmount()));
        } else {
            account.setBalance(account.getBalance().add(transaction.getAmount()));
        }
    }

    private TransactionResponse toResponse(Transaction t) {
        TransactionResponse response = new TransactionResponse();
        response.setId(t.getId());
        response.setAccountId(t.getAccount().getId());
        response.setType(t.getType());
        response.setDate(t.getDate());
        response.setDescription(t.getDescription());
        response.setAmount(t.getAmount());
        response.setApplied(t.getApplied());
        response.setDestinationAccountId(t.getDestinationAccountId());
        return response;
    }
}