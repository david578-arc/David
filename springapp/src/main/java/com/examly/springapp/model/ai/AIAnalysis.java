package com.examly.springapp.model.ai;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "ai_analyses")
public class AIAnalysis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "analysis_type")
    @Enumerated(EnumType.STRING)
    private AnalysisType analysisType;
    
    @Column(name = "entity_type")
    private String entityType; // TEAM, PLAYER, MATCH, TOURNAMENT
    
    @Column(name = "entity_id")
    private Long entityId;
    
    @Column(name = "analysis_data", columnDefinition = "TEXT")
    private String analysisData; // JSON string containing analysis results
    
    @Column(name = "confidence_score")
    private Double confidenceScore;
    
    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations; // JSON string containing recommendations
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "is_processed")
    private Boolean isProcessed = false;
    
    @Column(name = "processing_time_ms")
    private Long processingTimeMs;
    
    // Constructors
    public AIAnalysis() {}
    
    public AIAnalysis(AnalysisType analysisType, String entityType, Long entityId) {
        this.analysisType = analysisType;
        this.entityType = entityType;
        this.entityId = entityId;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public AnalysisType getAnalysisType() {
        return analysisType;
    }
    
    public void setAnalysisType(AnalysisType analysisType) {
        this.analysisType = analysisType;
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
    
    public String getAnalysisData() {
        return analysisData;
    }
    
    public void setAnalysisData(String analysisData) {
        this.analysisData = analysisData;
    }
    
    public Double getConfidenceScore() {
        return confidenceScore;
    }
    
    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }
    
    public String getRecommendations() {
        return recommendations;
    }
    
    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Boolean getIsProcessed() {
        return isProcessed;
    }
    
    public void setIsProcessed(Boolean isProcessed) {
        this.isProcessed = isProcessed;
    }
    
    public Long getProcessingTimeMs() {
        return processingTimeMs;
    }
    
    public void setProcessingTimeMs(Long processingTimeMs) {
        this.processingTimeMs = processingTimeMs;
    }
}
