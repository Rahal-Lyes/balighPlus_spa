<template>
  <div>
    <!-- HERO -->
    <section class="home-hero">
      <div class="home-hero-inner con">
        <div class="home-hero-text">
          <div v-if="welcome" class="alert a-ok" style="margin-bottom: 20px">
            🎉 {{ t("ok_welcome") }}
          </div>
          <div ref="heroBadge" class="home-hero-badge">
            <span class="home-hero-badge-dot" />
            {{
              lang === "fr"
                ? "Plateforme officielle"
                : lang === "en"
                  ? "Official Platform"
                  : "المنصة الرسمية للإبلاغ"
            }}
          </div>
          <h1 ref="heroTitle" class="home-hero-h1">{{ t("hero_title") }}</h1>
          <p ref="heroSub" class="home-hero-p">{{ t("hero_sub") }}</p>
          <div ref="heroBtns" class="home-hero-btns">
            <template v-if="auth.isLoggedIn && !auth.isAdmin">
              <RouterLink to="/new-report" class="btn bp home-btn-main">
                🚀 {{ t("hero_btn_new") }}
              </RouterLink>
              <RouterLink to="/my-reports" class="btn home-btn-ghost">
                📁 {{ t("hero_btn_mine") }}
              </RouterLink>
            </template>
            <template v-else-if="!auth.isLoggedIn">
              <RouterLink to="/register" class="btn bp home-btn-main">
                📝 {{ t("hero_btn_reg") }}
              </RouterLink>
              <RouterLink to="/reports" class="btn home-btn-ghost">
                📋 {{ t("hero_btn_view") }}
              </RouterLink>
            </template>
          </div>

          <!-- Mini stats -->
          <div ref="miniStats" class="home-mini-stats">
            <div class="home-mini-stat">
              <strong>{{ resvPct }}%</strong>
              <span>{{ t("adm_rate") }}</span>
            </div>
            <div class="home-mini-divider" />
            <div class="home-mini-stat">
              <strong style="color: #10b981">{{
                dataStore.stats.resolved
              }}</strong>
              <span>{{ t("stat_resolved") }}</span>
            </div>
            <div class="home-mini-divider" />
            <div class="home-mini-stat">
              <strong>{{ dataStore.stats.users }}</strong>
              <span>{{
                lang === "fr"
                  ? "Citoyens"
                  : lang === "en"
                    ? "Citizens"
                    : "مواطن"
              }}</span>
            </div>
            <div class="home-mini-divider" />
            <div class="home-mini-stat">
              <strong>{{ dataStore.stats.total }}</strong>
              <span>{{ t("stat_total") }}</span>
            </div>
          </div>
        </div>

        <!-- Hero visual -->
        <div ref="heroVisual" class="home-hero-visual">
          <div class="home-visual-card home-vc1">
            <div style="display: flex; align-items: center; gap: 10px">
              <div class="vc-icon" style="background: #fef2f2">🛣️</div>
              <div>
                <div class="vc-title">
                  {{
                    lang === "ar"
                      ? "حفرة في الطريق"
                      : lang === "en"
                        ? "Damaged road"
                        : "Route endommagée"
                  }}
                </div>
                <div class="vc-loc">
                  📍 {{ lang === "ar" ? "الجزائر" : "Alger" }}
                </div>
              </div>
            </div>
            <span class="vc-badge" style="background: #ecfdf5; color: #10b981">
              ✅ {{ t("st_resolved") }}
            </span>
          </div>
          <div class="home-visual-card home-vc2">
            <div style="display: flex; align-items: center; gap: 10px">
              <div class="vc-icon" style="background: #eff6ff">💡</div>
              <div>
                <div class="vc-title">
                  {{
                    lang === "ar"
                      ? "إنارة معطلة"
                      : lang === "en"
                        ? "Broken streetlight"
                        : "Éclairage défaillant"
                  }}
                </div>
                <div class="vc-loc">
                  📍 {{ lang === "ar" ? "وهران" : "Oran" }}
                </div>
              </div>
            </div>
            <span class="vc-badge" style="background: #eff6ff; color: #3b82f6">
              ⚙️ {{ t("st_processing") }}
            </span>
          </div>
          <div class="home-visual-card home-vc3">
            <div style="display: flex; align-items: center; gap: 8px">
              <div
                style="
                  width: 32px;
                  height: 32px;
                  background: var(--pu);
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                🗺️
              </div>
              <div style="font-size: 12px; font-weight: 600; color: var(--p)">
                {{
                  lang === "ar"
                    ? "58 ولاية مغطاة"
                    : lang === "en"
                      ? "58 wilayas covered"
                      : "58 wilayas couvertes"
                }}
              </div>
            </div>
          </div>
          <div class="home-visual-rate">
            <div
              style="
                font-size: 28px;
                font-weight: 900;
                color: #10b981;
                line-height: 1;
              "
            >
              {{ resvPct }}%
            </div>
            <div style="font-size: 11px; color: var(--muted); margin-top: 3px">
              {{ t("adm_rate") }}
            </div>
            <div
              style="
                margin-top: 8px;
                height: 5px;
                background: var(--brd);
                border-radius: 99px;
                overflow: hidden;
              "
            >
              <div
                :style="`height:100%;width:${resvPct}%;background:linear-gradient(90deg,#10B981,#34D399);border-radius:99px;transition:width 1.2s ease`"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTENU PRINCIPAL -->
    <div class="con">
      <!-- STATS COMPONENT -->
      <Stats />

      <!-- HOW IT WORKS -->
      <div class="home-section-head reveal-item">
        <h2 class="st">{{ t("how_title") }}</h2>
      </div>
      <div class="g4" style="margin-bottom: 56px">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="feat-card reveal-item"
          style="position: relative; overflow: hidden"
        >
          <div
            :style="`position:absolute;top:-16px;${isRTL ? 'right' : 'left'}:-16px;width:80px;height:80px;border-radius:50%;background:${step.bg};opacity:.6`"
          />
          <div
            class="feat-icon"
            :style="`background:${step.bg};position:relative;z-index:1`"
          >
            <span style="font-size: 26px">{{ step.icon }}</span>
          </div>
          <h3
            style="
              font-weight: 800;
              font-size: 16px;
              margin-bottom: 8px;
              position: relative;
              z-index: 1;
            "
          >
            {{ t(step.titleKey) }}
          </h3>
          <p
            style="
              font-size: 14px;
              color: var(--txt2);
              line-height: 1.7;
              position: relative;
              z-index: 1;
            "
          >
            {{ t(step.descKey) }}
          </p>
        </div>
      </div>

      <!-- CATEGORIES -->
      <div class="reveal-item">
        <h2 class="st">{{ t("cat_title") }}</h2>
      </div>
      <div class="home-cats-grid" style="margin-bottom: 56px">
        <div
          v-for="(cat, key) in CATEGORIES"
          :key="key"
          class="home-cat-card reveal-item"
          @click="goCategory(key)"
        >
          <div
            class="home-cat-icon"
            :style="`background:${cat.color}20;color:${cat.color}`"
          >
            {{ cat.icon }}
          </div>
          <div class="home-cat-name">{{ getCatLabel(cat) }}</div>
          <div class="home-cat-count">
            {{ dataStore.stats.by_category?.[key] || 0 }}
            {{ t("nav_reports").toLowerCase() }}
          </div>
        </div>
      </div>

      <!-- LATEST REPORTS -->
      <div class="reveal-item">
        <h2 class="st">{{ t("latest") }}</h2>
      </div>
      <div class="g3" style="margin-bottom: 40px">
        <div
          v-for="r in latestReports"
          :key="r.id"
          class="home-rep-card rc"
          @click="router.push(`/reports/${r.id}`)"
        >
              <div class="rch">
            <div>
              <div
                class="badge"
                :style="`background:${STATUSES[r.status]?.bg};color:${STATUSES[r.status]?.color}`"
              >
                {{ getStatusLabel(r.status) }}
              </div>
              <h3
                style="
                  font-size: 15px;
                  font-weight: 700;
                  margin-top: 8px;
                  margin-bottom: 4px;
                "
              >
                {{ r.title }}
              </h3>
              <div style="font-size: 13px; color: var(--muted)">
                📍 {{ r.wilaya }}, {{ r.commune }}
              </div>
            </div>
            <div style="font-size: 28px">
              {{ CATEGORIES[r.category]?.icon }}
            </div>
          </div>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-top: 12px;
              font-size: 13px;
              color: var(--muted);
            "
          >
            <span>👍 {{ r.votes_count }} {{ t("dt_votes") }}</span>
            <span>📅 {{ r.created_at?.slice(0, 10) }}</span>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="cta reveal-item" style="margin-bottom: 0">
        <h2
          style="
            font-size: clamp(22px, 3.5vw, 30px);
            font-weight: 900;
            margin-bottom: 12px;
          "
        >
          {{ t("cta_title") }}
        </h2>
        <p
          style="
            opacity: 0.8;
            font-size: 16px;
            margin-bottom: 28px;
            max-width: 500px;
            margin-inline: auto;
          "
        >
          {{ t("cta_sub") }}
        </p>
        <div
          style="
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
          "
        >
          <RouterLink
            v-if="!auth.isLoggedIn"
            to="/register"
            class="btn"
            style="
              background: white;
              color: var(--p);
              font-weight: 800;
              padding: 13px 28px;
            "
            >{{ t("cta_btn") }}</RouterLink
          >
          <RouterLink
            v-else
            to="/new-report"
            class="btn"
            style="
              background: white;
              color: var(--p);
              font-weight: 800;
              padding: 13px 28px;
            "
            >➕ {{ t("nav_new") }}</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "@/composables/useI18n";
