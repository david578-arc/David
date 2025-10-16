package com.examly.springapp.repository.ai;

import com.examly.springapp.model.ai.AnomalyDetection;
import com.examly.springapp.model.ai.AnomalyType;
import com.examly.springapp.model.ai.AnomalySeverity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnomalyDetectionRepository extends JpaRepository<AnomalyDetection, Long> {
    
    List<AnomalyDetection> findByAnomalyType(AnomalyType anomalyType);
    
    List<AnomalyDetection> findBySeverity(AnomalySeverity severity);
    
    List<AnomalyDetection> findByIsResolved(Boolean isResolved);
    
    List<AnomalyDetection> findByEntityTypeAndEntityId(String entityType, Long entityId);
    
    @Query("SELECT a FROM AnomalyDetection a WHERE a.detectedAt >= :since")
    List<AnomalyDetection> findDetectedSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT a FROM AnomalyDetection a WHERE a.confidenceScore >= :minConfidence")
    List<AnomalyDetection> findByMinConfidence(@Param("minConfidence") Double minConfidence);
    
    @Query("SELECT a FROM AnomalyDetection a ORDER BY a.severity DESC, a.detectedAt DESC")
    List<AnomalyDetection> findAllOrderBySeverityAndDateDesc();
    
    @Query("SELECT COUNT(a) FROM AnomalyDetection a WHERE a.anomalyType = :type AND a.detectedAt >= :since")
    Long countByTypeSince(@Param("type") AnomalyType type, @Param("since") LocalDateTime since);
}

