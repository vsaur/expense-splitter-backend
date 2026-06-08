package com.saurav.expensesplitter.service;

import com.saurav.expensesplitter.dto.request.AddMemberRequest;
import com.saurav.expensesplitter.dto.request.CreateGroupRequest;
import com.saurav.expensesplitter.dto.response.GroupResponse;
import com.saurav.expensesplitter.dto.response.UserResponse;
import com.saurav.expensesplitter.exception.EmailAlreadyExistsException;
import com.saurav.expensesplitter.exception.ResourceNotFoundException;
import com.saurav.expensesplitter.exception.UnAuthorizedException;
import com.saurav.expensesplitter.model.Group;
import com.saurav.expensesplitter.model.GroupMember;
import com.saurav.expensesplitter.model.User;
import com.saurav.expensesplitter.repository.GroupMemberRepository;
import com.saurav.expensesplitter.repository.GroupRepository;
import com.saurav.expensesplitter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private  final UserRepository userRepository;

   private User getCurrentUser(){
       String email = SecurityContextHolder.getContext()
               .getAuthentication().getName();

       return userRepository.findByEmail(email)
               .orElseThrow(()-> new ResourceNotFoundException(
                       "User not found with email: "+email));
   }

   public GroupResponse CreateGroup(CreateGroupRequest request){
       User currentUser = getCurrentUser();

       Group group = new Group();
       group.setName(request.getName());
       group.setDescription(request.getDescription());
       group.setCreatedby(currentUser);

       groupRepository.save(group);

       GroupMember member = new GroupMember();
       member.setGroup(group);
       member.setUser(currentUser);
       groupMemberRepository.save(member);

       return buildGroupResponse(group);
   }

   public GroupResponse addMember(Long groupId, AddMemberRequest request){
       User currentUser = getCurrentUser();

       Group group = groupRepository.findById(groupId)
               .orElseThrow(()-> new ResourceNotFoundException(
                       "Group not found" +groupId
               ));

       if(!group.getCreatedby().getId().equals(currentUser.getId())){
           throw new UnAuthorizedException(
                   "Only the group creator can add members"
           );
       }

       User newMember = userRepository.findByEmail(request.getEmail())
               .orElseThrow(()-> new ResourceNotFoundException(
                       "User not found with email" + request.getEmail()
               ));

       if(groupMemberRepository.existsByGroupAndUser(group, newMember)){
           throw new EmailAlreadyExistsException(
                   "User is alredy a memebr of this group"
           );
       }
       GroupMember member = new GroupMember();
       member.setGroup(group);
       member.setUser(newMember);
       groupMemberRepository.save(member);

       return buildGroupResponse(group);
   }
    public GroupResponse getGroupById(Long groupId) {
        User currentUser = getCurrentUser();

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Group not found with id: " + groupId
                ));

        if (!groupMemberRepository.existsByGroupAndUser(group, currentUser)) {
            throw new UnAuthorizedException(
                    "You are not a memeber of this group"
            );
        }

        return buildGroupResponse(group);
    }

    public List<GroupResponse> getMyGroups() {
        User currentUser = getCurrentUser();

        List<GroupMember> memberships = groupMemberRepository
                .findByUser(currentUser);

        return memberships.stream()
                .map(membership -> buildGroupResponse(membership.getGroup()))
                .toList();
    }

    private GroupResponse buildGroupResponse(Group group) {
        UserResponse createdByResponse = new UserResponse(
                group.getCreatedby().getId(),
                group.getCreatedby().getName(),
                group.getCreatedby().getEmail(),
                group.getCreatedby().getCreatedAt()
        );

        return new GroupResponse(
                group.getId(),
                group.getName(),
                group.getDescription(),
                createdByResponse,
                group.getCreatedAt()
        );
    }
}
