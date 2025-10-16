package com.examly.springapp.repository.ai;

import com.examly.springapp.model.ai.AutomatedWorkflow;
import com.examly.springapp.model.ai.WorkflowType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AutomatedWorkflowRepository extends JpaRepository<AutomatedWorkflow, Long> {
    
    List<AutomatedWorkflow> findByWorkflowType(WorkflowType workflowType);
    
    List<AutomatedWorkflow> findByIsActive(Boolean isActive);
    
    @Query("SELECT w FROM AutomatedWorkflow w WHERE w.nextExecution <= :now")
    List<AutomatedWorkflow> findDueForExecution(@Param("now") LocalDateTime now);
    
    @Query("SELECT w FROM AutomatedWorkflow w WHERE w.priority >= :minPriority")
    List<AutomatedWorkflow> findByMinPriority(@Param("minPriority") Integer minPriority);
    
    @Query("SELECT w FROM AutomatedWorkflow w ORDER BY w.executionCount DESC")
    List<AutomatedWorkflow> findAllOrderByExecutionCountDesc();
}

