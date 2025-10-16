package com.examly.springapp.controller.ai;

import com.examly.springapp.service.ai.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/ai")
//@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AutomatedTournamentProcessingService tournamentProcessingService;
    
    @Autowired
    private IntelligentMatchAnalysisService matchAnalysisService;
    
    @Autowired
    private MachineLearningService machineLearningService;
    
    @Autowired
    private NaturalLanguageProcessingService nlpService;
    
    @Autowired
    private AutomatedWorkflowManagementService workflowManagementService;
    
    @Autowired
    private AnomalyDetectionService anomalyDetectionService;

    // Tournament Processing Endpoints
    @PostMapping("/tournament/process/{tournamentId}")
    public ResponseEntity<Map<String, Object>> processTournament(@PathVariable Long tournamentId) {
        Map<String, Object> result = tournamentProcessingService.processTournamentValidation(tournamentId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/tournament/process")
    public ResponseEntity<Map<String, Object>> processAllTournaments() {
        // Trigger automated tournament processing
        tournamentProcessingService.processTournamentData();
        return ResponseEntity.ok(Map.of("status", "PROCESSING_STARTED", "message", "Tournament processing initiated"));
    }

    // Match Analysis Endpoints
    @PostMapping("/match/analyze/{matchId}")
    public ResponseEntity<Map<String, Object>> analyzeMatch(@PathVariable Long matchId) {
        CompletableFuture<Map<String, Object>> future = matchAnalysisService.analyzeMatch(matchId);
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    // Machine Learning Endpoints
    @PostMapping("/ml/predict/match/{matchId}")
    public ResponseEntity<Map<String, Object>> predictMatchOutcome(@PathVariable Long matchId) {
        CompletableFuture<Map<String, Object>> future = machineLearningService.predictMatchOutcome(matchId);
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/ml/analyze/tournament/{tournamentId}")
    public ResponseEntity<Map<String, Object>> analyzeTournamentPatterns(@PathVariable Long tournamentId) {
        CompletableFuture<Map<String, Object>> future = machineLearningService.analyzeTournamentPatterns(tournamentId);
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/ml/optimize/{entityType}/{entityId}")
    public ResponseEntity<Map<String, Object>> generateOptimizationRecommendations(
            @PathVariable String entityType, 
            @PathVariable Long entityId) {
        CompletableFuture<Map<String, Object>> future = machineLearningService.generateOptimizationRecommendations(entityType, entityId);
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/ml/train")
    public ResponseEntity<Map<String, Object>> trainModel(@RequestBody Map<String, Object> trainingRequest) {
        String modelType = (String) trainingRequest.get("modelType");
        Map<String, Object> trainingData = (Map<String, Object>) trainingRequest.get("trainingData");
        
        CompletableFuture<Map<String, Object>> future = machineLearningService.trainModel(
            com.examly.springapp.model.ai.ModelType.valueOf(modelType), trainingData);
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    // Natural Language Processing Endpoints
    @PostMapping("/nlp/search")
    public ResponseEntity<Map<String, Object>> processSearchQuery(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        CompletableFuture<Map<String, Object>> future = nlpService.processSearchQuery(query);
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/nlp/report/generate")
    public ResponseEntity<Map<String, Object>> generateAutomatedReport(@RequestBody Map<String, Object> request) {
        String reportType = (String) request.get("reportType");
        Map<String, Object> data = (Map<String, Object>) request.get("data");
        
        CompletableFuture<Map<String, Object>> future = nlpService.generateAutomatedReport(reportType, data);
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/nlp/voice/command")
    public ResponseEntity<Map<String, Object>> processVoiceCommand(@RequestBody Map<String, String> request) {
        String voiceCommand = request.get("voiceCommand");
        CompletableFuture<Map<String, Object>> future = nlpService.processVoiceCommand(voiceCommand);
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/nlp/sentiment")
    public ResponseEntity<Map<String, Object>> analyzeSentiment(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        CompletableFuture<Map<String, Object>> future = nlpService.analyzeSentiment(text);
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/nlp/summarize")
    public ResponseEntity<Map<String, Object>> generateSummary(@RequestBody Map<String, Object> request) {
        String text = (String) request.get("text");
        Integer maxLength = (Integer) request.get("maxLength");
        
        CompletableFuture<Map<String, Object>> future = nlpService.generateSummary(text, maxLength);
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    // Workflow Management Endpoints
    @PostMapping("/workflow/create")
    public ResponseEntity<Map<String, Object>> createWorkflow(@RequestBody Map<String, Object> request) {
        String workflowName = (String) request.get("workflowName");
        String workflowType = (String) request.get("workflowType");
        Map<String, Object> triggerConditions = (Map<String, Object>) request.get("triggerConditions");
        Map<String, Object> actions = (Map<String, Object>) request.get("actions");
        
        CompletableFuture<Map<String, Object>> future = workflowManagementService.createWorkflow(
            workflowName, 
            com.examly.springapp.model.ai.WorkflowType.valueOf(workflowType), 
            triggerConditions, 
            actions);
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/workflow/route")
    public ResponseEntity<Map<String, Object>> routeRequest(@RequestBody Map<String, Object> request) {
        String requestType = (String) request.get("requestType");
        Map<String, Object> requestData = (Map<String, Object>) request.get("requestData");
        
        CompletableFuture<Map<String, Object>> future = workflowManagementService.routeRequest(requestType, requestData);
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/workflow/notify")
    public ResponseEntity<Map<String, Object>> triggerNotifications(@RequestBody Map<String, Object> request) {
        String eventType = (String) request.get("eventType");
        Map<String, Object> eventData = (Map<String, Object>) request.get("eventData");
        
        CompletableFuture<Map<String, Object>> future = workflowManagementService.triggerNotifications(eventType, eventData);
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/workflow/optimize")
    public ResponseEntity<Map<String, Object>> optimizeWorkflows() {
        CompletableFuture<Map<String, Object>> future = workflowManagementService.optimizeWorkflows();
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    // Anomaly Detection Endpoints
    @PostMapping("/anomaly/detect/performance")
    public ResponseEntity<Map<String, Object>> detectPerformanceAnomalies() {
        CompletableFuture<Map<String, Object>> future = anomalyDetectionService.detectPerformanceAnomalies();
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/anomaly/detect/behavior")
    public ResponseEntity<Map<String, Object>> detectBehavioralAnomalies() {
        CompletableFuture<Map<String, Object>> future = anomalyDetectionService.detectBehavioralAnomalies();
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/anomaly/detect/integrity")
    public ResponseEntity<Map<String, Object>> detectDataIntegrityAnomalies() {
        CompletableFuture<Map<String, Object>> future = anomalyDetectionService.detectDataIntegrityAnomalies();
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/anomaly/detect/security")
    public ResponseEntity<Map<String, Object>> detectSecurityAnomalies() {
        CompletableFuture<Map<String, Object>> future = anomalyDetectionService.detectSecurityAnomalies();
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/anomaly/detect/compliance")
    public ResponseEntity<Map<String, Object>> detectComplianceAnomalies() {
        CompletableFuture<Map<String, Object>> future = anomalyDetectionService.detectComplianceAnomalies();
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/anomaly/resolve/{anomalyId}")
    public ResponseEntity<Map<String, Object>> resolveAnomaly(
            @PathVariable Long anomalyId,
            @RequestBody Map<String, String> request) {
        String resolvedBy = request.get("resolvedBy");
        String resolutionNotes = request.get("resolutionNotes");
        
        CompletableFuture<Map<String, Object>> future = anomalyDetectionService.resolveAnomaly(anomalyId, resolvedBy, resolutionNotes);
        Map<String, Object> result = future.join();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/anomaly/statistics")
    public ResponseEntity<Map<String, Object>> getAnomalyStatistics() {
        Map<String, Object> statistics = anomalyDetectionService.getAnomalyStatistics();
        return ResponseEntity.ok(statistics);
    }

    // AI System Status
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getAIStatus() {
        Map<String, Object> status = Map.of(
            "systemStatus", "OPERATIONAL",
            "services", Map.of(
                "tournamentProcessing", "ACTIVE",
                "matchAnalysis", "ACTIVE",
                "machineLearning", "ACTIVE",
                "naturalLanguageProcessing", "ACTIVE",
                "workflowManagement", "ACTIVE",
                "anomalyDetection", "ACTIVE"
            ),
            "lastUpdate", java.time.LocalDateTime.now(),
            "version", "1.0.0"
        );
        return ResponseEntity.ok(status);
    }
}
