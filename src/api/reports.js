// api/reports.js
import api from "@/composables/useApi";

/**
 * Create a new report
 * POST /api/reports
 * @param {FormData} formData - title, category, wilaya, wilaya_id, commune, description, lat, lng, priority, images
 * @returns {Promise} - ReportOut
 */
export const createReport = (formData) => {
  return api.post("/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * List reports (public, paginated + filterable)
 * GET /api/reports
 * @param {object} params - { page, per_page, status, category, wilaya, search }
 * @returns {Promise} - PaginatedReports
 */
export const getReports = (params) => {
  return api.get("/reports", { params });
};

/**
 * Get reports for the map (all, no pagination)
 * GET /api/reports/map
 * @returns {Promise} - ReportListOut[]
 */
export const getMapReports = () => {
  return api.get("/reports/map");
};

/**
 * Get reports of the authenticated user
 * GET /api/reports/mine
 * @param {object} params - { page, per_page }
 * @returns {Promise} - PaginatedReports
 */
export const getMyReports = (params) => {
  return api.get("/reports/mine", { params });
};

/**
 * Get a single report detail
 * GET /api/reports/:id
 * @param {number} id - Report ID
 * @returns {Promise} - ReportOut
 */
export const getReportDetail = (id) => {
  return api.get(`/reports/${id}`);
};

/**
 * Vote on a report
 * POST /api/reports/:id/vote
 * @param {number} id - Report ID
 * @returns {Promise}
 */
export const voteReport = (id) => {
  return api.post(`/reports/${id}/vote`);
};

/**
 * Add a comment to a report
 * POST /api/reports/:id/comments
 * @param {number} reportId - Report ID
 * @param {string} text - Comment text
 * @returns {Promise} - CommentOut
 */
export const addComment = (reportId, text) => {
  return api.post(`/reports/${reportId}/comments`, { text });
};