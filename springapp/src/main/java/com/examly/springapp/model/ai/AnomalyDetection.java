package com.examly.springapp.model.ai;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "anomaly_detections")
public class AnomalyDetection {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "anomaly_type")
    @Enumerated(EnumType.STRING)
    private AnomalyType anomalyType;
    
    @Column(name = "entity_type")
    private String entityType; // TEAM, PLAYER, MATCH, USER, SYSTEM
    
    @Column(name = "entity_id")
    private Long entityId;
    
    @Column(name = "severity")
    @Enumerated(EnumType.STRING)
    private AnomalySeverity severity;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "detected_data", columnDefinition = "TEXT")
    private String detectedData; // JSON string containing anomaly data
    
    @Column(name = "confidence_score")
    private Double confidenceScore;
    
    @Column(name = "is_resolved")
    private Boolean isResolved = false;
    
    @Column(name = "resolved_by")
    private String resolvedBy;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;
    
    @Column(name = "detected_at")
    private LocalDateTime detectedAt;
    
    @Column(name = "model_used")
    private String modelUsed;
    
    // Constructors
    public AnomalyDetection() {}
    
    public AnomalyDetection(AnomalyType anomalyType, String entityType, Long entityId, 
                           AnomalySeverity severity, String description) {
        this.anomalyType = anomalyType;
        this.entityType = entityType;
        this.entityId = entityId;
        this.severity = severity;
        this.description = description;
        this.detectedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public AnomalyType getAnomalyType() {
        return anomalyType;
    }
    
    public void setAnomalyType(AnomalyType anomalyType) {
        this.anomalyType = anomalyType;
    }
    
    public String getEntityType() {
        return entityType;
    }
    
    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }
    
    public Long getEntityId() {
        return entityId;
    }
    
    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }
    
    public AnomalySeverity getSeverity() {
        return severity;
    }
    
    public void setSeverity(AnomalySeverity severity) {
        this.severity = severity;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getDetectedData() {
        return detectedData;
    }
    
    public void setDetectedData(String detectedData) {
        this.detectedData = detectedData;
    }
    
    public Double getConfidenceScore() {
        return confidenceScore;
    }
    
    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }
    
    public Boolean getIsResolved() {
        return isResolved;
    }
    
    public void setIsResolved(Boolean isResolved) {
        this.isResolved = isResolved;
    }
    
    public String getResolvedBy() {
        return resolvedBy;
    }
    
    public void setResolvedBy(String resolvedBy) {
        this.resolvedBy = resolvedBy;
    }
    
    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }
    
    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
    
    public String getResolutionNotes() {
        return resolutionNotes;
    }
    
    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }
    
    public LocalDateTime getDetectedAt() {
        return detectedAt;
    }
    
    public void setDetectedAt(LocalDateTime detectedAt) {
        this.detectedAt = detectedAt;
    }
    
    public String getModelUsed() {
        return modelUsed;
    }
    
    public void setModelUsed(String modelUsed) {
        this.modelUsed = modelUsed;
    }
}
