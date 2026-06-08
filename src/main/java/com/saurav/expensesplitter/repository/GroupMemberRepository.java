package com.saurav.expensesplitter.repository;

import com.saurav.expensesplitter.model.Group;
import com.saurav.expensesplitter.model.GroupMember;
import com.saurav.expensesplitter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {

    List<GroupMember> findByGroup(Group group);

    List<GroupMember> findByUser(User user);

    Optional<GroupMember> findByGroupAndUser(Group group, User user);

    Boolean existsByGroupAndUser(Group group, User user);
}
