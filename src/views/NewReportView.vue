<!-- <template>
  <div>
    <div class="ph">
      <div>
        <h1>➕ {{ t('nr_title') }}</h1>
        <p>{{ t('nr_sub') }}</p>
      </div>
      <RouterLink to="/reports" class="btn bsm" style="background:rgba(255,255,255,.15);color:white;border-color:rgba(255,255,255,.3)">
        {{ t('nr_back') }}
      </RouterLink>
    </div>

    <div class="con" style="padding-top:0;max-width:780px">
      <div v-if="error"   class="alert a-err">❌ {{ error }}</div>

      <div class="card fu">

      
        <div class="fg">
          <label>{{ t('nr_f_title') }}</label>
          <input v-model="form.title" type="text" class="fc" :placeholder="t('nr_ph_title')" required />
        </div>

        <div class="fg">
          <label>{{ t('nr_f_cat') }}</label>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px">
            <button
              v-for="(cat, key) in CATEGORIES" :key="key"
              type="button"
              class="cat-chip"
              :style="form.category === key
                ? `background:${cat.color};color:white;border-color:${cat.color}`
                : `background:${cat.color}15;color:${cat.color};border-color:${cat.color}40`"
              style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;border:1.5px solid;transition:all .18s"
              @click="form.category = key"
            >
              {{ cat.icon }} {{ getCatLabel(cat) }}
            </button>
          </div>
        </div>

      
        <div class="fr">
          <div class="fg">
            <label>{{ t('nr_f_wilaya') }}</label>
            <select v-model="form.wilaya" class="fc" @change="form.commune = ''">
              <option value="">— {{ t('nr_f_wilaya') }} —</option>
              <option v-for="w in WILAYAT" :key="w.code" :value="w.name">
                {{ w.code }} — {{ w.name }}
              </option>
            </select>
          </div>
          <div class="fg">
            <label>{{ t('nr_f_commune') }}</label>
            <select v-model="form.commune" class="fc" :disabled="!form.wilaya">
              <option value="">— {{ t('nr_f_commune').replace(' *','') }} —</option>
              <option v-for="c in communes" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
        </div>

        <div class="fg">
          <label>{{ t('nr_f_desc') }}</label>
          <textarea v-model="form.description" class="fc" rows="4" :placeholder="t('nr_ph_desc')" />
        </div>

        <div class="fg">
          <label>
            {{ t('nr_f_map') }}
            <span style="font-size:12px;color:var(--muted);font-weight:400"> — {{ t('nr_optional') }}</span>
          </label>
          <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
            <button type="button" class="btn bsm" style="background:var(--pu);color:var(--p);border-color:rgba(28,110,242,.2);font-weight:600" @click="getGPS">
              📡 {{ gpsLabel }}
            </button>
            <span style="font-size:13px;color:var(--muted);align-self:center">{{ t('nr_map_hint') }}</span>
          </div>
          <div
            v-if="form.lat && form.lng"
            style="font-size:13px;color:var(--ok);margin-bottom:8px;background:#ECFDF5;padding:8px 12px;border-radius:8px;display:inline-flex;align-items:center;gap:6px"
          >
            ✅ {{ form.lat.toFixed(5) }}, {{ form.lng.toFixed(5) }}
          </div>
          <div v-else style="font-size:13px;color:var(--muted);margin-bottom:8px">{{ t('nr_map_none') }}</div>
          <div id="newReportMap" style="height:300px;border-radius:var(--r);border:1.5px solid var(--brd);overflow:hidden" />
        </div>

    
        <div class="fg">
          <label>
            {{ t('nr_f_img') }}
            <span style="font-size:12px;color:var(--muted);font-weight:400"> — {{ t('nr_img_hint') }}</span>
          </label>
          <div
            id="dz" class="upzone" :class="{ drag: isDragging }"
            @click="fileInput.click()"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="onDrop"
          >
            <div style="font-size:36px;margin-bottom:8px">🖼️</div>
            <div style="font-weight:700;color:var(--txt2);margin-bottom:4px">{{ t('nr_drop') }}</div>
            <div style="font-size:12px;color:var(--muted)">{{ t('nr_img_types') }}</div>
          </div>
          <input ref="fileInput" type="file" multiple accept="image/*" style="display:none" @change="onFileChange" />
      
          <div v-if="previews.length" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
            <div v-for="(pv, i) in previews" :key="i" class="pv-wrap">
              <img :src="pv" />
              <button class="pv-del" @click.stop="removeFile(i)">✕</button>
            </div>
          </div>
        </div>

        
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
          <button
            class="btn bp bbl"
            :disabled="submitting || !isValid"
            style="flex:1;min-width:200px"
            @click="submit"
          >
            <span v-if="submitting">⏳ ...</span>
            <span v-else>{{ t('nr_submit') }}</span>
          </button>
          <RouterLink to="/reports" class="btn bsm" style="align-self:center">{{ t('nr_cancel') }}</RouterLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/ToastStore'
