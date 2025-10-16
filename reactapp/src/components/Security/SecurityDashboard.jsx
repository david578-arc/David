import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SecurityDashboard.css';

const SecurityDashboard = ({ token }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [securityStatus, setSecurityStatus] = useState(null);
  const [maintainabilityStatus, setMaintainabilityStatus] = useState(null);
  const [systemConfig, setSystemConfig] = useState(null);
  const [diagnostics, setDiagnostics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSecurityStatus();
    fetchMaintainabilityStatus();
    fetchSystemConfiguration();
  }, []);

  const fetchSecurityStatus = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/security/security-status', config);
      setSecurityStatus(response.data);
    } catch (err) {
      setError('Failed to fetch security status: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchMaintainabilityStatus = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/security/maintainability-status', config);
      setMaintainabilityStatus(response.data);
    } catch (err) {
      setError('Failed to fetch maintainability status: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchSystemConfiguration = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/security/configuration', config);
      setSystemConfig(response.data);
    } catch (err) {
      setError('Failed to fetch system configuration: ' + (err.response?.data?.message || err.message));
    }
  };

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/security/diagnostics', config);
      setDiagnostics(response.data);
    } catch (err) {
      setError('Failed to run diagnostics: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityAction = async (action, data = {}) => {
    setLoading(true);
    setError('');
    
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      let response;
      switch (action) {
        case 'healthCheck':
          response = await axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/security/health-check', config);
          break;
        case 'dataCleanup':
          response = await axios.post('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/security/data-cleanup', {}, config);
          break;
        case 'backup':
          response = await axios.post('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/security/backup', {}, config);
          break;
        case 'runTests':
          response = await axios.post('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/security/run-tests', {}, config);
          break;
        default:
          throw new Error('Unknown action');
      }
      
      alert(`Action completed: ${JSON.stringify(response.data)}`);
    } catch (err) {
      setError(`Failed to execute ${action}: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="security-overview">
      <div className="status-cards">
        <div className="status-card security">
          <h3>🔒 Security Status</h3>
          <div className="security-features">
            <div className="feature-item">
              <span className="feature-label">Authentication:</span>
              <span className="feature-value">{securityStatus?.authentication || 'JWT_BASED'}</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Authorization:</span>
              <span className="feature-value">{securityStatus?.authorization || 'ROLE_BASED'}</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Data Protection:</span>
              <span className="feature-value">{securityStatus?.dataProtection || 'ENCRYPTED'}</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Input Validation:</span>
              <span className="feature-value">{securityStatus?.inputValidation || 'COMPREHENSIVE'}</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Audit Trail:</span>
              <span className="feature-value">{securityStatus?.auditTrail || 'COMPLETE'}</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Compliance:</span>
              <span className="feature-value">{securityStatus?.compliance || 'FIFA_GDPR'}</span>
            </div>
          </div>
        </div>
        
        <div className="status-card maintainability">
          <h3>🔧 Maintainability Status</h3>
          <div className="maintainability-features">
            <div className="feature-item">
              <span className="feature-label">Health Monitoring:</span>
              <span className="feature-value">{maintainabilityStatus?.healthMonitoring || 'AUTOMATED'}</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Data Cleanup:</span>
              <span className="feature-value">{maintainabilityStatus?.dataCleanup || 'SCHEDULED'}</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Performance Monitoring:</span>
              <span className="feature-value">{maintainabilityStatus?.performanceMonitoring || 'ACTIVE'}</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Backup & Recovery:</span>
              <span className="feature-value">{maintainabilityStatus?.backupRecovery || 'AUTOMATED'}</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Configuration Management:</span>
              <span className="feature-value">{maintainabilityStatus?.configurationManagement || 'CENTRALIZED'}</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Automated Testing:</span>
              <span className="feature-value">{maintainabilityStatus?.automatedTesting || 'SCHEDULED'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="security-features">
      <div className="security-controls">
        <h3>Security Controls</h3>
        <div className="control-buttons">
          <button 
            onClick={() => handleSecurityAction('healthCheck')}
            disabled={loading}
            className="control-btn health"
          >
            🏥 Health Check
          </button>
        </div>
      </div>

      <div className="security-info">
        <h3>Security Features</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>🔐 Authentication</h4>
            <p>JWT-based with tournament-grade security</p>
            <span className="status-badge active">Active</span>
          </div>
          <div className="feature-card">
            <h4>👥 Authorization</h4>
            <p>Role-based access control for all operations</p>
            <span className="status-badge active">Active</span>
          </div>
          <div className="feature-card">
            <h4>🛡️ Data Protection</h4>
            <p>Encryption at rest and in transit</p>
            <span className="status-badge active">Active</span>
          </div>
          <div className="feature-card">
            <h4>✅ Input Validation</h4>
            <p>Comprehensive sanitization and validation</p>
            <span className="status-badge active">Active</span>
          </div>
          <div className="feature-card">
            <h4>📊 Audit Trail</h4>
            <p>Complete logging of security events</p>
            <span className="status-badge active">Active</span>
          </div>
          <div className="feature-card">
            <h4>⚖️ Compliance</h4>
            <p>FIFA policies and GDPR adherence</p>
            <span className="status-badge active">Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaintainability = () => (
    <div className="maintainability-features">
      <div className="maintainability-controls">
        <h3>Maintainability Controls</h3>
        <div className="control-buttons">
          <button 
            onClick={() => handleSecurityAction('dataCleanup')}
            disabled={loading}
            className="control-btn cleanup"
          >
            🧹 Data Cleanup
          </button>
          <button 
            onClick={() => handleSecurityAction('backup')}
            disabled={loading}
            className="control-btn backup"
          >
            💾 Backup
          </button>
          <button 
            onClick={() => handleSecurityAction('runTests')}
            disabled={loading}
            className="control-btn tests"
          >
            🧪 Run Tests
          </button>
        </div>
      </div>

      <div className="maintainability-info">
        <h3>Maintainability Features</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>📊 Health Monitoring</h4>
            <p>Automated system health monitoring</p>
            <span className="status-badge active">Active</span>
          </div>
          <div className="feature-card">
            <h4>🧹 Data Cleanup</h4>
            <p>Scheduled data cleanup and optimization</p>
            <span className="status-badge active">Active</span>
          </div>
          <div className="feature-card">
            <h4>⚡ Performance Monitoring</h4>
            <p>Real-time performance monitoring</p>
            <span className="status-badge active">Active</span>
          </div>
          <div className="feature-card">
            <h4>💾 Backup & Recovery</h4>
            <p>Automated backup and recovery</p>
            <span className="status-badge active">Active</span>
          </div>
          <div className="feature-card">
            <h4>⚙️ Configuration Management</h4>
            <p>Centralized configuration management</p>
            <span className="status-badge active">Active</span>
          </div>
          <div className="feature-card">
            <h4>🔍 Diagnostics</h4>
            <p>System diagnostics and troubleshooting</p>
            <span className="status-badge active">Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfiguration = () => (
    <div className="configuration-section">
      <div className="config-header">
        <h3>System Configuration</h3>
        <button 
          onClick={runDiagnostics}
          disabled={loading}
          className="diagnostics-btn"
        >
          🔍 Run Diagnostics
        </button>
      </div>

      {systemConfig && (
        <div className="config-grid">
          <div className="config-section">
            <h4>Database Configuration</h4>
            <div className="config-item">
              <span className="config-label">URL:</span>
              <span className="config-value">{systemConfig.databaseUrl}</span>
            </div>
            <div className="config-item">
              <span className="config-label">Pool Size:</span>
              <span className="config-value">{systemConfig.databasePoolSize}</span>
            </div>
          </div>

          <div className="config-section">
            <h4>Security Configuration</h4>
            <div className="config-item">
              <span className="config-label">JWT Expiration:</span>
              <span className="config-value">{systemConfig.jwtExpiration}s</span>
            </div>
            <div className="config-item">
              <span className="config-label">Password Min Length:</span>
              <span className="config-value">{systemConfig.passwordMinLength}</span>
            </div>
            <div className="config-item">
              <span className="config-label">Max Login Attempts:</span>
              <span className="config-value">{systemConfig.maxLoginAttempts}</span>
            </div>
          </div>

          <div className="config-section">
            <h4>Performance Configuration</h4>
            <div className="config-item">
              <span className="config-label">Cache Enabled:</span>
              <span className="config-value">{systemConfig.cacheEnabled ? 'Yes' : 'No'}</span>
            </div>
            <div className="config-item">
              <span className="config-label">Cache TTL:</span>
              <span className="config-value">{systemConfig.cacheTtl}s</span>
            </div>
            <div className="config-item">
              <span className="config-label">Max Connections:</span>
              <span className="config-value">{systemConfig.maxConnections}</span>
            </div>
          </div>

          <div className="config-section">
            <h4>Logging Configuration</h4>
            <div className="config-item">
              <span className="config-label">Log Level:</span>
              <span className="config-value">{systemConfig.logLevel}</span>
            </div>
            <div className="config-item">
              <span className="config-label">Audit Log Retention:</span>
              <span className="config-value">{systemConfig.auditLogRetention} days</span>
            </div>
          </div>
        </div>
      )}

      {diagnostics && (
        <div className="diagnostics-results">
          <h4>Diagnostics Results</h4>
          <div className="diagnostics-grid">
            <div className="diagnostic-item">
              <span className="diagnostic-label">Database Status:</span>
              <span className={`diagnostic-value ${diagnostics.databaseStatus === 'CONNECTED' ? 'success' : 'error'}`}>
                {diagnostics.databaseStatus}
              </span>
            </div>
            <div className="diagnostic-item">
              <span className="diagnostic-label">Memory Usage:</span>
              <span className="diagnostic-value">{diagnostics.memoryUsage?.percentage}%</span>
            </div>
            <div className="diagnostic-item">
              <span className="diagnostic-label">Disk Space:</span>
              <span className="diagnostic-value">{diagnostics.diskSpace?.percentage}%</span>
            </div>
            <div className="diagnostic-item">
              <span className="diagnostic-label">Network Status:</span>
              <span className={`diagnostic-value ${diagnostics.networkStatus === 'CONNECTED' ? 'success' : 'error'}`}>
                {diagnostics.networkStatus}
              </span>
            </div>
            <div className="diagnostic-item">
              <span className="diagnostic-label">Application Health:</span>
              <span className={`diagnostic-value ${diagnostics.applicationHealth === 'HEALTHY' ? 'success' : 'error'}`}>
                {diagnostics.applicationHealth}
              </span>
            </div>
            <div className="diagnostic-item">
              <span className="diagnostic-label">Security Status:</span>
              <span className={`diagnostic-value ${diagnostics.securityStatus === 'SECURE' ? 'success' : 'error'}`}>
                {diagnostics.securityStatus}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'security':
        return renderSecurity();
      case 'maintainability':
        return renderMaintainability();
      case 'configuration':
        return renderConfiguration();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="security-dashboard">
      <div className="security-header">
        <h2>🔒 Security & Maintainability Dashboard</h2>
        <p>Comprehensive security and system maintenance management</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="security-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          🔒 Security
        </button>
        <button 
          className={`tab-button ${activeTab === 'maintainability' ? 'active' : ''}`}
          onClick={() => setActiveTab('maintainability')}
        >
          🔧 Maintainability
        </button>
        <button 
          className={`tab-button ${activeTab === 'configuration' ? 'active' : ''}`}
          onClick={() => setActiveTab('configuration')}
        >
          ⚙️ Configuration
        </button>
      </div>

      <div className="security-content">
        {renderTabContent()}
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Processing security request...</p>
        </div>
      )}
    </div>
  );
};

export default SecurityDashboard;
