<template>
  <div class="rc fu" @click="router.push(`/reports/${report.id}`)">
    <!-- Header -->
    <div class="rch">
      <div style="flex: 1; min-width: 0">
        <div
          class="rct"
          style="
            font-weight: 700;
            font-size: 15px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
          "
        >
          <span>{{ cat?.icon }}</span>
          <span
            style="
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
            >{{ report.title }}</span
          >
        </div>
        <div class="rcl" style="font-size: 13px; color: var(--muted)">
          📍 {{ report.wilaya }} – {{ report.commune }}
        </div>
      </div>
      <span
        class="badge"
        :style="`background:${st?.bg};color:${st?.color};flex-shrink:0`"
      >
        {{ statusLabel }}
      </span>
    </div>

    <!-- Description -->
    <p
      class="rcd"
      style="
        font-size: 14px;
        color: var(--txt2);
        margin-bottom: 12px;
        line-height: 1.6;
      "
    >
      {{ report.description?.substring(0, 110)
      }}{{ (report.description?.length || 0) > 110 ? "..." : "" }}
    </p>

    <!-- Priority badge -->
    <div
      v-if="report.priority && report.priority !== 'normal'"
      style="margin-bottom: 10px"
    >
      <span
        :style="`font-size:11px;background:${priMap[report.priority]?.bg};color:${priMap[report.priority]?.color};border:1px solid ${priMap[report.priority]?.color}30;padding:2px 10px;border-radius:999px;font-weight:700`"
      >
        {{ priMap[report.priority]?.icon }} {{ t("pri_" + report.priority) }}
      </span>
    </div>

    <!-- Images: utilise img.url au lieu de img directement -->
    <div
      v-if="report.images?.length"
      class="gal"
      style="
        margin-bottom: 12px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      "
      @click.stop
    >
      <img
        v-for="(img, i) in report.images.slice(0, 3)"
        :key="img.id"
        :src="img.url"
        loading="lazy"
        style="
          width: 100%;
          height: 140px;
          object-fit: cover;
          border-radius: 8px;
          cursor: pointer;
        "
        @click="emit('open-lb', i)"
      />
      <div
        v-if="report.images.length > 3"
        class="gal-more"
        style="
          width: 100%;
          height: 140px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: 700;
          color: var(--txt);
          font-size: 18px;
        "
        @click="emit('open-lb', 3)"
      >
        +{{ report.images.length - 3 }}
      </div>
    </div>

    <!-- Map link -->
    <div
      v-if="report.lat && report.lat !== 0"
      style="
        font-size: 12px;
        color: var(--p);
        background: #f0f7ff;
        padding: 6px 12px;
        border-radius: 8px;
        cursor: pointer;
        margin-bottom: 12px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        border: 1px solid rgba(28, 110, 242, 0.15);
        font-weight: 600;
      "
      @click.stop="emit('open-map')"
    >
      🗺️ {{ t("rp_view_map") }}
    </div>

    <!-- Footer -->
    <div
      class="rcf"
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 4px;
        padding-top: 12px;
        border-top: 1px solid var(--brd);
      "
    >
      <div
        style="
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
          font-size: 12px;
          color: var(--muted);
        "
      >
        <!-- created_at au lieu de date -->
        <span>📅 {{ formatDate(report.created_at) }}</span>
        <!-- votes_count au lieu de votes -->
        <span v-if="report.votes_count">👍 {{ report.votes_count }}</span>
        <!-- comments_count au lieu de commentCount prop -->
        <span v-if="report.comments_count">💬 {{ report.comments_count }}</span>
        <!-- ref_num au lieu de refNum -->
        <span
          v-if="report.ref_num"
          style="
            font-family: &quot;Courier New&quot;, monospace;
            font-size: 11px;
            background: var(--w2);
            padding: 2px 8px;
            border-radius: 20px;
            border: 1px solid var(--brd);
          "
          ># {{ report.ref_num }}</span
        >
      </div>

      <div style="display: flex; gap: 6px" @click.stop>
        <RouterLink
          :to="`/reports/${report.id}`"
          class="btn bsm"
          style="padding: 5px 12px; font-size: 12px"
          >{{ t("rp_details") }}</RouterLink
        >

        <!-- votes_count au lieu de votes -->
        <button
          v-if="auth.isLoggedIn && !auth.isAdmin"
          class="btn bsm"
          :class="{ bp: !voted }"
          :style="voted ? 'opacity:.6;cursor:default' : ''"
          style="padding: 5px 12px; font-size: 12px"
          :disabled="voted"
          @click="emit('vote')"
        >
          {{ voted ? t("rp_voted") : t("rp_vote") }}
          <span style="font-weight: 900">{{ report.votes_count }}</span>
        </button>
        <span
          v-else-if="!auth.isLoggedIn"
          class="badge"
          :style="`background:${cat?.color}15;color:${cat?.color}`"
          >👍 {{ report.votes_count }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "@/composables/useI18n";
import { CATEGORIES, STATUSES } from "@/composables/useApi";

const props = defineProps({
  report: { type: Object, required: true },
  voted: { type: Boolean, default: false },
});
const emit = defineEmits(["vote", "open-map", "open-lb"]);

console.log("ReportCard props:", props);

const router = useRouter();
const auth = useAuthStore();
const { lang, t } = useI18n();

const cat = computed(() =>
  props.report ? CATEGORIES[props.report.category] : null,
);
const st = computed(() =>
  props.report ? STATUSES[props.report.status] : null,
);

const statusLabel = computed(() => {
  const s = st.value;
  if (!s) return props.report.status;
  return lang.value === "fr"
    ? s.label_fr
    : lang.value === "en"
      ? s.label_en
      : s.label_ar;
});

// Formatage de la date created_at
function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(
    lang.value === "ar" ? "ar-DZ" : lang.value === "fr" ? "fr-FR" : "en-GB",
    { day: "2-digit", month: "short", year: "numeric" },
  );
}

const priMap = {
  urgent: { icon: "🔴", color: "#EF4444", bg: "#FEF2F2" },
  normal: { icon: "🟡", color: "#F59E0B", bg: "#FFFBEB" },
  low: { icon: "🟢", color: "#10B981", bg: "#ECFDF5" },
};
</script>
