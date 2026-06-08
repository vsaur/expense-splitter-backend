package com.saurav.expensesplitter.service;

import com.saurav.expensesplitter.dto.response.SplitResponse;
import com.saurav.expensesplitter.dto.response.UserResponse;
import com.saurav.expensesplitter.exception.ResourceNotFoundException;
import com.saurav.expensesplitter.exception.UnAuthorizedException;

import com.saurav.expensesplitter.model.ExpenseSplit;
import com.saurav.expensesplitter.model.Group;
import com.saurav.expensesplitter.model.User;
import com.saurav.expensesplitter.repository.ExpenseSplitRepository;
import com.saurav.expensesplitter.repository.GroupMemberRepository;
import com.saurav.expensesplitter.repository.GroupRepository;
import com.saurav.expensesplitter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SettlementService {

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

    public List<SplitResponse> getSettlements(Long groupId) {
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

        List<ExpenseSplit> unsettledSplits = expenseSplitRepository
                .findUnsettledSplitsByGroup(group);

        return unsettledSplits.stream()
                .map(this::buildSplitResponse)
                .toList();
    }

    public SplitResponse settleUp(Long splitId) {
        User currentUser = getCurrentUser();

        ExpenseSplit split = expenseSplitRepository.findById(splitId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Split not found with id: " + splitId
                ));

        if (!split.getUser().getId().equals(currentUser.getId())) {
            throw new UnAuthorizedException(
                    "You can only settle your own debts"
            );
        }

        split.setIsSettled(true);
        expenseSplitRepository.save(split);

        return buildSplitResponse(split);
    }

    private SplitResponse buildSplitResponse(ExpenseSplit split) {
        UserResponse owedByResponse = new UserResponse(
                split.getUser().getId(),
                split.getUser().getName(),
                split.getUser().getEmail(),
                split.getUser().getCreatedAt()
        );

        UserResponse owedToResponse = new UserResponse(
                split.getExpense().getPaidBy().getId(),
                split.getExpense().getPaidBy().getName(),
                split.getExpense().getPaidBy().getEmail(),
                split.getExpense().getPaidBy().getCreatedAt()
        );

        return new SplitResponse(
                split.getId(),
                split.getExpense().getId(),
                owedByResponse,
                owedToResponse,
                split.getAmountOwed(),
                split.getIsSettled()
        );
    }
}