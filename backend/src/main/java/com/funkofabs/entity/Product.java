package com.funkofabs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "produto")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produto")
    private Long id;

    @Column(name = "nome", nullable = false)
    private String name;

    @Column(name = "descricao")
    private String description;

    @Column(name = "preco", nullable = false)
    private BigDecimal price;

    @Column(name = "estoque", nullable = false)
    private Integer stock;

    @Column(name = "imagem_url")
    private String imageUrl;
}