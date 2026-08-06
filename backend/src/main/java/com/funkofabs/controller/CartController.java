package com.funkofabs.controller;

import com.funkofabs.dto.CartItemRequest;
import com.funkofabs.entity.Cart;
import com.funkofabs.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/cart") @RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(Authentication auth) { return ResponseEntity.ok(cartService.getCart(auth.getName())); }

    @PostMapping("/items")
    public ResponseEntity<Cart> addItem(Authentication auth, @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(auth.getName(), request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<Cart> updateItem(Authentication auth, @PathVariable Long itemId, @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateItemQuantity(auth.getName(), itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Cart> removeItem(Authentication auth, @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(auth.getName(), itemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication auth) { cartService.clearCart(auth.getName()); return ResponseEntity.noContent().build(); }
}
