package com.examly.springapp.repository.ai;

import com.examly.springapp.model.ai.AIAnalysis;
import com.examly.springapp.model.ai.AnalysisType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AIAnalysisRepository extends JpaRepository<AIAnalysis, Long> {
    
    List<AIAnalysis> findByAnalysisType(AnalysisType analysisType);
    
    List<AIAnalysis> findByEntityTypeAndEntityId(String entityType, Long entityId);
    
    List<AIAnalysis> findByIsProcessed(Boolean isProcessed);
    
    @Query("SELECT a FROM AIAnalysis a WHERE a.createdAt >= :since")
    List<AIAnalysis> findAnalysesSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT a FROM AIAnalysis a WHERE a.confidenceScore >= :minConfidence")
    List<AIAnalysis> findByMinConfidence(@Param("minConfidence") Double minConfidence);
    
    @Query("SELECT a FROM AIAnalysis a ORDER BY a.confidenceScore DESC")
    List<AIAnalysis> findAllOrderByConfidenceDesc();
    
    @Query("SELECT COUNT(a) FROM AIAnalysis a WHERE a.analysisType = :type AND a.createdAt >= :since")
    Long countByTypeSince(@Param("type") AnalysisType type, @Param("since") LocalDateTime since);
}

