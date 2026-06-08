package com.saurav.expensesplitter.repository;

import com.saurav.expensesplitter.model.Expense;
import com.saurav.expensesplitter.model.Group;
import com.saurav.expensesplitter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByGroup(Group group);

    List<Expense> findByPaidBy(User paidBy);

    List<Expense> findByGroupAndPaidBy(Group group, User paidBy);

}
