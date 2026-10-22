<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-end gap-3">
      <div class="flex gap-1">
        <button @click="moverDia(-1)" class="px-3 py-2 rounded-xl text-[12px] font-black bg-white dark:bg-white/5 text-slate-500 dark:text-white/50 border border-slate-100 dark:border-white/10">‹</button>
        <input type="date" v-model="fecha" @change="cargar" :class="inputClass" />
        <button @click="moverDia(1)" class="px-3 py-2 rounded-xl text-[12px] font-black bg-white dark:bg-white/5 text-slate-500 dark:text-white/50 border border-slate-100 dark:border-white/10">›</button>
      </div>
      <select v-if="cargos.length > 1" v-model="filtroCargo" :class="inputClass" class="!w-auto">
        <option value="">Todo el equipo</option>
        <option v-for="c in cargos" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div v-if="cargando" class="py-16 text-center">
      <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
    <p v-else-if="!visibles.length" class="py-16 text-center text-slate-400 dark:text-white/30 text-[11px] uppercase tracking-widest">Nadie registró jornada este día</p>

    <template v-else>
      <!-- Línea de tiempo de todos -->
      <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-4 overflow-x-auto">
        <div class="min-w-[720px]">
          <div class="flex">
            <div class="w-32 shrink-0"></div>
            <div class="relative flex-1 h-5">
              <span v-for="h in horasEje" :key="h" class="absolute -translate-x-1/2 text-[9px] font-black text-slate-400 dark:text-white/30 tabular-nums" :style="{ left: pos(h * 60) + '%' }">
                {{ etiquetaHora(h) }}
              </span>
            </div>
          </div>

          <div v-for="p in visibles" :key="p.tutorId" class="flex items-center py-1.5">
            <div class="w-32 shrink-0 pr-2 min-w-0">
              <p class="font-[1000] uppercase italic text-[11px] dark:text-white truncate">{{ p.nombre }}</p>
              <p class="text-[8px] text-slate-400 dark:text-white/30 uppercase tracking-widest truncate">{{ p.cargo }}</p>
            </div>
            <div class="relative flex-1 h-9 rounded-lg bg-slate-50 dark:bg-white/5">
              <div v-for="h in horasEje" :key="h" class="absolute top-0 bottom-0 border-l border-slate-200/70 dark:border-white/5" :style="{ left: pos(h * 60) + '%' }"></div>
              <button v-for="(it, i) in p.items" :key="i" @click="seleccion = { persona: p, it }"
                class="absolute top-1 bottom-1 rounded-md overflow-hidden text-left px-1 transition-opacity hover:opacity-80"
                :class="[claseBloque(it), it.fueraDeArea ? 'ring-2 ring-offset-1 ring-[#DE1F27] dark:ring-offset-slate-900' : '', seleccion?.it === it ? 'outline outline-2 outline-black dark:outline-white' : '']"
                :style="{ left: pos(it.ini) + '%', width: Math.max(0.4, pos(it.fin) - pos(it.ini)) + '%' }"
                :title="`${hora(it.inicio)}–${hora(it.fin)} · ${textoItem(it)}`">
                <span class="block text-[9px] font-bold leading-tight truncate">{{ textoItem(it) }}</span>
              </button>
            </div>
          </div>

          <div v-if="mascotasHora.length" class="flex items-center pt-2 mt-1 border-t border-slate-100 dark:border-white/10">
            <div class="w-32 shrink-0 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">🐾 Mascotas</div>
            <div class="relative flex-1 h-6">
              <span v-for="m in mascotasHora" :key="m.hora" class="absolute text-center text-[10px] font-black tabular-nums"
                :class="m.total ? 'text-[#152C77] dark:text-blue-300' : 'text-slate-300 dark:text-white/20'"
                :style="{ left: pos(m.hora * 60) + '%', width: (pos((m.hora + 1) * 60) - pos(m.hora * 60)) + '%' }"
                :title="`${m.perrosDia} de día · ${m.perrosHotel} de hotel`">
                {{ m.total }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-x-4 gap-y-1.5">
        <span v-for="(n, a) in AREAS" :key="a" class="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-white/50">
          <span class="w-3 h-3 rounded" :class="COLOR_AREA[a]"></span>{{ n }}
        </span>
        <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-white/50"><span class="w-3 h-3 rounded" :class="COLOR_AREA.SIN"></span>Sin clasificar</span>
        <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-white/50"><span class="w-3 h-3 rounded" :class="claseBloque({ tipo: 'SIN_TAREA' })"></span>Sin tarea</span>
        <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-white/50"><span class="w-3 h-3 rounded" :class="claseBloque({ tipo: 'ALMUERZO' })"></span>Almuerzo</span>
        <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-white/50"><span class="w-3 h-3 rounded ring-2 ring-[#DE1F27]"></span>Fuera de su área</span>
      </div>

      <!-- Bloque tocado -->
      <div v-if="seleccion" class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-4 space-y-1">
        <div class="flex items-start justify-between gap-3">
          <p class="text-[12px] font-[1000] uppercase italic dark:text-white">{{ seleccion.persona.nombre }} · <span class="not-italic tabular-nums">{{ hora(seleccion.it.inicio) }} – {{ hora(seleccion.it.fin) }}</span></p>
          <button @click="seleccion = null" class="text-slate-400 dark:text-white/40 text-[12px]">✕</button>
        </div>
        <p class="text-[13px] font-bold dark:text-white">{{ textoItem(seleccion.it) }} <span class="text-slate-400 dark:text-white/40 font-black">· {{ dur(seleccion.it.segundos) }}</span></p>
        <p v-if="seleccion.it.tipo === 'TAREA'" class="text-[11px] font-bold" :class="seleccion.it.fueraDeArea ? 'text-[#DE1F27]' : 'text-slate-500 dark:text-white/50'">
          Área: {{ AREAS[seleccion.it.area] || 'sin clasificar' }}<span v-if="seleccion.it.fueraDeArea"> · fuera de su área ({{ AREAS[seleccion.persona.areaPropia] }})</span>
        </p>
        <p v-if="seleccion.it.nota" class="text-[11px] font-semibold text-amber-700 dark:text-amber-300">⚠️ {{ seleccion.it.nota }}</p>
        <p v-if="seleccion.it.explicacion" class="text-[11px] font-semibold text-slate-700 dark:text-white/80">💬 Explicó: "{{ seleccion.it.explicacion }}"</p>
        <p class="text-[11px] text-slate-500 dark:text-white/50 pt-1">
          A esa hora:
          <span v-for="(o, k) in otrosEnMomento" :key="k" class="block">· <b class="dark:text-white/80">{{ o.nombre }}</b>: {{ o.texto }}</span>
        </p>
      </div>

      <!-- Momentos en que un compañero de la misma área estaba en otra cosa -->
      <div class="space-y-2">
        <h3 class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50">🤝 Mientras uno trabajaba en su área, el compañero estaba en otra cosa</h3>
        <p v-if="!momentos.length" class="text-[11px] text-slate-400 dark:text-white/30 bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-4">
          No hubo ratos de 10 minutos o más en que alguien estuviera en su área mientras su compañero del mismo cargo estaba en otra área o sin tarea.
        </p>
        <div v-else class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5">
          <div v-for="(m, i) in momentos" :key="i" class="px-4 py-3 space-y-0.5">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 tabular-nums">
              {{ horaMin(m.ini) }} – {{ horaMin(m.fin) }} · {{ dur((m.fin - m.ini) * 60) }}
              <span v-if="m.mascotas != null" class="text-[#152C77] dark:text-blue-300"> · 🐾 {{ m.mascotas }} mascota(s) adentro</span>
            </p>
            <p class="text-[12px] dark:text-white/80">
              <b class="dark:text-white">{{ m.a }}</b> estaba en <b>{{ m.tareaA }}</b> ({{ AREAS[m.areaA] }})
            </p>
            <p class="text-[12px]" :class="m.sinTarea ? 'text-red-600 dark:text-red-300' : 'text-[#DE1F27]'">
              mientras <b>{{ m.b }}</b> {{ m.sinTarea ? 'no tenía tarea registrada' : `estaba en ${m.tareaB} (${AREAS[m.areaB] || 'sin clasificar'})` }}
              <span v-if="m.notaB" class="block text-[11px] font-semibold text-amber-700 dark:text-amber-300">⚠️ {{ m.notaB }}</span>
              <span v-if="m.explicacionB" class="block text-[11px] font-semibold text-slate-700 dark:text-white/80">💬 Explicó: "{{ m.explicacionB }}"</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Tiempo por área de cada persona -->
      <div class="space-y-2">
        <h3 class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50">Tiempo por área</h3>
        <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5">
          <div v-for="p in visibles" :key="p.tutorId" class="px-4 py-3 space-y-1.5">
            <p class="text-[11px] font-[1000] uppercase italic dark:text-white">{{ p.nombre }}</p>
            <div class="flex h-2.5 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10">
              <div v-for="t in p.porArea" :key="t.area" :class="t.clase" :style="{ width: t.pct + '%' }"></div>
            </div>
            <div class="flex flex-wrap gap-x-3 gap-y-0.5">
              <span v-for="t in p.porArea" :key="t.area" class="text-[10px] font-bold text-slate-500 dark:text-white/50 tabular-nums">
                {{ t.nombre }} {{ dur(t.seg) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <p class="text-[10px] text-slate-400 dark:text-white/30">
        Son los registros tal cual, sin interpretación. El área de cada tarea es la del Reporte; si alguna está mal, corrígela allá y se refleja aquí. Las mascotas son las de guardería y hotel en esa hora.
      </p>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'

const AREAS = { GUARDERIA: 'Guardería', PELUQUERIA: 'Peluquería', VETERINARIA: 'Veterinaria', CAJA: 'Caja', DOMICILIOS: 'Domicilios', CONTABILIDAD: 'Contabilidad', GENERAL: 'General' }
const COLOR_AREA = {
  GUARDERIA: 'bg-blue-600 text-white',
  PELUQUERIA: 'bg-pink-500 text-white',
  VETERINARIA: 'bg-emerald-600 text-white',
  CAJA: 'bg-amber-400 text-amber-950',
  DOMICILIOS: 'bg-violet-500 text-white',
  CONTABILIDAD: 'bg-slate-600 text-white',
  GENERAL: 'bg-teal-500 text-white',
  SIN: 'bg-slate-400 text-white',
}
const inputClass = 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#152C77]'
const MIN_MOMENTO = 10

const fecha = ref(fechaLocal(new Date()))
const filtroCargo = ref('')
const personas = ref([])
const horasGuarderia = ref([])
const cargando = ref(false)
const seleccion = ref(null)

function fechaLocal(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function moverDia(n) {
  const d = new Date(fecha.value + 'T12:00:00')
  d.setDate(d.getDate() + n)
  fecha.value = fechaLocal(d)
  cargar()
}

// Minutos desde la medianoche del día consultado
function minutos(iso) {
  const d = new Date(iso)
  const base = new Date(fecha.value + 'T00:00:00')
  return (d - base) / 60000
}

async function cargar() {
  cargando.value = true
  seleccion.value = null
  try {
    const [eq, g] = await Promise.all([
      api.get('/admin/jornada/dia-equipo', { params: { fecha: fecha.value } }),
      api.get('/admin/jornada/ocupacion/dia', { params: { fecha: fecha.value } }).catch(() => ({ data: null })),
    ])
    personas.value = eq.data.map(p => {
      const items = p.sesiones.flatMap(s => s.linea).map(it => ({
        ...it,
        ini: minutos(it.inicio),
        fin: minutos(it.fin),
        fueraDeArea: it.tipo === 'TAREA' && !!it.area && it.area !== 'GENERAL' && it.area !== p.areaPropia,
      })).sort((a, b) => a.ini - b.ini)
      const seg = {}
      items.filter(it => it.tipo === 'TAREA').forEach(it => { seg[it.area || 'SIN'] = (seg[it.area || 'SIN'] || 0) + it.segundos })
      const total = Object.values(seg).reduce((a, b) => a + b, 0) || 1
      const porArea = Object.entries(seg).sort((a, b) => b[1] - a[1])
        .map(([area, s]) => ({ area, seg: s, pct: s * 100 / total, nombre: AREAS[area] || 'Sin clasificar', clase: COLOR_AREA[area] || COLOR_AREA.SIN }))
      return { ...p, items, porArea }
    })
    horasGuarderia.value = g.data?.horas || []
  } finally {
    cargando.value = false
  }
}

const cargos = computed(() => [...new Set(personas.value.map(p => p.cargo).filter(Boolean))])
const visibles = computed(() => personas.value.filter(p => !filtroCargo.value || p.cargo === filtroCargo.value))

const rango = computed(() => {
  const its = visibles.value.flatMap(p => p.items)
  if (!its.length) return [7 * 60, 19 * 60]
  return [Math.floor(Math.min(...its.map(i => i.ini)) / 60) * 60, Math.ceil(Math.max(...its.map(i => i.fin)) / 60) * 60]
})
const horasEje = computed(() => {
  const hs = []
  for (let h = rango.value[0] / 60; h <= rango.value[1] / 60; h++) hs.push(h)
  return hs
})
function pos(min) {
  const [a, b] = rango.value
  return Math.min(100, Math.max(0, (min - a) * 100 / Math.max(1, b - a)))
}

const mascotasHora = computed(() => horasGuarderia.value
  .filter(h => h.hora * 60 >= rango.value[0] && h.hora * 60 < rango.value[1])
  .map(h => ({ ...h, total: h.perrosDia + h.perrosHotel })))
function mascotasEn(min) {
  const h = horasGuarderia.value.find(x => x.hora === Math.floor(min / 60))
  return h ? h.perrosDia + h.perrosHotel : null
}

function textoItem(it) {
  if (it.tipo === 'TAREA') return it.descripcion
  if (it.tipo === 'ALMUERZO') return '🍽️ Almuerzo'
  return '⏸ Sin tarea'
}
function claseBloque(it) {
  if (it.tipo === 'ALMUERZO') return 'bg-amber-100 dark:bg-amber-500/25 text-amber-800 dark:text-amber-200'
  if (it.tipo === 'SIN_TAREA') return 'sin-tarea text-red-700 dark:text-red-300'
  return COLOR_AREA[it.area] || COLOR_AREA.SIN
}

const otrosEnMomento = computed(() => {
  if (!seleccion.value) return []
  const { persona, it } = seleccion.value
  const medio = (it.ini + it.fin) / 2
  return visibles.value.filter(p => p.tutorId !== persona.tutorId).map(p => {
    const o = p.items.find(x => x.ini <= medio && x.fin > medio)
    return { nombre: p.nombre, texto: o ? `${textoItem(o)}${o.tipo === 'TAREA' ? ` (${AREAS[o.area] || 'sin clasificar'})` : ''}` : 'fuera de jornada' }
  })
})

// Para cada par de la misma área: ratos en que A estaba en una tarea de su área y B en otra área o sin tarea
const momentos = computed(() => {
  const out = []
  const ps = visibles.value
  for (const A of ps) {
    for (const B of ps) {
      if (A === B || A.areaPropia !== B.areaPropia || A.areaPropia === 'GENERAL') continue
      const propias = A.items.filter(i => i.tipo === 'TAREA' && i.area === A.areaPropia)
      const fuera = B.items.filter(i => i.tipo === 'SIN_TAREA' || (i.tipo === 'TAREA' && i.area !== B.areaPropia && i.area !== 'GENERAL'))
      for (const a of propias) {
        for (const b of fuera) {
          const ini = Math.max(a.ini, b.ini), fin = Math.min(a.fin, b.fin)
          if (fin - ini < MIN_MOMENTO) continue
          out.push({
            ini, fin, a: A.nombre, b: B.nombre,
            tareaA: a.descripcion, areaA: a.area,
            sinTarea: b.tipo === 'SIN_TAREA', tareaB: b.descripcion, areaB: b.area,
            notaB: b.nota, explicacionB: b.explicacion,
            mascotas: mascotasEn(ini),
          })
        }
      }
    }
  }
  return out.sort((x, y) => x.ini - y.ini)
})

function dur(seg) {
  seg = Math.round(seg || 0)
  const h = Math.floor(seg / 3600)
  const m = Math.floor((seg % 3600) / 60)
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`
}
function hora(iso) {
  return iso ? new Date(iso).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' }) : ''
}
function horaMin(min) {
  const d = new Date(fecha.value + 'T00:00:00')
  d.setMinutes(Math.round(min))
  return d.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })
}
function etiquetaHora(h) {
  return h === 12 ? '12m' : h > 12 ? `${h - 12}p` : `${h}a`
}

onMounted(cargar)
</script>

<style scoped>
.sin-tarea {
  background: repeating-linear-gradient(135deg, rgb(254 202 202 / .9) 0 4px, rgb(254 226 226 / .9) 4px 8px);
}
:global(.dark) .sin-tarea {
  background: repeating-linear-gradient(135deg, rgb(239 68 68 / .3) 0 4px, rgb(239 68 68 / .12) 4px 8px);
}
</style>
