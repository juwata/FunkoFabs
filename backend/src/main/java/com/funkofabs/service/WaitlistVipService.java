package com.funkofabs.service;

import com.funkofabs.dto.WaitlistRequest;
import com.funkofabs.entity.WaitlistVip;
import com.funkofabs.repository.WaitlistVipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WaitlistVipService {

    private final WaitlistVipRepository waitlistVipRepository;

    public void joinWaitlist(WaitlistRequest request) {
        if (waitlistVipRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Este e-mail já está cadastrado na lista VIP!");
        }

        WaitlistVip vip = WaitlistVip.builder()
                .email(request.getEmail())
                .build();

        waitlistVipRepository.save(vip);
    }
}
