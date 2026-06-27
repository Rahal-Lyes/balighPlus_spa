<template>
  <div class="stat-card fu" :style="accentStyle">
    <div class="si" :style="`background:${bgColor};font-size:${iconSize}`">{{ icon }}</div>
    <div>
      <div class="sv" :style="`color:${color}`">{{ value }}</div>
      <div class="sl">{{ label }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon:     { type: String, required: true },
  value:    { type: [Number, String], required: true },
  label:    { type: String, required: true },
  color:    { type: String, default: 'var(--p)' },
  bgColor:  { type: String, default: 'var(--pu)' },
  accent:   { type: Boolean, default: false },
  iconSize: { type: String, default: '24px' },
})

const accentStyle = computed(() =>
  props.accent ? `border-inline-start:3px solid ${props.color}` : ''
)
</script>