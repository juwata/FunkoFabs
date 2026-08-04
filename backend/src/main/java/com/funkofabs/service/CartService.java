package com.funkofabs.service;

import com.funkofabs.dto.CartItemRequest;
import com.funkofabs.entity.*;
import com.funkofabs.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Cart getCart(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart cart = Cart.builder()
                            .user(user)
                            .build();

                    return cartRepository.save(cart);
                });
    }

    @Transactional
    public Cart addItem(String email, CartItemRequest request) {
        Cart cart = getCart(email);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        var existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(request.getProductId())).findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + request.getQuantity());
        } else {
            cart.getItems().add(CartItem.builder().cart(cart).product(product).quantity(request.getQuantity()).build());
        }
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateItemQuantity(String email, Long itemId, Integer quantity) {
        Cart cart = getCart(email);
        CartItem item = cart.getItems().stream().filter(i -> i.getId().equals(itemId)).findFirst()
                .orElseThrow(() -> new RuntimeException("Item não encontrado no carrinho"));
        if (quantity <= 0) cart.getItems().remove(item); else item.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeItem(String email, Long itemId) {
        Cart cart = getCart(email);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(String email) {
        Cart cart = getCart(email);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
