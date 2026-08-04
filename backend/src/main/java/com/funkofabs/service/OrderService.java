package com.funkofabs.service;

import com.funkofabs.dto.OrderResponse;
import com.funkofabs.entity.*;
import com.funkofabs.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;


    @Transactional
    public OrderResponse checkout(String email) {
        Cart cart = cartService.getCart(email);
        if (cart.getItems().isEmpty()) throw new RuntimeException("Carrinho vazio");

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Order order = Order.builder().user(user).total(BigDecimal.ZERO).build();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem ci : cart.getItems()) {
            Product p = ci.getProduct();
            if (p.getStock() < ci.getQuantity()) throw new RuntimeException("Estoque insuficiente: " + p.getName());
            p.setStock(p.getStock() - ci.getQuantity());
            productRepository.save(p);

            BigDecimal itemTotal = p.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity()));
            total = total.add(itemTotal);
            order.getItems().add(OrderItem.builder().order(order).product(p).quantity(ci.getQuantity()).unitPrice(p.getPrice()).build());
        }
        order.setTotal(total);

        order = orderRepository.save(order);

        paymentRepository.save(
                Payment.builder()
                        .order(order)
                        .build()
        );

        cartService.clearCart(email);

        return toResponse(order);
    }

    public List<OrderResponse> getHistory(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public OrderResponse updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        order.setStatus(status);
        return toResponse(orderRepository.save(order));
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    private OrderResponse toResponse(Order o) {
        return OrderResponse.builder().id(o.getId()).total(o.getTotal()).status(o.getStatus())
                .createdAt(o.getCreatedAt())
                .items(o.getItems().stream().map(i -> OrderResponse.OrderItemResponse.builder()
                        .productId(i.getProduct().getId()).productName(i.getProduct().getName())
                        .quantity(i.getQuantity()).unitPrice(i.getUnitPrice()).build()).collect(Collectors.toList()))
                .build();
    }
}
