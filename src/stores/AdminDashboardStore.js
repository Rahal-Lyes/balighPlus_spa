import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/http";
import API_ENDPOINTS from "@/config/endpoints";
import { useToastStore } from "@/stores/ToastStore";

export const useAdminDashboardStore = defineStore("adminDashboard", () => {
  const toast = useToastStore();

  // =========================
  // STATE
  // =========================  
  const notifOpen = ref(false)
  const notifications = ref([])
  const unreadCount = ref(0)
  const stats         = ref(null);   // { total, pending, processing, resolved, users, rate, avg_resolution_days }
  const monthly       = ref({});     // { "2026-06": 1 }
  const weekly        = ref({});     // { "S25": 1 }
  const byCategory    = ref({});     // { "lighting": 1 }
  const byWilaya      = ref({});     // { "البويرة": 1 }
  const statusMonthly = ref({});     // { "2026-06": { pending, processing, resolved } }
  const reports       = ref([]);     // []
  const users         = ref([]);     // []

  const loading = ref(false);
  const error   = ref(null);

  // =========================
  // GETTERS
  // =========================

  const isLoaded      = computed(() => stats.value !== null);
  const totalReports  = computed(() => stats.value?.total       ?? 0);
  const pendingCount  = computed(() => stats.value?.pending     ?? 0);
  const processingCount = computed(() => stats.value?.processing ?? 0);
  const resolvedCount = computed(() => stats.value?.resolved    ?? 0);
  const usersCount    = computed(() => stats.value?.users       ?? 0);
  const resolutionRate = computed(() => stats.value?.rate       ?? 0);
  const avgResolutionDays = computed(() => stats.value?.avg_resolution_days ?? null);

  // =========================
  // HELPERS PRIVÉS
  // =========================

  /**
   * Normalise la réponse API vers une structure homogène.
   * Supporte deux formats : { stats, reports, users, ... } OU format plat { total, pending, ... }
   */
  const _normalize = (body) => {
    if (body.stats) {
      // Format complet attendu
      stats.value         = body.stats;
      monthly.value       = body.monthly        ?? {};
      weekly.value        = body.weekly         ?? {};
      byCategory.value    = body.by_category    ?? {};
      byWilaya.value      = body.by_wilaya      ?? {};
      statusMonthly.value = body.status_monthly ?? {};
      reports.value       = body.reports        ?? [];
      users.value         = body.users          ?? [];
    } else {
      // Format plat (fallback)
      stats.value = {
        total:               body.total            ?? 0,
        pending:             body.pending          ?? 0,
        processing:          body.processing       ?? 0,
        resolved:            body.resolved         ?? 0,
        users:               body.users_total      ?? 0,
        rate:                body.resolution_rate  ?? 0,
        avg_resolution_days: null,
      };
      monthly.value    = Object.fromEntries(
        (body.monthly ?? []).map((r) => [`${r.year}-${String(r.month).padStart(2, "0")}`, r.count])
      );
      weekly.value        = {};
      byCategory.value    = Object.fromEntries((body.by_category ?? []).map((r) => [r.category, r.count]));
      byWilaya.value      = {};
      statusMonthly.value = {};
      reports.value       = body.reports ?? [];
      users.value         = body.users   ?? [];
    }
  };

  // =========================
  // ACTIONS
  // =========================

  /**
   * Charge le dashboard admin complet
   */



function toggleNotifications() {
    notifOpen.value = !notifOpen.value
}
  const fetchDashboard = async () => {
    loading.value = true;
    error.value   = null;
    try {
      const { data } = await api.get(API_ENDPOINTS.admin_dashboard);
      console.log("datais ",data)
      _normalize(data);
    } catch (err) {
      console.error("AdminDashboardStore – fetchDashboard:", err);
      error.value = err.response?.data?.detail ?? "Erreur de chargement";
      toast.ToastError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

    const getNotifications = async () => {
    try {
      const { data } = await api.get(API_ENDPOINTS.adminNotifications)

      notifications.value = data.notifications
      unreadCount.value = data.unread_count
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Met à jour le statut et/ou la priorité d'un signalement
   * @param {number|string} reportId
   * @param {{ status: string, priority?: string }} payload
   */
  const updateReportStatus = async (reportId, payload) => {
    try {
      const { data } = await api.patch(API_ENDPOINTS.adminReportStatus(reportId), payload);
      // Mise à jour locale immédiate
      const idx = reports.value.findIndex((r) => r.id === reportId);
      if (idx !== -1) Object.assign(reports.value[idx], data);
      return data;
    } catch (err) {
      console.error("AdminDashboardStore – updateReportStatus:", err);
      throw err;
    }
  };

  /**
   * Supprime un signalement
   * @param {number|string} reportId
   */
  const deleteReport = async (reportId) => {
    try {
      await api.delete(API_ENDPOINTS.adminReportDelete(reportId));
      reports.value = reports.value.filter((r) => r.id !== reportId);
    } catch (err) {
      console.error("AdminDashboardStore – deleteReport:", err);
      throw err;
    }
  };

  /**
   * Active / suspend un utilisateur
   * @param {number|string} userId
   */
  const toggleUserBan = async (userId) => {
    try {
      const { data } = await api.patch(API_ENDPOINTS.adminUserBan(userId));
      const u = users.value.find((u) => u.id === userId);
      if (u) u.banned = data.banned ?? data.is_banned ?? !u.banned;
      return data;
    } catch (err) {
      console.error("AdminDashboardStore – toggleUserBan:", err);
      throw err;
    }
  };

  /**
   * Supprime un utilisateur et ses signalements associés
   * @param {number|string} userId
   */
  const deleteUser = async (userId) => {
    try {
      await api.delete(API_ENDPOINTS.adminUserDelete(userId));
      users.value   = users.value.filter((u) => u.id !== userId);
      reports.value = reports.value.filter((r) => (r.user_id ?? r.userId) !== userId);
    } catch (err) {
      console.error("AdminDashboardStore – deleteUser:", err);
      throw err;
    }
  };

  /**
   * Exporte les signalements en CSV et déclenche le téléchargement
   */
  const exportCsv = async () => {
    try {
      const { data } = await api.get(API_ENDPOINTS.exportCsv, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "reports.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("AdminDashboardStore – exportCsv:", err);
      throw err;
    }
  };

  // =========================
  // RESET
  // =========================

  const $reset = () => {
    stats.value         = null;
    monthly.value       = {};
    weekly.value        = {};
    byCategory.value    = {};
    byWilaya.value      = {};
    statusMonthly.value = {};
    reports.value       = [];
    users.value         = [];
    loading.value       = false;
    error.value         = null;
  };

  // =========================
  // EXPOSE
  // =========================

  return {
    // state
    stats,
    monthly,
    weekly,
    byCategory,
    byWilaya,
    statusMonthly,
    reports,
    users,
    loading,
    error,
    notifOpen,
    notifications,
    unreadCount,


    // getters
    isLoaded,
    totalReports,
    pendingCount,
    processingCount,
    resolvedCount,
    usersCount,
    resolutionRate,
    avgResolutionDays,

    // actions
    fetchDashboard,
    updateReportStatus,
    deleteReport,
    toggleUserBan,
    deleteUser,
    exportCsv,
    toggleNotifications,
    getNotifications,

    // utils
    $reset,
  };
});