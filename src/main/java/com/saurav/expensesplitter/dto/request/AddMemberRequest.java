package com.saurav.expensesplitter.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddMemberRequest {

    @NotBlank(message = "email is required")
    @Email(message = "provide a valid email")
    private String email;
}
