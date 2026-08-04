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

    @Column(name = "endereco")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    @Builder.Default
    private Role role = Role.CUSTOMER;

    @Column(name = "foto_url")
    private String photoUrl;

    @Column(name = "data_cadastro", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum Role {
        CUSTOMER,
        ADMIN
    }
}