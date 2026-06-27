// api/auth.js
import api from "@/composables/useApi";

/**
 * Register a new user
 * POST /api/auth/register
 * @param {object} credentials - { name, email, password, password_confirm }
 * @returns {Promise} - { access_token, token_type, user }
 */
export const register = (credentials) => {
  return api.post("/auth/register", credentials);
};

/**
 * Login user
 * POST /api/auth/login
 * @param {object} credentials - { email, password }
 * @returns {Promise} - { access_token, token_type, user }
 */
export const login = (credentials) => {
  return api.post("/auth/login", credentials);
};

/**
 * Admin login
 * POST /api/auth/admin/login
 * @param {object} credentials - { password }
 * @returns {Promise} - { access_token, token_type }
 */
export const adminLogin = (credentials) => {
  return api.post("/auth/admin/login", credentials);
};