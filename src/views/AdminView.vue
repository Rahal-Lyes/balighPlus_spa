/<template>
  <div class="adm-wrap">

    <!-- TOP BAR -->
    <div class="adm-topbar">
      <div class="adm-topbar-left">
        <div class="adm-logo-sm">🛡️</div>
        <div>
          <h1 class="adm-pg-title">{{ t("adm_title") }}</h1>
          <p class="adm-pg-sub">
            v2.0 &nbsp;·&nbsp; {{ dashboard.usersCount }} {{ t("adm_users") }}
            &nbsp;·&nbsp; {{ dashboard.totalReports }} {{ t("adm_reports") }}
            <span v-if="dashboard.avgResolutionDays" class="adm-sub-chip">
              ⚡ {{ dashboard.avgResolutionDays }}j moy. résolution
            </span>
          </p>
        </div>
      </div>
      <div class="adm-topbar-right">
        <RouterLink to="/map" class="adm-tb-btn">🗺️ {{ t("nav_map") }}</RouterLink>
        <button class="adm-tb-btn" @click="handleDownloadCsv">⬇️ CSV</button>
      </div>
    </div>

    <div class="adm-body">
      <div v-if="dashboard.loading" class="adm-loading">
        <div class="adm-spinner" />
        <p>Chargement du tableau de bord…</p>
      </div>

      <template v-else-if="dashboard.isLoaded">

        <!-- SECTION 1 : KPIs -->
        <div class="adm-section-label">📊 Vue d'ensemble</div>
        <div class="adm-kpis">
          <div class="adm-kpi" style="--kc:#1C6EF2">
            <div class="adm-kpi-icon">📋</div>
            <div class="adm-kpi-label">{{ t("stat_total") }}</div>
            <div class="adm-kpi-num">{{ dashboard.totalReports }}</div>
            <div class="adm-kpi-bar"><div style="width:100%;background:#1C6EF2" /></div>
          </div>
          <div class="adm-kpi" style="--kc:#f59e0b">
            <div class="adm-kpi-icon">⏳</div>
            <div class="adm-kpi-label">{{ t("stat_pending") }}</div>
            <div class="adm-kpi-num" style="color:#f59e0b">{{ dashboard.pendingCount }}</div>
            <div class="adm-kpi-bar"><div :style="`width:${pct(dashboard.pendingCount)}%;background:#f59e0b`" /></div>
          </div>
          <div class="adm-kpi" style="--kc:#3b82f6">
            <div class="adm-kpi-icon">⚙️</div>
            <div class="adm-kpi-label">{{ t("stat_process") }}</div>
            <div class="adm-kpi-num" style="color:#3b82f6">{{ dashboard.processingCount }}</div>
            <div class="adm-kpi-bar"><div :style="`width:${pct(dashboard.processingCount)}%;background:#3b82f6`" /></div>
          </div>
          <div class="adm-kpi" style="--kc:#10b981">
            <div class="adm-kpi-icon">✅</div>
            <div class="adm-kpi-label">{{ t("stat_resolved") }}</div>
            <div class="adm-kpi-num" style="color:#10b981">{{ dashboard.resolvedCount }}</div>
            <div class="adm-kpi-bar"><div :style="`width:${pct(dashboard.resolvedCount)}%;background:#10b981`" /></div>
          </div>
          <div class="adm-kpi" style="--kc:#8b5cf6">
            <div class="adm-kpi-icon">👥</div>
            <div class="adm-kpi-label">{{ t("adm_users") }}</div>
            <div class="adm-kpi-num" style="color:#8b5cf6">{{ dashboard.usersCount }}</div>
            <div class="adm-kpi-bar"><div style="width:100%;background:#8b5cf6" /></div>
          </div>
          <div class="adm-kpi" style="--kc:#10b981">
            <div class="adm-kpi-icon">📈</div>
            <div class="adm-kpi-label">{{ t("adm_rate") }}</div>
            <div class="adm-kpi-num" style="color:#10b981">{{ dashboard.resolutionRate }}%</div>
            <div class="adm-kpi-bar"><div :style="`width:${dashboard.resolutionRate}%;background:#10b981`" /></div>
          </div>
        </div>

        <!-- SECTION 2 : CHARTS -->
        <div class="adm-charts-grid">
          <div class="card fu adm-chart-card">
            <h3 class="adm-chart-title">📅 {{ t("adm_monthly") }}</h3>
            <div class="adm-chart-wrap"><canvas ref="barCanvas" /></div>
          </div>
          <div class="card fu adm-chart-card">
            <h3 class="adm-chart-title">🗂 {{ t("adm_by_cat") }}</h3>
            <div class="adm-chart-wrap"><canvas ref="pieCanvas" /></div>
          </div>
          <div class="card fu adm-chart-card">
            <h3 class="adm-chart-title">📊 Répartition par statut / mois</h3>
            <div class="adm-chart-legend">
              <span class="adm-legend-item"><span class="adm-legend-sq" style="background:#eda100"></span>En attente</span>
              <span class="adm-legend-item"><span class="adm-legend-sq" style="background:#2a78d6"></span>En cours</span>
              <span class="adm-legend-item"><span class="adm-legend-sq" style="background:#1baf7a"></span>Résolu</span>
            </div>
            <div class="adm-chart-wrap"><canvas ref="areaCanvas" /></div>
          </div>
          <div class="card fu adm-chart-card">
            <h3 class="adm-chart-title">📍 Top Wilayas</h3>
            <div class="adm-chart-wrap"><canvas ref="wilayaCanvas" /></div>
          </div>
        </div>

        <!-- SECTION 3 : REPORTS TABLE -->
        <div class="adm-section-label">📋 {{ t("adm_reports") }}</div>
        <div class="card fu" style="padding:0;overflow:hidden;margin-bottom:32px">
          <div class="adm-table-head">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-weight:700">📋 {{ t("adm_reports") }}</span>
              <span class="adm-badge-num">{{ filteredReports.length }}</span>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <input v-model="rSearch" type="text" class="fc adm-filter-sel" :placeholder="t('adm_search')" style="width:200px" />
              <select v-model="rStatus" class="fc adm-filter-sel">
                <option value="">Tous statuts</option>
                <option value="pending">⏳ En attente</option>
                <option value="processing">⚙️ En cours</option>
                <option value="resolved">✅ Résolu</option>
              </select>
              <select v-model="rPriority" class="fc adm-filter-sel">
                <option value="">Toutes priorités</option>
                <option value="urgent">🔴 Urgent</option>
                <option value="normal">🟡 Normal</option>
                <option value="low">🟢 Bas</option>
              </select>
            </div>
          </div>
          <div v-if="!filteredReports.length" class="empty" style="padding:32px">{{ t("adm_no_rep") }}</div>
          <div v-else style="overflow-x:auto">
            <table>
              <thead>
                <tr>
                  <th @click="sortBy('id')" class="adm-th-sort"># <span class="sort-arrow">{{ sortArrow('id') }}</span></th>
                  <th @click="sortBy('title')" class="adm-th-sort">{{ t("adm_name") }} <span class="sort-arrow">{{ sortArrow('title') }}</span></th>
                  <th>Type</th>
                  <th @click="sortBy('wilaya')" class="adm-th-sort">{{ t("adm_location") }} <span class="sort-arrow">{{ sortArrow('wilaya') }}</span></th>
                  <th>{{ t("adm_photos") }}</th>
                  <th @click="sortBy('votes_count')" class="adm-th-sort" style="text-align:center">{{ t("adm_votes") }} <span class="sort-arrow">{{ sortArrow('votes_count') }}</span></th>
                  <th>{{ t("adm_status") }}</th>
                  <th>{{ t("adm_action") }}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in paginatedReports" :key="r.id">
                  <td style="font-size:12px;color:var(--muted);white-space:nowrap">{{ r.id }}</td>
                  <td>
                    <div style="font-weight:700;font-size:13px;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ r.title }}</div>
                    <div style="display:flex;align-items:center;gap:6px;margin-top:3px">
                      <div class="avatar" style="width:22px;height:22px;font-size:11px;flex-shrink:0">{{ ownerName(r.user_id)?.[0]?.toUpperCase() || "?" }}</div>
                      <span style="font-size:12px;color:var(--muted)">{{ ownerName(r.user_id) || r.author_name || "—" }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge" :style="`background:${CATEGORIES[r.category]?.color}15;color:${CATEGORIES[r.category]?.color};border:1px solid ${CATEGORIES[r.category]?.color}25;font-size:12px`">
                      {{ CATEGORIES[r.category]?.icon }} {{ getCatLabel(r.category) }}
                    </span>
                  </td>
                  <td style="font-size:13px">
                    <div style="font-weight:600">{{ r.wilaya }}</div>
                    <div style="color:var(--muted);font-size:12px">{{ r.commune }}</div>
                  </td>
                  <td>
                    <div v-if="r.images?.length" style="display:flex;gap:4px">
                      <img
                        v-for="(img, i) in r.images.slice(0, 2)"
                        :key="i"
                        :src="imgUrl(img)"
                        loading="lazy"
                        style="width:36px;height:36px;object-fit:cover;border-radius:6px;cursor:pointer;border:1.5px solid var(--brd)"
                      />
                      <div v-if="r.images.length > 2" class="adm-img-more">+{{ r.images.length - 2 }}</div>
                    </div>
                    <span v-else style="color:var(--muted)">—</span>
                  </td>
                  <td style="text-align:center"><span style="font-weight:700;color:var(--p)">👍 {{ r.votes_count ?? r.votes ?? 0 }}</span></td>
                  <td>
                    <span class="badge" :style="`background:${STATUSES[r.status]?.bg};color:${STATUSES[r.status]?.color}`">{{ getStLabel(r.status) }}</span>
                  </td>
                  <td style="white-space:nowrap">
                    <div style="display:flex;flex-direction:column;gap:4px">
                      <select :value="r.status" class="fc adm-filter-sel" @change="handleUpdateStatus(r, $event.target.value, r.priority)">
                        <option value="pending">⏳ {{ t("st_pending") }}</option>
                        <option value="processing">⚙️ {{ t("st_processing") }}</option>
                        <option value="resolved">✅ {{ t("st_resolved") }}</option>
                      </select>
                      <select :value="r.priority || 'normal'" class="fc adm-filter-sel" style="font-size:11px" @change="handleUpdateStatus(r, r.status, $event.target.value)">
                        <option value="urgent">🔴 Urgent</option>
                        <option value="normal">🟡 Normal</option>
                        <option value="low">🟢 Bas</option>
                      </select>
                    </div>
                  </td>
                  <td style="white-space:nowrap">
                    <div style="display:flex;gap:4px">
                      <RouterLink :to="`/reports/${r.id}`" class="adm-icon-btn adm-icon-view">👁</RouterLink>
                      <button class="adm-icon-btn adm-icon-del" @click="handleDeleteReport(r)">🗑</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="totalPages > 1" class="adm-pagination">
            <button class="adm-pg-btn" :disabled="currentPage === 1" @click="currentPage--">‹</button>
            <button v-for="p in totalPages" :key="p" class="adm-pg-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
            <button class="adm-pg-btn" :disabled="currentPage === totalPages" @click="currentPage++">›</button>
          </div>
        </div>

        <!-- SECTION 4 : USERS TABLE -->
        <div class="adm-section-label">👥 {{ t("adm_users") }}</div>
        <div class="card fu" style="padding:0;overflow:hidden;margin-bottom:48px">
          <div class="adm-table-head">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-weight:700">👥 {{ t("adm_users") }}</span>
              <span class="adm-badge-num">{{ filteredUsers.length }}</span>
            </div>
            <input v-model="uSearch" type="text" class="fc adm-filter-sel" placeholder="Chercher un utilisateur…" style="width:220px" />
          </div>
          <div style="overflow-x:auto">
            <table>
              <thead>
                <tr>
                  <th>{{ t("adm_name") }}</th>
                  <th>{{ t("adm_email") }}</th>
                  <th style="text-align:center">Signalements</th>
                  <th>{{ t("adm_joined") }}</th>
                  <th>{{ t("adm_status") }}</th>
                  <th>{{ t("adm_action") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in filteredUsers" :key="u.id">
                  <td>
                    <div style="display:flex;align-items:center;gap:10px">
                      <div class="avatar" :style="`width:32px;height:32px;font-size:13px;flex-shrink:0;${u.banned ? 'opacity:.5;filter:grayscale(1);' : ''}`">{{ u.name?.[0]?.toUpperCase() }}</div>
                      <div>
                        <div :style="`font-weight:600;font-size:14px;${u.banned ? 'text-decoration:line-through;color:var(--muted);' : ''}`">{{ u.name }}</div>
                        <div style="font-size:11px;color:var(--muted)">ID: {{ u.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td style="font-size:13px;color:var(--txt2)">{{ u.email }}</td>
                  <td style="text-align:center"><strong style="color:var(--p);font-size:15px">{{ u.reports_count ?? userReportCount(u.id) }}</strong></td>
                  <td style="font-size:12px;color:var(--muted)">📅 {{ (u.joined_at ?? u.created_at ?? u.joined)?.slice(0, 10) }}</td>
                  <td>
                    <span v-if="u.banned" class="badge" style="background:#fef2f2;color:var(--err)">🚫 Suspendu</span>
                    <span v-else class="badge" style="background:#ecfdf5;color:#10b981">✅ Actif</span>
                  </td>
                  <td style="white-space:nowrap">
                    <div style="display:flex;gap:6px">
                      <button
                        class="adm-icon-btn"
                        :class="u.banned ? 'adm-icon-view' : 'adm-icon-del'"
                        style="width:auto;padding:0 10px;font-size:12px;font-weight:600"
                        @click="handleToggleBan(u)"
                      >
                        {{ u.banned ? "🔓 Activer" : "🚫 Suspendre" }}
                      </button>
                      <button class="adm-icon-btn adm-icon-del" @click="handleDeleteUser(u)">🗑</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { useAdminDashboardStore } from "@/stores/AdminDashboardStore";
import { useToastStore } from "@/stores/ToastStore";
import { useI18n } from "@/composables/useI18n";
import { CATEGORIES, STATUSES } from "@/composables/useApi";

const dashboard   = useAdminDashboardStore();
const toast       = useToastStore();
const { lang, t } = useI18n();
dashboard.getNotifications();

// ── Filtres & tri ──────────────────────────────────────────────────────────────
const rSearch     = ref("");
const rStatus     = ref("");
const rPriority   = ref("");
const sortKey     = ref("id");
const sortDir     = ref(-1);
const currentPage = ref(1);
const PAGE_SIZE   = 20;
const uSearch     = ref("");

// ── Canvas refs ────────────────────────────────────────────────────────────────
const barCanvas    = ref(null);
const pieCanvas    = ref(null);
const areaCanvas   = ref(null);
const wilayaCanvas = ref(null);
let chartInstances = [];

// ── Computed ───────────────────────────────────────────────────────────────────
const filteredReports = computed(() => {
  const q  = rSearch.value.toLowerCase().trim();
  const st = rStatus.value;
  const pr = rPriority.value;
  return dashboard.reports
    .filter((r) => {
      if (st && r.status   !== st) return false;
      if (pr && r.priority !== pr) return false;
      if (q && !(
        r.title?.toLowerCase().includes(q) ||
        r.wilaya?.toLowerCase().includes(q) ||
        r.commune?.toLowerCase().includes(q) ||
        r.author_name?.toLowerCase().includes(q)
      )) return false;
      return true;
    })
    .sort((a, b) => {
      const va = a[sortKey.value] ?? "";
      const vb = b[sortKey.value] ?? "";
      return va < vb ? -sortDir.value : va > vb ? sortDir.value : 0;
    });
});

const totalPages = computed(() => Math.ceil(filteredReports.value.length / PAGE_SIZE));
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return filteredReports.value.slice(start, start + PAGE_SIZE);
});

const filteredUsers = computed(() => {
  const q = uSearch.value.toLowerCase().trim();
  if (!q) return dashboard.users;
  return dashboard.users.filter(
    (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
  );
});

watch([rSearch, rStatus, rPriority], () => { currentPage.value = 1; });

// ── Helpers ────────────────────────────────────────────────────────────────────
function pct(val) {
  return dashboard.totalReports ? Math.round((val / dashboard.totalReports) * 100) : 0;
}
function ownerName(uid) {
  return dashboard.users.find((u) => u.id === uid)?.name ?? null;
}
function userReportCount(uid) {
  return dashboard.reports.filter((r) => (r.user_id ?? r.userId) === uid).length;
}
function getCatLabel(key) {
  const c = CATEGORIES[key];
  if (!c) return key;
  return lang.value === "fr" ? c.label_fr : lang.value === "en" ? c.label_en : c.label_ar;
}
function getStLabel(status) {
  const s = STATUSES[status];
  if (!s) return status;
  return lang.value === "fr" ? s.label_fr : lang.value === "en" ? s.label_en : s.label_ar;
}
function sortBy(key) {
  if (sortKey.value === key) sortDir.value *= -1;
  else { sortKey.value = key; sortDir.value = -1; }
}
function sortArrow(key) {
  if (sortKey.value !== key) return "↕";
  return sortDir.value === -1 ? "↓" : "↑";
}
/**
 * Normalise l'URL d'une image : supporte string ou objet { id, url }
 */
function imgUrl(img) {
  return typeof img === "string" ? img : img?.url ?? "";
}

// ── Actions ────────────────────────────────────────────────────────────────────
async function handleUpdateStatus(r, status, priority) {
  try {
    await dashboard.updateReportStatus(r.id, { status, priority: priority || "normal" });
    toast.ToastSuccess(t("ok_status"));
  } catch {
    toast.ToastError(t("err_generic") || "Erreur");
  }
}

async function handleDeleteReport(r) {
  if (!confirm(t("adm_del_ok"))) return;
  try {
    await dashboard.deleteReport(r.id);
    toast.ToastSuccess(t("ok_deleted"));
  } catch {
    toast.ToastError(t("err_generic") || "Erreur");
  }
}

async function handleToggleBan(u) {
  if (!confirm(u.banned ? "Réactiver ?" : "Suspendre ?")) return;
  try {
    await dashboard.toggleUserBan(u.id);
  } catch {
    toast.ToastError(t("err_generic") || "Erreur");
  }
}

async function handleDeleteUser(u) {
  if (!confirm("Supprimer définitivement ?")) return;
  try {
    await dashboard.deleteUser(u.id);
    toast.ToastSuccess(t("ok_deleted"));
  } catch {
    toast.ToastError(t("err_generic") || "Erreur");
  }
}

async function handleDownloadCsv() {
  try {
    await dashboard.exportCsv();
  } catch {
    toast.ToastError("Erreur export CSV");
  }
}

// ── Charts ─────────────────────────────────────────────────────────────────────
async function drawCharts() {
  await nextTick();
  chartInstances.forEach((c) => c.destroy());
  chartInstances = [];
  if (!barCanvas.value) return;

  const { Chart, registerables } = await import("chart.js");
  Chart.register(...registerables);

  const grid = "rgba(0,0,0,0.06)";

  // Bar – mensuel
  chartInstances.push(new Chart(barCanvas.value, {
    type: "bar",
    data: {
      labels: Object.keys(dashboard.monthly),
      datasets: [{
        data: Object.values(dashboard.monthly),
        backgroundColor: "#1C6EF2",
        borderRadius: 6,
        label: "Signalements",
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, grid: { color: grid } }, x: { grid: { display: false } } },
    },
  }));

  // Doughnut – par catégorie
  if (pieCanvas.value) {
    const catKeys = Object.keys(dashboard.byCategory);
    chartInstances.push(new Chart(pieCanvas.value, {
      type: "doughnut",
      data: {
        labels: catKeys.map((k) => `${CATEGORIES[k]?.icon || ""} ${getCatLabel(k)}`),
        datasets: [{
          data: catKeys.map((k) => dashboard.byCategory[k]),
          backgroundColor: catKeys.map((k) => CATEGORIES[k]?.color || "#ccc"),
          borderWidth: 2,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 10 } } },
      },
    }));
  }

  // Grouped bar – évolution par statut (lisible même avec 1 mois / peu de données)
  if (areaCanvas.value) {
    let sm = { ...dashboard.statusMonthly };
    const smKeys = Object.keys(sm);
    const hasData = smKeys.some(
      (k) => (sm[k]?.pending ?? 0) + (sm[k]?.processing ?? 0) + (sm[k]?.resolved ?? 0) > 0
    );

    if (!smKeys.length || !hasData) {
      Object.keys(dashboard.monthly).forEach((m) => {
        sm[m] = { pending: 0, processing: 0, resolved: 0 };
      });
      dashboard.reports.forEach((r) => {
        const month = r.created_at?.slice(0, 7);
        if (!month) return;
        if (!sm[month]) sm[month] = { pending: 0, processing: 0, resolved: 0 };
        if (["pending", "processing", "resolved"].includes(r.status)) {
          sm[month][r.status] = (sm[month][r.status] ?? 0) + 1;
        }
      });
    }

    const finalKeys = Object.keys(sm).sort();

    if (!finalKeys.length) {
      const ctx = areaCanvas.value.getContext("2d");
      ctx.fillStyle = "#888780";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Aucune donnée disponible", areaCanvas.value.offsetWidth / 2 || 150, 110);
    } else {
      chartInstances.push(new Chart(areaCanvas.value, {
        type: "bar",
        data: {
          labels: finalKeys,
          datasets: [
            {
              label: "En attente",
              data: finalKeys.map((k) => sm[k]?.pending ?? 0),
              backgroundColor: "#eda100",
              borderRadius: { topLeft: 4, topRight: 4 },
              borderSkipped: "bottom",
              borderWidth: 0,
              barPercentage: 0.75,
              categoryPercentage: 0.7,
            },
            {
              label: "En cours",
              data: finalKeys.map((k) => sm[k]?.processing ?? 0),
              backgroundColor: "#2a78d6",
              borderRadius: { topLeft: 4, topRight: 4 },
              borderSkipped: "bottom",
              borderWidth: 0,
              barPercentage: 0.75,
              categoryPercentage: 0.7,
            },
            {
              label: "Résolu",
              data: finalKeys.map((k) => sm[k]?.resolved ?? 0),
              backgroundColor: "#1baf7a",
              borderRadius: { topLeft: 4, topRight: 4 },
              borderSkipped: "bottom",
              borderWidth: 0,
              barPercentage: 0.75,
              categoryPercentage: 0.7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: (items) => `Mois : ${items[0].label}`,
                label: (item) => ` ${item.dataset.label} : ${item.parsed.y}`,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: "#898781", font: { size: 12 } },
              border: { color: "#c3c2b7" },
            },
            y: {
              beginAtZero: true,
              grid: { color: "#e1e0d9" },
              ticks: {
                color: "#898781",
                font: { size: 12 },
                stepSize: 1,
                precision: 0,
                callback: (v) => Number.isInteger(v) ? v : null,
              },
              border: { display: false },
            },
          },
        },
      }));
    }
  }

  // Horizontal bar – top wilayas
  if (wilayaCanvas.value) {
    const wKeys = Object.keys(dashboard.byWilaya);
    chartInstances.push(new Chart(wilayaCanvas.value, {
      type: "bar",
      data: {
        labels: wKeys,
        datasets: [{
          label: "Signalements",
          data: wKeys.map((k) => dashboard.byWilaya[k]),
          backgroundColor: wKeys.map((_, i) => `hsl(${220 + i * 14},75%,${55 + i * 3}%)`),
          borderRadius: 4,
        }],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, grid: { color: grid } }, y: { grid: { display: false } } },
      },
    }));
  }
}

