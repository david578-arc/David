// API Configuration for Examly Premium Project
const API_CONFIG = {
  BASE_URL: ('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io'),
  FRONTEND_URL: ('https://8081-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io'),
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    
    // Teams
    TEAMS: '/api/teams',
    TEAM_REGISTER: '/api/teams/register',
    TEAM_STATUS: '/api/teams/{id}/status',
    
    // Players
    PLAYERS: '/api/players',
    PLAYER_BY_ID: '/api/players/{id}',
    PLAYER_STATS: '/api/players/{id}/stats',
    PLAYER_MEDICAL: '/api/players/{id}/medical',
    PLAYER_TOP_SCORERS: '/api/players/top-scorers',
    PLAYER_SEARCH: '/api/players/search',
    
    // Matches
    MATCHES: '/api/matches',
    MATCH_BY_ID: '/api/matches/{id}',
    MATCH_RESULT: '/api/matches/{id}/result',
    MATCH_STATS: '/api/matches/{id}/statistics',
    MATCH_EVENTS: '/api/matches/{id}/events',
    MATCHES_STATUS: '/api/matches/status/{status}',
    MATCHES_UPCOMING: '/api/matches/upcoming',
    MATCHES_LIVE: '/api/matches/live',
    MATCHES_PAST: '/api/matches/past',
    
    // Tournaments
    TOURNAMENTS: '/api/tournaments',
    TOURNAMENT_BY_ID: '/api/tournaments/{id}',
    TOURNAMENT_STATUS: '/api/tournaments/status/{status}',
    TOURNAMENT_ACTIVE: '/api/tournaments/active',
    TOURNAMENT_UPCOMING: '/api/tournaments/upcoming',
    TOURNAMENT_STANDINGS: '/api/tournaments/{id}/standings',
    TOURNAMENT_BRACKET: '/api/tournaments/{id}/bracket',
    TOURNAMENT_ADVANCE: '/api/tournaments/{id}/advance',
    TOURNAMENT_STATISTICS: '/api/tournaments/{id}/statistics',
    
    // Venues
    VENUES: '/api/venues',
    VENUE_BY_ID: '/api/venues/{id}',
    VENUE_BY_CITY: '/api/venues/city/{city}',
    VENUE_BY_COUNTRY: '/api/venues/country/{country}',
    VENUE_BY_CAPACITY: '/api/venues/capacity',
    VENUE_BY_SURFACE: '/api/venues/surface/{surfaceType}',
    // Profile
    PROFILE: '/api/profile',

    // Tickets & Payments
    TICKETS: '/api/tickets',
    MY_TICKETS: '/api/tickets/my',
    PAYMENT_CHECKOUT: '/api/payments/checkout',
    PAYMENT_CAPTURE: '/api/payments/capture/{reference}',
    
    // Officials
    OFFICIALS: '/api/officials',
    OFFICIAL_BY_ID: '/api/officials/{id}',
    OFFICIAL_BY_TYPE: '/api/officials/type/{type}',
    OFFICIAL_BY_NATIONALITY: '/api/officials/nationality/{nationality}',
    OFFICIAL_BY_EXPERIENCE: '/api/officials/experience',
    
    // Notifications
    NOTIFICATIONS: '/api/notifications',
    NOTIFICATIONS_BY_USER: '/api/notifications/user/{userId}',
    NOTIFICATIONS_UNREAD_BY_USER: '/api/notifications/user/{userId}/unread',
    NOTIFICATIONS_MARK_ALL_READ: '/api/notifications/user/{userId}/mark-all-read',
    NOTIFICATION_MARK_READ: '/api/notifications/{id}/read',
    NOTIFICATION_DELETE: '/api/notifications/{id}',
    NOTIFICATION_BROADCAST: '/api/notifications/broadcast',
    
    // Admin
    ADMIN_ANALYTICS: '/api/admin/analytics',
    ADMIN_REPORTS: '/api/admin/reports',
    ADMIN_AUDIT_LOGS: '/api/admin/audit-logs',
    ADMIN_SYSTEM_HEALTH: '/api/admin/system-health',
    ADMIN_USERS: '/api/auth/users',
    
    // AI Services
    AI_TOURNAMENT_PROCESS: '/api/ai/tournament/process',
    AI_TOURNAMENT_PROCESS_ONE: '/api/ai/tournament/process/{tournamentId}',
    AI_MATCH_ANALYZE: '/api/ai/match/analyze/{matchId}',
    AI_ML_PREDICT: '/api/ai/ml/predict/match/{matchId}',
    AI_ML_ANALYZE_TOURNAMENT: '/api/ai/ml/analyze/tournament/{tournamentId}',
    AI_ML_OPTIMIZE: '/api/ai/ml/optimize/{entityType}/{entityId}',
    AI_NLP_SEARCH: '/api/ai/nlp/search',
    AI_NLP_REPORT: '/api/ai/nlp/report/generate',
    AI_WORKFLOW_CREATE: '/api/ai/workflow/create',
    AI_WORKFLOW_ROUTE: '/api/ai/workflow/route',
    AI_WORKFLOW_NOTIFY: '/api/ai/workflow/notify',
    AI_WORKFLOW_OPTIMIZE: '/api/ai/workflow/optimize',
    AI_ANOMALY_DETECT_PERFORMANCE: '/api/ai/anomaly/detect/performance',
    AI_ANOMALY_DETECT_BEHAVIOR: '/api/ai/anomaly/detect/behavior'
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint, params = {}) => {
  let url = API_CONFIG.BASE_URL + endpoint;
  
  // Replace path parameters
  Object.keys(params).forEach(key => {
    url = url.replace(`{${key}}`, params[key]);
  });
  
  return url;
};

// Helper function to get endpoint URL
export const getEndpoint = (endpointName, params = {}) => {
  const endpoint = API_CONFIG.ENDPOINTS[endpointName];
  if (!endpoint) {
    throw new Error(`Endpoint '${endpointName}' not found`);
  }
  return buildApiUrl(endpoint, params);
};

export default API_CONFIG;

