<template>
  <div v-if="message" class="alert" :class="typeClass">
    <span>{{ typeIcon }}</span>
    <span>{{ message }}</span>
    <button v-if="dismissible" @click="$emit('dismiss')"
      style="margin-inline-start:auto;background:none;border:none;cursor:pointer;font-size:16px;opacity:.6;padding:0">✕</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message:    { type: String, default: '' },
  type:       { type: String, default: 'error' },  // error | success | info
  dismissible:{ type: Boolean, default: false },
})
defineEmits(['dismiss'])

const typeClass = computed(() => ({ error: 'a-err', success: 'a-ok', info: 'a-info' }[props.type]))
const typeIcon  = computed(() => ({ error: '❌', success: '✅', info: 'ℹ️' }[props.type]))
</script>