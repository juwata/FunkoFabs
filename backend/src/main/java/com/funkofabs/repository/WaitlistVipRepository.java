package com.funkofabs.repository;

import com.funkofabs.entity.WaitlistVip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WaitlistVipRepository extends JpaRepository<WaitlistVip, Long> {
    Optional<WaitlistVip> findByEmail(String email);
    boolean existsByEmail(String email);
}
