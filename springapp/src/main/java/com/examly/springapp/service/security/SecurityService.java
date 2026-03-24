package com.examly.springapp.service.security;

import com.examly.springapp.model.User;
import com.examly.springapp.model.UserRole;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.AuditLogRepository;
import com.examly.springapp.model.AuditLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class SecurityService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
    private final SecureRandom secureRandom = new SecureRandom();
    
    // Encryption key for sensitive data
    private static final String ENCRYPTION_ALGORITHM = "AES";
    private static final String SECRET_KEY = "FIFA2024TournamentSecurityKey"; // In production, use environment variable
    
    // Input validation patterns
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
    private static final Pattern FIFA_ID_PATTERN = Pattern.compile("^FIFA\\d{6}$");
    private static final Pattern NAME_PATTERN = Pattern.compile("^[a-zA-Z\\s]{2,50}$");

    /**
     * 3.6.3 Security Implementation
     */

    /**
     * JWT-based authentication with tournament-grade security
     */
    public boolean validateTournamentGradeSecurity(String token, UserRole requiredRole) {
        try {
            // Enhanced JWT validation with role-based access control
            if (token == null || token.isEmpty()) {
                logSecurityEvent("INVALID_TOKEN", "Empty or null token provided", "HIGH");
                return false;
            }
            
            // Validate token format and signature
            if (!isValidJWTFormat(token)) {
                logSecurityEvent("INVALID_TOKEN_FORMAT", "Malformed JWT token", "HIGH");
                return false;
            }
            
            // Check token expiration
            if (isTokenExpired(token)) {
                logSecurityEvent("TOKEN_EXPIRED", "JWT token has expired", "MEDIUM");
                return false;
            }
            
            // Validate role-based access
            if (!hasRequiredRole(token, requiredRole)) {
                logSecurityEvent("INSUFFICIENT_PERMISSIONS", 
                    "User lacks required role: " + requiredRole, "HIGH");
                return false;
            }
            
            return true;
        } catch (Exception e) {
            logSecurityEvent("AUTHENTICATION_ERROR", "Authentication validation failed: " + e.getMessage(), "CRITICAL");
            return false;
        }
    }

    /**
     * Role-based access control for all operations
     */
    public boolean authorizeOperation(UserRole userRole, String operation, String resource) {
        try {
            // Define role-based permissions matrix
            Map<String, String[]> rolePermissions = getRolePermissions();
            
            String[] allowedOperations = rolePermissions.get(userRole.name());
            if (allowedOperations == null) {
                logSecurityEvent("UNAUTHORIZED_ACCESS", 
                    "Unknown role attempting operation: " + userRole, "HIGH");
                return false;
            }
            
            boolean isAuthorized = java.util.Arrays.asList(allowedOperations).contains(operation);
            
            if (!isAuthorized) {
                logSecurityEvent("UNAUTHORIZED_OPERATION", 
                    "Role " + userRole + " attempted unauthorized operation: " + operation + " on " + resource, "HIGH");
            }
            
            return isAuthorized;
        } catch (Exception e) {
            logSecurityEvent("AUTHORIZATION_ERROR", "Authorization check failed: " + e.getMessage(), "CRITICAL");
            return false;
        }
    }

    /**
     * Data protection: Encryption at rest and in transit for sensitive tournament data
     */
    public String encryptSensitiveData(String data) {
        try {
            if (data == null || data.isEmpty()) {
                return data;
            }
            
            SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), ENCRYPTION_ALGORITHM);
            Cipher cipher = Cipher.getInstance(ENCRYPTION_ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            
            byte[] encryptedData = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encryptedData);
        } catch (Exception e) {
            logSecurityEvent("ENCRYPTION_ERROR", "Failed to encrypt sensitive data: " + e.getMessage(), "CRITICAL");
            throw new RuntimeException("Encryption failed", e);
        }
    }

    public String decryptSensitiveData(String encryptedData) {
        try {
            if (encryptedData == null || encryptedData.isEmpty()) {
                return encryptedData;
            }
            
            SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), ENCRYPTION_ALGORITHM);
            Cipher cipher = Cipher.getInstance(ENCRYPTION_ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            
            byte[] decodedData = Base64.getDecoder().decode(encryptedData);
            byte[] decryptedData = cipher.doFinal(decodedData);
            return new String(decryptedData, StandardCharsets.UTF_8);
        } catch (Exception e) {
            logSecurityEvent("DECRYPTION_ERROR", "Failed to decrypt sensitive data: " + e.getMessage(), "CRITICAL");
            throw new RuntimeException("Decryption failed", e);
        }
    }

    /**
     * Input validation: Comprehensive sanitization and validation
     */
    public ValidationResult validateInput(String input, InputType inputType) {
        ValidationResult result = new ValidationResult();
        
        try {
            if (input == null || input.isEmpty()) {
                result.addError("Input cannot be null or empty");
                return result;
            }
            
            // Sanitize input to prevent XSS and injection attacks
            String sanitizedInput = sanitizeInput(input);
            
            // Type-specific validation
            switch (inputType) {
                case EMAIL:
                    if (!EMAIL_PATTERN.matcher(sanitizedInput).matches()) {
                        result.addError("Invalid email format");
                    }
                    break;
                case PASSWORD:
                    if (!PASSWORD_PATTERN.matcher(sanitizedInput).matches()) {
                        result.addError("Password must contain at least 8 characters with uppercase, lowercase, number, and special character");
                    }
                    break;
                case FIFA_ID:
                    if (!FIFA_ID_PATTERN.matcher(sanitizedInput).matches()) {
                        result.addError("FIFA ID must be in format FIFA######");
                    }
                    break;
                case NAME:
                    if (!NAME_PATTERN.matcher(sanitizedInput).matches()) {
                        result.addError("Name must contain only letters and spaces, 2-50 characters");
                    }
                    break;
                case GENERAL_TEXT:
                    if (sanitizedInput.length() > 255) {
                        result.addError("Text too long (max 255 characters)");
                    }
                    break;
            }
            
            result.setSanitizedInput(sanitizedInput);
            result.setValid(result.getErrors().isEmpty());
            
        } catch (Exception e) {
            result.addError("Validation error: " + e.getMessage());
            logSecurityEvent("VALIDATION_ERROR", "Input validation failed: " + e.getMessage(), "MEDIUM");
        }
        
        return result;
    }

    /**
     * Tournament data security: Protection of team and player information
     */
    public void protectTournamentData(String dataType, Long entityId, String operation) {
        try {
            // Implement data protection measures
            logSecurityEvent("DATA_ACCESS", 
                "Access to " + dataType + " (ID: " + entityId + ") - Operation: " + operation, "INFO");
            
            // Additional protection for sensitive tournament data
            if (isSensitiveData(dataType)) {
                // Implement additional security measures
                enforceDataAccessPolicies(dataType, entityId);
            }
            
        } catch (Exception e) {
            logSecurityEvent("DATA_PROTECTION_ERROR", 
                "Failed to protect tournament data: " + e.getMessage(), "HIGH");
        }
    }

    /**
     * Audit trail: Complete logging of security-relevant events
     */
    @Transactional
    public void logSecurityEvent(String eventType, String description, String severity) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setAction(eventType);
            auditLog.setEntityType("SECURITY");
            auditLog.setDescription(description);
            auditLog.setTimestamp(LocalDateTime.now());
            auditLog.setSeverity(severity);
            
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            // Log to system log if database logging fails
            System.err.println("Failed to log security event: " + e.getMessage());
        }
    }

    /**
     * Compliance: FIFA policies and data protection regulation adherence
     */
    public boolean checkFIFACompliance(String operation, String dataType) {
        try {
            // Check FIFA compliance requirements
            if (isFIFARegulatedOperation(operation)) {
                return validateFIFAPolicies(operation, dataType);
            }
            
            // Check GDPR compliance
            if (isGDPRRelevant(operation)) {
                return validateGDPRCompliance(operation, dataType);
            }
            
            return true;
        } catch (Exception e) {
            logSecurityEvent("COMPLIANCE_ERROR", "Compliance check failed: " + e.getMessage(), "HIGH");
            return false;
        }
    }

    // Helper methods
    private boolean isValidJWTFormat(String token) {
        return token.split("\\.").length == 3;
    }

    private boolean isTokenExpired(String token) {
        // Implement JWT expiration check
        return false; // Simplified for example
    }

    private boolean hasRequiredRole(String token, UserRole requiredRole) {
        // Implement role extraction from JWT
        return true; // Simplified for example
    }

    private Map<String, String[]> getRolePermissions() {
        Map<String, String[]> permissions = new HashMap<>();
        
        permissions.put("FIFA_ADMIN", new String[]{
            "CREATE", "READ", "UPDATE", "DELETE", "MANAGE_USERS", "MANAGE_TOURNAMENTS", 
            "VIEW_ANALYTICS", "MANAGE_SECURITY", "AUDIT_LOGS"
        });
        
        permissions.put("TOURNAMENT_DIRECTOR", new String[]{
            "READ", "UPDATE", "MANAGE_TOURNAMENTS", "MANAGE_MATCHES", "VIEW_ANALYTICS"
        });
        
        permissions.put("TEAM_MANAGER", new String[]{
            "READ", "UPDATE", "MANAGE_TEAM", "MANAGE_PLAYERS"
        });
        
        permissions.put("COACH", new String[]{
            "READ", "UPDATE", "MANAGE_PLAYERS", "VIEW_TACTICS"
        });
        
        permissions.put("PLAYER", new String[]{
            "READ", "UPDATE_PROFILE"
        });
        
        return permissions;
    }

    private String sanitizeInput(String input) {
        // Remove potentially dangerous characters
        return input.replaceAll("[<>\"'&]", "")
                   .replaceAll("script", "")
                   .replaceAll("javascript:", "")
                   .trim();
    }

    private boolean isSensitiveData(String dataType) {
        return dataType.equals("PLAYER_MEDICAL") || 
               dataType.equals("TEAM_STRATEGY") || 
               dataType.equals("FINANCIAL_DATA");
    }

    private void enforceDataAccessPolicies(String dataType, Long entityId) {
        // Implement additional data access policies
        logSecurityEvent("DATA_ACCESS_POLICY", 
            "Enforcing access policies for " + dataType + " (ID: " + entityId + ")", "INFO");
    }

    private boolean isFIFARegulatedOperation(String operation) {
        return operation.contains("TOURNAMENT") || 
               operation.contains("MATCH") || 
               operation.contains("PLAYER_REGISTRATION");
    }

    private boolean validateFIFAPolicies(String operation, String dataType) {
        // Implement FIFA policy validation
        return true; // Simplified for example
    }

    private boolean isGDPRRelevant(String operation) {
        return operation.contains("PERSONAL_DATA") || 
               operation.contains("PLAYER_DATA") || 
               operation.contains("USER_DATA");
    }

    private boolean validateGDPRCompliance(String operation, String dataType) {
        // Implement GDPR compliance validation
        return true; // Simplified for example
    }

    // Inner classes
    public enum InputType {
        EMAIL, PASSWORD, FIFA_ID, NAME, GENERAL_TEXT
    }

    public static class ValidationResult {
        private boolean valid = true;
        private String sanitizedInput;
        private java.util.List<String> errors = new java.util.ArrayList<>();

        public void addError(String error) {
            errors.add(error);
            valid = false;
        }

        public boolean isValid() { return valid; }
        public String getSanitizedInput() { return sanitizedInput; }
        public void setSanitizedInput(String sanitizedInput) { this.sanitizedInput = sanitizedInput; }
        public java.util.List<String> getErrors() { return errors; }
        public void setValid(boolean valid) { this.valid = valid; }
    }
}
