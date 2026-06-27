<template>
  <div class="login-wrap">
    <div class="login-box" style="max-width: 480px">
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 24px">
        <div class="login-logo" style="margin-bottom: 14px">🏘️</div>
        <h2 style="font-size: 22px; font-weight: 800">{{ t("lg_title") }}</h2>
        <p class="sub" style="color: var(--muted); font-size: 14px; margin-top: 4px">
          {{ t("lg_sub") }}
        </p>
      </div>

      <!-- Tabs -->
      <div class="login-tabs">
        <button class="login-tab" :class="{ on: activeTab === 'citizen' }" @click="activeTab = 'citizen'">
          👤 {{ lang === "fr" ? "Citoyen" : lang === "en" ? "Citizen" : "مواطن" }}
        </button>
        <button class="login-tab" :class="{ on: activeTab === 'admin' }" @click="activeTab = 'admin'">
          🛡️ {{ lang === "fr" ? "Admin" : lang === "en" ? "Admin" : "مسؤول" }}
        </button>
      </div>

      <!-- ── Citizen tab ── -->
      <div v-show="activeTab === 'citizen'">
        <div class="fg">
          <label>{{ t("lg_email") }}</label>
          <input v-model="email" type="email" class="fc" placeholder="example@email.com" style="direction: ltr" />
        </div>
        <div class="fg">
          <label>{{ t("lg_pass") }}</label>
          <div style="position: relative">
            <input
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              class="fc"
              placeholder="••••••••"
              @keyup.enter="doLogin"
            />
            <button type="button" class="eye-btn" @click="showPass = !showPass">
              {{ showPass ? "🙈" : "👁️" }}
            </button>
          </div>
        </div>

        <button class="btn bp bbl" :disabled="loading" @click="doLogin">
          <span v-if="loading">⏳...</span>
          <span v-else>{{ t("lg_btn") }}</span>
        </button>

        <div class="demo-box">
          🧪 Demo : <strong>ahmed@example.com</strong> / <strong>citizen1</strong><br />
          ou <strong>fatima@example.com</strong> / <strong>citizen2</strong>
        </div>

        <p style="text-align: center; margin-top: 18px; font-size: 14px; color: var(--muted)">
          {{ t("lg_no_acc") }}
          <RouterLink to="/register" style="color: var(--p); font-weight: 700">{{ t("lg_reg_now") }}</RouterLink>
        </p>
      </div>

      <!-- ── Admin tab ── -->
      <div v-show="activeTab === 'admin'">
        <div class="admin-banner">
          <div class="admin-banner-icon">🛡️</div>
          <div>
            <div style="color: white; font-weight: 700; font-size: 14px">{{ t("adm_login_t") }}</div>
            <div style="color: rgba(255,255,255,0.6); font-size: 12px">{{ t("adm_login_s") }}</div>
          </div>
        </div>

        <div class="fg">
          <label>{{ t("lg_pass") }}</label>
          <div style="position: relative">
            <input
              v-model="adminPass"
              :type="showAdmin ? 'text' : 'password'"
              class="fc"
              placeholder="••••••••"
              style="text-align: center; letter-spacing: 6px; font-size: 20px"
              @keyup.enter="doAdminLogin"
            />
            <button type="button" class="eye-btn" @click="showAdmin = !showAdmin">
              {{ showAdmin ? "🙈" : "👁️" }}
            </button>
          </div>
        </div>

        <button
          class="btn bbl"
          style="background: linear-gradient(135deg, #0d1b3e, #1e3a5f); color: white; box-shadow: 0 4px 14px rgba(13,27,62,0.4)"
          :disabled="loading"
          @click="doAdminLogin"
        >
          <span v-if="loading">⏳...</span>
          <span v-else>{{ t("adm_login_btn") }}</span>
        </button>

        <div class="demo-box">
          🔑 Demo admin password: <strong>admin123</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "@/composables/useI18n";

const router   = useRouter();
const auth     = useAuthStore();
const { lang, t } = useI18n();

const activeTab = ref("citizen");
const email     = ref("");
const password  = ref("");
const adminPass = ref("");
const loading   = ref(false);
const showPass  = ref(false);
const showAdmin = ref(false);

// ── Citizen login ─────────────────────────────────────────────────
async function doLogin() {
  if (!email.value || !password.value) return;
  loading.value = true;
  try {
    await auth.login({ email: email.value, password: password.value });
    router.push({ name: "home" });
  } finally {
    loading.value = false;
  }
}

// ── Admin login ───────────────────────────────────────────────────
async function doAdminLogin() {
  if (!adminPass.value) return;
  loading.value = true;
  try {
    await auth.adminLogin(adminPass.value);
    // la redirection /admin est gérée dans le store
  } catch {
    // le toast d'erreur est géré dans le store
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-tabs {
  display: flex;
  gap: 4px;
  background: var(--w2);
  border-radius: var(--r-sm);
  padding: 4px;
  margin-bottom: 22px;
  border: 1px solid var(--brd);
}
.login-tab {
  flex: 1;
  padding: 10px 16px;
  border-radius: calc(var(--r-sm) - 2px);
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  font-family: inherit;
  color: var(--txt2);
  transition: all 0.22s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.login-tab:hover { background: rgba(28,110,242,0.08); color: var(--p); }
.login-tab.on    { background: white; color: var(--p); box-shadow: var(--sh1); }

.admin-banner {
  background: linear-gradient(135deg, #0d1b3e, #1e3a5f);
  border-radius: var(--r);
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.admin-banner-icon {
  width: 42px;
  height: 42px;
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.eye-btn {
  position: absolute;
  top: 50%;
  inset-inline-end: 12px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: var(--muted);
}
</style>