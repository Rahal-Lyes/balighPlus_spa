<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" :lang="lang" class="app-root">

    <!-- ─── Page loader ─── -->
    <div v-if="loading" class="page-loader" />

  

    <!-- ─── Scroll to top ─── -->
    <Transition name="fade">
      <button
        v-show="showScrollTop"
        class="scroll-top"
        @click="scrollToTop"
        aria-label="Retour en haut"
      >↑</button>
    </Transition>

    <!-- ─── Lightbox ─── -->
    <Teleport to="body">
      <div
        v-if="lb.open"
        class="lb"
        role="dialog"
        aria-modal="true"
        aria-label="Visionneuse d'images"
        @click.self="lbClose"
      >
        <button class="lb-close" @click="lbClose" aria-label="Fermer">✕</button>
        <img :src="lb.images[lb.idx]" alt="" class="lb-img" />
        <div class="lb-nav">
          <button @click="lbStep(isRTL ? 1 : -1)" aria-label="Précédent">←</button>
          <span class="lb-ctr">{{ lb.idx + 1 }} / {{ lb.images.length }}</span>
          <button @click="lbStep(isRTL ? -1 : 1)" aria-label="Suivant">→</button>
        </div>
        <div class="lb-thumb">
          <img
            v-for="(src, i) in lb.images"
            :key="i"
            :src="src"
            :class="{ on: i === lb.idx }"
            @click="lb.idx = i"
            :alt="`Miniature ${i + 1}`"
          />
        </div>
      </div>
    </Teleport>

    <!-- ─── Map modal ─── -->
    <Teleport to="body">
      <div
        v-if="mapModal.open"
        class="map-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="`Carte : ${mapModal.title}`"
        @click.self="mapModal.open = false"
      >
        <div class="mm-box">
          <div class="mm-head">
            <strong>📍 {{ mapModal.title }}</strong>
            <button class="mm-close" @click="mapModal.open = false" aria-label="Fermer">✕</button>
          </div>
          <div id="mapModalView" class="mm-map" />
        </div>
      </div>
    </Teleport>

    <!-- ─── Notification panel ─── -->
    <div
      class="np"
      :class="{ open: npOpen }"
      id="np"
      role="region"
      :aria-label="t('notif_title')"
    >
      <div class="np-head">
        <strong class="np-title">{{ t("notif_title") }}</strong>
        <button class="np-mark" @click="markRead">{{ t("notif_mark") }}</button>
      </div>
      <div class="np-list">
        <template v-if="notifs.length">
          <div
            v-for="n in notifs"
            :key="n.id"
            class="ni"
            :class="{ unread: !n.read }"
          >
            <div v-if="!n.read" class="ni-dot" />
            <span class="ni-icon" aria-hidden="true">{{ notifIcons[n.type] || "🔔" }}</span>
            <div class="ni-content">
              <div class="ni-title">{{ n.title }}</div>
              <div class="ni-body">{{ n.body }}</div>
              <div class="ni-date">{{ n.date }}</div>
            </div>
          </div>
        </template>
        <div v-else class="np-empty">{{ t("notif_empty") }}</div>
      </div>
    </div>

    <!-- ─── Navbar ─── -->
    <NavBar :unread-count="unreadCount" @toggle-notif="toggleNotif" />

    <!-- ─── Main content ─── -->
    <main class="app-main">
      <RouterView />
    </main>
<AppToast />
    <!-- ─── Footer ─── -->
    <AppFooter />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useAuthStore }  from "@/stores/auth";
import { useToastStore } from "@/stores/ToastStore";
import { useI18n }       from "@/composables/useI18n";
import api               from "@/composables/useApi";
import NavBar            from "@/views/NavBar.vue";
import AppFooter         from "@/views/Footer.vue";
import AppToast from "../src/components/Toast.vue";



/* ── Stores & composables ───────────────────────────────── */
const auth  = useAuthStore();
const toast = useToastStore();
const { lang, t, setLang, isRTL } = useI18n();

/* ── State ──────────────────────────────────────────────── */
const loading      = ref(false);
const npOpen       = ref(false);
const notifs       = ref([]);
const showScrollTop = ref(true);

const notifIcons = {
  new_report:    "📋",
  new_user:      "👤",
  status_update: "🔄",
  vote:          "👍",
  report_sent:   "✅",
  comment:       "💬",
};

