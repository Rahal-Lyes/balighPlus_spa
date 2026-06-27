// stores/toast.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const visible = ref(false)
  const message = ref('')
  const icon    = ref('✅')
  let timer = null

  function show(msg, icon) {
    message.value = msg
    icon.value    = icon
    visible.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { visible.value = false }, 3200)
  }

  return { visible, message, icon, show }
})