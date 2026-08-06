package com.funkofabs.controller;

import com.funkofabs.dto.PaymentResponse;
import com.funkofabs.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable Long orderId) {

        return ResponseEntity.ok(paymentService.findByOrder(orderId));

    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> approve(@PathVariable Long id) {

        return ResponseEntity.ok(paymentService.approve(id));

    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> reject(@PathVariable Long id) {

        return ResponseEntity.ok(paymentService.reject(id));

    }

}