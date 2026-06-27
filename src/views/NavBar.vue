<template>
  <nav :dir="isRTL ? 'rtl' : 'ltr'">
    <!-- ══════════════════════════════
         LOGO
    ══════════════════════════════ -->
    <RouterLink to="/" class="logo" aria-label="Baligh+ — Accueil">
      <div class="logo-icon">
        <img
          src="../assets/baligh_logo2.png"
          alt=""
          aria-hidden="true"
          class="logo-img"
        />
        <span class="logo-status" title="Plateforme active" />
      </div>
      <div class="logo-divider" aria-hidden="true" />
      <div class="logo-text">
        <span class="logo-name">بلّغ<span class="logo-plus">+</span></span>
        <span class="logo-badge">BETA</span>
      </div>
    </RouterLink>

    <!-- ══════════════════════════════
         DESKTOP LINKS
    ══════════════════════════════ -->
    <div class="nav-r">
      <!-- Nav links communs -->
      <RouterLink to="/" class="nb" :class="{ on: $route.name === 'home' }"
        >🏠 {{ t("nav_home") }}</RouterLink
      >
      <RouterLink
        to="/reports"
        class="nb"
        :class="{ on: $route.name === 'reports' }"
        >📋 {{ t("nav_reports") }}</RouterLink
      >
      <RouterLink to="/map" class="nb" :class="{ on: $route.name === 'map' }"
        >🗺️ {{ t("nav_map") }}</RouterLink
      >

      <!-- Utilisateur connecté (non-admin) -->
      <template v-if="auth.isLoggedIn && !auth.isAdmin">
        <RouterLink
          to="/new-report"
          class="nb"
          :class="{ on: $route.name === 'new-report' }"
          >➕ {{ t("nav_new") }}</RouterLink
        >
        <RouterLink
          to="/my-reports"
          class="nb"
          :class="{ on: $route.name === 'my-reports' }"
          >📁 {{ t("nav_mine") }}</RouterLink
        >
        <RouterLink
          to="/profile"
          class="nb"
          :class="{ on: $route.name === 'profile' }"
          style="display: flex; align-items: center; gap: 6px"
        >
          <div class="avatar">{{ auth.user?.name?.[0] }}</div>
          {{ auth.user?.name?.split(" ")[0] }}
        </RouterLink>
        <button class="btn bsm btn-danger" @click="doLogout">
          {{ t("nav_logout") }}
        </button>
      </template>

      <!-- Admin connecté -->
      <template v-else-if="auth.isAdmin">
        <RouterLink
          to="/admin"
          class="nb"
          :class="{ on: $route.name === 'admin' }"
          >🛡️ {{ t("nav_panel") }}</RouterLink
        >
        <button class="btn bsm btn-danger" @click="doLogout">
          {{ t("nav_logout") }}
        </button>
      </template>

      <!-- Non connecté -->
      <template v-else>
        <RouterLink
          to="/login"
          class="nb"
          :class="{ on: $route.name === 'login' }"
          >🔑 {{ t("nav_login") }}</RouterLink
        >
        <RouterLink to="/register" class="btn bp bsm"
          >📝 {{ t("nav_register") }}</RouterLink
        >
      </template>

      <!-- ── Cloche notifications (desktop) ── -->
      <div v-if="auth.isLoggedIn" class="notif-wrap" ref="notifWrapDesktop">
        <button
          class="bell-btn"
          @click="handleBellClick"
          :aria-label="t('notif_title')"
        >
          🔔
          
        </button>

        <Transition name="notif">
          <div
            v-if="notifStore.notifOpen"
            class="notif-panel"
            role="dialog"
            :aria-label="t('notif_title')"
          >
            <!-- En-tête -->
            <div class="notif-header">
  <span class="notif-title">{{ t("notif_title") }}</span>
  <span v-if="notifStore.unreadCount > 0" class="notif-badge">
    {{ notifStore.unreadCount }}
  </span>
  <!-- ✅ Moved inside header, removed duplicate notif-close class -->
  <button
    class="notif-close"
    @click="notifStore.closeNotifications()"
    aria-label="Fermer"
  >
    ✕
  </button>
