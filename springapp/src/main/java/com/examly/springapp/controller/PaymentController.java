package com.examly.springapp.controller;

import com.examly.springapp.model.Payment;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/initiate")
    public ResponseEntity<Payment> initiate(@AuthenticationPrincipal Jwt jwt, @RequestBody Map<String, Object> payload) {
        String username = jwt.getSubject();
        User user = userRepository.findByUsername(username).orElseThrow();
        Long ticketId = payload.get("ticketId") == null ? null : Long.valueOf(payload.get("ticketId").toString());
        double amount = Double.parseDouble(payload.get("amount").toString());
        String currency = payload.getOrDefault("currency", "INR").toString();
        String provider = payload.getOrDefault("provider", "OFFLINE").toString();
        Payment p = paymentService.initiate(user.getId(), ticketId, amount, currency, provider);
        return ResponseEntity.ok(p);
    }

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> checkout(@AuthenticationPrincipal Jwt jwt, @RequestBody Map<String, Object> payload) throws Exception {
        String username = jwt.getSubject();
        User user = userRepository.findByUsername(username).orElseThrow();
        double amount = Double.parseDouble(payload.get("amount").toString());
        String currency = payload.getOrDefault("currency", "INR").toString();
        String apiKey = System.getenv("STRIPE_SECRET");
        if (apiKey == null || apiKey.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Stripe secret not configured"));
        }
        Payment p = paymentService.initiate(user.getId(), null, amount, currency, "STRIPE");
        long amountMinor = Math.round(amount * 100);
        String success = payload.getOrDefault("successUrl", "http://localhost:3000/success").toString();
        String cancel = payload.getOrDefault("cancelUrl", "http://localhost:3000/cancel").toString();
        String url = paymentService.createStripeCheckoutSession(apiKey, amountMinor, currency, success, cancel, "FIFA Ticket", p.getReference());
        return ResponseEntity.ok(Map.of("checkoutUrl", url, "reference", p.getReference()));
    }

    @PostMapping("/capture/{reference}")
    public ResponseEntity<Payment> capture(@PathVariable String reference) {
        Payment p = paymentService.findByReference(reference).orElseThrow();
        return ResponseEntity.ok(paymentService.markCaptured(p));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Payment>> history(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        User user = userRepository.findByUsername(username).orElseThrow();
        return ResponseEntity.ok(paymentService.history(user.getId()));
    }
}