// ── Lifecycle ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  await dashboard.fetchDashboard();
  drawCharts();
});

onBeforeUnmount(() => {
  chartInstances.forEach((c) => c.destroy());
});
</script>

<style scoped>
.adm-wrap { min-height: 100vh; background: var(--w2); }

.adm-topbar {
  background: linear-gradient(135deg, #0d1b3e, #0d47a1);
  color: white; padding: 18px 32px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; flex-wrap: wrap;
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 2px 12px rgba(0,0,0,.3);
}
.adm-topbar-left  { display: flex; align-items: center; gap: 12px; }
.adm-topbar-right { display: flex; gap: 8px; align-items: center; }
.adm-logo-sm { width:42px;height:42px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0; }
.adm-pg-title { font-size:20px;font-weight:900;color:white; }
.adm-pg-sub   { font-size:13px;color:rgba(255,255,255,0.65);margin-top:2px; }
.adm-sub-chip { background:rgba(255,255,255,0.12);border-radius:999px;padding:1px 8px;margin-left:6px;font-size:11px; }
.adm-tb-btn {
  display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--r-sm);
  background:rgba(255,255,255,0.12);color:white;border:1px solid rgba(255,255,255,0.2);
  font-size:13px;font-weight:600;cursor:pointer;text-decoration:none;transition:background 0.18s;font-family:inherit;
}
.adm-tb-btn:hover { background:rgba(255,255,255,0.22); }

