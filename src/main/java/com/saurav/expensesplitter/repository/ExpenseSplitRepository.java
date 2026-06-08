package com.saurav.expensesplitter.repository;

import com.saurav.expensesplitter.model.Expense;
import com.saurav.expensesplitter.model.ExpenseSplit;
import com.saurav.expensesplitter.model.Group;
import com.saurav.expensesplitter.model.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Long> {

    List<ExpenseSplit> findByExpense(Expense expense);

    List<ExpenseSplit> findByUserAndIsSettled(User user, Boolean isSettled);

    @Query("SELECT es FROM ExpenseSplit es WHERE es.expense.group = :group AND es.isSettled = false")
    List<ExpenseSplit> findUnsettledSplitsByGroup(@Param("group") Group group);

    @Query("SELECT es FROM ExpenseSplit es WHERE es.user = :user AND es.expense.group = :group AND es.isSettled = false")
    List<ExpenseSplit> findUnsettledSplitsByUserAndGroup(@Param("user") User user, @Param("group") Group group);

}