import { useI18n } from '@/composables/useI18n'
import { createReport } from '@/api/reports'
import { CATEGORIES, WILAYAT } from '@/composables/useApi'

const router = useRouter()
const toast  = useToastStore()
const { lang, t } = useI18n()

const form = ref({
  title: '', category: 'road', wilaya: '', commune: '',
  description: '', lat: null, lng: null,
})
const error      = ref('')
const submitting = ref(false)
const isDragging = ref(false)
const gpsLabel   = ref('')
const fileInput  = ref(null)
const files      = ref([])
const previews   = ref([])
let mapInstance  = null
let marker       = null

const communes = computed(() => {
  if (!form.value.wilaya) return []
  return WILAYAT.find(w => w.name === form.value.wilaya)?.communes || []
})
const isValid = computed(() =>
  form.value.title && form.value.category && form.value.wilaya && form.value.commune && form.value.description
)

function getCatLabel(cat) {
  return lang.value === 'fr' ? cat.label_fr : lang.value === 'en' ? cat.label_en : cat.label_ar
}

async function initMap() {
  await nextTick()
  const L = (await import('leaflet')).default
  const el = document.getElementById('newReportMap')
  if (!el || el._leaflet_id) return
  mapInstance = L.map(el, { center: [36.2, 2.5], zoom: 5 })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(mapInstance)
  mapInstance.on('click', e => {
    form.value.lat = e.latlng.lat
    form.value.lng = e.latlng.lng
    placeMarker(L, e.latlng.lat, e.latlng.lng)
  })
}

function placeMarker(L, lat, lng) {
  if (marker) marker.remove()
  marker = L.marker([lat, lng], {
    icon: L.divIcon({
      html: '<div style="background:#EF4444;width:28px;height:28px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 3px 10px rgba(0,0,0,.3)">📍</div>',
      iconSize: [28, 28], iconAnchor: [14, 14], className: ''
    })
  }).addTo(mapInstance)
}

async function getGPS() {
  if (!navigator.geolocation) { gpsLabel.value = t('gps_no'); return }
  gpsLabel.value = t('gps_finding')
  navigator.geolocation.getCurrentPosition(
    async pos => {
      form.value.lat = pos.coords.latitude
      form.value.lng = pos.coords.longitude
      gpsLabel.value = t('gps_ok')
      if (mapInstance) {
        const L = (await import('leaflet')).default
        mapInstance.setView([pos.coords.latitude, pos.coords.longitude], 14)
        placeMarker(L, pos.coords.latitude, pos.coords.longitude)
      }
    },
    () => { gpsLabel.value = t('gps_err') }
  )
}

function addFiles(newFiles) {
  for (const f of newFiles) {
    if (files.value.length >= 6) break
    if (!f.type.startsWith('image/')) continue
    files.value.push(f)
    const reader = new FileReader()
    reader.onload = e => previews.value.push(e.target.result)
    reader.readAsDataURL(f)
  }
}
function onFileChange(e) { addFiles(e.target.files) }
function onDrop(e) { isDragging.value = false; addFiles(e.dataTransfer.files) }
function removeFile(i) { files.value.splice(i, 1); previews.value.splice(i, 1) }

async function submit() {
  error.value = ''
  if (!isValid.value) { error.value = t('err_fields'); return }
  submitting.value = true
  try {
    const fd = new FormData()
    fd.append('title',       form.value.title)
    fd.append('category',    form.value.category)
    fd.append('wilaya',      form.value.wilaya)
    fd.append('commune',     form.value.commune)
    fd.append('description', form.value.description)
    fd.append('lat',         form.value.lat || 0)
    fd.append('lng',         form.value.lng || 0)
    files.value.forEach(f => fd.append('images', f))
    await createReport(fd)
    toast.show(t('ok_sent'))
    router.push('/my-reports')
  } catch (e) {
    error.value = e.response?.data?.detail || t('err_fields')
  } finally { submitting.value = false }
}

onMounted(() => {
  gpsLabel.value = t('nr_gps')
  initMap()
})
</script> -->