.adm-body { padding:28px 32px; }
.adm-loading { display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 0;gap:16px;color:var(--muted); }
.adm-spinner { width:40px;height:40px;border:4px solid var(--brd);border-top-color:var(--p);border-radius:50%;animation:spin 0.8s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

.adm-section-label { font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:var(--muted);margin-bottom:14px;padding-left:10px;border-left:3px solid var(--p); }

.adm-kpis { display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:14px;margin-bottom:28px; }
.adm-kpi { background:white;border-radius:var(--r);padding:16px 18px;box-shadow:var(--sh1);border:1px solid var(--brd);border-top:3px solid var(--kc,var(--p));transition:transform 0.15s,box-shadow 0.15s; }
.adm-kpi:hover { transform:translateY(-2px);box-shadow:0 6px 24px rgba(0,0,0,.09); }
.adm-kpi-icon  { font-size:18px;margin-bottom:6px; }
.adm-kpi-label { font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px; }
.adm-kpi-num   { font-size:28px;font-weight:900;font-family:"Outfit","Cairo",sans-serif;line-height:1;margin-bottom:10px; }
.adm-kpi-bar   { height:4px;background:var(--brd);border-radius:999px;overflow:hidden; }
.adm-kpi-bar > div { height:100%;border-radius:999px;transition:width 1.2s cubic-bezier(.22,.68,0,1.2); }

.adm-charts-grid { display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:32px; }
.adm-chart-card  { padding:20px; }
.adm-chart-title { font-weight:800;font-size:14px;margin-bottom:14px;color:var(--txt); }
.adm-chart-wrap  { height:220px;position:relative; }

.adm-table-head { display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--brd);flex-wrap:wrap;gap:10px; }
.adm-badge-num  { background:var(--pu);color:var(--p);font-size:12px;font-weight:700;padding:2px 8px;border-radius:999px; }
.adm-filter-sel { font-size:12px;padding:5px 8px;border-radius:var(--r-sm);border:1px solid var(--brd);background:white;font-family:inherit; }
.adm-th-sort    { cursor:pointer;user-select:none;white-space:nowrap; }
.adm-th-sort:hover { color:var(--p); }
.sort-arrow     { font-size:11px;color:var(--muted);margin-left:2px; }
.adm-img-more   { width:36px;height:36px;background:var(--w2);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--txt2);border:1.5px solid var(--brd); }

