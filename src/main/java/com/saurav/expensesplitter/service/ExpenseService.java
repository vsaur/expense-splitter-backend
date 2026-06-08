package com.saurav.expensesplitter.service;

import com.saurav.expensesplitter.dto.response.UserResponse;
import com.saurav.expensesplitter.exception.UnAuthorizedException;
import com.saurav.expensesplitter.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.saurav.expensesplitter.dto.request.AddExpenseRequest;
import com.saurav.expensesplitter.dto.response.ExpenseResponse;

import com.saurav.expensesplitter.exception.ResourceNotFoundException;

import com.saurav.expensesplitter.model.Expense;
import com.saurav.expensesplitter.model.ExpenseSplit;
import com.saurav.expensesplitter.model.Group;
import com.saurav.expensesplitter.model.User;
import com.saurav.expensesplitter.repository.ExpenseRepository;
import com.saurav.expensesplitter.repository.ExpenseSplitRepository;
import com.saurav.expensesplitter.repository.GroupMemberRepository;
import com.saurav.expensesplitter.repository.GroupRepository;
import com.saurav.expensesplitter.repository.UserRepository;

import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + email
                ));
    }

    public ExpenseResponse addExpense(Long groupId, AddExpenseRequest request) {
        User currentUser = getCurrentUser();

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Group not found with id: " + groupId
                ));

        if (!groupMemberRepository.existsByGroupAndUser(group, currentUser)) {
            throw new UnAuthorizedException(
                    "You are not a member of this group"
            );
        }

        User paidBy = userRepository.findById(request.getPaidByUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + request.getPaidByUserId()
                ));

        Expense expense = new Expense();
        expense.setGroup(group);
        expense.setPaidBy(paidBy);
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expenseRepository.save(expense);

        BigDecimal splitAmount = request.getAmount()
                .divide(BigDecimal.valueOf(request.getSplitMemberIds().size()),
                        2, RoundingMode.HALF_UP);

        for (Long memberId : request.getSplitMemberIds()) {
            User memberUser = userRepository.findById(memberId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "User not found with id: " + memberId
                    ));

            ExpenseSplit split = new ExpenseSplit();
            split.setExpense(expense);
            split.setUser(memberUser);
            split.setAmountOwed(splitAmount);
            split.setIsSettled(memberId.equals(request.getPaidByUserId()));
            expenseSplitRepository.save(split);
        }

        return buildExpenseResponse(expense);
    }
    public List<ExpenseResponse> getGroupExpenses(Long groupId) {
        User currentUser = getCurrentUser();

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Group not found with id: " + groupId
                ));

        if (!groupMemberRepository.existsByGroupAndUser(group, currentUser)) {
            throw new UnAuthorizedException(
                    "You are not a member of this group"
            );
        }

        List<Expense> expenses = expenseRepository.findByGroup(group);

        return expenses.stream()
                .map(this::buildExpenseResponse)
                .toList();
    }

    public ExpenseResponse getExpenseById(Long expenseId) {
        User currentUser = getCurrentUser();

        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Expense not found with id: " + expenseId
                ));

        if (!groupMemberRepository.existsByGroupAndUser(
                expense.getGroup(), currentUser)) {
            throw new UnAuthorizedException(
                    "You are not a member of this group"
            );
        }

        return buildExpenseResponse(expense);
    }

    private ExpenseResponse buildExpenseResponse(Expense expense) {
        UserResponse paidByResponse = new UserResponse(
                expense.getPaidBy().getId(),
                expense.getPaidBy().getName(),
                expense.getPaidBy().getEmail(),
                expense.getPaidBy().getCreatedAt()
        );

        return new ExpenseResponse(
                expense.getId(),
                expense.getDescription(),
                expense.getAmount(),
                paidByResponse,
                expense.getGroup().getId(),
                expense.getCreatedAt()
        );
    }

}
