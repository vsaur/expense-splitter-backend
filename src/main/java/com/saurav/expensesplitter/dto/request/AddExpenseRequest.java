package com.saurav.expensesplitter.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class AddExpenseRequest {

    @NotBlank(message = "description is required")
    private String description;

    @NotNull(message = "amount is required")
    @DecimalMin(value = "0.1", message = "amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "paid by user is required")
    private Long paidByUserId;

    @NotEmpty(message = "please select at least one member  to split with")
    private List<Long> splitMemberIds;
}
