// api/admin.js
import api from "@/composables/useApi";

/**
 * Get admin dashboard stats
 * GET /api/admin/stats
 * @returns {Promise}
 */
export const getAdminStats = () => {
  return api.get("/admin/stats");
};

/**
 * List all reports (admin view, paginated + filterable)
 * GET /api/admin/reports
 * @param {object} params - { page, per_page, status, category, wilaya, search }
 * @returns {Promise} - PaginatedReports
 */
export const getAdminReports = (params) => {
  return api.get("/admin/reports", { params });
};

/**
 * Update report status and/or priority (admin only)
 * PATCH /api/admin/reports/:id/status
 * @param {number} reportId - Report ID
 * @param {object} data - { status, priority }
 * @returns {Promise} - ReportOut
 */
export const updateReportStatus = (reportId, data) => {
  return api.patch(`/admin/reports/${reportId}/status`, data);
};

/**
 * Delete a report (admin only)
 * DELETE /api/admin/reports/:id
 * @param {number} reportId - Report ID
 * @returns {Promise}
 */
export const deleteReport = (reportId) => {
  return api.delete(`/admin/reports/${reportId}`);
};

/**
 * Admin reply to a report (creates a comment marked as admin)
 * POST /api/admin/reports/:id/reply
 * @param {number} reportId - Report ID
 * @param {object} data - { text }
 * @returns {Promise} - CommentOut
 */
export const adminReplyToReport = (reportId, data) => {
  return api.post(`/admin/reports/${reportId}/reply`, data);
};

/**
 * List all users (admin only)
 * GET /api/admin/users
 * @param {object} params - { search }
 * @returns {Promise}
 */
export const getAdminUsers = (params) => {
  return api.get("/admin/users", { params });
};

/**
 * Toggle ban status of a user (admin only)
 * PATCH /api/admin/users/:id/ban
 * @param {number} userId - User ID
 * @returns {Promise}
 */
export const toggleUserBan = (userId) => {
  return api.patch(`/admin/users/${userId}/ban`);
};

/**
 * Delete a user (admin only)
 * DELETE /api/admin/users/:id
 * @param {number} userId - User ID
 * @returns {Promise}
 */
export const deleteUser = (userId) => {
  return api.delete(`/admin/users/${userId}`);
};

/**
 * Delete a comment (admin only)
 * DELETE /api/admin/comments/:id
 * @param {number} commentId - Comment ID
 * @returns {Promise}
 */
export const deleteComment = (commentId) => {
  return api.delete(`/admin/comments/${commentId}`);
};

/**
 * Export all reports as CSV (admin only)
 * GET /api/admin/export/csv
 * @returns {Promise}
 */
export const exportReportsCsv = () => {
  return api.get("/admin/export/csv", { responseType: "blob" });
};

export const getAdminDashboard = async () => {
  const [statsRes, reportsRes, usersRes] = await Promise.all([
    api.get("/admin/stats"),
    api.get("/admin/reports"),
    api.get("/admin/users"),
  ]);

  // Normalise en une seule structure attendue par AdminView
  const stats   = statsRes.data;
  const reports = reportsRes.data?.items ?? reportsRes.data ?? [];
  const users   = usersRes.data?.items   ?? usersRes.data   ?? [];

  return {
    data: {
      stats: {
        total:      stats.total      ?? 0,
        pending:    stats.pending    ?? 0,
        processing: stats.processing ?? 0,
        resolved:   stats.resolved   ?? 0,
        users:      stats.users      ?? users.length,
        rate:       stats.total
          ? Math.round((stats.resolved / stats.total) * 100)
          : 0,
      },
      reports,
      users,
      monthly:  stats.monthly  ?? {},
      by_cat:   stats.by_category ?? {},
    },
  };
};

export const updateReportStatusWithComment = (reportId, data) => {
  return api.patch(`/admin/reports/${reportId}/status`, data);
};