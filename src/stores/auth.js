import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/http";
import API_ENDPOINTS from "@/config/endpoints";
import router from "@/router";
import { useToastStore } from "@/stores/ToastStore";

export const useAuthStore = defineStore("auth", () => {
  const toast = useToastStore();

  // =========================
  // STATE
  // =========================

  const access = ref(localStorage.getItem("access") || null);
  const refresh = ref(localStorage.getItem("refresh") || null);
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"));

  // =========================
  // GETTERS
  // =========================

  /** Vrai si un token d'accès est présent */
  const isLoggedIn = computed(() => !!access.value);

  /** Alias pour la compatibilité */
  const isAuthenticated = isLoggedIn;

  const isAdmin = computed(
    () => user.value?.is_admin === true || user.value?.role === "admin",
  );

  const getUser = computed(() => user.value);
  const getUserId = computed(() => user.value?.id ?? null);
  const getUsername = computed(() => user.value?.username ?? null);
  const getEmail = computed(() => user.value?.email ?? null);

  // =========================
  // HELPERS PRIVÉS
  // =========================

  const _setTokens = (accessToken, refreshToken) => {
    access.value = accessToken;
    refresh.value = refreshToken;
    localStorage.setItem("access", accessToken);
    localStorage.setItem("refresh", refreshToken);
  };

  const _setUser = (userData) => {
    user.value = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const _clearAuth = () => {
    access.value = null;
    refresh.value = null;
    user.value = null;
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
  };

  // =========================
  // ACTIONS
  // =========================

  /**
   * Connexion citoyen
   * @param {{ email: string, password: string }} credentials
   */
  const login = async (credentials) => {
    try {
      const { data } = await api.post(API_ENDPOINTS.login, credentials);
      const { access: at, refresh: rt, user: userData } = data;

      _setTokens(at, rt);
      userData ? _setUser(userData) : await fetchCurrentUser();

      toast.ToastSuccess("Bienvenue " + (userData?.name ?? ""), 2000);
      return data;
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail[0]?.msg
        : (detail ?? "Identifiants incorrects");
      toast.ToastError(msg);
      throw err;
    }
  };

  /**
   * Connexion administrateur
   * @param {string} password
   */

  const adminLogin = async (password) => {
    try {
      const { data } = await api.post(API_ENDPOINTS.adminLogin, { password });

      // ✅ L'API retourne { access_token, token_type }
      const accessToken = data.access_token;
      if (!accessToken) throw new Error("Token manquant dans la réponse");

      // Pas de refresh token pour l'admin
      access.value = accessToken;
      refresh.value = null;
      localStorage.setItem("access", accessToken);
      localStorage.removeItem("refresh");

      // L'API ne retourne pas d'objet user → on le construit
      _setUser({ username: "admin", role: "admin", is_admin: true });

      toast.ToastSuccess("Accès administrateur accordé", 2000);
      router.push({ name: "admin" });
      return data;
    } catch (err) {
      toast.ToastError(
        err.response?.data?.message ??
          err.response?.data?.detail ??
          "Mot de passe administrateur incorrect",
      );
      throw err;
    }
  };
  /**
   * Inscription citoyen
   */
  const register = async (payload) => {
    try {
      const { data } = await api.post(API_ENDPOINTS.register, payload);
      toast.ToastSuccess("Compte créé avec succès", 2000);
      return data;
    } catch (err) {
      toast.ToastError(
        err.response?.data?.message ?? "Erreur lors de l'inscription",
      );
      throw err;
    }
  };

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  const fetchCurrentUser = async () => {
    try {
      const { data } = await api.get(API_ENDPOINTS.currentUser);
      _setUser(data);
      return data;
    } catch (err) {
      console.error("fetchCurrentUser error:", err);
      throw err;
    }
  };

  /**
   * Déconnexion
   */
  const logout = async () => {
    try {
      if (refresh.value) {
        await api.post(API_ENDPOINTS.logout, { refresh: refresh.value });
      }
    } catch (err) {
      console.error("logout error:", err);
    } finally {
      _clearAuth();
      toast.ToastSuccess("Déconnexion réussie", 2000);
      router.push("/login");
    }
  };

  // =========================
  // EXPOSE
  // (helpers publics pour cas rares : intercepteur HTTP, etc.)
  // =========================

  return {
    // state
    access,
    refresh,
    user,

    // getters
    isLoggedIn, // ← utilisé dans les templates
    isAuthenticated, // ← alias rétrocompatible
    isAdmin,
    getUser,
    getUserId,
    getUsername,
    getEmail,

    // actions
    login,
    adminLogin,
    register,
    logout,
    fetchCurrentUser,

    // helpers exposés (intercepteur token refresh, tests)
    setTokens: _setTokens,
    setUser: _setUser,
    clearAuth: _clearAuth,
  };
});
