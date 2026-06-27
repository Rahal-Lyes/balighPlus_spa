// api/users.js
import api from "@/composables/useApi";

/**
 * Get current user profile
 * GET /api/users/me
 * @returns {Promise} - UserProfile
 */
export const getCurrentUser = () => {
  return api.get("/users/me");
};

/**
 * Change password for the authenticated user
 * PATCH /api/users/me/password
 * @param {object} data - { old_password, new_password, new_password_confirm }
 * @returns {Promise}
 */
export const changePassword = (data) => {
  return api.patch("/users/me/password", data);
};





export const toggleUserBan = (userId) => api.patch(`/users/${userId}/ban`);

export const deleteUser = (userId) => api.delete(`/users/${userId}`);