package com.finant.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AccountResponse {
    private Long id;
    private String type;
    private BigDecimal balance;
}