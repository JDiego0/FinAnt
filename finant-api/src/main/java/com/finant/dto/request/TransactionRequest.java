package com.finant.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionRequest {

    @NotNull
    private Long accountId;

    @NotBlank
    private String type; // "income" | "expense"

    @NotNull
    private LocalDate date;

    private String description;

    @NotNull
    @Positive(message = "El monto debe ser positivo")
    private BigDecimal amount;

    private Boolean applied = true;
}