<template>
  <div>
    <!-- PAGE HEADER -->
    <div class="ph">
      <div>
        <h1>➕ {{ t('nr_title') }}</h1>
        <p>{{ t('nr_sub') }}</p>
      </div>
      <RouterLink
        to="/reports"
        class="btn bsm"
        style="background:rgba(255,255,255,.15);color:white;border-color:rgba(255,255,255,.3)"
      >
        {{ t('nr_back') }}
      </RouterLink>
    </div>

    <div class="con" style="padding-top:0;max-width:780px">
      <div v-if="error" class="alert a-err">❌ {{ error }}</div>

      <div class="card fu">

        <!-- Title -->
        <div class="fg">
          <label>{{ t('nr_f_title') }}</label>
          <input v-model="form.title" type="text" class="fc" :placeholder="t('nr_ph_title')" required />
        </div>

        <!-- Category selector (chips) -->
        <div class="fg">
          <label>{{ t('nr_f_cat') }}</label>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px">
            <button
              v-for="(cat, key) in CATEGORIES" :key="key"
              type="button"
              class="cat-chip"
              :style="form.category === key
                ? `background:${cat.color};color:white;border-color:${cat.color}`
                : `background:${cat.color}15;color:${cat.color};border-color:${cat.color}40`"
              style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;border:1.5px solid;transition:all .18s"
              @click="form.category = key"
            >
              {{ cat.icon }} {{ getCatLabel(cat) }}
            </button>
          </div>
        </div>

        <!-- Wilaya + Commune -->
        <div class="fr">
          <div class="fg">
            <label>{{ t('nr_f_wilaya') }}</label>
            <select v-model="form.wilaya" class="fc" @change="form.commune = ''">
              <option value="">— {{ t('nr_f_wilaya') }} —</option>
              <option v-for="w in WILAYAT" :key="w.code" :value="w.name">
                {{ w.code }} — {{ w.name }}
              </option>
            </select>
          </div>
          <div class="fg">
            <label>{{ t('nr_f_commune') }}</label>
            <select v-model="form.commune" class="fc" :disabled="!form.wilaya">
              <option value="">— {{ t('nr_f_commune').replace(' *','') }} —</option>
              <option v-for="c in communes" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
        </div>

        <!-- Description -->
        <div class="fg">
          <label>{{ t('nr_f_desc') }}</label>
          <textarea v-model="form.description" class="fc" rows="4" :placeholder="t('nr_ph_desc')" />
        </div>

        <!-- Map location -->
        <div class="fg">
          <label>
            {{ t('nr_f_map') }}
            <span style="font-size:12px;color:var(--muted);font-weight:400"> — {{ t('nr_optional') }}</span>
          </label>
          <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
            <button type="button" class="btn bsm" style="background:var(--pu);color:var(--p);border-color:rgba(28,110,242,.2);font-weight:600" @click="getGPS">
              📡 {{ gpsLabel }}
            </button>
            <span style="font-size:13px;color:var(--muted);align-self:center">{{ t('nr_map_hint') }}</span>
          </div>
          <div
            v-if="form.lat && form.lng"
            style="font-size:13px;color:var(--ok);margin-bottom:8px;background:#ECFDF5;padding:8px 12px;border-radius:8px;display:inline-flex;align-items:center;gap:6px"
          >
            ✅ {{ form.lat.toFixed(5) }}, {{ form.lng.toFixed(5) }}
          </div>
          <div v-else style="font-size:13px;color:var(--muted);margin-bottom:8px">{{ t('nr_map_none') }}</div>
          <div id="newReportMap" style="height:300px;border-radius:var(--r);border:1.5px solid var(--brd);overflow:hidden" />
        </div>

        <!-- Images upload -->
        <div class="fg">
          <label>
            {{ t('nr_f_img') }}
            <span style="font-size:12px;color:var(--muted);font-weight:400"> — {{ t('nr_img_hint') }}</span>
          </label>
          <div
            id="dz" class="upzone" :class="{ drag: isDragging }"
            @click="fileInput.click()"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="onDrop"
          >
            <div style="font-size:36px;margin-bottom:8px">🖼️</div>
            <div style="font-weight:700;color:var(--txt2);margin-bottom:4px">{{ t('nr_drop') }}</div>
            <div style="font-size:12px;color:var(--muted)">{{ t('nr_img_types') }}</div>
          </div>
          <input ref="fileInput" type="file" multiple accept="image/*" style="display:none" @change="onFileChange" />
          <div v-if="previews.length" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
            <div v-for="(pv, i) in previews" :key="i" class="pv-wrap">
              <img :src="pv" />
              <button class="pv-del" @click.stop="removeFile(i)">✕</button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
          <button
            class="btn bp bbl"
            :disabled="submitting || !isValid"
            style="flex:1;min-width:200px"
            @click="submit"
          >
            <span v-if="submitting">⏳ ...</span>
            <span v-else>{{ t('nr_submit') }}</span>
          </button>
          <RouterLink to="/reports" class="btn bsm" style="align-self:center">{{ t('nr_cancel') }}</RouterLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/ToastStore'