.adm-icon-btn  { width:32px;height:32px;border-radius:var(--r-sm);border:1px solid var(--brd);background:var(--w2);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;text-decoration:none;transition:all 0.18s; }
.adm-icon-view       { color:var(--p); }
.adm-icon-view:hover { background:var(--pu); }
.adm-icon-del        { color:var(--err);border-color:rgba(239,68,68,.2);background:rgba(239,68,68,.05); }
.adm-icon-del:hover  { background:var(--err);color:white; }

.adm-pagination { display:flex;align-items:center;justify-content:center;gap:4px;padding:12px;border-top:1px solid var(--brd); }
.adm-pg-btn { min-width:32px;height:32px;padding:0 8px;border-radius:var(--r-sm);border:1px solid var(--brd);background:white;font-size:13px;cursor:pointer;font-family:inherit;transition:all 0.15s; }
.adm-pg-btn:disabled             { opacity:.35;cursor:default; }
.adm-pg-btn:hover:not(:disabled) { background:var(--pu);color:var(--p); }
.adm-pg-btn.active               { background:var(--p);color:white;border-color:var(--p); }

.adm-chart-legend { display:flex;gap:14px;margin-bottom:10px;flex-wrap:wrap; }
.adm-legend-item  { display:flex;align-items:center;gap:5px;font-size:12px;color:var(--muted); }
.adm-legend-sq    { width:10px;height:10px;border-radius:2px;flex-shrink:0; }

@media (max-width:900px) { .adm-charts-grid { grid-template-columns:1fr; } }
@media (max-width:768px) { .adm-body { padding:16px; } .adm-topbar { padding:14px 16px; } }
</style>