package com.finant.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AdjustBalanceRequest {

    @NotNull
    private BigDecimal newBalance;
}