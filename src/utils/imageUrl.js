import api from '@/composables/useApi'

// Origine du backend (ex: http://localhost:5000), déduite de la baseURL d'axios
function backendOrigin() {
  const base = api.defaults?.baseURL || import.meta.env.VITE_API_URL || ''
  try {
    return new URL(base, window.location.origin).origin
  } catch {
    return window.location.origin
  }
}

// Accepte une chaîne ou un objet { url | image_url | path | filename }
export function imageUrl(img) {
  if (!img) return ''
  const raw =
    typeof img === 'string'
      ? img
      : img.url || img.image_url || img.path || img.filename || ''
  if (!raw) return ''
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw
  return backendOrigin() + (raw.startsWith('/') ? raw : '/' + raw)
}