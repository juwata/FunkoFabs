package com.funkofabs.repository;

import com.funkofabs.entity.Cart;
import com.funkofabs.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
