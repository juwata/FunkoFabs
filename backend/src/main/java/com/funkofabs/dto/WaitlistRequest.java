package com.funkofabs.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WaitlistRequest {
    @NotBlank(message = "E-mail não pode ser vazio")
    @Email(message = "Por favor, digite um e-mail válido")
    private String email;
}
