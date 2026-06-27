<template>
  <Teleport to="body">
    <div
      v-if="mounted"
      ref="toastEl"
      class="toast-container"
      :class="[`toast--${toast.color}`]"
      role="alert"
      aria-live="polite"
    >
      <!-- Accent bar -->
      <div class="toast-accent" />

      <!-- Icon wrapper -->
      <div class="toast-icon-wrap">
        <i :class="['fa-solid', iconClass]" class="toast-icon" />
      </div>

      <!-- Content -->
      <div class="toast-content">
        <span class="toast-label">{{ toastLabel }}</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>

      <!-- Close button -->
      <button class="toast-close" @click="dismiss" aria-label="Fermer">
        <i class="fa-solid fa-xmark" />
      </button>

      <!-- Progress bar -->
      <div ref="progressEl" class="toast-progress" />
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from "vue";
import { gsap } from "gsap";
import { useToastStore } from "@/stores/ToastStore";

const toast = useToastStore();

const toastEl = ref(null);
const progressEl = ref(null);
const mounted = ref(false);

let progressTween = null;
let dismissTimer = null;

// ── Icon Font Awesome ──────────────────────────────────────────────────────
const iconClass = computed(() => {
  switch (toast.color) {
    case "success":
      return "fa-circle-check";
    case "error":
      return "fa-circle-xmark";
    case "warning":
      return "fa-triangle-exclamation";
    case "info":
      return "fa-circle-info";
    default:
      return "fa-bell";
  }
});

// ── Label lisible ─────────────────────────────────────────────────────────
const toastLabel = computed(() => {
  switch (toast.color) {
    case "success":
      return "Succès";
    case "error":
      return "Erreur";
    case "warning":
      return "Attention";
    case "info":
      return "Information";
    default:
      return "Notification";
  }
});

// ── Dismiss ───────────────────────────────────────────────────────────────
function dismiss() {
  if (!toastEl.value) return;
  progressTween?.kill();
  clearTimeout(dismissTimer);

  gsap.to(toastEl.value, {
    x: 420,
    opacity: 0,
    scale: 0.95,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      mounted.value = false;
      toast.show = false;
    },
  });
}

// ── Watch show ────────────────────────────────────────────────────────────
watch(
  () => toast.show,
  async (val) => {
    if (!val) return;

    mounted.value = true;
    await nextTick();

    // Entrée GSAP
    gsap.fromTo(
      toastEl.value,
      { x: 420, opacity: 0, scale: 0.92 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "back.out(1.4)",
        onComplete: startProgress,
      },
    );

    // Icône : petit bounce
    gsap.fromTo(
      toastEl.value.querySelector(".toast-icon"),
      { scale: 0, rotate: -15 },
      { scale: 1, rotate: 0, duration: 0.4, delay: 0.15, ease: "back.out(2)" },
    );
  },
);

function startProgress() {
  if (!progressEl.value || toast.timer <= 0) return;

  progressTween = gsap.fromTo(
    progressEl.value,
    { scaleX: 1 },
    {
      scaleX: 0,
      duration: toast.timer / 1000,
      ease: "none",
      transformOrigin: "left center",
      onComplete: dismiss,
    },
  );
}

onUnmounted(() => {
  progressTween?.kill();
  clearTimeout(dismissTimer);
});
</script>

<style scoped>
/* ── Font Awesome CDN (si pas encore global) ── */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");

/* ── Variables de thème ── */
.toast--success {
  --accent: #22c55e;
  --accent-dark: #16a34a;
  --glow: rgba(34, 197, 94, 0.25);
}
.toast--error {
  --accent: #f87171;
  --accent-dark: #dc2626;
  --glow: rgba(248, 113, 113, 0.25);
}
.toast--warning {
  --accent: #fbbf24;
  --accent-dark: #d97706;
  --glow: rgba(251, 191, 36, 0.25);
}
.toast--info {
  --accent: #60a5fa;
  --accent-dark: #2563eb;
  --glow: rgba(96, 165, 250, 0.25);
}

/* ── Conteneur principal ── */
.toast-container {
  position: fixed;
  bottom: 28px;
  inset-inline-end: 28px;
  z-index: 9999;
  right: 28px; 
  left: auto;
  display: flex;
  align-items: center;
  gap: 12px;

  min-width: 300px;
  max-width: 440px;
  padding: 16px 16px 16px 0;
  border-radius: 14px;
  overflow: hidden;

  /* Glassmorphism sombre */
  background: rgba(15, 15, 20, 0.88);
  backdrop-filter: blur(18px) saturate(1.6);
  -webkit-backdrop-filter: blur(18px) saturate(1.6);

  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    0 8px 32px rgba(0, 0, 0, 0.45),
    0 0 40px var(--glow);
}

/* ── Barre d'accent latérale ── */
.toast-accent {
  flex-shrink: 0;
  width: 4px;
  align-self: stretch;
  background: linear-gradient(180deg, var(--accent), var(--accent-dark));
  border-radius: 0 3px 3px 0;
  box-shadow: 0 0 12px var(--glow);
}

/* ── Icône ── */
.toast-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.toast-icon {
  font-size: 16px;
  color: var(--accent);
  display: block;
}

/* ── Contenu texte ── */
.toast-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.toast-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  font-family: system-ui, sans-serif;
}

.toast-message {
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.9);
  font-family: system-ui, sans-serif;
  word-break: break-word;
}

/* ── Bouton fermer ── */
.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  flex-shrink: 0;
  margin-right: 4px;
  transition:
    background 0.18s,
    color 0.18s,
    border-color 0.18s;
  font-size: 13px;
}
.toast-close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
}

/* ── Barre de progression ── */
.toast-progress {
  position: absolute;
  bottom: 0;
  inset-inline-start: 0;
  height: 2px;
  width: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-dark));
  transform-origin: left center;
  opacity: 0.7;
}

/* ── Respect du prefers-reduced-motion ── */
@media (prefers-reduced-motion: reduce) {
  .toast-container {
    transition: none !important;
  }
}
</style>
