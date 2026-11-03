<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-end gap-3">
      <div class="flex gap-1">
        <button v-for="p in PRESETS" :key="p.dias" @click="aplicarPreset(p.dias)"
          class="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
          :class="preset === p.dias ? 'bg-[#DE1F27] text-white' : 'bg-white dark:bg-white/5 text-slate-500 dark:text-white/50 border border-slate-100 dark:border-white/10'">
          {{ p.label }}
        </button>
      </div>
      <div class="flex items-center gap-2">
        <input type="date" v-model="desde" @change="preset = null; cargar()" :class="inputClass" />
        <span class="text-slate-400 text-xs">a</span>
        <input type="date" v-model="hasta" @change="preset = null; cargar()" :class="inputClass" />
      </div>
    </div>

    <!-- Punto de referencia del Pet -->
    <div class="bg-white dark:bg-white/5 rounded-2xl border p-5 space-y-3"
      :class="pet?.configurada ? 'border-slate-100 dark:border-white/10' : 'border-amber-300 dark:border-amber-500/40'">
      <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">📍 Ubicación del Pet</p>
      <p v-if="!pet?.configurada" class="text-[13px] font-bold text-amber-700 dark:text-amber-300">
        Falta guardarla. Hazlo una vez estando dentro del Pet: sin ella no se puede saber a qué distancia marcaron.
      </p>
      <p v-else class="text-[12px] text-slate-500 dark:text-white/60">
        Guardada. Cuenta como "en el Pet" hasta <b>{{ pet.radio }} m</b> del punto.
        <a :href="mapa(pet)" target="_blank" class="underline">Ver en el mapa</a>
      </p>
      <div class="flex flex-wrap items-center gap-3">
        <button @click="guardarPet" :disabled="!!fijando"
          class="bg-[#152C77] hover:bg-[#DE1F27] text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50">
          {{ fijando ? `Afinando… ${fijando.precision ?? '—'} m (${fijando.lecturas} lecturas)` : (pet?.configurada ? 'Volver a tomarla aquí' : 'Estoy en el Pet: guardar ubicación') }}
        </button>
        <label v-if="pet?.configurada" class="flex items-center gap-2 text-[11px] text-slate-500 dark:text-white/50">
          Radio
          <input type="number" min="20" max="500" step="10" v-model.number="radio" @change="guardarRadio" :class="inputClass" class="!w-20" /> m
        </label>
      </div>
      <p v-if="mensaje" class="text-[11px] font-bold text-slate-500 dark:text-white/60">{{ mensaje }}</p>
    </div>

    <div v-if="cargando" class="py-16 text-center">
      <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
    <p v-else-if="error" class="py-10 text-center text-red-500 text-[12px] font-bold">{{ error }}</p>
    <p v-else-if="!marcas.length" class="py-16 text-center text-slate-400 dark:text-white/30 text-[11px] uppercase tracking-widest">
      Todavía no hay marcas con ubicación en este periodo
    </p>

    <template v-else>
      <!-- Lo que hay que mirar -->
      <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-2">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">
          🚩 Para revisar · {{ alertas.length }} de {{ marcas.length }} marcas
        </p>
        <p v-if="!pet?.configurada" class="text-[13px] font-bold text-amber-700 dark:text-amber-300">Guarda la ubicación del Pet para saber a qué distancia marcaron. Las marcas que ya hay se calculan solas apenas la guardes.</p>
        <p v-else-if="!alertas.length" class="text-[13px] font-bold text-green-600 dark:text-green-400">Todas las marcas fueron desde el Pet 👍</p>
        <div v-for="(m, i) in alertas" :key="i" class="flex flex-wrap items-baseline gap-x-2 text-[12px]">
          <b class="dark:text-white">{{ nombre(m) }}</b>
          <span class="text-slate-500 dark:text-white/50">{{ TIPO[m.tipo] }} · {{ fechaHora(m.momento) }}</span>
          <span :class="clase(m)" class="font-bold">{{ texto(m) }}</span>
          <a v-if="m.lat != null" :href="mapa(m)" target="_blank" class="text-[11px] underline text-slate-400">mapa</a>
        </div>
        <p class="text-[10px] text-slate-400 dark:text-white/30 pt-1">
          Jean puede marcar desde una ruta de trabajo. "Imprecisa" significa que el celular no logró ubicarse bien: no es prueba de nada, mira si se repite.
        </p>
      </div>

      <!-- Mapa de marcas -->
      <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 p-5 pb-3">🗺️ Mapa de marcas</p>
        <div ref="mapaEl" style="height:340px" class="w-full z-0"></div>
      </div>

      <!-- Todas las marcas, por persona -->
      <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-x-auto">
        <table class="w-full text-[12px] min-w-[620px]">
          <thead>
            <tr class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 text-left">
              <th class="p-3">Persona · día</th><th class="p-3">Entrada</th><th class="p-3">Regreso del almuerzo</th><th class="p-3">Salida</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in filas" :key="f.key" class="border-t border-slate-100 dark:border-white/5 align-top">
              <td class="p-3"><b class="dark:text-white">{{ f.nombre }}</b><br><span class="text-slate-400">{{ f.dia }}</span></td>
              <td v-for="t in ['ENTRADA', 'REGRESO_ALMUERZO', 'SALIDA']" :key="t" class="p-3">
                <template v-for="(m, i) in f[t]" :key="i">
                  <span class="tabular-nums text-slate-500 dark:text-white/50">{{ hora(m.momento) }}</span>
                  <span :class="clase(m)" class="block font-bold">{{ texto(m) }}</span>
                </template>
                <span v-if="!f[t].length" class="text-slate-300 dark:text-white/20">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import api from '@/api/axios'