</div>
<!-- ✅ Remove the stray button that was here before -->
            <!-- Chargement -->

            
            <div v-if="notifStore.loading" class="notif-empty">
              <div class="spinner" />
            </div>

            <!-- Vide -->
            <div
              v-else-if="!notifStore.notifications.length"
              class="notif-empty"
            >
              <span style="font-size: 32px">🔕</span>
              <p>{{ t("notif_empty") || "Aucune notification" }}</p>
            </div>

            <!-- Liste -->
            <div v-else class="notif-list">
              <div
                v-for="n in notifStore.notifications"
                :key="n.id"
                class="notif-item"
                :class="{ unread: !n.is_read }"
                @click="onNotifClick(n)"
              >
                <div class="notif-icon">{{ notifIcon(n.type) }}</div>
                <div class="notif-body">
                  <div class="notif-item-title">{{ n.title }}</div>
                  <div class="notif-item-body">{{ n.body }}</div>
                  <div class="notif-item-date">
                    {{ formatDate(n.created_at) }}
                  </div>
                </div>
                <!-- <div v-if="!n.is_read" class="notif-unread-dot" /> -->
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- ── Sélecteur de langue ── -->
      <div class="lang-drop">
        <button
          class="lang-drop-btn"
          @click.stop="langOpen = !langOpen"
          :aria-expanded="langOpen"
          aria-haspopup="listbox"
        >
          {{ LANG_FLAGS[lang] }} {{ LANG_NAMES[lang] }}
          <svg
            class="lang-chevron"
            :class="{ open: langOpen }"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <div class="lang-menu" :class="{ open: langOpen }" role="listbox">
          <a
            v-for="(info, code) in LANGS"
            :key="code"
            href="#"
            class="lang-opt"
            :class="{ on: lang === code }"
            :aria-selected="lang === code"
            role="option"
            @click.prevent="switchLang(code)"
          >
            <span class="lang-opt-flag">{{ info.flag }}</span>
            <span class="lang-opt-name">{{ info.name }}</span>
          </a>
        </div>
      </div>
    </div>
    <!-- /nav-r -->

    <!-- ══════════════════════════════
         MOBILE CONTROLS
    ══════════════════════════════ -->
    <div class="mobile-controls">
      <!-- Cloche mobile -->
      <div v-if="auth.isLoggedIn" class="notif-wrap" ref="notifWrapMobile">
        <button
          class="bell-btn"
          @click="handleBellClick"
          :aria-label="t('notif_title')"
        >
          🔔
          <span v-if="notifStore.unreadCount > 0" class="bell-dot">
            {{ notifStore.unreadCount > 99 ? "99+" : notifStore.unreadCount }}
          </span>
        </button>
      </div>

      <!-- Burger -->
      <button
        class="burger"
        :class="{ open: mobileOpen }"
        @click="mobileOpen = !mobileOpen"
        :aria-expanded="mobileOpen"
        aria-label="Menu"
      >
        <span /><span /><span />
      </button>
    </div>

    <!-- ══════════════════════════════
         MOBILE SLIDE MENU
    ══════════════════════════════ -->
    <div class="mobile-menu" :class="{ open: mobileOpen }" role="navigation">
      <RouterLink to="/" class="nb" @click="mobileOpen = false"
        >🏠 {{ t("nav_home") }}</RouterLink
      >
      <RouterLink to="/reports" class="nb" @click="mobileOpen = false"
        >📋 {{ t("nav_reports") }}</RouterLink
      >
      <RouterLink to="/map" class="nb" @click="mobileOpen = false"
        >🗺️ {{ t("nav_map") }}</RouterLink
      >

      <template v-if="auth.isLoggedIn && !auth.isAdmin">
        <RouterLink to="/new-report" class="nb" @click="mobileOpen = false"
          >➕ {{ t("nav_new") }}</RouterLink
        >
        <RouterLink to="/my-reports" class="nb" @click="mobileOpen = false"
          >📁 {{ t("nav_mine") }}</RouterLink
        >
        <RouterLink to="/profile" class="nb" @click="mobileOpen = false"
          >👤 {{ auth.user?.name?.split(" ")[0] }}</RouterLink
        >
        <hr />
        <button class="nb" style="color: var(--err)" @click="doLogout">
          {{ t("nav_logout") }}
        </button>
      </template>

      <template v-else-if="auth.isAdmin">
        <RouterLink to="/admin" class="nb" @click="mobileOpen = false"
          >🛡️ {{ t("nav_panel") }}</RouterLink
        >
        <hr />
        <button class="nb" style="color: var(--err)" @click="doLogout">
          {{ t("nav_logout") }}
        </button>
      </template>

      <template v-else>
        <hr />
        <RouterLink to="/login" class="nb" @click="mobileOpen = false"
          >🔑 {{ t("nav_login") }}</RouterLink
        >
        <RouterLink to="/register" class="nb" @click="mobileOpen = false"
          >📝 {{ t("nav_register") }}</RouterLink
        >
      </template>

      <hr />
      <div style="display: flex; gap: 8px; padding: 4px 0">
        <a
          v-for="(info, code) in LANGS"
          :key="code"
          href="#"
          class="nb"
          :class="{ on: lang === code }"
          style="flex: 1; justify-content: center"
          @click.prevent="
            switchLang(code);
            mobileOpen = false;
          "
        >
          {{ info.flag }} {{ code.toUpperCase() }}
        </a>
      </div>
    </div>

    <!-- ══════════════════════════════
         PANNEAU NOTIF MOBILE (sous nav)
    ══════════════════════════════ -->
    <Transition name="notif">
      <div
        v-if="auth.isLoggedIn && notifStore.notifOpen && mobileNotifVisible"
        class="notif-panel notif-panel--mobile"
        role="dialog"
        :aria-label="t('notif_title')"
      >
        <div class="notif-header">
          <span class="notif-title">{{ t("notif_title") }}</span>
          <span v-if="notifStore.unreadCount > 0" class="notif-badge">{{
            notifStore.unreadCount
          }}</span>
          <button
            class="notif-close"
            @click="notifStore.closeNotifications()"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div v-if="notifStore.loading" class="notif-empty">
          <div class="spinner" />
        </div>
        <div v-else-if="!notifStore.notifications.length" class="notif-empty">
          <span style="font-size: 32px">🔕</span>
          <p>{{ t("notif_empty") || "Aucune notification" }}</p>
        </div>
        <div v-else class="notif-list">
          <div
            v-for="n in notifStore.notifications"
            :key="n.id"
            class="notif-item"
            :class="{ unread: !n.is_read }"
            @click="onNotifClick(n)"
          >
            <div class="notif-icon">{{ notifIcon(n.type) }}</div>
            <div class="notif-body">
              <div class="notif-item-title">{{ n.title }}</div>
              <div class="notif-item-body">{{ n.body }}</div>
              <div class="notif-item-date">{{ formatDate(n.created_at) }}</div>
            </div>
            <div v-if="!n.is_read" class="notif-unread-dot" />
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "@/composables/useI18n";
import { useUserNotificationStore } from "@/stores/UserNotificationStore";
import { useAdminNotificationStore } from "@/stores/AdminNotificationStore";

