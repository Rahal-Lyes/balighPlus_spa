<template>
  <div class="empty">
    <div style="font-size:60px;margin-bottom:14px;opacity:.5">{{ icon }}</div>
    <p style="font-size:16px;color:var(--muted);margin-bottom:20px">{{ message }}</p>
  
    <slot />
  </div>
</template>

<script setup>
defineProps({
  icon:    { type: String, default: '📭' },
  message: { type: String, required: true },
})
</script>