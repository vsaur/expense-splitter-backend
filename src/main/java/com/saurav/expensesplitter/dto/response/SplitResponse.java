package com.saurav.expensesplitter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SplitResponse {
    private Long id;
    private Long expenseId;

    private UserResponse owedBy;
    private UserResponse owedTo;
    private BigDecimal amountOwed;
    private Boolean isSettled;

}
