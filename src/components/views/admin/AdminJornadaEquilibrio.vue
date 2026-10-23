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
      <select v-model="area" :class="inputClass" class="!w-auto">
        <option v-for="a in areasConEquipo" :key="a" :value="a">{{ AREAS[a] }}</option>
      </select>
    </div>

    <div v-if="cargando" class="py-16 text-center space-y-3">
      <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">Leyendo {{ progreso }} de {{ totalDias }} días</p>
    </div>
    <p v-else-if="error" class="py-10 text-center text-red-500 text-[12px] font-bold">{{ error }}</p>
    <p v-else-if="personas.length < 2" class="py-16 text-center text-slate-400 dark:text-white/30 text-[11px] uppercase tracking-widest">
      Se necesitan al menos 2 personas de {{ AREAS[area] }} con jornadas en este periodo
    </p>

    <template v-else>
      <p v-if="segSinClasificar >= 1800" class="text-[11px] font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 rounded-xl px-4 py-3">
        ⚠️ Hay {{ dur(segSinClasificar) }} en tareas sin área. Clasifícalas en Reporte → "Clasificar esfuerzo con IA" (y corrige las que queden mal) para que las cifras sean exactas.
      </p>

      <!-- Hechos principales -->
      <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-2">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">📌 Lo que dicen los registros</p>
        <p v-for="(h, i) in hechos" :key="i" class="text-[13px] font-bold dark:text-white/90 leading-snug">· {{ h }}</p>
      </div>

      <!-- Reparto por persona -->
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="p in personas" :key="p.tutorId" class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-3">
          <div>
            <p class="font-[1000] uppercase italic text-sm dark:text-white">{{ p.nombre }}</p>
            <p class="text-[10px] text-slate-400 dark:text-white/40">{{ p.dias }} día(s) · {{ dur(p.jornada) }} de jornada</p>
          </div>
          <div class="flex h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10">
            <div v-for="b in barra(p)" :key="b.k" :class="b.clase" :style="{ width: b.pct + '%' }" :title="b.label"></div>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
            <span class="text-slate-500 dark:text-white/50">En {{ AREAS[area].toLowerCase() }}</span><b class="tabular-nums text-right dark:text-white">{{ dur(p.propia) }} <span class="font-normal opacity-60">({{ pct(p.propia, p.jornada) }})</span></b>
            <span class="text-slate-500 dark:text-white/50">· de eso, tareas pesadas</span><b class="tabular-nums text-right dark:text-white">{{ dur(p.pesadas) }}</b>
            <template v-for="(s, a) in p.otras" :key="a">
              <span class="text-[#DE1F27]">En {{ (AREAS[a] || 'sin área').toLowerCase() }}</span><b class="tabular-nums text-right text-[#DE1F27]">{{ dur(s) }} <span class="font-normal opacity-60">({{ pct(s, p.jornada) }})</span></b>
            </template>
            <span class="text-slate-500 dark:text-white/50">Sin tarea</span><b class="tabular-nums text-right dark:text-white">{{ dur(p.sinTarea) }}</b>
          </div>
          <p class="text-[11px] font-black text-[#152C77] dark:text-blue-300">
            Hizo el {{ pct(p.propia, totalPropia) }} del trabajo de {{ AREAS[area].toLowerCase() }} y el {{ pct(p.pesadas, totalPesadas) }} de las tareas pesadas
          </p>
        </div>
      </div>

      <!-- Tareas pesadas hechas sola -->
      <div class="space-y-2">
        <h3 class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50">
          🏋️ Tareas pesadas de {{ AREAS[area].toLowerCase() }} que alguien hizo mientras su compañera estaba fuera del área
        </h3>
        <p v-if="!solas.length" class="text-[11px] text-slate-400 dark:text-white/30 bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-4">No hubo en este periodo.</p>
        <div v-else class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5">
          <div v-for="(s, i) in solas" :key="i" class="px-4 py-3 space-y-0.5">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 tabular-nums">{{ diaCorto(s.fecha) }} · {{ s.desde }} – {{ s.hasta }}</p>
            <p class="text-[12px] dark:text-white/80"><b class="dark:text-white">{{ s.quien }}</b>: {{ s.tarea }} <b class="tabular-nums">({{ dur(s.seg) }})</b></p>
            <p class="text-[12px] text-[#DE1F27]">Mientras tanto {{ s.otra }}: {{ s.haciendo }}</p>
          </div>
        </div>
      </div>

      <!-- Día por día -->
      <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-x-auto">
        <table class="w-full text-left min-w-[560px]">
          <thead class="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
            <tr>
              <th class="px-4 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest dark:text-white">Día</th>
              <th v-for="p in personas" :key="p.tutorId" class="px-4 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest dark:text-white">{{ p.nombre.split(' ')[0] }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-white/5">
            <tr v-for="d in porDia" :key="d.fecha">
              <td class="px-4 py-3 text-[12px] font-[1000] uppercase italic dark:text-white whitespace-nowrap">{{ diaCorto(d.fecha) }}</td>
              <td v-for="p in personas" :key="p.tutorId" class="px-4 py-3 text-[11px] tabular-nums whitespace-nowrap">
                <template v-if="d.p[p.tutorId]">
                  <span class="font-bold dark:text-white/80">{{ dur(d.p[p.tutorId].propia) }}</span>
                  <span v-if="d.p[p.tutorId].fuera >= 60" class="block text-[10px] font-black text-[#DE1F27]">+ {{ dur(d.p[p.tutorId].fuera) }} fuera</span>
                </template>
                <span v-else class="text-slate-300 dark:text-white/20">no vino</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-[10px] text-slate-400 dark:text-white/30">
        Cada celda es el tiempo en tareas de {{ AREAS[area].toLowerCase() }}; "fuera" es el tiempo en tareas de otras áreas (sin contar las generales). Tareas pesadas = las marcadas como pesadas en el Reporte.
      </p>

      <!-- PDF para conversar -->
      <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-3">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">📄 Para conversarlo con el equipo</p>
        <textarea v-model="mensaje" rows="3" :class="inputClass" class="!w-full !text-sm !py-3"
          placeholder="Mensaje o regla que quieres que aparezca en el documento. Ej: El trabajo de guardería se reparte entre las dos. Peluquería solo cuando guardería está al día y la administración lo autoriza."></textarea>
        <button @click="descargar" class="bg-[#152C77] hover:bg-[#DE1F27] text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors">
          Descargar PDF
        </button>
        <p class="text-[10px] text-slate-400 dark:text-white/30">El documento solo lleva cifras y hechos de los registros, sin opiniones de la IA.</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import api from '@/api/axios'

const AREAS = { GUARDERIA: 'Guardería', PELUQUERIA: 'Peluquería', VETERINARIA: 'Veterinaria', CAJA: 'Caja', DOMICILIOS: 'Domicilios', CONTABILIDAD: 'Contabilidad', GENERAL: 'General' }
const COLOR = { PROPIA: 'bg-blue-600', PESADA: 'bg-blue-900', FUERA: 'bg-[#DE1F27]', SIN_TAREA: 'bg-slate-300 dark:bg-white/20' }
const PRESETS = [{ dias: 7, label: '7 días' }, { dias: 14, label: '14 días' }, { dias: 30, label: '30 días' }]
const MAX_DIAS = 31
const MIN_SOLAPE = 10
const inputClass = 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#152C77]'

const preset = ref(7)
const desde = ref('')
const hasta = ref('')
const area = ref('GUARDERIA')
const dias = ref([])
const cargando = ref(false)
const progreso = ref(0)
const totalDias = ref(0)
const error = ref('')
const mensaje = ref('')

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
function fechasDelRango() {
  const out = []
  const d = new Date(desde.value + 'T12:00:00'), fin = new Date(hasta.value + 'T12:00:00')
  while (d <= fin && out.length < MAX_DIAS) { out.push(fechaLocal(d)); d.setDate(d.getDate() + 1) }
  return out
}

async function cargar() {
  if (!desde.value || !hasta.value) return
  const fechas = fechasDelRango()
  cargando.value = true
  error.value = ''
  progreso.value = 0
  totalDias.value = fechas.length
  try {
    const res = []
    // De a 4 días a la vez para no saturar el servidor
    for (let i = 0; i < fechas.length; i += 4) {
      const lote = await Promise.all(fechas.slice(i, i + 4).map(async fecha => {
        const { data } = await api.get('/admin/jornada/dia-equipo', { params: { fecha } })
        progreso.value++
        return { fecha, personas: data }
      }))
      res.push(...lote)
    }
    dias.value = res
  } catch (e) {
    error.value = e.response?.data?.message || 'No se pudieron leer los registros'
  } finally {
    cargando.value = false
  }
}

const minutos = (fecha, iso) => (new Date(iso) - new Date(fecha + 'T00:00:00')) / 60000
const itemsDe = (fecha, p) => p.sesiones.flatMap(s => s.linea)
  .map(it => ({ ...it, ini: minutos(fecha, it.inicio), fin: minutos(fecha, it.fin) }))

const areasConEquipo = computed(() => {
  const cuenta = {}
  dias.value.forEach(d => d.personas.forEach(p => { (cuenta[p.areaPropia] ||= new Set()).add(p.tutorId) }))
  const lista = Object.keys(cuenta).filter(a => a !== 'GENERAL' && cuenta[a].size >= 2)
  return lista.length ? lista : ['GUARDERIA']
})

const personas = computed(() => {
  const acc = {}
  for (const d of dias.value) {
    for (const p of d.personas.filter(x => x.areaPropia === area.value)) {
      const a = acc[p.tutorId] ||= { tutorId: p.tutorId, nombre: p.nombre, dias: 0, jornada: 0, propia: 0, pesadas: 0, sinTarea: 0, otras: {} }
      a.dias++
      for (const it of itemsDe(d.fecha, p)) {
        if (it.tipo === 'ALMUERZO') continue
        a.jornada += it.segundos
        if (it.tipo === 'SIN_TAREA') a.sinTarea += it.segundos
        else if (it.area === area.value || it.area === 'GENERAL') {
          a.propia += it.segundos
          if (it.nivel === 'PESADA' && it.area === area.value) a.pesadas += it.segundos
        } else a.otras[it.area || 'SIN'] = (a.otras[it.area || 'SIN'] || 0) + it.segundos
      }
    }
  }
  return Object.values(acc).sort((x, y) => y.propia - x.propia)
})
const totalPropia = computed(() => personas.value.reduce((s, p) => s + p.propia, 0))
const totalPesadas = computed(() => personas.value.reduce((s, p) => s + p.pesadas, 0))
const segSinClasificar = computed(() => personas.value.reduce((s, p) => s + (p.otras.SIN || 0), 0))

const porDia = computed(() => [...dias.value].reverse().map(d => {
  const p = {}
  d.personas.filter(x => x.areaPropia === area.value).forEach(x => {
    let propia = 0, fuera = 0
    itemsDe(d.fecha, x).filter(it => it.tipo === 'TAREA').forEach(it => {
      if (it.area === area.value || it.area === 'GENERAL') propia += it.segundos
      else fuera += it.segundos
    })
    p[x.tutorId] = { propia, fuera }
  })
  return { fecha: d.fecha, p }
}).filter(d => Object.keys(d.p).length))

// Tarea pesada del área hecha por A mientras B (misma área, ese día) estaba en otra área o sin tarea
const solas = computed(() => {
  const out = []
  for (const d of dias.value) {
    const equipo = d.personas.filter(x => x.areaPropia === area.value)
    for (const A of equipo) {
      const pesadas = itemsDe(d.fecha, A).filter(it => it.tipo === 'TAREA' && it.area === area.value && it.nivel === 'PESADA')
      for (const t of pesadas) {
        for (const B of equipo) {
          if (B === A) continue
          const fuera = itemsDe(d.fecha, B).filter(it => (it.tipo === 'SIN_TAREA' || (it.tipo === 'TAREA' && it.area && it.area !== area.value && it.area !== 'GENERAL'))
            && Math.min(it.fin, t.fin) - Math.max(it.ini, t.ini) >= MIN_SOLAPE)
          if (!fuera.length) continue
          const minFuera = fuera.reduce((s, it) => s + Math.min(it.fin, t.fin) - Math.max(it.ini, t.ini), 0)
          const resumen = {}
          fuera.forEach(it => {
            const k = it.tipo === 'SIN_TAREA' ? 'sin tarea registrada' : `${it.descripcion} (${AREAS[it.area]})`
            resumen[k] = (resumen[k] || 0) + Math.min(it.fin, t.fin) - Math.max(it.ini, t.ini)
          })
          out.push({
            fecha: d.fecha, desde: hora(t.inicio), hasta: hora(t.fin), quien: A.nombre, otra: B.nombre,
            tarea: t.descripcion, seg: t.segundos, minFuera,
            areasFuera: fuera.filter(it => it.tipo === 'TAREA').map(it => it.area),
            haciendo: Object.entries(resumen).map(([k, m]) => `${k} ${dur(m * 60)}`).join(' · '),
          })
        }
      }
    }
  }
  return out.sort((x, y) => (x.fecha + x.desde).localeCompare(y.fecha + y.desde))
})

const hechos = computed(() => {
  const ps = personas.value
  const n = AREAS[area.value].toLowerCase()
  const h = []
  ps.forEach(p => {
    const fuera = Object.entries(p.otras).filter(([a]) => a !== 'SIN').sort((x, y) => y[1] - x[1])
    let t = `${p.nombre} hizo ${dur(p.propia)} de ${n} (${pct(p.propia, totalPropia.value)} del total del área) en ${p.dias} día(s)`
    if (fuera.length) t += `, y pasó ${fuera.map(([a, s]) => `${dur(s)} en ${AREAS[a].toLowerCase()}`).join(' y ')} (${pct(fuera.reduce((s, [, x]) => s + x, 0), p.jornada)} de su jornada)`
    h.push(t + '.')
  })
  if (totalPesadas.value) {
    h.push(`Tareas pesadas de ${n}: ` + ps.map(p => `${p.nombre.split(' ')[0]} ${dur(p.pesadas)} (${pct(p.pesadas, totalPesadas.value)})`).join(' · ') + '.')
  }
  const porQuien = {}
  solas.value.forEach(s => { (porQuien[s.quien] ||= { veces: 0, seg: 0, mayor: null }); const q = porQuien[s.quien]; q.veces++; q.seg += s.seg; if (!q.mayor || s.seg > q.mayor.seg) q.mayor = s })
  Object.entries(porQuien).forEach(([quien, q]) => {
    h.push(`${quien} hizo ${q.veces} tarea(s) pesada(s) de ${n} (${dur(q.seg)}) mientras su compañera estaba fuera del área. La más larga: ${q.mayor.tarea}, el ${diaCorto(q.mayor.fecha)}, ${dur(q.mayor.seg)}, mientras ${q.mayor.otra} estaba en ${q.mayor.haciendo}.`)
  })
  return h
})

function barra(p) {
  const fuera = Object.values(p.otras).reduce((s, x) => s + x, 0)
  const total = p.jornada || 1
  return [
    { k: 'pes', clase: COLOR.PESADA, pct: p.pesadas * 100 / total, label: 'Tareas pesadas del área' },
    { k: 'pro', clase: COLOR.PROPIA, pct: (p.propia - p.pesadas) * 100 / total, label: 'Resto de tareas del área' },
    { k: 'fue', clase: COLOR.FUERA, pct: fuera * 100 / total, label: 'Otras áreas' },
    { k: 'sin', clase: COLOR.SIN_TAREA, pct: p.sinTarea * 100 / total, label: 'Sin tarea' },
  ]
}

function pct(a, b) { return b ? Math.round(a * 100 / b) + ' %' : '—' }
function dur(seg) {
  seg = Math.round(seg || 0)
  const h = Math.floor(seg / 3600), m = Math.floor((seg % 3600) / 60)
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`
}
function hora(iso) { return new Date(iso).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' }) }
function diaCorto(f) { return new Date(f + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }) }
function fechaLarga(f) { return new Date(f + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }) }

function descargar() {
  const w = window.open('', '_blank')
  if (!w) return alert('El navegador bloqueó la ventana. Permite ventanas emergentes para petstationvet.com.')
  const esc = t => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const n = AREAS[area.value]
  const tarjetas = personas.value.map(p => `
    <tr><td><b>${esc(p.nombre)}</b></td><td>${p.dias}</td><td>${dur(p.propia)} (${pct(p.propia, totalPropia.value)})</td><td>${dur(p.pesadas)} (${pct(p.pesadas, totalPesadas.value)})</td>
    <td>${Object.entries(p.otras).filter(([a]) => a !== 'SIN').map(([a, s]) => `${esc(AREAS[a])} ${dur(s)}`).join('<br>') || '—'}</td><td>${dur(p.sinTarea)}</td></tr>`).join('')
  const filasSolas = solas.value.map(s => `<li><b>${esc(diaCorto(s.fecha))} ${esc(s.desde)}–${esc(s.hasta)}</b> · ${esc(s.quien)}: ${esc(s.tarea)} (${dur(s.seg)}). Mientras tanto ${esc(s.otra)}: ${esc(s.haciendo)}.</li>`).join('')
  w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Reparto ${esc(n)} ${desde.value} a ${hasta.value}</title>
<style>
  @page { margin: 18mm 16mm; }
  body { font-family: -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color: #1e293b; font-size: 12.5px; line-height: 1.55; max-width: 760px; margin: 24px auto; padding: 0 16px; }
  header { border-bottom: 3px solid #DE1F27; padding-bottom: 10px; margin-bottom: 18px; }
  .marca { font-weight: 900; font-style: italic; color: #152C77; letter-spacing: .04em; font-size: 13px; }
  h1 { font-size: 20px; margin: 4px 0 2px; } .sub { color: #64748b; font-size: 11px; }
  h3 { font-size: 12.5px; text-transform: uppercase; letter-spacing: .04em; color: #152C77; margin: 18px 0 6px; }
  table { width: 100%; border-collapse: collapse; font-size: 11.5px; } th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  th { font-size: 9.5px; text-transform: uppercase; color: #64748b; }
  ul { padding-left: 18px; } li { margin: 4px 0; break-inside: avoid; }
  .msg { background: #f1f5f9; border-left: 4px solid #152C77; padding: 10px 14px; margin: 14px 0; white-space: pre-wrap; }
  footer { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 8px; color: #94a3b8; font-size: 10px; }
</style></head><body>
<header><div class="marca">PET STATION · MI JORNADA</div><h1>Reparto del trabajo de ${esc(n.toLowerCase())}</h1>
<div class="sub">Del ${esc(fechaLarga(desde.value))} al ${esc(fechaLarga(hasta.value))}</div></header>
${mensaje.value.trim() ? `<div class="msg">${esc(mensaje.value.trim())}</div>` : ''}
<h3>Lo que dicen los registros</h3><ul>${hechos.value.map(h => `<li>${esc(h)}</li>`).join('')}</ul>
<h3>Tiempo por persona</h3>
<table><tr><th>Persona</th><th>Días</th><th>En ${esc(n.toLowerCase())}</th><th>Tareas pesadas</th><th>En otras áreas</th><th>Sin tarea</th></tr>${tarjetas}</table>
${filasSolas ? `<h3>Tareas pesadas hechas mientras la compañera estaba fuera del área</h3><ul>${filasSolas}</ul>` : ''}
<footer>Cifras calculadas directamente de los registros de Mi Jornada (tareas que cada persona inició y terminó en la app). No incluye interpretación de inteligencia artificial.</footer>
</body></html>`)
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 300)
}

watch(areasConEquipo, l => { if (!l.includes(area.value)) area.value = l[0] })
onMounted(() => aplicarPreset(7))
</script>
