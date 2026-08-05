package com.funkofabs.controller;

import com.funkofabs.dto.WaitlistRequest;
import com.funkofabs.service.WaitlistVipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/waitlist")
@RequiredArgsConstructor
public class WaitlistVipController {

    private final WaitlistVipService waitlistVipService;

    @PostMapping
    public ResponseEntity<java.util.Map<String, String>> joinWaitlist(@Valid @RequestBody WaitlistRequest request) {
        waitlistVipService.joinWaitlist(request);
        return ResponseEntity.ok(java.util.Map.of("message", "Sucesso"));
    }
}
