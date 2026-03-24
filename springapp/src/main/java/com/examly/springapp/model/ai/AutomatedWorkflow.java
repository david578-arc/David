package com.examly.springapp.model.ai;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "automated_workflows")
public class AutomatedWorkflow {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "workflow_name")
    private String workflowName;
    
    @Column(name = "workflow_type")
    @Enumerated(EnumType.STRING)
    private WorkflowType workflowType;
    
    @Column(name = "trigger_conditions", columnDefinition = "TEXT")
    private String triggerConditions; // JSON string
    
    @Column(name = "actions", columnDefinition = "TEXT")
    private String actions; // JSON string containing workflow actions
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "priority")
    private Integer priority = 1;
    
    @Column(name = "execution_count")
    private Long executionCount = 0L;
    
    @Column(name = "last_executed")
    private LocalDateTime lastExecuted;
    
    @Column(name = "next_execution")
    private LocalDateTime nextExecution;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    // Constructors
    public AutomatedWorkflow() {}
    
    public AutomatedWorkflow(String workflowName, WorkflowType workflowType) {
        this.workflowName = workflowName;
        this.workflowType = workflowType;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getWorkflowName() {
        return workflowName;
    }
    
    public void setWorkflowName(String workflowName) {
        this.workflowName = workflowName;
    }
    
    public WorkflowType getWorkflowType() {
        return workflowType;
    }
    
    public void setWorkflowType(WorkflowType workflowType) {
        this.workflowType = workflowType;
    }
    
    public String getTriggerConditions() {
        return triggerConditions;
    }
    
    public void setTriggerConditions(String triggerConditions) {
        this.triggerConditions = triggerConditions;
    }
    
    public String getActions() {
        return actions;
    }
    
    public void setActions(String actions) {
        this.actions = actions;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public Integer getPriority() {
        return priority;
    }
    
    public void setPriority(Integer priority) {
        this.priority = priority;
    }
    
    public Long getExecutionCount() {
        return executionCount;
    }
    
    public void setExecutionCount(Long executionCount) {
        this.executionCount = executionCount;
    }
    
    public LocalDateTime getLastExecuted() {
        return lastExecuted;
    }
    
    public void setLastExecuted(LocalDateTime lastExecuted) {
        this.lastExecuted = lastExecuted;
    }
    
    public LocalDateTime getNextExecution() {
        return nextExecution;
    }
    
    public void setNextExecution(LocalDateTime nextExecution) {
        this.nextExecution = nextExecution;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
}
