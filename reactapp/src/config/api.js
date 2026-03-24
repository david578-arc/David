const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io',
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || 'https://8081-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io',

  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    TEAMS: '/api/teams',
    TEAM_REGISTER: '/api/teams/register',
    TEAM_STATUS: '/api/teams/{id}/status',
    PLAYERS: '/api/players',
    PLAYER_STATS: '/api/players/{id}/stats',
    PLAYER_MEDICAL: '/api/players/{id}/medical',
    MATCHES: '/api/matches',
    MATCH_RESULT: '/api/matches/{id}/result',
    MATCH_EVENTS: '/api/matches/{id}/events',
    TOURNAMENTS: '/api/tournaments',
    TOURNAMENT_STANDINGS: '/api/tournaments/{id}/standings',
    TOURNAMENT_BRACKET: '/api/tournaments/{id}/bracket',
    VENUES: '/api/venues',
    OFFICIALS: '/api/officials',
    NOTIFICATIONS: '/api/notifications',
    NOTIFICATION_BROADCAST: '/api/notifications/broadcast',
    ADMIN_ANALYTICS: '/api/admin/analytics',
    ADMIN_REPORTS: '/api/admin/reports',
    ADMIN_AUDIT_LOGS: '/api/admin/audit-logs',
    ADMIN_SYSTEM_HEALTH: '/api/admin/system-health',
    AI_STATUS: '/api/ai/status',
    AI_TOURNAMENT_PROCESS: '/api/ai/tournament/process',
    AI_MATCH_ANALYZE: '/api/ai/match/analyze/{id}',
    AI_ML_PREDICT: '/api/ai/ml/predict/match/{id}',
    AI_NLP_SEARCH: '/api/ai/nlp/search',
    AI_NLP_REPORT: '/api/ai/nlp/report/generate',
    AI_WORKFLOW_CREATE: '/api/ai/workflow/create',
    AI_WORKFLOW_OPTIMIZE: '/api/ai/workflow/optimize',
    AI_ANOMALY_DETECT: '/api/ai/anomaly/detect',
    AI_ANOMALY_STATISTICS: '/api/ai/anomaly/statistics'
  }
};

export const buildApiUrl = (endpoint, params = {}) => {
  let url = API_CONFIG.BASE_URL + endpoint;
  Object.keys(params).forEach(key => {
    url = url.replace(`{${key}}`, params[key]);
  });
  return url;
};

export const getEndpoint = (endpointName, params = {}) => {
  const endpoint = API_CONFIG.ENDPOINTS[endpointName];
  if (!endpoint) throw new Error(`Endpoint '${endpointName}' not found`);
  return buildApiUrl(endpoint, params);
};

export default API_CONFIG;
