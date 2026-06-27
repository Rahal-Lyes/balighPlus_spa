<template>
  <div>
    <template v-if="loading">
      <div class="empty"><div class="spinner" /></div>
    </template>

    <template v-else-if="!report">
      <div class="con"><div class="alert a-err">❌ البلاغ غير موجود.</div></div>
    </template>

    <template v-else>
      <!-- Page header -->
      <div class="ph">
        <div style="flex: 1; min-width: 0">
          <h1 style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span>{{ cat?.icon }}</span>
            <span>{{ report.title }}</span>
          </h1>
          <p>
            📍 {{ report.wilaya }} – {{ report.commune }} &nbsp;·&nbsp;
            📅 {{ formatDate(report.created_at) }} &nbsp;·&nbsp;
            👍 {{ report.votes_count }} &nbsp;·&nbsp;
            💬 {{ comments.length }}
            <span v-if="report.ref_num" class="ref-pill"># {{ report.ref_num }}</span>
          </p>
        </div>
        <RouterLink to="/reports" class="btn bsm btn-back">{{ t("dt_back") }}</RouterLink>
      </div>

      <div class="con" style="padding-top:0;max-width:860px">

        <!-- Status + Priority + Vote -->
        <div class="card fu" style="margin-bottom:22px">
          <div class="status-row">
            <div class="badges-group">
              <span class="badge"
                :style="`background:${st?.bg};color:${st?.color};font-size:14px;padding:6px 16px`">
                {{ statusLabel }}
              </span>
              <span v-if="report.priority && report.priority !== 'normal'" class="pri-badge"
                :style="`background:${priMap[report.priority]?.bg};color:${priMap[report.priority]?.color};border:1px solid ${priMap[report.priority]?.color}30`">
                {{ priMap[report.priority]?.icon }} {{ t("pri_" + report.priority) }}
              </span>
              <span class="badge" :style="`background:${cat?.color}15;color:${cat?.color}`">
                {{ cat?.icon }} {{ catLabel }}
              </span>
            </div>
            <button v-if="auth.isLoggedIn && !auth.isAdmin" class="btn bp bsm vote-btn"
              :disabled="userVoted" :class="{ voted: userVoted }" @click="doVote">
              {{ userVoted ? t("dt_voted_btn") : t("dt_vote_btn") }}
              <span class="vote-count">{{ report.votes_count }}</span>
            </button>
          </div>
        </div>

        <!-- Description + Map -->
        <div class="card fu" style="margin-bottom:22px">
          <h3 class="section-title">📋 {{ t("nr_f_desc").replace(" *", "") }}</h3>
          <p class="desc-text">{{ report.description }}</p>
          <div v-if="report.lat && report.lat !== 0" style="margin-top:18px">
            <button class="btn bsm map-btn" @click="openMap">🗺️ {{ t("rp_view_map") }}</button>
          </div>
        </div>

        <!-- ───── Images + Lightbox ───── -->
        <div v-if="report.images?.length" class="card fu" style="margin-bottom:22px">
          <h3 class="section-title">🖼️ {{ t("nr_f_img").replace(" *", "") }}</h3>

          <!-- Galerie -->
          <div class="gal">
            <div v-for="(img, i) in report.images" :key="img.id"
              class="gal-item" @click="openLightbox(i)">
              <img :src="img.url" loading="lazy" :alt="`Image ${i + 1}`" />
              <div class="gal-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Lightbox Portal -->
        <Teleport to="body">
          <Transition name="lb">
            <div v-if="lightbox.open" class="lb-backdrop" @click.self="closeLightbox"
              @keydown.esc="closeLightbox" tabindex="-1" ref="lbRef">

              <!-- Close -->
              <button class="lb-ctrl lb-close" @click="closeLightbox" aria-label="Fermer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>

              <!-- Prev -->
              <button v-if="report.images.length > 1"
                class="lb-ctrl lb-prev" @click="lbPrev" aria-label="Précédent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>

              <!-- Image -->
              <Transition name="lb-img" mode="out-in">
                <img :key="lightbox.index"
                  :src="report.images[lightbox.index]?.url"
                  class="lb-img"
                  :alt="`Image ${lightbox.index + 1}`"
                  @click.stop
                />
              </Transition>

              <!-- Next -->
              <button v-if="report.images.length > 1"
                class="lb-ctrl lb-next" @click="lbNext" aria-label="Suivant">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>

              <!-- Counter + dots -->
              <div class="lb-footer">
                <span class="lb-counter">{{ lightbox.index + 1 }} / {{ report.images.length }}</span>
                <div v-if="report.images.length > 1" class="lb-dots">
                  <button v-for="(_, i) in report.images" :key="i"
                    class="lb-dot" :class="{ active: i === lightbox.index }"
                    @click="lightbox.index = i" :aria-label="`Image ${i + 1}`" />
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>

        <!-- History -->
        <div v-if="report.history?.length" class="card fu" style="margin-bottom:22px">
          <h3 class="section-title">📜 {{ t("history") }}</h3>
          <div class="history-list">
            <div v-for="(h, i) in report.history" :key="i" class="history-item">
              <div class="history-dot" />
              <span class="history-date">📅 {{ h.date }}</span>
              <span v-if="h.from">
                <span class="badge" :style="`background:${STATUSES[h.from]?.bg};color:${STATUSES[h.from]?.color};font-size:11px`">{{ getStLabel(h.from) }}</span>
                →
                <span class="badge" :style="`background:${STATUSES[h.to]?.bg};color:${STATUSES[h.to]?.color};font-size:11px`">{{ getStLabel(h.to) }}</span>
              </span>
              <span v-else class="badge" :style="`background:${STATUSES[h.to]?.bg};color:${STATUSES[h.to]?.color};font-size:11px`">{{ getStLabel(h.to) }}</span>
              <span v-if="h.by === 'admin'" class="badge admin-badge">🛡️ Admin</span>
            </div>
          </div>
        </div>

        <!-- Comments -->
        <div class="card fu" style="margin-bottom:22px">
          <h3 class="section-title" style="font-size:17px;margin-bottom:18px">
            {{ t("dt_comments") }}
            <span class="cmt-count">({{ comments.length }})</span>
          </h3>

          <div v-if="comments.length">
            <div v-for="c in comments" :key="c.id" class="comment" :class="{ 'admin-c': c.is_admin }">
              <div class="c-header">
                <div class="avatar" style="width:32px;height:32px;font-size:13px">
                  {{ c.author_name?.[0] || '?' }}
                </div>
                <span class="c-name">{{ c.author_name || t('anonymous') }}</span>
                <span v-if="c.is_admin" class="badge" style="background:#fef9c3;color:#92400e;font-size:11px">{{ t("dt_official") }}</span>
                <span class="c-date">{{ formatDate(c.created_at) }}</span>
              </div>
              <p class="c-text">{{ c.content || c.text }}</p>
            </div>
          </div>
          <div v-else class="empty" style="padding:24px">{{ t("dt_no_cmt") }}</div>

          <!-- Add comment -->
          <div class="cmt-form">
            <template v-if="auth.isLoggedIn">
              <h4 style="font-weight:700;font-size:15px;margin-bottom:12px">{{ t("dt_add_cmt") }}</h4>
              <div v-if="cmtError" class="alert a-err">❌ {{ cmtError }}</div>
              <div class="fg">
                <textarea v-model="cmtText" class="fc" :placeholder="t('dt_ph_cmt')" rows="3" />
              </div>
              <button class="btn bp bsm" :disabled="!cmtText.trim() || cmtLoading" @click="addComment">
                <span v-if="cmtLoading">...</span>
                <span v-else>{{ t("dt_send_cmt") }}</span>
              </button>
            </template>
            <p v-else class="login-prompt">
              <RouterLink to="/login" style="color:var(--p);font-weight:700">{{ t("dt_login_cmt") }}</RouterLink>
              {{ t("dt_login_cmt2") }}
            </p>
          </div>
        </div>

      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/ToastStore";
