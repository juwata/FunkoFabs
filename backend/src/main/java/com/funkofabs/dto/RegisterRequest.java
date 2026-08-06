package com.funkofabs.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank private String name;
    @NotBlank @Email private String email;
    @NotBlank 
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[!@#$%^&*(),.?\":{}|<>]).{6,}$", message = "A senha deve ter no mínimo 6 caracteres, 1 número e 1 caractere especial")
    private String password;
    private String phone;
    private String photoUrl;
}