const unreadCount = computed(() => notifs.value.filter((n) => !n.read).length);

/* ── Scroll to top ──────────────────────────────────────── */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function onScroll() {
  showScrollTop.value = window.scrollY > 300;
}

/* ── Lightbox ───────────────────────────────────────────── */
const lb = ref({ open: false, images: [], idx: 0 });

function lbClose() {
  lb.value.open = false;
  document.body.style.overflow = "";
}
function lbStep(d) {
  lb.value.idx = (lb.value.idx + d + lb.value.images.length) % lb.value.images.length;
}

window.$lbOpen = (imgs, idx = 0) => {
  lb.value = { open: true, images: imgs, idx };
  document.body.style.overflow = "hidden";
};

/* ── Map modal ──────────────────────────────────────────── */
const mapModal = ref({ open: false, title: "", lat: 0, lng: 0 });

window.$mmOpen = async (lat, lng, title) => {
  mapModal.value = { open: true, title, lat, lng };
  document.body.style.overflow = "hidden";
  await nextTick();
  const L  = (await import("leaflet")).default;
  const el = document.getElementById("mapModalView");
  if (el._leaflet_id) return;
  const map = L.map(el).setView([lat, lng], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OSM",
  }).addTo(map);
  L.marker([lat, lng]).addTo(map).bindPopup(`<b>${title}</b>`).openPopup();
};

/* ── Notifications ──────────────────────────────────────── */
async function toggleNotif() {
  npOpen.value = !npOpen.value;
  if (npOpen.value) await loadNotifs();
}

async function loadNotifs() {
  if (!auth.isLoggedIn) return;
  try {
    const res = await api.get("/notifications");
    notifs.value = res.data;
  } catch {
    // silently fail
  }
}

async function markRead() {
  try {
    await api.post("/notifications/mark-read");
    await loadNotifs();
    toast.show(t("toast_read", ""));
  } catch {
    // silently fail
  }
}

/* ── Global keyboard & click handlers ──────────────────── */
function onKey(e) {
  if (e.key === "Escape") {
    lbClose();
    mapModal.value.open = false;
    npOpen.value = false;
  }
  if (lb.value.open) {
    if (e.key === "ArrowLeft")  lbStep(isRTL.value ?  1 : -1);
    if (e.key === "ArrowRight") lbStep(isRTL.value ? -1 :  1);
  }
}

function onDocClick(e) {
  if (
    !e.target.closest("#np") &&
    !e.target.closest("#bellBtn") &&
    !e.target.closest(".bell-btn")
  ) {
    npOpen.value = false;
  }
}

/* ── Lifecycle ──────────────────────────────────────────── */
let notifInterval;

onMounted(() => {
  document.addEventListener("keydown", onKey);
  document.addEventListener("click",   onDocClick);
  window.addEventListener("scroll",    onScroll, { passive: true });
  setLang(lang.value);
  if (auth.isLoggedIn) {
    loadNotifs();
    notifInterval = setInterval(loadNotifs, 30_000);
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKey);
  document.removeEventListener("click",   onDocClick);
  window.removeEventListener("scroll",    onScroll);
  clearInterval(notifInterval);
});

watch(
  () => auth.isLoggedIn,
  (v) => {
    if (v) {
      loadNotifs();
      notifInterval = setInterval(loadNotifs, 30_000);
    } else {
      clearInterval(notifInterval);
      notifs.value = [];
    }
  },
);
</script>

<style>
/* ─────────────────────────────────────────────────────────
   BASE — scroll fix
   ───────────────────────────────────────────────────────── */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  height: 100%;
  margin: 0;
  padding: 0;
  /* force la scrollbar même quand le contenu est court
     → évite le layout-shift quand des modals s'ouvrent */
  overflow-y: scroll;
  overflow-x: hidden;
}

body {
  min-height: 100%;
  margin: 0;
  padding: 0;
  /* NE PAS mettre overflow:hidden ici — ça casse le scroll */
}

/* ─────────────────────────────────────────────────────────
   LAYOUT PRINCIPAL
   ───────────────────────────────────────────────────────── */
.app-root {
  /* Flex column : navbar en haut, footer collé en bas */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  /* Prend tout l'espace disponible entre navbar et footer */
  flex: 1 0 auto;
  /* Pas de overflow:hidden ici ! */
}

/* ─────────────────────────────────────────────────────────
   PAGE LOADER
   ───────────────────────────────────────────────────────── */
