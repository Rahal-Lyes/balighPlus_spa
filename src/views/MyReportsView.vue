<template>
  <div>
    <div class="ph">
      <div>
        <h1>📁 {{ t("mr_title") }}</h1>
        <p>{{ t("mr_sub") }} — {{ auth.user?.name }}</p>
      </div>
      <RouterLink to="/new-report" class="btn bp bsm"
        >➕ {{ t("mr_new") }}</RouterLink
      >
    </div>

    <div class="con" style="padding-top: 0">
      <!-- Stat cards -->
      <div class="g4" style="margin-bottom: 28px">
        <div
          class="stat-card fu"
          style="border-inline-start: 3px solid #0066cc"
        >
          <div class="si" style="background: #0066cc18">📋</div>
          <div>
            <div class="sv" style="color: #0066cc">{{ myReports.length }}</div>
            <div class="sl">{{ t("stat_total") }}</div>
          </div>
        </div>
        <div
          class="stat-card fu"
          style="border-inline-start: 3px solid #ff9800"
        >
          <div class="si" style="background: #ff980018">⏳</div>
          <div>
            <div class="sv" style="color: #ff9800">{{ count("pending") }}</div>
            <div class="sl">{{ t("st_pending") }}</div>
          </div>
        </div>
        <div
          class="stat-card fu"
          style="border-inline-start: 3px solid #2196f3"
        >
          <div class="si" style="background: #2196f318">⚙️</div>
          <div>
            <div class="sv" style="color: #2196f3">
              {{ count("processing") }}
            </div>
            <div class="sl">{{ t("st_processing") }}</div>
          </div>
        </div>
        <div
          class="stat-card fu"
          style="border-inline-start: 3px solid #4caf50"
        >
          <div class="si" style="background: #4caf5018">✅</div>
          <div>
            <div class="sv" style="color: #4caf50">{{ count("resolved") }}</div>
            <div class="sl">{{ t("st_resolved") }}</div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="empty"><div class="spinner" /></div>

      <!-- Empty state -->
      <div v-else-if="!myReports.length" class="empty">
        <div style="font-size: 64px; margin-bottom: 16px; opacity: 0.5">📭</div>
        <p style="font-size: 16px; color: var(--muted); margin-bottom: 20px">
          {{ t("mr_empty") }}
        </p>
        <RouterLink to="/new-report" class="btn bp"
          >➕ {{ t("mr_first") }}</RouterLink
        >
      </div>

      <!-- Reports grid -->
      <div v-else class="g3">
        <div
          v-for="r in myReports"
          :key="r.id"
          class="rc fu"
          @click="router.push(`/reports/${r.id}`)"
        >
          <div class="rch">
            <div style="flex: 1; min-width: 0">
              <div
                style="
                  font-weight: 700;
                  font-size: 15px;
                  margin-bottom: 4px;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                "
              >
                <span>{{ CATEGORIES[r.category]?.icon }}</span>
                <span
                  style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                  >{{ r.title }}</span
                >
              </div>
              <div style="font-size: 13px; color: var(--muted)">
                📍 {{ r.wilaya }} – {{ r.commune }}
              </div>
            </div>
            <span
              class="badge"
              :style="`background:${STATUSES[r.status]?.bg};color:${STATUSES[r.status]?.color};flex-shrink:0`"
            >
              {{ getStatusLabel(r.status) }}
            </span>
          </div>

          <p
            style="
              font-size: 14px;
              color: var(--txt2);
              margin-bottom: 12px;
              line-height: 1.6;
            "
          >
            {{ r.description?.substring(0, 110) }}...
          </p>

          <!-- Map btn -->
          <button
            v-if="r.lat && r.lat !== 0"
            style="
              display: inline-flex;
              align-items: center;
              gap: 6px;
              font-size: 12px;
              color: var(--p);
              background: var(--pu);
              border: 1px solid rgba(28, 110, 242, 0.2);
              padding: 6px 14px;
              border-radius: 999px;
              cursor: pointer;
              font-weight: 600;
              margin-bottom: 12px;
            "
            @click.stop="window.$mmOpen?.(r.lat, r.lng, r.title)"
          >
            🗺️ {{ t("rp_view_map") }}
          </button>

          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-top: 12px;
              border-top: 1px solid var(--brd);
              font-size: 12px;
              color: var(--muted);
            "
          >
            <!-- <span>📅 {{ r.date }} &nbsp;·&nbsp; 👍 {{ r.votes }}</span> -->
             <span>📅 {{ r.created_at?.slice(0, 10) }} &nbsp;·&nbsp; 👍 {{ r.votes_count }}</span>
            <RouterLink
              :to="`/reports/${r.id}`"
              class="btn bp bsm"
              style="font-size: 12px"
              @click.stop
            >
              {{ t("rp_details") }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "@/composables/useI18n";
import { getMyReports } from "@/api/reports";
import { CATEGORIES, STATUSES } from "@/composables/useApi";

const router = useRouter();
const auth = useAuthStore();
const { lang, t } = useI18n();

const myReports = ref([]);
const loading = ref(true);

const count = (status) =>
  myReports.value.filter((r) => r.status === status).length;

function getStatusLabel(status) {
  const s = STATUSES[status];
  if (!s) return status;
  return lang.value === "fr"
    ? s.label_fr
    : lang.value === "en"
      ? s.label_en
      : s.label_ar;
}

// onMounted(async () => {
//   try {
//     const res = await getMyReports();
//     myReports.value = res.data;
//   } finally {
//     loading.value = false;
//   }
// });
onMounted(async () => {
  try {
    const res = await getMyReports();
    myReports.value = res.data.items ?? res.data; // ← fix
  } finally {
    loading.value = false;
  }
});
</script>
