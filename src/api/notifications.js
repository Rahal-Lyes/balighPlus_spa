// api/notifications.js
import api from "@/composables/useApi";

/**
 * Get notifications for the authenticated user
 * GET /api/notifications
 * @returns {Promise} - NotificationOut[]
 */
export const getNotifications = () => {
  return api.get("/notifications");
};

/**
 * Get unread notifications count
 * GET /api/notifications/unread-count
 * @returns {Promise}
 */
export const getUnreadCount = () => {
  return api.get("/notifications/unread-count");
};

/**
 * Mark all user notifications as read
 * POST /api/notifications/mark-read
 * @returns {Promise}
 */
export const markNotificationsRead = () => {
  return api.post("/notifications/mark-read");
};

/**
 * Get admin notifications
 * GET /api/notifications/admin
 * @returns {Promise} - NotificationOut[]
 */
export const getAdminNotifications = () => {
  return api.get("/notifications/admin");
};

/**
 * Mark all admin notifications as read
 * POST /api/notifications/admin/mark-read
 * @returns {Promise}
 */
export const markAdminNotificationsRead = () => {
  return api.post("/notifications/admin/mark-read");
};