.page-loader {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--p, #2563eb), var(--ac, #7c3aed));
  z-index: 9999;
  animation: loaderAnim 0.6s ease forwards;
}

@keyframes loaderAnim {
  from { width: 0;    opacity: 1; }
  to   { width: 100%; opacity: 0; }
}

/* ─────────────────────────────────────────────────────────
   TOAST
   ───────────────────────────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--toast-bg, #1f2937);
  color: var(--toast-text, #f9fafb);
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  z-index: 8000;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.toast-anim-enter-active,
.toast-anim-leave-active {
  transition: all 0.35s cubic-bezier(0.22, 0.68, 0, 1.2);
}
.toast-anim-enter-from,
.toast-anim-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* ─────────────────────────────────────────────────────────
   SCROLL TO TOP
   ───────────────────────────────────────────────────────── */
.scroll-top {
  position: fixed;
  bottom: 5rem;
  inset-inline-end: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--p, #2563eb);
  color: #fff;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  z-index: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  transition: opacity 0.2s, transform 0.2s;
}
.scroll-top:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.fade-enter-active,
.fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; }

/* ─────────────────────────────────────────────────────────
   LIGHTBOX
   ───────────────────────────────────────────────────────── */
.lb {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 9000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.lb-close {
  position: absolute;
  top: 1rem;
  inset-inline-end: 1rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  line-height: 1;
  padding: 0.25rem 0.5rem;
}
.lb-close:hover { opacity: 1; }

.lb-img {
  max-height: 70vh;
  max-width: 90vw;
  object-fit: contain;
  border-radius: 4px;
}

.lb-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: #fff;
}
.lb-nav button {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.lb-nav button:hover { background: rgba(255, 255, 255, 0.3); }

.lb-ctr {
  font-size: 0.9rem;
  opacity: 0.7;
}

.lb-thumb {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 90vw;
}
.lb-thumb img {
  width: 56px;
  height: 40px;
  object-fit: cover;
  border-radius: 3px;
  cursor: pointer;
  opacity: 0.5;
  border: 2px solid transparent;
  transition: opacity 0.2s, border-color 0.2s;
}
.lb-thumb img.on {
  opacity: 1;
  border-color: var(--p, #2563eb);
}

/* ─────────────────────────────────────────────────────────
   MAP MODAL
   ───────────────────────────────────────────────────────── */
.map-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 8500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.mm-box {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 580px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.25);
}

.mm-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.1rem;
  border-bottom: 1px solid #e5e7eb;
}

.mm-close {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: #9ca3af;
  line-height: 1;
  padding: 0.15rem 0.35rem;
  transition: color 0.15s;
}
.mm-close:hover { color: #374151; }

.mm-map { height: 340px; }

/* ─────────────────────────────────────────────────────────
   NOTIFICATION PANEL
   ───────────────────────────────────────────────────────── */
.np {
  position: fixed;
  inset-block-start: 56px;
  inset-inline-end: 1rem;
  width: 320px;
  max-height: 420px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  z-index: 1200;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* masqué par défaut avec transition */
  visibility: hidden;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.2s, transform 0.2s, visibility 0s 0.2s;
}
.np.open {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.2s, transform 0.2s;
}

.np-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  flex-shrink: 0;
}

.np-title { font-size: 0.9375rem; }

.np-mark {
  font-size: 0.75rem;
  color: var(--p, #2563eb);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  padding: 0;
}

.np-list {
  overflow-y: auto;
  flex: 1;
}

.np-empty {
  padding: 2rem 1rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
}

.ni {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.7rem 1rem;
  position: relative;
  border-bottom: 1px solid #f9fafb;
  transition: background 0.15s;
}
.ni:last-child { border-bottom: none; }
.ni:hover      { background: #f9fafb; }
.ni.unread     { background: #eff6ff; }

.ni-dot {
  position: absolute;
  inset-block-start: 0.85rem;
  inset-inline-start: 0.35rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--p, #2563eb);
  flex-shrink: 0;
}

.ni-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.ni-content  { min-width: 0; }
.ni-title    { font-weight: 600; font-size: 0.875rem; margin-bottom: 2px; }
.ni-body     { font-size: 0.8125rem; color: #4b5563; }
.ni-date     { font-size: 0.75rem; color: #9ca3af; margin-top: 2px; }
</style>