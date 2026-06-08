package com.saurav.expensesplitter.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateGroupRequest {

    @NotBlank(message = "group name is required")
    private String name;

    private String description;
}
