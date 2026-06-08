package com.saurav.expensesplitter.repository;

import com.saurav.expensesplitter.model.Group;
import com.saurav.expensesplitter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

    List<Group> findByCreatedby(User createdBy);
}