// ── Stores ──────────────────────────────────────────────────────
const auth = useAuthStore();
const userNotif = useUserNotificationStore();
const adminNotif = useAdminNotificationStore();
const router = useRouter();
const { lang, t, setLang, isRTL } = useI18n();

// ── Store actif selon le rôle (computed = réactif) ───────────────
const notifStore = computed(() => (auth.isAdmin ? adminNotif : userNotif));

// ── UI state ─────────────────────────────────────────────────────
const mobileOpen = ref(false);
const langOpen = ref(false);
const mobileNotifVisible = ref(false); // panneau notif sur mobile
const notifWrapDesktop = ref(null);
const notifWrapMobile = ref(null);

// ── Langue ───────────────────────────────────────────────────────
const LANG_FLAGS = { ar: "🇩🇿", fr: "🇫🇷", en: "🇬🇧" };
const LANG_NAMES = { ar: "العربية", fr: "Français", en: "English" };
const LANGS = {
  ar: { flag: "🇩🇿", name: "العربية" },
  fr: { flag: "🇫🇷", name: "Français" },
  en: { flag: "🇬🇧", name: "English" },
};

// ── Helpers ───────────────────────────────────────────────────────
function notifIcon(type) {
  return (
    {
      new_report: "📋",
      status_change: "🔄",
      new_comment: "💬",
      new_user: "👤",
      report_resolved: "✅",
      vote: "👍",
    }[type] ?? "🔔"
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  return d.toLocaleDateString(lang.value === "ar" ? "ar-DZ" : "fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

// ── Bell click ────────────────────────────────────────────────────
async function handleBellClick() {
  const store = notifStore.value;

  // Détecter si l'on est sur mobile (largeur < 768px)
  const isMobile = window.innerWidth < 768;
  if (isMobile) mobileNotifVisible.value = !mobileNotifVisible.value;

  store.toggleNotifications();

  if (store.notifOpen && store.notifications.length === 0) {
    await store.getNotifications();
  }
}

// ── Clic sur une notification ─────────────────────────────────────
async function onNotifClick(n) {
  const store = notifStore.value;

  if (!n.is_read) {
    n.is_read = true; // optimistic
    await store.markAsRead(n.id);
  }

  if (n.report_id) {
    router.push(`/reports/${n.report_id}`);
  }

  store.closeNotifications();
  mobileNotifVisible.value = false;
}



// ── Fermer sur clic extérieur ─────────────────────────────────────
function onDocClick(e) {
  if (!e.target.closest(".lang-drop")) langOpen.value = false;
  if (!e.target.closest("nav")) mobileOpen.value = false;

  const inDesktop = notifWrapDesktop.value?.contains(e.target);
  const inMobile = notifWrapMobile.value?.contains(e.target);
  if (!inDesktop && !inMobile) {
    notifStore.value.closeNotifications();
    mobileNotifVisible.value = false;
  }
}

// ── Langue ────────────────────────────────────────────────────────
function switchLang(code) {
  setLang(code);
  langOpen.value = false;
  document.documentElement.lang = code;
  document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
}

// ── Logout ────────────────────────────────────────────────────────
function doLogout() {
  userNotif.$reset();
  adminNotif.$reset();
  auth.logout();
  mobileOpen.value = false;
  router.push("/");
}

// ── Lifecycle ─────────────────────────────────────────────────────
onMounted(async () => {
  document.addEventListener("click", onDocClick);
  if (auth.isLoggedIn) {
    // Charger uniquement le compteur au démarrage (léger)
    await notifStore.value.getNotifications();
  }
});
onUnmounted(() => document.removeEventListener("click", onDocClick));
</script>

<style scoped>
/* ════════════════════════════
   LOGO
════════════════════════════ */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  padding: 4px 6px;
  border-radius: 10px;
  transition: background 0.18s ease;
}
.logo:hover {
  background: rgba(46, 158, 91, 0.06);
}

.logo-icon {
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  overflow: visible;
  background: linear-gradient(135deg, var(--p), var(--ac));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.logo:hover .logo-icon {
  transform: scale(1.06) rotate(-2deg);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.18);
}
.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}
.logo-status {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid var(--bg, #fff);
  animation: statusPulse 2.5s ease-in-out infinite;
}
@keyframes statusPulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(34, 197, 94, 0);
  }
}
.logo-divider {
  width: 1px;
  height: 28px;
  background: rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}
