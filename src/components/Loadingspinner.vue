<template>
  <div :class="fullPage ? 'empty' : ''">
    <div class="spinner" :style="sizeStyle" />
    <p v-if="message" style="color:var(--muted);font-size:14px;margin-top:12px">{{ message }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size:     { type: Number, default: 40 },
  message:  { type: String, default: '' },
  fullPage: { type: Boolean, default: false },
})

const sizeStyle = computed(() =>
  `width:${props.size}px;height:${props.size}px;border-width:${Math.max(2, props.size / 12)}px`
)
</script>