import { useI18n } from "@/composables/useI18n";
import api from "@/composables/useApi";
import { CATEGORIES, STATUSES } from "@/composables/useApi";

const route   = useRoute();
const router  = useRouter();
const auth    = useAuthStore();
const toast   = useToastStore();
const { lang, t } = useI18n();

const report    = ref(null);
const comments  = ref([]);
const loading   = ref(true);
const cmtText   = ref("");
const cmtError  = ref("");
const cmtLoading = ref(false);
const userVoted = ref(false);
const lbRef     = ref(null);

// ── Lightbox state ──────────────────────────────────────────────────────────
const lightbox = reactive({ open: false, index: 0 });

function openLightbox(index) {
  lightbox.index = index;
  lightbox.open  = true;
  document.body.style.overflow = "hidden";
  nextTick(() => lbRef.value?.focus());
}

function closeLightbox() {
  lightbox.open = false;
  document.body.style.overflow = "";
}

function lbNext() {
  lightbox.index = (lightbox.index + 1) % report.value.images.length;
}

function lbPrev() {
  lightbox.index = (lightbox.index - 1 + report.value.images.length) % report.value.images.length;
}

// Keyboard navigation
function onKeydown(e) {
  if (!lightbox.open) return;
  if (e.key === "ArrowRight") lbNext();
  if (e.key === "ArrowLeft")  lbPrev();
  if (e.key === "Escape")     closeLightbox();
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
});

