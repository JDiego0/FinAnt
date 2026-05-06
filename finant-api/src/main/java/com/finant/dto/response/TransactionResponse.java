package com.finant.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionResponse {
    private Long id;
    private Long accountId;
    private String type;
    private LocalDate date;
    private String description;
    private BigDecimal amount;
    private Boolean applied;
}