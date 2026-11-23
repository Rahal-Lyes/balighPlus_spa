<template>
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <h1>{{ t("reports") }}</h1>
      <div class="filters" style="display: flex; gap: 8px; flex-wrap: wrap">
        <select
          v-model="filter.category"
          style="padding: 8px; border-radius: 8px; border: 1px solid var(--brd)"
        >
          <option value="">{{ t("all_categories") }}</option>
          <option v-for="(cat, key) in CATEGORIES" :key="key" :value="key">
            {{ cat.label }}
          </option>
        </select>
        <select
          v-model="filter.status"
          style="padding: 8px; border-radius: 8px; border: 1px solid var(--brd)"
        >
          <option value="">{{ t("all_status") }}</option>
          <option v-for="(st, key) in STATUSES" :key="key" :value="key">
            {{ st.label_en }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" style="text-align: center; padding: 40px">
      <LoadingSpinner />
    </div>

    <!-- Empty state -->
    <EmptyState
      v-else-if="reports.length === 0"
      icon="📋"
      :title="t('no_reports')"
    />
    <!-- Reports list -->
    <div v-else class="reports-list">
      <ReportCard
        v-for="report in reports"
        :key="report.id"
        :report="report"
        :voted="voted[report.id] || false"
        @vote="handleVote(report.id)"
        @open-map="showMap(report)"
        @open-lb="openLightbox(report, $event)"
      />
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination.pages > 1"
      class="pagination"
      style="
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-top: 24px;
        flex-wrap: wrap;
      "
    >
      <button
        v-for="p in pagination.pages"
        :key="p"
        :class="{ active: pagination.page === p }"
        @click="goToPage(p)"
        style="
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--brd);
          cursor: pointer;
        "
      >
        {{ p }}
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useI18n } from "@/composables/useI18n";
import { CATEGORIES, STATUSES } from "@/composables/useApi";
import api from "@/composables/useApi";
import ReportCard from "@/components/ReportCard.vue";
import LoadingSpinner from "@/components/Loadingspinner.vue";   // casse corrigée
import EmptyState from "@/components/Emptystate.vue";          // casse corrigée

const { t } = useI18n();

const reports = ref([]);
const loading = ref(false);
const voted = ref({});

const filter = reactive({
  category: "",
  status: "",
});

const pagination = reactive({
  page: 1,
  per_page: 10,
  pages: 1,
  total: 0,
});

// Rechargement automatique lors du changement de filtre
watch(
  () => [filter.category, filter.status],
  () => {
    pagination.page = 1;
    loadReports();
  }
);

async function loadReports() {
  loading.value = true;
  try {
    const params = {
      page: pagination.page,
      per_page: pagination.per_page,
    };
    if (filter.category) params.category = filter.category;
    if (filter.status) params.status = filter.status;

    const res = await api.get("/reports", { params });

    if (res.data.items && Array.isArray(res.data.items)) {
      reports.value = res.data.items;
      pagination.pages = res.data.pages || 1;
      pagination.total = res.data.total || 0;
    }
  } catch (err) {
    console.error("Erreur chargement rapports:", err);
  } finally {
    loading.value = false;
  }
}

async function handleVote(reportId) {
  // Évite un double vote déjà enregistré localement
  if (voted.value[reportId]) return;

  try {
    const response = await api.post(`/reports/${reportId}/vote`);
    voted.value[reportId] = true;

    // Met à jour le compteur avec la valeur renvoyée par l'API (si disponible)
    const newVoteCount = response.data?.votes_count;
    const idx = reports.value.findIndex((r) => r.id === reportId);
    if (idx !== -1) {
      if (typeof newVoteCount === "number") {
        reports.value[idx].votes_count = newVoteCount;
      } else {
        // fallback : incrémentation locale
        reports.value[idx].votes_count++;
      }
    }
  } catch (err) {
    console.warn("Erreur lors du vote:", err);
    // Optionnel : afficher une notification à l'utilisateur
  }
}

function goToPage(page) {
  pagination.page = page;
  loadReports();
}

function showMap(report) {
  // TODO: ouvrir une modale avec la carte
  console.log("Afficher la carte pour:", report);
}

function openLightbox(report, index) {
  // TODO: ouvrir la lightbox avec les images
  console.log("Ouvrir lightbox:", report, index);
}

onMounted(() => {
  loadReports();

});
</script>

<style scoped>
.page {
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 700;
}

.filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.reports-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.pagination button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--brd);
  background: var(--w);
  cursor: pointer;
  transition: all 0.2s;
}

.pagination button.active {
  background: var(--p);
  color: white;
  border-color: var(--p);
}

.pagination button:hover:not(.active) {
  border-color: var(--p);
}
</style>