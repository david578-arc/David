package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "ticket_id")
    private Long ticketId;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "currency", length = 3, nullable = false)
    private String currency;

    @Column(name = "status", length = 20, nullable = false)
    private String status; // INITIATED, AUTHORIZED, CAPTURED, FAILED, REFUNDED

    @Column(name = "provider", length = 50, nullable = false)
    private String provider; // e.g., RAZORPAY, STRIPE

    @Column(name = "reference", length = 120, unique = true)
    private String reference; // provider payment id

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "captured_at")
    private LocalDateTime capturedAt;

    @Lob
    @Column(name = "meta")
    private String meta;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getCapturedAt() { return capturedAt; }
    public void setCapturedAt(LocalDateTime capturedAt) { this.capturedAt = capturedAt; }
    public String getMeta() { return meta; }
    public void setMeta(String meta) { this.meta = meta; }
}


