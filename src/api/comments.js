// api/comments.js
import api from "@/composables/useApi";

/**
 * Add a comment to a report
 * POST /api/comments/
 * @param {string} reportId - Report ID
 * @param {string} text - Comment text
 * @returns {Promise}
 */
export const addComment = (reportId, text) => {
  const form = new FormData();
  form.append("report_id", reportId);
  form.append("text", text);
  return api.post("/comments/", form);
};

/**
 * Get comments for a report
 * GET /api/comments/:reportId
 * @param {string} reportId - Report ID
 * @returns {Promise}
 */
export const getComments = (reportId) => {
  return api.get(`/comments/${reportId}`);
};
