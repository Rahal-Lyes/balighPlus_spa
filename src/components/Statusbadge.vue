<template>
  <span class="badge" :style="`background:${st?.bg};color:${st?.color};${sizeStyle}`">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { STATUSES } from '@/composables/useApi'

const props = defineProps({
  status: { type: String, required: true },
  size:   { type: String, default: 'md' },   // sm | md | lg
})
const { lang } = useI18n()

const st    = computed(() => STATUSES[props.status])
const label = computed(() => {
  const s = st.value; if (!s) return props.status
  return lang.value === 'fr' ? s.label_fr : lang.value === 'en' ? s.label_en : s.label_ar
})
const sizeStyle = computed(() => ({
  sm: 'font-size:11px;padding:2px 8px',
  md: 'font-size:12px;padding:4px 12px',
  lg: 'font-size:14px;padding:6px 16px',
}[props.size]))
</script>