<template>
  <div>
    <div class="ph">
      <div>
        <h1>{{ t("pf_title") }}</h1>
        <p>{{ auth.user?.email }}</p>
      </div>
    </div>

    <div class="con" style="padding-top: 0; max-width: 700px">
      <!-- Profile card -->
      <div
        class="card fu"
        style="text-align: center; padding: 36px; margin-bottom: 22px"
      >
        <div
          class="avatar"
          style="
            width: 72px;
            height: 72px;
            font-size: 28px;
            margin: 0 auto 16px;
          "
        >
          {{ auth.user?.name?.[0] }}
        </div>
        <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 4px">
          {{ auth.user?.name }}
        </h2>
        <p style="color: var(--muted); font-size: 14px">
          {{ auth.user?.email }}
        </p>
        <p style="color: var(--muted); font-size: 13px; margin-top: 4px">
          {{ t("pf_since") }} {{ auth.user?.joined }}
        </p>

        <!-- Stats row -->
        <div
          v-if="stats"
          style="
            display: flex;
            gap: 16px;
            justify-content: center;
            margin-top: 24px;
            flex-wrap: wrap;
          "
        >
          <div style="text-align: center">
            <div style="font-size: 26px; font-weight: 900; color: var(--p)">
              {{ stats.total }}
            </div>
            <div style="font-size: 13px; color: var(--muted)">
              {{ t("pf_my_rep") }}
            </div>
          </div>
          <div style="width: 1px; background: var(--brd)" />
          <div style="text-align: center">
            <div style="font-size: 26px; font-weight: 900; color: #4caf50">
              {{ stats.resolved }}
            </div>
            <div style="font-size: 13px; color: var(--muted)">
              {{ t("pf_resolved") }}
            </div>
          </div>
          <div style="width: 1px; background: var(--brd)" />
          <div style="text-align: center">
            <div style="font-size: 26px; font-weight: 900; color: #ff9800">
              {{ stats.total - stats.resolved }}
            </div>
            <div style="font-size: 13px; color: var(--muted)">
              {{ t("stat_pending") }}
            </div>
          </div>
        </div>

        <!-- Resolution rate -->
        <div
          v-if="stats?.total"
          style="margin-top: 24px; max-width: 360px; margin-inline: auto"
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              font-weight: 600;
              margin-bottom: 6px;
            "
          >
            <span>{{ t("adm_rate") }}</span>
            <span style="color: var(--ok)"
              >{{ Math.round((stats.resolved / stats.total) * 100) }}%</span
            >
          </div>
          <div class="pw">
            <div
              class="pb"
              :style="`width:${Math.round((stats.resolved / stats.total) * 100)}%`"
            />
          </div>
        </div>

        <!-- Quick links -->
        <div
          style="
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 24px;
            flex-wrap: wrap;
          "
        >
          <RouterLink to="/my-reports" class="btn bp bsm"
            >📁 {{ t("mr_title") }}</RouterLink
          >
          <RouterLink to="/new-report" class="btn bsm"
            >➕ {{ t("mr_new") }}</RouterLink
          >
        </div>
      </div>

      <!-- Change password -->
      <div class="card fu">
        <h3 style="font-weight: 800; font-size: 17px; margin-bottom: 18px">
          {{ t("pf_chg_pass") }}
        </h3>
        <div v-if="passError" class="alert a-err">❌ {{ passError }}</div>
        <div v-if="passSuccess" class="alert a-ok">✅ {{ passSuccess }}</div>

        <div class="fg">
          <label>{{ t("pf_old_pass") }}</label>
          <div style="position: relative">
            <input
              v-model="passForm.old"
              :type="showOld ? 'text' : 'password'"
              class="fc"
              required
            />
            <button
              type="button"
              style="
                position: absolute;
                top: 50%;
                inset-inline-end: 12px;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                font-size: 16px;
                color: var(--muted);
              "
              @click="showOld = !showOld"
            >
              {{ showOld ? "🙈" : "👁️" }}
            </button>
          </div>
        </div>

        <div class="fr">
          <div class="fg">
            <label>{{ t("pf_new_pass") }}</label>
            <div style="position: relative">
              <input
                v-model="passForm.new"
                :type="showNew ? 'text' : 'password'"
                class="fc"
                required
              />
              <button
                type="button"
                style="
                  position: absolute;
                  top: 50%;
                  inset-inline-end: 12px;
                  transform: translateY(-50%);
                  background: none;
                  border: none;
                  cursor: pointer;
                  font-size: 16px;
                  color: var(--muted);
                "
                @click="showNew = !showNew"
              >
                {{ showNew ? "🙈" : "👁️" }}
              </button>
            </div>
          </div>
          <div class="fg">
            <label>{{ t("pf_new_pass2") }}</label>
            <input
              v-model="passForm.new2"
              type="password"
              class="fc"
              required
            />
          </div>
        </div>

        <button
          class="btn bp bsm"
          :disabled="passLoading"
          @click="changePassword"
        >
          <span v-if="passLoading">⏳...</span>
          <span v-else>{{ t("pf_save") }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/ToastStore";
import { useI18n } from "@/composables/useI18n";
import {
  getCurrentUser,
  changePassword as apiChangePassword,
} from "@/api/users";

const auth = useAuthStore();
console.log("auth ",auth)
const toast = useToastStore();
const { t } = useI18n();

const stats = ref(null);
const passError = ref("");
const passSuccess = ref("");
const passLoading = ref(false);
const showOld = ref(false);
const showNew = ref(false);
const passForm = ref({ old: "", new: "", new2: "" });

async function changePassword() {
  passError.value = "";
  passSuccess.value = "";
  if (!passForm.value.old || !passForm.value.new || !passForm.value.new2) {
    passError.value = t("err_fields");
    return;
  }
  if (passForm.value.new !== passForm.value.new2) {
    passError.value = t("err_mismatch");
    return;
  }
  if (passForm.value.new.length < 6) {
    passError.value = t("err_short");
    return;
  }
  passLoading.value = true;
  try {
    await apiChangePassword({
      old_password: passForm.value.old,
      new_password: passForm.value.new,
      new_password_confirm: passForm.value.new2,
    });
    passSuccess.value = t("ok_pass");
    passForm.value = { old: "", new: "", new2: "" };
    toast.show(t("ok_pass"));
  } catch (e) {
    passError.value = e.response?.data?.detail || t("err_fields");
  } finally {
    passLoading.value = false;
  }
}

onMounted(async () => {
  try {
    const res = await getCurrentUser();
    const u = res.data;
    // UserProfile renvoie reports_count, resolved_count directement (pas nested)
    stats.value = {
      total: u.reports_count ?? 0,
      resolved: u.resolved_count ?? 0,
    };
  } catch {}
});
</script>