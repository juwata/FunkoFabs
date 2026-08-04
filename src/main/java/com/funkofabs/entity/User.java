package com.funkofabs.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(name = "nome", nullable = false)
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "senha", nullable = false)
    @JsonIgnore
    private String password;

    @Column(name = "telefone")
    private String phone;

    // Não existe no banco
    @Transient
    private String photoUrl;

    // Não existe no banco
    @Enumerated(EnumType.STRING)
    @Transient
    private Role role;

    @Column(name = "data_cadastro", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        CUSTOMER,
        ADMIN
    }
}