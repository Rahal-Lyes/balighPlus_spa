import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  // ── STATE ──────────────────────────────────────────────────────────────
  state: () => ({
    message: '',
    color: 'success',   // 'success' | 'error' | 'warning' | 'info'
    timer: 4000,        // ms — 0 = persistant jusqu'au clic
    show: false,
  }),

  // ── GETTERS ────────────────────────────────────────────────────────────
  getters: {},

  // ── ACTIONS ────────────────────────────────────────────────────────────
  actions: {
    /**
     * Action principale — toutes les autres y convergent.
     * @param {{ message: string, color?: string, timer?: number }} data
     */
    Toast(data) {
      if (!data?.message) return

      // Si un toast est déjà visible, on le cache brièvement
      // pour que le composant puisse relancer l'animation GSAP
      if (this.show) {
        this.show = false
        setTimeout(() => this._show(data), 60)
      } else {
        this._show(data)
      }
    },

    _show(data) {
      this.message = data.message
      this.color   = data.color  ?? 'info'
      this.timer   = data.timer  ?? 4000
      this.show    = true
    },

    /** Toast de succès */
    ToastSuccess(message, timer = 4000) {
      this.Toast({ message, color: 'success', timer })
    },

    /** Toast d'erreur — durée plus longue par défaut */
    ToastError(message, timer = 6000) {
      this.Toast({ message, color: 'error', timer })
    },

    /** Toast d'avertissement */
    ToastWarning(message, timer = 5000) {
      this.Toast({ message, color: 'warning', timer })
    },

    /** Toast d'information */
    ToastInfo(message, timer = 4000) {
      this.Toast({ message, color: 'info', timer })
    },
  },
})