<template>
  <div class="login-wrap">
    <div class="login-box">
      <div class="login-logo">📝</div>
      <h2 style="font-size:22px;font-weight:800;text-align:center;margin-bottom:4px">{{ t('rg_title') }}</h2>
      <p style="text-align:center;color:var(--muted);font-size:14px;margin-bottom:24px">{{ t('rg_sub') }}</p>

      <div v-if="error" class="alert a-err">❌ {{ error }}</div>

      <div class="fg">
        <label>{{ t('rg_name') }}</label>
        <input v-model="form.name" type="text" class="fc"
          :placeholder="lang === 'fr' ? 'Ahmed Ben Ali' : 'أحمد بن علي'" required />
      </div>

      <div class="fg">
        <label>{{ t('rg_email') }}</label>
        <input v-model="form.email" type="email" class="fc" placeholder="example@email.com" style="direction:ltr" required />
      </div>

      <div class="fr">
        <div class="fg">
          <label>{{ t('rg_pass') }}</label>
          <div style="position:relative">
            <input
              v-model="form.password"
              :type="showPass ? 'text' : 'password'"
              class="fc"
              :placeholder="t('rg_pass_hint')"
              required
            />
            <button type="button"
              style="position:absolute;top:50%;inset-inline-end:12px;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:14px;color:var(--muted)"
              @click="showPass = !showPass">{{ showPass ? '🙈' : '👁️' }}</button>
          </div>
        </div>
        <div class="fg">
          <label>{{ t('rg_pass2') }}</label>
          <input v-model="form.password_confirm" type="password" class="fc" :placeholder="lang === 'ar' ? 'أعد الكتابة' : 'Confirmer'" required />
        </div>
      </div>

      <button class="btn bp bbl" style="margin-top:4px" :disabled="loading" @click="doRegister">
        <span v-if="loading">⏳...</span>
        <span v-else>{{ t('rg_btn') }}</span>
      </button>

      <p style="text-align:center;margin-top:20px;font-size:14px;color:var(--muted)">
        {{ t('rg_have_acc') }}
        <RouterLink to="/login" style="color:var(--p);font-weight:700">{{ t('rg_login') }}</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'

const router = useRouter()
const auth   = useAuthStore()
const { lang, t } = useI18n()

const form     = ref({ name: '', email: '', password: '', password_confirm: '' })
const error    = ref('')
const loading  = ref(false)
const showPass = ref(false)

async function doRegister() {
  error.value = ''  
  console.log(form.value,"form.value")
  const { name, email, password, password_confirm } = form.value
  if (!name || !email || !password || !password_confirm) { error.value = t('err_fields'); return }
  if (password !== password_confirm) { error.value = t('err_mismatch'); return }
  if (password.length < 6) { error.value = t('err_short'); return }
  loading.value = true
  try {
    // await auth.register(name, email, password, password_confirm)
    await auth.register({
  name,
  email,
  password,
  password_confirm
})
    router.push('/?welcome=1')
  } catch (e) {
    error.value = e.response?.data?.detail || t('err_fields')
  } finally { loading.value = false }
}

</script>