// ── Computed ─────────────────────────────────────────────────────────────────
const cat = computed(() => report.value ? CATEGORIES[report.value.category] : null);
const st  = computed(() => report.value ? STATUSES[report.value.status]   : null);

const catLabel = computed(() => {
  const c = cat.value;
  if (!c) return "";
  return lang.value === "fr" ? c.label_fr : lang.value === "en" ? c.label_en : c.label_ar;
});

const statusLabel = computed(() => {
  const s = st.value;
  if (!s) return "";
  return lang.value === "fr" ? s.label_fr : lang.value === "en" ? s.label_en : s.label_ar;
});

const priMap = {
  urgent: { icon: "🔴", color: "#EF4444", bg: "#FEF2F2" },
  normal: { icon: "🟡", color: "#F59E0B", bg: "#FFFBEB" },
  low:    { icon: "🟢", color: "#10B981", bg: "#ECFDF5" },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(
    lang.value === 'ar' ? 'ar-DZ' : lang.value === 'fr' ? 'fr-FR' : 'en-GB',
    { day: '2-digit', month: 'short', year: 'numeric' }
  );
}

function getStLabel(status) {
  const s = STATUSES[status];
  if (!s) return status;
  return lang.value === "fr" ? s.label_fr : lang.value === "en" ? s.label_en : s.label_ar;
}

// ── Actions ───────────────────────────────────────────────────────────────────
async function doVote() {
  if (!auth.isLoggedIn) { router.push("/login"); return; }
  if (userVoted.value) return;
  try {
    const res = await api.post(`/reports/${report.value.id}/vote`);
    report.value.votes_count = res.data.votes_count ?? report.value.votes_count + 1;
    userVoted.value = true;
    toast.show(t('dt_vote_thanks') || "Merci pour votre vote !");
  } catch {
    toast.show(t('dt_vote_err') || "Impossible de voter pour l'instant.");
  }
}

function openMap() {
  if (report.value?.lat && report.value.lat !== 0) {
    window.open(
      `https://www.openstreetmap.org/?mlat=${report.value.lat}&mlon=${report.value.lng}#map=15/${report.value.lat}/${report.value.lng}`,
      '_blank'
    );
  }
}

async function addComment() {
  cmtError.value = "";
  const text = cmtText.value.trim();
  if (!text) return;
  cmtLoading.value = true;
  try {
    const res = await api.post(`/reports/${report.value.id}/comments`, { text });
    const c = res.data;
    comments.value.push({
      id:          c.id,
      report_id:   c.report_id || report.value.id,
      author_name: c.author_name || auth.user?.name || "Anonymous",
      is_admin:    !!c.is_admin,
      created_at:  c.created_at,
      text:        c.text,
    });
    cmtText.value = "";
    toast.show(t("dt_cmt_success") || "💬 Commentaire ajouté !");
  } catch (e) {
    cmtError.value = e.response?.data?.detail || t("dt_cmt_err") || "Erreur";
  } finally {
    cmtLoading.value = false;
  }
}

