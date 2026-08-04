package com.funkofabs.controller;

import com.funkofabs.dto.OrderResponse;
import com.funkofabs.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @RequestMapping("/api/orders") @RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(Authentication auth) { return ResponseEntity.ok(orderService.checkout(auth.getName())); }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getHistory(Authentication auth) { return ResponseEntity.ok(orderService.getHistory(auth.getName())); }
}
