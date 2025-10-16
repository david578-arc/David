package com.examly.springapp.service;

import com.examly.springapp.model.Payment;
import com.examly.springapp.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Payment initiate(Long userId, Long ticketId, double amount, String currency, String provider) {
        Payment p = new Payment();
        p.setUserId(userId);
        p.setTicketId(ticketId);
        p.setAmount(amount);
        p.setCurrency(currency);
        p.setStatus("INITIATED");
        p.setProvider(provider);
        p.setReference(UUID.randomUUID().toString());
        p.setCreatedAt(LocalDateTime.now());
        return paymentRepository.save(p);
    }

    public String createStripeCheckoutSession(String apiKey, long amountMinor, String currency, String successUrl, String cancelUrl, String productName, String reference) throws StripeException {
        Stripe.apiKey = apiKey;
        SessionCreateParams params = SessionCreateParams.builder()
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency(currency.toLowerCase())
                            .setUnitAmount(amountMinor)
                            .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName(productName)
                                    .build()
                            )
                            .build()
                    )
                    .build()
            )
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl(successUrl + "?ref=" + reference)
            .setCancelUrl(cancelUrl)
            .putMetadata("reference", reference)
            .build();
        Session session = Session.create(params);
        return session.getUrl();
    }

    public Optional<Payment> findByReference(String reference) {
        return paymentRepository.findByReference(reference);
    }

    public Payment markCaptured(Payment p) {
        p.setStatus("CAPTURED");
        p.setCapturedAt(LocalDateTime.now());
        return paymentRepository.save(p);
    }

    public List<Payment> history(Long userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}


