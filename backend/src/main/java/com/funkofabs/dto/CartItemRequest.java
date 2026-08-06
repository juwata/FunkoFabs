package com.funkofabs.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CartItemRequest {
    @NotNull private Long productId;
    @NotNull @Positive private Integer quantity;
}
