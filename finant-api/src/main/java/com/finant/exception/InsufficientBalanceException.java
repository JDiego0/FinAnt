package com.finant.exception;

import lombok.Getter;

import java.math.BigDecimal;

/**
 * Excepción lanzada cuando una cuenta no tiene saldo suficiente
 * para aplicar un egreso o traslado.
 */
@Getter
public class InsufficientBalanceException extends RuntimeException {

    private final String accountType;
    private final BigDecimal currentBalance;
    private final BigDecimal requiredAmount;

    public InsufficientBalanceException(String accountType, BigDecimal currentBalance, BigDecimal requiredAmount) {
        super(String.format(
                "Saldo insuficiente en %s. Saldo actual: %s, monto requerido: %s",
                accountType, currentBalance.toPlainString(), requiredAmount.toPlainString()
        ));
        this.accountType = accountType;
        this.currentBalance = currentBalance;
        this.requiredAmount = requiredAmount;
    }
}