import { useDataStore } from "@/stores/DataStore";
import { CATEGORIES, STATUSES } from "@/composables/useApi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Stats from "@/components/Stats.vue";

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const dataStore = useDataStore();
const { lang, t, isRTL } = useI18n();

// ── Refs GSAP ─────────────────────────────────────────────────────
const heroBadge = ref(null);
const heroTitle = ref(null);
const heroSub = ref(null);
const heroBtns = ref(null);
const miniStats = ref(null);
const heroVisual = ref(null);

// ── Data locale ───────────────────────────────────────────────────
const latestReports = ref([]);

// ── Computed ──────────────────────────────────────────────────────
const welcome = computed(() => route.query.welcome === "1");
const resvPct = computed(() =>
  dataStore.stats.total
    ? Math.round((dataStore.stats.resolved / dataStore.stats.total) * 100)
    : 0,
);

// ── Steps ─────────────────────────────────────────────────────────
const steps = [
  { icon: "🔐", titleKey: "how1_t", descKey: "how1_d", bg: "#EBF2FF" },
  { icon: "📍", titleKey: "how2_t", descKey: "how2_d", bg: "#ECFDF5" },
  { icon: "🔔", titleKey: "how3_t", descKey: "how3_d", bg: "#FFFBEB" },
  { icon: "🏛️", titleKey: "how4_t", descKey: "how4_d", bg: "#F5F3FF" },
];

