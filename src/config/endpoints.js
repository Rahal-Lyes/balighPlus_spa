const API_ENDPOINTS = {
  // Auth
  register:   "auth/register",
  login:      "auth/login",
  adminLogin: "auth/admin/login",
  logout:     "auth/logout",
  refresh:    "auth/refresh/",

  // User
  currentUser:    "users/me",
  changePassword: "users/me/password",

  // Reports
  reports:        "reports",
  reportsMap:     "reports/map",
  myReports:      "reports/mine",
  reportDetails:  (id) => `reports/${id}`,
  voteReport:     (id) => `reports/${id}/vote`,
  reportComments: (id) => `reports/${id}/comments`,

  // Notifications (user)
  notifications:            "notifications",
  notificationsMarkRead:    "notifications/mark-read",
  notificationsUnreadCount: "notifications/unread-count",

  // Notifications (admin)
  adminNotifications:        "notifications/admin",
  adminNotificationsMarkRead:"notifications/admin/mark-read",


  // Admin Stats
  adminStats: "admin/stats",

  // Admin Reports
  adminReports:      "admin/reports",
  adminReportStatus: (id) => `admin/reports/${id}/status`,
  adminReportDelete: (id) => `admin/reports/${id}`,
  adminReportReply:  (id) => `admin/reports/${id}/reply`,

  // Admin Users
  adminUsers:      "admin/users",
  adminUserBan:    (id) => `admin/users/${id}/ban`,
  adminUserDelete: (id) => `admin/users/${id}`,

  // Admin Comments
  adminCommentDelete: (id) => `admin/comments/${id}`,

  // Admin dashboard
  admin_dashboard: "admin/dashboard",

  // Export
  exportCsv: "admin/export/csv",

  // Stats
  stats: "stats",

  // Health
  health: "",
};

export default API_ENDPOINTS;