.logo-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  line-height: 1;
}
.logo-name {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--fg, #1a1a1a);
}
.logo-plus {
  color: var(--p);
  font-size: 21px;
}
.logo-badge {
  display: inline-flex;
  align-items: center;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: var(--p);
  background: rgba(46, 158, 91, 0.12);
  border: 1px solid rgba(46, 158, 91, 0.25);
  border-radius: 4px;
  padding: 1px 5px;
  line-height: 1.6;
  align-self: flex-start;
}

/* ════════════════════════════
   NOTIFICATIONS — WRAPPER & CLOCHE
════════════════════════════ */
.notif-wrap {
  position: relative;
}

.bell-btn {
  position: relative;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 8px;
  transition: background 0.15s;
  line-height: 1;
}
.bell-btn:hover {
  background: var(--brd, #f3f4f6);
}

.bell-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background: var(--err, #ef4444);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid var(--bg, #fff);
  pointer-events: none;
}

/* ════════════════════════════
   PANNEAU NOTIFICATIONS
════════════════════════════ */
.notif-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 340px;
  max-height: 480px;
  background: var(--bg, #fff);
  border: 1px solid var(--brd, #e5e7eb);
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 500;
}
[dir="rtl"] .notif-panel {
  right: auto;
  left: 0;
}

/* Variante mobile : pleine largeur, collé sous la nav */
.notif-panel--mobile {
  position: fixed;
  top: 64px; /* hauteur nav */
  left: 12px;
  right: 12px;
  width: auto;
  border-radius: 14px;
  z-index: 600;
}

.notif-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--brd, #e5e7eb);
  flex-shrink: 0;
}
.notif-title {
  font-weight: 700;
  font-size: 15px;
  flex: 1;
}
.notif-badge {
  background: var(--p, #2563eb);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
  line-height: 1.6;
}
.notif-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--muted, #9ca3af);
  font-size: 16px;
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.15s;
}
.notif-close:hover {
  background: var(--brd, #f3f4f6);
}

.notif-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 20px;
  color: var(--muted, #9ca3af);
  font-size: 14px;
  text-align: center;
}

.notif-list {
  overflow-y: auto;
  flex: 1;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--brd, #f3f4f6);
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}
.notif-item:last-child {
  border-bottom: none;
}
.notif-item:hover {
  background: var(--pu, #f5f8ff);
}
.notif-item.unread {
  background: rgba(37, 99, 235, 0.04);
}

.notif-icon {
  font-size: 22px;
  flex-shrink: 0;
  margin-top: 2px;
}
.notif-body {
  flex: 1;
  min-width: 0;
}

.notif-item-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--fg, #111);
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.notif-item-body {
  font-size: 12px;
  color: var(--txt2, #6b7280);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.notif-item-date {
  font-size: 11px;
  color: var(--muted, #9ca3af);
  margin-top: 4px;
}

.notif-unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--p, #2563eb);
  flex-shrink: 0;
  margin-top: 6px;
}

/* ════════════════════════════
   TRANSITIONS
════════════════════════════ */
.notif-enter-active,
.notif-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.notif-enter-from,
.notif-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

/* Spinner générique */
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--brd, #e5e7eb);
  border-top-color: var(--p, #2563eb);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


</style>
