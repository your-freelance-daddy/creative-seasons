// Data Store - Handles all persistence and analytics
const DataStore = {
  STORAGE_KEY: 'creative_pulse_sessions',
  ANALYTICS_KEY: 'creative_pulse_analytics',

  // Save a session
  saveSession(session) {
    const sessions = this.getAllSessions();
    session.id = Date.now();
    session.timestamp = new Date().toISOString();
    sessions.push(session);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
    this.trackAnalytics(session);
    return session.id;
  },

  // Get all sessions
  getAllSessions() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Get sessions for a specific mode
  getSessionsByMode(mode) {
    return this.getAllSessions().filter(s => s.mode === mode);
  },

  // Get session by ID
  getSession(id) {
    return this.getAllSessions().find(s => s.id === id);
  },

  // Track analytics
  trackAnalytics(session) {
    const analytics = this.getAnalytics();
    analytics.totalSessions = (analytics.totalSessions || 0) + 1;
    analytics.modeBreakdown = analytics.modeBreakdown || {};
    analytics.modeBreakdown[session.mode] = (analytics.modeBreakdown[session.mode] || 0) + 1;
    analytics.lastSessionDate = new Date().toISOString();
    localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(analytics));
  },

  // Get analytics
  getAnalytics() {
    const data = localStorage.getItem(this.ANALYTICS_KEY);
    return data ? JSON.parse(data) : {};
  },

  // Export sessions as JSON
  exportAsJSON(sessions = null) {
    const data = sessions || this.getAllSessions();
    return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  },

  // Clear all data
  clearAllData() {
    if (confirm('This will delete all your sessions. Are you sure?')) {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.ANALYTICS_KEY);
    }
  },

  // Get user stats
  getUserStats() {
    const sessions = this.getAllSessions();
    const analytics = this.getAnalytics();
    return {
      totalSessions: sessions.length,
      modeBreakdown: analytics.modeBreakdown || {},
      lastSession: sessions[sessions.length - 1]?.timestamp,
      streak: this.calculateStreak(sessions)
    };
  },

  // Calculate user streak
  calculateStreak(sessions) {
    if (sessions.length === 0) return 0;
    let streak = 1;
    for (let i = sessions.length - 1; i > 0; i--) {
      const current = new Date(sessions[i].timestamp).toDateString();
      const previous = new Date(sessions[i - 1].timestamp).toDateString();
      const dayDiff = (new Date(current) - new Date(previous)) / (1000 * 60 * 60 * 24);
      if (dayDiff <= 1) streak++;
      else break;
    }
    return streak;
  }
};

window.DataStore = DataStore;
