package com.finant.controller;

import com.finant.dto.request.TransactionRequest;
import com.finant.dto.response.TransactionResponse;
import com.finant.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                transactionService.getTransactionsByUser(userDetails.getUsername())
        );
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> create(
            @Valid @RequestBody TransactionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                transactionService.createTransaction(request, userDetails.getUsername())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                transactionService.updateTransaction(id, request, userDetails.getUsername())
        );
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TransactionResponse> toggle(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                transactionService.toggleApplied(id, userDetails.getUsername())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        transactionService.deleteTransaction(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}