import { obtenerUbicacion } from '@/composables/useUbicacion'

const PRESETS = [{ dias: 1, label: 'Hoy' }, { dias: 7, label: '7 días' }, { dias: 30, label: '30 días' }]
const TIPO = { ENTRADA: 'Entrada', REGRESO_ALMUERZO: 'Regreso del almuerzo', SALIDA: 'Salida' }
const SIN = {
  DENEGADO: '🚫 No dio permiso de ubicación',
  NO_DISPONIBLE: '📵 El celular no logró ubicarse',
  TIEMPO: '📵 El celular no logró ubicarse',
  NO_SOPORTADO: '📵 Su celular no da ubicación',
  SIN_DATO: '❔ Sin ubicación',
  AUTOMATICO: '⏰ No marcó el regreso: el almuerzo se cerró solo',
}
const inputClass = 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#152C77]'

// ── Mapa ────────────────────────────────────────────────────────────────────
const mapaEl = ref(null)
let leafletMap = null
let L = null

const COLORES = {
  EN_PET: '#16a34a',
  FUERA: '#DE1F27',
  SIN_REFERENCIA: '#64748b',
  SIN_UBICACION: '#64748b',
  IMPRECISA: '#d97706',
}

const iconoColor = (color) => {
  if (!L) return null
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

async function iniciarMapa() {
  if (!mapaEl.value) return
  if (!L) {
    // Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
      document.head.appendChild(link)
    }
    // Leaflet JS
    await new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
      s.onload = resolve
      s.onerror = reject
      document.head.appendChild(s)
    })
    L = window.L
  }
  if (leafletMap) { leafletMap.remove(); leafletMap = null }
  leafletMap = L.map(mapaEl.value, { zoomControl: true, scrollWheelZoom: false })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19,
  }).addTo(leafletMap)
  renderizarPines()
}

function renderizarPines() {
  if (!leafletMap || !L) return
  // Limpiar capas anteriores
  leafletMap.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Circle) leafletMap.removeLayer(l) })

  const puntos = []

  // Pin del Pet Station
  if (pet.value?.lat && pet.value?.lon) {
    const petLatLon = [pet.value.lat, pet.value.lon]
    puntos.push(petLatLon)
    L.circle(petLatLon, {
      radius: pet.value.radio || 60,
      color: '#152C77', fillColor: '#152C77', fillOpacity: 0.1, weight: 2,
    }).addTo(leafletMap).bindPopup('<b>Pet Station</b><br>Radio de referencia')
    L.marker(petLatLon, {
      icon: L.divIcon({
        className: '',
        html: `<div style="background:#152C77;color:white;font-size:16px;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4)">🏠</div>`,
        iconSize: [28, 28], iconAnchor: [14, 14],
      })
    }).addTo(leafletMap).bindPopup('<b>Pet Station</b>')
  }

  // Pines de cada marca con ubicación
  const conUbicacion = marcas.value.filter(m => m.lat != null && m.lon != null)
  for (const m of conUbicacion) {
    const color = COLORES[m.estado] || COLORES.IMPRECISA
    const ll = [m.lat, m.lon]
    puntos.push(ll)
    L.marker(ll, { icon: iconoColor(color) })
      .addTo(leafletMap)
      .bindPopup(`<b>${nombre(m)}</b><br>${TIPO[m.tipo]} · ${hora(m.momento)}<br>${texto(m)}`)
  }

  if (puntos.length) {
    leafletMap.fitBounds(L.latLngBounds(puntos), { padding: [30, 30], maxZoom: 17 })
  } else {
    // Sin puntos: centrar en Chía
    leafletMap.setView([4.8625, -74.0397], 13)
  }
}

