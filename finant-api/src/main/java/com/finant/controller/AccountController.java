package com.finant.controller;

import com.finant.dto.request.AdjustBalanceRequest;
import com.finant.dto.response.AccountResponse;
import com.finant.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAccounts(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                accountService.getAccountsByUser(userDetails.getUsername())
        );
    }

    @PatchMapping("/{id}/balance")
    public ResponseEntity<AccountResponse> adjustBalance(
            @PathVariable Long id,
            @Valid @RequestBody AdjustBalanceRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                accountService.adjustBalance(id, request, userDetails.getUsername())
        );
    }
}