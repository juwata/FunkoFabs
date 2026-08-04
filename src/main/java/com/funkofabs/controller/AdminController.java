package com.funkofabs.controller;

import com.funkofabs.dto.*;
import com.funkofabs.entity.*;
import com.funkofabs.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @RequestMapping("/api/admin") @PreAuthorize("hasRole('ADMIN')") @RequiredArgsConstructor
public class AdminController {
    private final ProductService productService;
    private final OrderService orderService;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductRequest request) { return ResponseEntity.ok(productService.create(request)); }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) { return ResponseEntity.ok(productService.update(id, request)); }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) { productService.delete(id); return ResponseEntity.noContent().build(); }

    @PutMapping("/products/{id}/stock")
    public ResponseEntity<Product> updateStock(@PathVariable Long id, @RequestParam Integer stock) {
        Product p = productService.findById(id);
        ProductRequest r = new ProductRequest();
        r.setName(p.getName()); r.setDescription(p.getDescription()); r.setPrice(p.getPrice());
        r.setImageUrl(p.getImageUrl()); r.setStock(stock);
        return ResponseEntity.ok(productService.update(id, r));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() { return ResponseEntity.ok(orderService.getAllOrders()); }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}
