<template>
  <div class="g4" style="margin-bottom: 40px">
    <div class="stat-card">
      <div class="si" style="background: #ebf2ff">📋</div>
      <div>
        <div class="sv" style="color: var(--p)">{{ animatedTotal }}</div>
        <div class="sl">{{ t("stat_total") }}</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="si" style="background: #fff3e0">⏳</div>
      <div>
        <div class="sv" style="color: #ff9800">{{ animatedPending }}</div>
        <div class="sl">{{ t("stat_pending") }}</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="si" style="background: #e3f2fd">⚙️</div>
      <div>
        <div class="sv" style="color: #2196f3">{{ animatedProcessing }}</div>
        <div class="sl">{{ t("stat_process") }}</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="si" style="background: #e8f5e9">✅</div>
      <div>
        <div class="sv" style="color: #4caf50">{{ animatedResolved }}</div>
        <div class="sl">{{ t("stat_resolved") }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "@/composables/useI18n";
import { useDataStore } from "@/stores/DataStore";

const { t } = useI18n();
const dataStore = useDataStore();

// ✅ Fetch au montage du composant
onMounted(async () => {
  await dataStore.fetchStats();
});

// ✅ Computed réactifs — se mettent à jour automatiquement après le fetch
const animatedTotal      = computed(() => dataStore.stats.total);
const animatedPending    = computed(() => dataStore.stats.pending);
const animatedProcessing = computed(() => dataStore.stats.processing);
const animatedResolved   = computed(() => dataStore.stats.resolved);
</script>
<style scoped>
/* HERO */
.home-hero {
  background: linear-gradient(
    135deg,
    #0d1b3e 0%,
    #0d47a1 45%,
    #1565c0 70%,
    #1976d2 100%
  );
  padding: 0;
  overflow: hidden;
}
.home-hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  padding: 80px 24px 100px;
}
.home-hero-text {
  color: white;
}
.home-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20px;
}
.home-hero-badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}
.home-hero-h1 {
  font-size: clamp(26px, 4vw, 44px);
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 16px;
}
.home-hero-p {
  font-size: 16px;
  opacity: 0.8;
  margin-bottom: 32px;
  max-width: 480px;
  line-height: 1.7;
}
.home-hero-btns {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}
.home-btn-main {
  background: white;
  color: var(--p);
  padding: 13px 24px;
  font-size: 15px;
  font-weight: 800;
  border-color: transparent;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
.home-btn-main:hover {
  background: var(--pu);
}
.home-btn-ghost {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.25);
  padding: 13px 24px;
  font-size: 15px;
}
.home-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Mini stats */
.home-mini-stats {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  overflow: hidden;
}
.home-mini-stat {
  flex: 1;
  padding: 12px 16px;
  text-align: center;
}
.home-mini-stat strong {
  display: block;
  font-size: 22px;
  font-weight: 900;
  color: white;
  line-height: 1;
}
.home-mini-stat span {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 3px;
  display: block;
}
.home-mini-divider {
  width: 1px;
  background: rgba(255, 255, 255, 0.15);
  height: 40px;
  flex-shrink: 0;
}

/* Hero visual */
.home-hero-visual {
  position: relative;
  height: 320px;
}
.home-visual-card {
  background: white;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: absolute;
  animation: float 4s ease-in-out infinite;
}
.home-vc1 {
  top: 0;
  right: 0;
  left: 40%;
}
.home-vc2 {
  bottom: 40px;
  left: 0;
  right: 40%;
  animation-delay: 1.5s;
}
.home-vc3 {
  bottom: 0;
  right: 0;
  left: 50%;
  padding: 12px 14px;
  animation-delay: 0.8s;
}
.home-visual-rate {
  position: absolute;
  top: 50%;
  right: 30%;
  transform: translateY(-50%);
  background: white;
  border-radius: 14px;
  padding: 16px 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  text-align: center;
  min-width: 120px;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
.vc-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.vc-title {
  font-weight: 700;
  font-size: 13px;
  color: var(--txt);
}
.vc-loc {
  font-size: 11px;
  color: var(--muted);
}
.vc-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  margin-top: 8px;
  display: inline-block;
}

/* Cats grid */
.home-cats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}
.home-cat-card {
  background: var(--w);
  border-radius: var(--r);
  padding: 20px 16px;
  text-align: center;
  border: 1px solid var(--brd);
  box-shadow: var(--sh1);
  cursor: pointer;
  transition:
    transform 0.22s,
    box-shadow 0.22s;
}
.home-cat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--sh2);
}
.home-cat-icon {
  font-size: 32px;
  margin: 0 auto 10px;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.home-cat-name {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 4px;
}
.home-cat-count {
  font-size: 12px;
  color: var(--muted);
}

/* Rep cards */
.home-rep-card {
  cursor: pointer;
}

/* Scroll reveal initial state */
.reveal-item {
  opacity: 0;
}

@media (max-width: 900px) {
  .home-hero-inner {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 56px 20px;
  }
  .home-hero-visual {
    display: none;
  }
}
@media (max-width: 600px) {
  .home-mini-stats {
    flex-wrap: wrap;
  }
  .home-mini-divider {
    display: none;
  }
  .home-mini-stat {
    flex: 1;
    min-width: 70px;
    padding: 10px 8px;
  }
  .home-cats-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  }
}
</style>
