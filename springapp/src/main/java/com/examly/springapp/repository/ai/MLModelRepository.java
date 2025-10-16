package com.examly.springapp.repository.ai;

import com.examly.springapp.model.ai.MLModel;
import com.examly.springapp.model.ai.ModelType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MLModelRepository extends JpaRepository<MLModel, Long> {
    
    List<MLModel> findByModelType(ModelType modelType);
    
    List<MLModel> findByIsActive(Boolean isActive);
    
    Optional<MLModel> findByModelNameAndVersion(String modelName, String version);
    
    @Query("SELECT m FROM MLModel m WHERE m.accuracyScore >= :minAccuracy")
    List<MLModel> findByMinAccuracy(@Param("minAccuracy") Double minAccuracy);
    
    @Query("SELECT m FROM MLModel m ORDER BY m.accuracyScore DESC")
    List<MLModel> findAllOrderByAccuracyDesc();
    
    @Query("SELECT m FROM MLModel m WHERE m.modelType = :type AND m.isActive = true")
    List<MLModel> findActiveByType(@Param("type") ModelType type);
}

