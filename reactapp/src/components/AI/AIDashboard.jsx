import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AIDashboard.css';

const AIDashboard = ({ token }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [aiStatus, setAiStatus] = useState(null);
  const [anomalyStats, setAnomalyStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAIStatus();
    fetchAnomalyStatistics();
  }, []);

  const fetchAIStatus = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/ai/status', config);
      setAiStatus(response.data);
    } catch (err) {
      setError('Failed to fetch AI status: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchAnomalyStatistics = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/ai/anomaly/statistics', config);
      setAnomalyStats(response.data);
    } catch (err) {
      setError('Failed to fetch anomaly statistics: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAIAction = async (action, data = {}) => {
    setLoading(true);
    setError('');
    
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      let response;
      switch (action) {
        case 'detectPerformanceAnomalies':
          response = await axios.post('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/ai/anomaly/detect/performance', {}, config);
          break;
        case 'detectSecurityAnomalies':
          response = await axios.post('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/ai/anomaly/detect/security', {}, config);
          break;
        case 'optimizeWorkflows':
          response = await axios.post('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/ai/workflow/optimize', {}, config);
          break;
        case 'processTournaments':
          response = await axios.post('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/ai/tournament/process', {}, config);
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
    <div className="ai-overview">
      <div className="status-cards">
        <div className="status-card">
          <h3>🤖 AI System Status</h3>
          <div className={`status-indicator ${aiStatus?.systemStatus === 'OPERATIONAL' ? 'operational' : 'error'}`}>
            {aiStatus?.systemStatus || 'Unknown'}
          </div>
          <p>All AI services are running</p>
        </div>
        
        <div className="status-card">
          <h3>🔍 Anomaly Detection</h3>
          <div className="anomaly-stats">
            <div className="stat-item">
              <span className="stat-value">{anomalyStats?.totalAnomalies || 0}</span>
              <span className="stat-label">Total Anomalies</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{anomalyStats?.unresolvedAnomalies || 0}</span>
              <span className="stat-label">Unresolved</span>
            </div>
          </div>
        </div>
        
        <div className="status-card">
          <h3>⚡ Performance</h3>
          <div className="performance-metrics">
            <div className="metric">
              <span className="metric-label">Response Time</span>
              <span className="metric-value">150ms</span>
            </div>
            <div className="metric">
              <span className="metric-label">Accuracy</span>
              <span className="metric-value">94.2%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ai-services">
        <h3>AI Services Status</h3>
        <div className="services-grid">
          {aiStatus?.services && Object.entries(aiStatus.services).map(([service, status]) => (
            <div key={service} className="service-item">
              <span className="service-name">{service.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className={`service-status ${status.toLowerCase()}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnomalyDetection = () => (
    <div className="anomaly-detection">
      <div className="anomaly-controls">
        <h3>Anomaly Detection Controls</h3>
        <div className="control-buttons">
          <button 
            onClick={() => handleAIAction('detectPerformanceAnomalies')}
            disabled={loading}
            className="control-btn performance"
          >
            🔍 Detect Performance Anomalies
          </button>
          <button 
            onClick={() => handleAIAction('detectSecurityAnomalies')}
            disabled={loading}
            className="control-btn security"
          >
            🛡️ Detect Security Anomalies
          </button>
        </div>
      </div>

      <div className="anomaly-statistics">
        <h3>Anomaly Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card critical">
            <span className="stat-number">{anomalyStats?.criticalAnomalies || 0}</span>
            <span className="stat-label">Critical</span>
          </div>
          <div className="stat-card high">
            <span className="stat-number">{anomalyStats?.highAnomalies || 0}</span>
            <span className="stat-label">High</span>
          </div>
          <div className="stat-card medium">
            <span className="stat-number">{anomalyStats?.mediumAnomalies || 0}</span>
            <span className="stat-label">Medium</span>
          </div>
          <div className="stat-card low">
            <span className="stat-number">{anomalyStats?.lowAnomalies || 0}</span>
            <span className="stat-label">Low</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkflowManagement = () => (
    <div className="workflow-management">
      <div className="workflow-controls">
        <h3>Workflow Management</h3>
        <div className="control-buttons">
          <button 
            onClick={() => handleAIAction('optimizeWorkflows')}
            disabled={loading}
            className="control-btn optimize"
          >
            ⚡ Optimize Workflows
          </button>
        </div>
      </div>

      <div className="workflow-info">
        <h3>Automated Workflows</h3>
        <div className="workflow-list">
          <div className="workflow-item">
            <span className="workflow-name">Tournament Processing</span>
            <span className="workflow-status active">Active</span>
          </div>
          <div className="workflow-item">
            <span className="workflow-name">Match Analysis</span>
            <span className="workflow-status active">Active</span>
          </div>
          <div className="workflow-item">
            <span className="workflow-name">Data Validation</span>
            <span className="workflow-status active">Active</span>
          </div>
          <div className="workflow-item">
            <span className="workflow-name">Notification Dispatch</span>
            <span className="workflow-status active">Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTournamentProcessing = () => (
    <div className="tournament-processing">
      <div className="processing-controls">
        <h3>Tournament Processing</h3>
        <div className="control-buttons">
          <button 
            onClick={() => handleAIAction('processTournaments')}
            disabled={loading}
            className="control-btn process"
          >
            🏆 Process All Tournaments
          </button>
        </div>
      </div>

      <div className="processing-info">
        <h3>Automated Processing Features</h3>
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">✅</span>
            <span className="feature-text">Data Validation</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📅</span>
            <span className="feature-text">Scheduling Optimization</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <span className="feature-text">Workflow Coordination</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span className="feature-text">Performance Analysis</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'anomaly':
        return renderAnomalyDetection();
      case 'workflow':
        return renderWorkflowManagement();
      case 'tournament':
        return renderTournamentProcessing();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="ai-dashboard">
      <div className="ai-header">
        <h2>🤖 AI & Automation Dashboard</h2>
        <p>Intelligent system management and automation</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="ai-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'anomaly' ? 'active' : ''}`}
          onClick={() => setActiveTab('anomaly')}
        >
          🔍 Anomaly Detection
        </button>
        <button 
          className={`tab-button ${activeTab === 'workflow' ? 'active' : ''}`}
          onClick={() => setActiveTab('workflow')}
        >
          🔄 Workflow Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'tournament' ? 'active' : ''}`}
          onClick={() => setActiveTab('tournament')}
        >
          🏆 Tournament Processing
        </button>
      </div>

      <div className="ai-content">
        {renderTabContent()}
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Processing AI request...</p>
        </div>
      )}
    </div>
  );
};

export default AIDashboard;
