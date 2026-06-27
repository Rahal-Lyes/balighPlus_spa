<template>
  <div>
    <div class="ph">
      <div>
        <h1>🗺️ {{ t("map_title") }}</h1>
        <p>{{ t("map_sub") }} — {{ locatedCount }} {{ t("map_located") }}</p>
      </div>
    </div>

    <div class="con" style="padding-top: 0">
      <div class="card fu" style="padding: 0; overflow: hidden">
        <!-- Legend -->
        <div
          style="
            padding: 16px 22px;
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
            align-items: center;
            border-bottom: 1px solid var(--brd);
            background: var(--w2);
          "
        >
          <span style="font-size: 13px; font-weight: 600; color: var(--txt2)">
            {{
              lang === "ar" ? "الحالات" : lang === "fr" ? "Statuts" : "Status"
            }}
            :
          </span>
          <span
            v-for="(info, key) in legendItems"
            :key="key"
            style="
              font-size: 13px;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background: white;
              padding: 5px 12px;
              border-radius: 999px;
              border: 1px solid var(--brd);
              font-weight: 600;
            "
          >
            <span
              :style="`width:10px;height:10px;border-radius:50%;background:${info.color};flex-shrink:0`"
            />
            {{ info.icon }} {{ info.label }}
          </span>
        </div>

        <!-- Map container -->
        <div id="mapAll" style="height: 580px" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "@/composables/useI18n";
import { getReports } from "@/api/reports";
import { CATEGORIES, STATUSES } from "@/composables/useApi";

const router = useRouter();
const { lang, t } = useI18n();

const reports = ref([]);
const locatedCount = computed(
  () => reports.value.filter((r) => r.lat && r.lat !== 0).length,
);

const STATUS_COLORS = {
  pending: "#F59E0B",
  processing: "#3B82F6",
  resolved: "#10B981",
};

const legendItems = computed(() => ({
  pending: {
    color: "#F59E0B",
    icon: "⏳",
    label:
      lang.value === "fr"
        ? "En attente"
        : lang.value === "en"
          ? "Pending"
          : "قيد الانتظار",
  },
  processing: {
    color: "#3B82F6",
    icon: "⚙️",
    label:
      lang.value === "fr"
        ? "En traitement"
        : lang.value === "en"
          ? "In Progress"
          : "قيد المعالجة",
  },
  resolved: {
    color: "#10B981",
    icon: "✅",
    label:
      lang.value === "fr"
        ? "Résolue"
        : lang.value === "en"
          ? "Resolved"
          : "محلولة",
  },
}));

let mapInstance = null;

async function initMap() {
  const L = (await import("leaflet")).default;

  mapInstance = L.map("mapAll").setView([36.2, 2.5], 6);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(mapInstance);

  // Marker cluster group (fallback to standard markers if plugin unavailable)
  const withLoc = reports.value.filter((r) => r.lat && r.lat !== 0);

  // Cluster-like: use simple markers with divIcon
  const detailTxt =
    lang.value === "fr"
      ? "Voir les détails"
      : lang.value === "en"
        ? "View details"
        : "عرض التفاصيل";
  const markers = [];

  withLoc.forEach((r) => {
    const col = STATUS_COLORS[r.status] || "#888";
    const icon = L.divIcon({
      html: `<div style="background:${col};width:38px;height:38px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 3px 10px rgba(0,0,0,.25)">${CATEGORIES[r.category]?.icon || "📋"}</div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      className: "",
    });
    const popup = `
      <div style="font-family:'Cairo','Outfit',sans-serif;min-width:190px;padding:4px 0;direction:${lang.value === "ar" ? "rtl" : "ltr"}">
        <div style="font-weight:700;font-size:14px;margin-bottom:5px">${r.title}</div>
        <div style="font-size:12px;color:#666;margin-bottom:8px">📍 ${r.wilaya} – ${r.commune}</div>
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">
          <span style="width:10px;height:10px;border-radius:50%;background:${col};display:inline-block"></span>
          <span style="font-size:12px;color:${col};font-weight:600">${r.status}</span>
        </div>
        <a href="/reports/${r.id}" style="display:inline-block;background:#1C6EF2;color:white;padding:5px 12px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none">${detailTxt} →</a>
      </div>`;
    const m = L.marker([r.lat, r.lng], { icon });
    m.bindPopup(popup);
    m.addTo(mapInstance);
    markers.push(m);
  });

  // Fit bounds if there are markers
  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    mapInstance.fitBounds(group.getBounds().pad(0.1));
  }
}

onMounted(async () => {
  try {
    const res = await getReports();
    reports.value = res.data;
  } catch {}
  await initMap();
});

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
});
</script>