watch(marcas, async () => {
  await nextTick()
  if (leafletMap) renderizarPines()
  else iniciarMapa()
})
// ── fin Mapa ─────────────────────────────────────────────────────────────────

const preset = ref(7)
const desde = ref('')
const hasta = ref('')
const marcas = ref([])
const nombres = ref({})
const pet = ref(null)
const radio = ref(60)
const cargando = ref(false)
const error = ref('')
const mensaje = ref('')
const fijando = ref(null)

function fechaLocal(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function aplicarPreset(n) {
  preset.value = n
  const fin = new Date(), ini = new Date()
  ini.setDate(fin.getDate() - (n - 1))
  desde.value = fechaLocal(ini)
  hasta.value = fechaLocal(fin)
  cargar()
}

async function cargar() {
  if (!desde.value || !hasta.value) return
  cargando.value = true
  error.value = ''
  try {
    const { data } = await api.get('/admin/jornada/marcas', { params: { desde: desde.value, hasta: hasta.value } })
    marcas.value = data.marcas || []
    nombres.value = data.nombres || {}
    pet.value = data.pet || null
    radio.value = data.pet?.radio || 60
  } catch (e) {
    error.value = e.response?.data?.message || 'No se pudieron cargar las marcas'
  } finally {
    cargando.value = false
  }
}

// Para el punto del Pet se espera más y se piden más lecturas: de él dependen todas las distancias
async function guardarPet() {
  mensaje.value = ''
  fijando.value = { precision: null, lecturas: 0 }
  const u = await obtenerUbicacion({ objetivo: 8, minLecturas: 6, maxSeg: 40, onProgreso: p => { fijando.value = p } })
  fijando.value = null
  if (u.error) {
    mensaje.value = u.error === 'DENEGADO' ? 'El navegador no dio permiso de ubicación.' : 'No se logró tomar la ubicación. Intenta junto a una ventana o con el WiFi encendido.'
    return
  }
  if (u.precision > 50 && !confirm(`La precisión es de ${u.precision} m, no muy buena. ¿Guardarla igual? (Puedes volver a intentarlo cerca de una ventana)`)) return
  try {
    await api.put('/admin/jornada/ubicacion-pet', { lat: u.lat, lon: u.lon, precision: u.precision })
    mensaje.value = `Guardada con una precisión de ${u.precision} m.`
    cargar()
  } catch (e) {
    mensaje.value = e.response?.data?.message || 'No se pudo guardar'
  }
}

async function guardarRadio() {
  try {
    await api.put('/admin/jornada/ubicacion-pet', { radio: radio.value })
    cargar()
  } catch (e) {
    mensaje.value = e.response?.data?.message || 'No se pudo guardar el radio'
  }
}

const nombre = m => nombres.value[m.tutorId] || 'Sin nombre'
const alertas = computed(() => marcas.value.filter(m => m.estado !== 'EN_PET' && m.estado !== 'SIN_REFERENCIA'))

const filas = computed(() => {
  const out = {}
  for (const m of marcas.value) {
    const key = `${m.tutorId}-${m.sesionId}`
    out[key] ||= { key, nombre: nombre(m), dia: fecha(m.momento), orden: m.momento, ENTRADA: [], REGRESO_ALMUERZO: [], SALIDA: [] }
    out[key][m.tipo]?.push(m)
  }
  return Object.values(out).sort((a, b) => (b.orden > a.orden ? 1 : -1))
})

function distancia(m) {
  return m.distancia >= 1000 ? `${(m.distancia / 1000).toFixed(1).replace('.', ',')} km` : `${m.distancia} m`
}
function texto(m) {
  if (m.estado === 'SIN_UBICACION') return SIN[m.error] || SIN.SIN_DATO
  if (m.estado === 'SIN_REFERENCIA') return `📍 ±${m.precision} m (falta la ubicación del Pet)`
  if (m.estado === 'EN_PET') return `✅ En el Pet (±${m.precision} m)`
  if (m.estado === 'FUERA') return `🚩 A ${distancia(m)} del Pet`
  return `⚠️ Imprecisa: a ~${distancia(m)}, ±${m.precision ?? '?'} m`
}
function clase(m) {
  if (m.estado === 'EN_PET') return 'text-green-600 dark:text-green-400'
  if (m.estado === 'FUERA') return 'text-[#DE1F27]'
  if (m.estado === 'SIN_REFERENCIA') return 'text-slate-500 dark:text-white/50'
  return 'text-amber-600 dark:text-amber-300'
}
const mapa = m => `https://www.google.com/maps?q=${m.lat},${m.lon}`
const fecha = iso => new Date(iso).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })
const hora = iso => new Date(iso).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })
const fechaHora = iso => `${fecha(iso)} ${hora(iso)}`

onMounted(() => aplicarPreset(7))
</script>