// ── Helpers ───────────────────────────────────────────────────────
function getCatLabel(cat) {
  return lang.value === "fr"
    ? cat.label_fr
    : lang.value === "en"
      ? cat.label_en
      : cat.label_ar;
}
function getStatusLabel(status) {
  const s = STATUSES[status];
  if (!s) return status;
  return lang.value === "fr"
    ? s.label_fr
    : lang.value === "en"
      ? s.label_en
      : s.label_ar;
}
function goCategory(key) {
  router.push({ path: "/reports", query: { category: key } });
}
function setupScrollReveal() {
  gsap.utils.toArray(".reveal-item").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      },
    );
  });
}

// ── onMounted ─────────────────────────────────────────────────────
onMounted(async () => {
  // Animations hero
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  tl.from(heroBadge.value, { opacity: 0, y: -16, duration: 0.5 })
    .from(heroTitle.value, { opacity: 0, y: 28, duration: 0.6 }, "-=0.25")
    .from(heroSub.value, { opacity: 0, y: 20, duration: 0.5 }, "-=0.3")
    .from(
      heroBtns.value?.children ?? [],
      {
        opacity: 0,
        y: 16,
        duration: 0.45,
        stagger: 0.1,
        ease: "back.out(1.6)",
      },
      "-=0.25",
    )
    .from(miniStats.value, { opacity: 0, y: 20, duration: 0.5 }, "-=0.2")
    .from(
      heroVisual.value,
      { opacity: 0, x: 40, duration: 0.7, ease: "power3.out" },
      "-=0.6",
    );

  setupScrollReveal();

  // ✅ Uniquement les reports récents pour la liste
await dataStore.fetchReports({ page: 1, per_page: 6 });
latestReports.value = [...(dataStore.reports.items ?? [])];

});
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
