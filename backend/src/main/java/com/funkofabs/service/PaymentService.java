package com.funkofabs.service;

import com.funkofabs.dto.PaymentResponse;
import com.funkofabs.entity.Payment;
import com.funkofabs.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentResponse approve(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado"));

        payment.setApproval("aprovado");

        paymentRepository.save(payment);

        return toResponse(payment);
    }

    public PaymentResponse reject(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado"));

        payment.setApproval("rejeitado");

        paymentRepository.save(payment);

        return toResponse(payment);
    }

    public PaymentResponse findByOrder(Long orderId) {

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado"));

        return toResponse(payment);
    }

    private PaymentResponse toResponse(Payment payment) {

        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .approval(payment.getApproval())
                .paymentDate(payment.getPaymentDate())
                .build();

    }
}