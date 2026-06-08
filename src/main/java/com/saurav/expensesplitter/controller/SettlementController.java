package com.saurav.expensesplitter.controller;

import com.saurav.expensesplitter.dto.response.SplitResponse;
import com.saurav.expensesplitter.service.SettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/settlements")
@RequiredArgsConstructor
public class SettlementController {

    private final SettlementService settlementService;

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<SplitResponse>> getSettlements(
            @PathVariable Long groupId) {
        List<SplitResponse> response = settlementService.getSettlements(groupId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/settle/{splitId}")
    public ResponseEntity<SplitResponse> settleUp(
            @PathVariable Long splitId) {
        SplitResponse response = settlementService.settleUp(splitId);
        return ResponseEntity.ok(response);
    }
}