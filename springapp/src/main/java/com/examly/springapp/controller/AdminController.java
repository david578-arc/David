package com.examly.springapp.controller;

import com.examly.springapp.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
//@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getSystemAnalytics() {
        Map<String, Object> analytics = adminService.getSystemAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> generateReports() {
        Map<String, Object> reports = adminService.generateReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<Map<String, Object>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Map<String, Object> auditLogs = adminService.getAuditLogs(page, size);
        return ResponseEntity.ok(auditLogs);
    }

    @PostMapping("/notifications")
    public ResponseEntity<Void> sendSystemNotification(@RequestBody Map<String, Object> notificationData) {
        String message = (String) notificationData.get("message");
        String type = (String) notificationData.get("type");
        adminService.sendSystemNotification(message, type);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/system-health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        Map<String, Object> health = adminService.getSystemHealth();
        return ResponseEntity.ok(health);
    }

    @GetMapping("/user-activity")
    public ResponseEntity<Map<String, Object>> getUserActivity() {
        Map<String, Object> activity = adminService.getUserActivity();
        return ResponseEntity.ok(activity);
    }

    @GetMapping("/database-stats")
    public ResponseEntity<Map<String, Object>> getDatabaseStats() {
        Map<String, Object> stats = adminService.getDatabaseStats();
        return ResponseEntity.ok(stats);
    }
}
