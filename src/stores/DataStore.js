import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/http";
import API_ENDPOINTS from "@/config/endpoints";

export const useDataStore = defineStore("dataStore", () => {

  // ── Reports (paginés) ─────────────────────────────────────────
  const reports = ref({
    total: 0,
    page: 1,
    per_page: 12,
    pages: 1,
    items: [],
  });

  // ── Stats (depuis /api/stats) ─────────────────────────────────
  const statsData = ref({
    total: 0,
    users: 0,
    by_status: { pending: 0, processing: 0, resolved: 0 },
    by_category: { road: 0, lighting: 0, waste: 0, water: 0, other: 0 },
    by_priority: { urgent: 0, normal: 0, low: 0 },
  });

  // ── Computed (accès rapide) ───────────────────────────────────
  const stats = computed(() => ({
    total:      statsData.value.total,
    pending:    statsData.value.by_status.pending,
    processing: statsData.value.by_status.processing,
    resolved:   statsData.value.by_status.resolved,
    users:      statsData.value.users,
    by_category: statsData.value.by_category,
    by_priority: statsData.value.by_priority,
  }));

  // ── Actions ───────────────────────────────────────────────────
  const fetchReports = async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.reports, { params });
    reports.value = response.data;
  };

  const fetchStats = async () => {
    const response = await api.get(API_ENDPOINTS.stats);
    statsData.value = response.data;
  };

  // Charge tout en parallèle
  const fetchAll = async () => {
    await Promise.all([fetchReports(), fetchStats()]);
  };

  return {
    reports,
    stats,
    statsData,
    fetchReports,
    fetchStats,
    fetchAll,
  };
});