async function loadData(id) {
  loading.value = true;
  try {
    const reportRes = await api.get(`/reports/${id}`);
    report.value = reportRes.data;
    if (auth.isLoggedIn && report.value.has_voted) userVoted.value = true;
    try {
      const commentsRes = await api.get(`/reports/${id}/comments`);
      comments.value = commentsRes.data.items || commentsRes.data || [];
    } catch {
      comments.value = [];
    }
  } catch {
    report.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(() => { const id = route.params.id; if (id) loadData(id); });
</script>

<style scoped>
/* ── Galerie ──────────────────────────────────────────────────────────────── */
.gal {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}

.gal-item {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  overflow: hidden;
  cursor: zoom-in;
  background: var(--brd, #f0f0f0);
}

.gal-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.25s ease;
}

.gal-item:hover img {
  transform: scale(1.06);
}

.gal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.gal-item:hover .gal-overlay {
  background: rgba(0, 0, 0, 0.35);
  opacity: 1;
}

/* ── Lightbox ─────────────────────────────────────────────────────────────── */
.lb-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.lb-img {
  max-width: min(90vw, 1100px);
  max-height: 85vh;
  object-fit: contain;
  border-radius: 6px;
  display: block;
  user-select: none;
}

/* Boutons de contrôle */
.lb-ctrl {
  position: absolute;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
  z-index: 10001;
}

.lb-ctrl:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.08);
}

.lb-close { top: 16px; right: 16px; }
.lb-prev  { left: 16px;  top: 50%; transform: translateY(-50%); }
.lb-next  { right: 16px; top: 50%; transform: translateY(-50%); }
.lb-prev:hover { transform: translateY(-50%) scale(1.08); }
.lb-next:hover { transform: translateY(-50%) scale(1.08); }

/* Footer : compteur + dots */
.lb-footer {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.lb-counter {
  background: rgba(0, 0, 0, 0.55);
  color: rgba(255, 255, 255, 0.85);
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.lb-dots {
  display: flex;
  gap: 6px;
}

.lb-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s, transform 0.2s;
}

.lb-dot.active {
  background: white;
  transform: scale(1.3);
}

/* ── Transitions Lightbox ─────────────────────────────────────────────────── */
.lb-enter-active,
.lb-leave-active { transition: opacity 0.2s ease; }
.lb-enter-from,
.lb-leave-to    { opacity: 0; }

.lb-img-enter-active,
.lb-img-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.lb-img-enter-from   { opacity: 0; transform: scale(0.97); }
.lb-img-leave-to     { opacity: 0; transform: scale(1.03); }

/* ── Utilitaires ──────────────────────────────────────────────────────────── */
.ref-pill {
  font-family: "Courier New", monospace;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.15);
  padding: 2px 10px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  margin-inline-start: 8px;
}

.btn-back {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.status-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.badges-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.pri-badge {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 999px;
  font-weight: 700;
}

.vote-btn { opacity: 1; transition: opacity 0.2s; }
.vote-btn.voted { opacity: 0.6; cursor: default; }
.vote-count { font-weight: 900; }

.section-title { font-weight: 800; font-size: 16px; margin-bottom: 12px; }

.desc-text { color: var(--txt2); line-height: 1.8; font-size: 15px; }

.map-btn {
  background: var(--pu);
  color: var(--p);
  border-color: rgba(28, 110, 242, 0.2);
  font-weight: 600;
}

.history-list { display: flex; flex-direction: column; gap: 10px; }

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--txt2);
}

.history-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--p);
  flex-shrink: 0;
}

.history-date { color: var(--muted); min-width: 130px; }

.admin-badge { background: #fffbeb; color: #92400e; font-size: 11px; }

.cmt-count { font-size: 14px; font-weight: 600; color: var(--muted); margin-inline-start: 8px; }

.cmt-form {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--brd);
}

.login-prompt { font-size: 14px; color: var(--muted); text-align: center; padding: 12px; }
</style>