import { useI18n } from '@/composables/useI18n'
import { useDataStore } from '@/stores/DataStore'
import { CATEGORIES, WILAYAT } from '@/composables/useApi'
import api from '@/http'
import API_ENDPOINTS from '@/config/endpoints'

const router    = useRouter()
const toast     = useToastStore()
const dataStore = useDataStore()
const { lang, t } = useI18n()

const form = ref({
  title: '', category: 'road', wilaya: '', commune: '',
  description: '', lat: null, lng: null,
})
const error      = ref('')
const submitting = ref(false)
const isDragging = ref(false)
const gpsLabel   = ref('')
const fileInput  = ref(null)
const files      = ref([])
const previews   = ref([])
let mapInstance  = null
let marker       = null

const communes = computed(() => {
  if (!form.value.wilaya) return []
  return WILAYAT.find(w => w.name === form.value.wilaya)?.communes || []
})

const isValid = computed(() =>
  form.value.title && form.value.category &&
  form.value.wilaya && form.value.commune &&
  form.value.description
)

function getCatLabel(cat) {
  return lang.value === 'fr' ? cat.label_fr
       : lang.value === 'en' ? cat.label_en
       : cat.label_ar
}

async function initMap() {
  await nextTick()
  const L = (await import('leaflet')).default
  const el = document.getElementById('newReportMap')
  if (!el || el._leaflet_id) return
  mapInstance = L.map(el, { center: [36.2, 2.5], zoom: 5 })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(mapInstance)
  mapInstance.on('click', e => {
    form.value.lat = e.latlng.lat
    form.value.lng = e.latlng.lng
    placeMarker(L, e.latlng.lat, e.latlng.lng)
  })
}

function placeMarker(L, lat, lng) {
  if (marker) marker.remove()
  marker = L.marker([lat, lng], {
    icon: L.divIcon({
      html: '<div style="background:#EF4444;width:28px;height:28px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 3px 10px rgba(0,0,0,.3)">📍</div>',
      iconSize: [28, 28], iconAnchor: [14, 14], className: ''
    })
  }).addTo(mapInstance)
}

async function getGPS() {
  if (!navigator.geolocation) { gpsLabel.value = t('gps_no'); return }
  gpsLabel.value = t('gps_finding')
  navigator.geolocation.getCurrentPosition(
    async pos => {
      form.value.lat = pos.coords.latitude
      form.value.lng = pos.coords.longitude
      gpsLabel.value = t('gps_ok')
      if (mapInstance) {
        const L = (await import('leaflet')).default
        mapInstance.setView([pos.coords.latitude, pos.coords.longitude], 14)
        placeMarker(L, pos.coords.latitude, pos.coords.longitude)
      }
    },
    () => { gpsLabel.value = t('gps_err') }
  )
}

function addFiles(newFiles) {
  for (const f of newFiles) {
    if (files.value.length >= 6) break
    if (!f.type.startsWith('image/')) continue
    files.value.push(f)
    const reader = new FileReader()
    reader.onload = e => previews.value.push(e.target.result)
    reader.readAsDataURL(f)
  }
}
function onFileChange(e) { addFiles(e.target.files) }
function onDrop(e)       { isDragging.value = false; addFiles(e.dataTransfer.files) }
function removeFile(i)   { files.value.splice(i, 1); previews.value.splice(i, 1) }

async function submit() {
  error.value = ''
  if (!isValid.value) { error.value = t('err_fields'); return }
  submitting.value = true
  try {
    const fd = new FormData()
    fd.append('title',       form.value.title)
    fd.append('category',    form.value.category)
    fd.append('wilaya',      form.value.wilaya)
    fd.append('commune',     form.value.commune)
    fd.append('description', form.value.description)
    fd.append('lat',         form.value.lat ?? 0)
    fd.append('lng',         form.value.lng ?? 0)
    files.value.forEach(f => fd.append('images', f))

    await api.post(API_ENDPOINTS.reports, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    // Rafraîchit le store
    await dataStore.fetchReports({ page: 1, per_page: 6 })
    await dataStore.fetchStats()

    toast.ToastSuccess("Rapport soumis avec succès", 2000);
    router.push('/my-reports')
  } catch (e) {
    error.value = e.response?.data?.detail || t('err_fields')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  gpsLabel.value = t('nr_gps')
  initMap()
})
</script>