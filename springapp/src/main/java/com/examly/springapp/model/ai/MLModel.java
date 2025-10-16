package com.examly.springapp.model.ai;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "ml_models")
public class MLModel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "model_name")
    private String modelName;
    
    @Column(name = "model_type")
    @Enumerated(EnumType.STRING)
    private ModelType modelType;
    
    @Column(name = "version")
    private String version;
    
    @Column(name = "model_data", columnDefinition = "LONGTEXT")
    private String modelData; // Serialized model data
    
    @Column(name = "training_data_size")
    private Long trainingDataSize;
    
    @Column(name = "accuracy_score")
    private Double accuracyScore;
    
    @Column(name = "precision_score")
    private Double precisionScore;
    
    @Column(name = "recall_score")
    private Double recallScore;
    
    @Column(name = "f1_score")
    private Double f1Score;
    
    @Column(name = "is_active")
    private Boolean isActive = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "last_trained")
    private LocalDateTime lastTrained;
    
    @Column(name = "training_parameters", columnDefinition = "TEXT")
    private String trainingParameters; // JSON string
    
    // Constructors
    public MLModel() {}
    
    public MLModel(String modelName, ModelType modelType, String version) {
        this.modelName = modelName;
        this.modelType = modelType;
        this.version = version;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getModelName() {
        return modelName;
    }
    
    public void setModelName(String modelName) {
        this.modelName = modelName;
    }
    
    public ModelType getModelType() {
        return modelType;
    }
    
    public void setModelType(ModelType modelType) {
        this.modelType = modelType;
    }
    
    public String getVersion() {
        return version;
    }
    
    public void setVersion(String version) {
        this.version = version;
    }
    
    public String getModelData() {
        return modelData;
    }
    
    public void setModelData(String modelData) {
        this.modelData = modelData;
    }
    
    public Long getTrainingDataSize() {
        return trainingDataSize;
    }
    
    public void setTrainingDataSize(Long trainingDataSize) {
        this.trainingDataSize = trainingDataSize;
    }
    
    public Double getAccuracyScore() {
        return accuracyScore;
    }
    
    public void setAccuracyScore(Double accuracyScore) {
        this.accuracyScore = accuracyScore;
    }
    
    public Double getPrecisionScore() {
        return precisionScore;
    }
    
    public void setPrecisionScore(Double precisionScore) {
        this.precisionScore = precisionScore;
    }
    
    public Double getRecallScore() {
        return recallScore;
    }
    
    public void setRecallScore(Double recallScore) {
        this.recallScore = recallScore;
    }
    
    public Double getF1Score() {
        return f1Score;
    }
    
    public void setF1Score(Double f1Score) {
        this.f1Score = f1Score;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getLastTrained() {
        return lastTrained;
    }
    
    public void setLastTrained(LocalDateTime lastTrained) {
        this.lastTrained = lastTrained;
    }
    
    public String getTrainingParameters() {
        return trainingParameters;
    }
    
    public void setTrainingParameters(String trainingParameters) {
        this.trainingParameters = trainingParameters;
    }
}
