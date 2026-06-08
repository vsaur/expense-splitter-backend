package com.saurav.expensesplitter.controller;

import com.saurav.expensesplitter.dto.request.AddMemberRequest;
import com.saurav.expensesplitter.dto.request.CreateGroupRequest;
import com.saurav.expensesplitter.dto.response.GroupResponse;
import com.saurav.expensesplitter.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;
    @PostMapping
    public ResponseEntity<GroupResponse> createGroup(@RequestBody @Valid CreateGroupRequest request) {
        GroupResponse response = groupService.CreateGroup(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<GroupResponse> addMember(@PathVariable Long groupId,
                                                   @RequestBody @Valid AddMemberRequest request) {
        GroupResponse response = groupService.addMember(groupId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<GroupResponse> getGroupById(@PathVariable Long groupId) {
        GroupResponse response = groupService.getGroupById(groupId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<GroupResponse>> getMyGroups() {
        List<GroupResponse> response = groupService.getMyGroups();
        return ResponseEntity.ok(response);
    }

}
