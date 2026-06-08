package com.saurav.expensesplitter.controller;

import com.saurav.expensesplitter.dto.request.AddExpenseRequest;
import com.saurav.expensesplitter.dto.response.ExpenseResponse;
import com.saurav.expensesplitter.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping("/{groupId}/expenses")
    public ResponseEntity<ExpenseResponse> addExpense(
            @PathVariable Long groupId,
            @RequestBody @Valid AddExpenseRequest request) {
        ExpenseResponse response = expenseService.addExpense(groupId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{groupId}/expenses")
    public ResponseEntity<List<ExpenseResponse>> getGroupExpenses(
            @PathVariable Long groupId) {
        List<ExpenseResponse> response = expenseService.getGroupExpenses(groupId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/expenses/{expenseId}")
    public ResponseEntity<ExpenseResponse> getExpenseById(
            @PathVariable Long expenseId) {
        ExpenseResponse response = expenseService.getExpenseById(expenseId);
        return ResponseEntity.ok(response);
    }
}