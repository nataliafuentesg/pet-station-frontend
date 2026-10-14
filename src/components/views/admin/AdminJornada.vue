<template>
  <div class="space-y-6">

    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-[1000] uppercase italic dark:text-white">Productividad</h2>
        <p class="text-[10px] text-slate-500 dark:text-white/30 uppercase tracking-widest">Jornadas y tareas del equipo · portal en /equipo</p>
      </div>
      <button @click="abrirForm()"
        class="flex items-center gap-2 bg-[#152C77] hover:bg-[#DE1F27] text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors">
        ➕ Nuevo empleado
      </button>
    </div>

    <div class="flex gap-2 overflow-x-auto">
      <button v-for="v in vistas" :key="v.id" @click="vista = v.id"
        class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors"
        :class="vista === v.id ? 'bg-[#152C77] text-white' : 'bg-white dark:bg-white/5 text-slate-500 dark:text-white/50 border border-slate-100 dark:border-white/10'">
        {{ v.label }}
      </button>
    </div>

    <!-- AHORA -->
    <div v-if="vista === 'ahora'" class="space-y-3">
      <div class="flex justify-end">
        <button @click="cargarEmpleados" class="text-[10px] font-black uppercase text-slate-400 hover:text-[#152C77] dark:text-white/40">🔄 Actualizar</button>
      </div>
      <div v-if="loadingEmpleados" class="py-16 text-center">
        <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
      <div v-else-if="!activos.length" class="py-16 text-center text-slate-400 dark:text-white/30 text-[11px] uppercase tracking-widest">
        Sin empleados. Crea el primero con "Nuevo empleado".
      </div>
      <div v-else class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div v-for="e in activos" :key="e.tutorId"
          class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="font-[1000] uppercase italic text-sm dark:text-white truncate">{{ e.nombre }}</p>
              <p class="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-widest">{{ e.cargo }}</p>
            </div>
            <span class="text-[9px] px-2.5 py-1 rounded-full font-black uppercase shrink-0" :class="estadoVivo(e).clase">
              {{ estadoVivo(e).label }}
            </span>
          </div>
          <div v-if="e.tareaActual" class="bg-slate-50 dark:bg-white/5 rounded-xl px-4 py-3">
            <p class="text-[13px] font-bold dark:text-white break-words">{{ e.tareaActual.descripcion }}</p>
            <p class="text-[10px] text-slate-400 dark:text-white/40 mt-1">
              {{ dur(e.tareaActual.segundos) }} en esta tarea
              <span v-if="e.tareaActual.checkPendiente" class="text-amber-500 font-bold"> · no ha respondido el aviso</span>
            </p>
          </div>
          <p v-if="e.sesion" class="text-[10px] text-slate-400 dark:text-white/40">
            Entró {{ hora(e.sesion.inicio) }} · {{ dur(e.sesion.segundosEnTareas) }} en tareas hoy
          </p>
        </div>
      </div>
    </div>

    <!-- REPORTE -->
    <div v-if="vista === 'reporte'" class="space-y-5">
      <div class="flex flex-wrap items-end gap-3">
        <div class="flex gap-1">
          <button v-for="p in presets" :key="p.id" @click="aplicarPreset(p.id)"
            class="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
            :class="preset === p.id ? 'bg-[#DE1F27] text-white' : 'bg-white dark:bg-white/5 text-slate-500 dark:text-white/50 border border-slate-100 dark:border-white/10'">
            {{ p.label }}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <input type="date" v-model="desde" @change="preset = null; cargarResumen()" :class="inputClass" class="!py-2 !text-xs" />
          <span class="text-slate-400 text-xs">a</span>
          <input type="date" v-model="hasta" @change="preset = null; cargarResumen()" :class="inputClass" class="!py-2 !text-xs" />
        </div>
        <select v-if="cargos.length > 1" v-model="filtroCargo" @change="cargarResumen" :class="inputClass" class="!py-2 !text-xs !w-auto">
          <option value="">Todos los cargos</option>
          <option v-for="c in cargos" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div v-if="loadingResumen" class="py-16 text-center">
        <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>

      <template v-else-if="resumen">
        <!-- Totales del equipo -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div v-for="k in kpis" :key="k.label" class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-4">
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">{{ k.label }}</p>
            <p class="text-2xl font-[1000] mt-1 tabular-nums" :class="k.color || 'dark:text-white'">{{ k.valor }}</p>
          </div>
        </div>

        <!-- Por persona -->
        <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-x-auto">
          <table class="w-full text-left min-w-[760px]">
            <thead class="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
              <tr>
                <th v-for="h in ['Persona','Días','Jornada','En tareas','Tiempo muerto','Ocupación','Tareas','Avisos sin responder','']" :key="h"
                  class="px-4 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest dark:text-white">{{ h }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
              <tr v-for="p in resumen.personas" :key="p.tutorId" class="hover:bg-slate-50 dark:hover:bg-white/3">
                <td class="px-4 py-3">
                  <p class="font-[1000] uppercase italic text-[12px] dark:text-white">{{ p.nombre }}</p>
                  <p class="text-[9px] text-slate-400 dark:text-white/30 uppercase">{{ p.cargo }}<span v-if="!p.activo"> · inactivo</span></p>
                </td>
                <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">{{ p.dias }}</td>
                <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">{{ dur(p.segJornada) }}</td>
                <td class="px-4 py-3 text-[12px] font-bold text-green-600 dark:text-green-400 tabular-nums">{{ dur(p.segTareas) }}</td>
                <td class="px-4 py-3 text-[12px] font-bold tabular-nums" :class="p.segMuerto > 3600 ? 'text-red-500' : 'dark:text-white/70'">{{ dur(p.segMuerto) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-20 h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                      <div class="h-full rounded-full" :class="barraClase(p.pctOcupado)" :style="{ width: p.pctOcupado + '%' }"></div>
                    </div>
                    <span class="text-[11px] font-black dark:text-white/70 tabular-nums">{{ p.pctOcupado }}%</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">
                  {{ p.numTareas }}
                  <span v-if="p.conImprevistos" class="block text-[9px] text-amber-500 font-black uppercase">{{ p.conImprevistos }} con imprevistos</span>
                </td>
                <td class="px-4 py-3 text-[12px] font-bold tabular-nums" :class="p.checksSinRespuesta ? 'text-amber-500' : 'dark:text-white/70'">
                  {{ p.checksSinRespuesta }}<span class="opacity-40"> / {{ p.checksEnviados }}</span>
                  <span v-if="p.cierresAutomaticos" class="block text-[9px] text-red-400 font-black uppercase">Olvidó cerrar {{ p.cierresAutomaticos }}×</span>
                </td>
                <td class="px-4 py-3">
                  <button v-if="p.dias" @click="abrirDetalle(p)" class="text-[9px] font-black uppercase text-[#152C77] dark:text-blue-300 hover:text-[#DE1F27] whitespace-nowrap">Ver día →</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-[10px] text-slate-400 dark:text-white/30">
          Jornada = tiempo desde que inicia hasta que cierra, sin almuerzo. Tiempo muerto = parte de la jornada sin ninguna tarea registrada.
        </p>

        <!-- Por tarea -->
        <div class="space-y-2">
          <h3 class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50">Tareas que más tiempo consumen</h3>
          <div v-if="!resumen.tareas.length" class="py-10 text-center text-slate-400 dark:text-white/30 text-[11px] uppercase tracking-widest bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
            Aún no hay tareas terminadas en este periodo
          </div>
          <div v-else class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-x-auto">
            <table class="w-full text-left min-w-[600px]">
              <thead class="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                <tr>
                  <th v-for="h in ['Tarea','Veces','Tiempo total','Promedio','Quién la hace']" :key="h"
                    class="px-4 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest dark:text-white">{{ h }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-white/5">
                <tr v-for="t in resumen.tareas.slice(0, 40)" :key="t.descripcion">
                  <td class="px-4 py-3 text-[12px] font-bold dark:text-white">{{ t.descripcion }}</td>
                  <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">
                    {{ t.veces }}
                    <span v-if="t.conImprevistos" class="block text-[9px] text-amber-500 font-black uppercase">{{ t.conImprevistos }} con imprevistos</span>
                  </td>
                  <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">{{ dur(t.segTotal) }}</td>
                  <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">{{ dur(t.segPromedio) }}</td>
                  <td class="px-4 py-3 text-[11px] text-slate-500 dark:text-white/50">{{ t.personas.join(', ') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>

    <!-- EQUIPO -->
    <div v-if="vista === 'equipo'" class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-x-auto">
      <div v-if="!empleados.length" class="py-16 text-center text-slate-400 dark:text-white/30 text-[11px] uppercase tracking-widest">Sin empleados</div>
      <table v-else class="w-full text-left min-w-[560px]">
        <thead class="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
          <tr>
            <th v-for="h in ['Nombre','Usuario','Cargo','Estado','']" :key="h"
              class="px-5 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest dark:text-white">{{ h }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-white/5">
          <tr v-for="e in empleados" :key="e.tutorId">
            <td class="px-5 py-3 font-[1000] uppercase italic text-[12px] dark:text-white">{{ e.nombre }}</td>
            <td class="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">{{ e.usuario }}</td>
            <td class="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">{{ e.cargo }}</td>
            <td class="px-5 py-3">
              <span class="text-[9px] px-2.5 py-1 rounded-full font-black uppercase"
                :class="e.activo ? 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400'">
                {{ e.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-5 py-3 text-right whitespace-nowrap space-x-3">
              <button @click="abrirForm(e)" class="text-[9px] font-black uppercase text-[#152C77] dark:text-blue-300 hover:text-[#DE1F27]">Editar</button>
              <button @click="toggleActivo(e)" class="text-[9px] font-black uppercase"
                :class="e.activo ? 'text-red-400 hover:text-red-600' : 'text-green-500 hover:text-green-700'">
                {{ e.activo ? 'Desactivar' : 'Reactivar' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal crear / editar -->
    <Teleport to="body">
      <div v-if="form" class="fixed inset-0 z-[9000] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="form = null"></div>
        <div class="relative w-full max-w-md bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
            <h3 class="font-[1000] uppercase italic text-sm dark:text-white">{{ form.tutorId ? 'Editar empleado' : 'Nuevo empleado' }}</h3>
            <button @click="form = null" class="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-lg text-slate-400 dark:text-white/50">✕</button>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label :class="labelClass">Nombre *</label>
                <input v-model="form.nombre" :class="inputClass" />
              </div>
              <div class="space-y-1">
                <label :class="labelClass">Apellido</label>
                <input v-model="form.apellido" :class="inputClass" />
              </div>
            </div>
            <div class="space-y-1">
              <label :class="labelClass">Usuario *</label>
              <input v-model="form.usuario" :disabled="!!form.tutorId" autocapitalize="none" placeholder="ej: maria.guarderia"
                :class="inputClass" class="disabled:opacity-50" />
            </div>
            <div class="space-y-1">
              <label :class="labelClass">Cargo *</label>
              <input v-model="form.cargo" list="jornada-cargos" :class="inputClass" />
              <datalist id="jornada-cargos">
                <option v-for="c in cargosSugeridos" :key="c" :value="c" />
              </datalist>
            </div>
            <div class="space-y-1">
              <label :class="labelClass">{{ form.tutorId ? 'Nueva contraseña (opcional)' : 'Contraseña *' }}</label>
              <input v-model="form.password" type="text" placeholder="Mínimo 4 caracteres" :class="inputClass" />
            </div>

            <div v-if="errorForm" class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3 text-[11px] text-red-600 dark:text-red-400">{{ errorForm }}</div>

            <div class="flex gap-3 pt-2">
              <button @click="form = null" class="flex-1 bg-slate-100 dark:bg-white/5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest dark:text-white">Cancelar</button>
              <button @click="guardar" :disabled="!formValido || guardando"
                class="flex-1 bg-[#152C77] hover:bg-[#DE1F27] text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-colors disabled:opacity-30">
                {{ guardando ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
            <p v-if="!form.tutorId" class="text-[10px] text-slate-400 dark:text-white/30 leading-relaxed">
              Entrégale el usuario y la contraseña. Entra desde el celular a <b>petstationvet.com/equipo</b> y lo agrega a la pantalla de inicio.
            </p>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal detalle del día -->
    <Teleport to="body">
      <div v-if="detalle" class="fixed inset-0 z-[9000] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="detalle = null"></div>
        <div class="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 dark:border-white/5">
            <div class="min-w-0">
              <h3 class="font-[1000] uppercase italic text-sm dark:text-white truncate">{{ detalle.persona.nombre }}</h3>
              <input type="date" v-model="detalle.fecha" @change="cargarDetalle" class="mt-1 bg-transparent text-[11px] font-bold text-slate-500 dark:text-white/50 outline-none" />
            </div>
            <button @click="detalle = null" class="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-lg text-slate-400 dark:text-white/50 shrink-0">✕</button>
          </div>
          <div class="p-6 overflow-y-auto space-y-5">
            <div v-if="detalle.cargando" class="py-10 text-center">
              <div class="w-6 h-6 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <p v-else-if="!detalle.sesiones.length" class="py-10 text-center text-slate-400 dark:text-white/30 text-[11px] uppercase tracking-widest">No trabajó este día</p>
            <div v-for="(s, i) in detalle.sesiones" :key="i" class="space-y-2">
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">
                Jornada {{ hora(s.inicio) }} – {{ s.fin ? hora(s.fin) : 'en curso' }}
                <span v-if="s.cierreAutomatico" class="text-red-400"> · no la cerró</span>
              </p>
              <div v-for="(it, j) in s.linea" :key="j" class="flex items-center gap-3 rounded-xl px-4 py-2.5" :class="itemClase(it.tipo)">
                <span class="text-[10px] font-bold tabular-nums w-24 shrink-0 opacity-70">{{ hora(it.inicio) }} – {{ hora(it.fin) }}</span>
                <span class="flex-1 min-w-0 text-[12px] font-bold break-words">
                  {{ it.tipo === 'TAREA' ? it.descripcion : it.tipo === 'ALMUERZO' ? '🍽️ Almuerzo' : '⏸ Sin tarea registrada' }}
                  <span v-if="it.nota" class="block text-[11px] font-semibold text-amber-700 dark:text-amber-300 mt-0.5">⚠️ {{ it.nota }}</span>
                  <span v-if="it.checksSinRespuesta" class="block text-[9px] font-black uppercase text-amber-500">{{ it.checksSinRespuesta }} aviso(s) sin responder</span>
                </span>
                <span class="text-[11px] font-black tabular-nums shrink-0">{{ dur(it.segundos) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'

const vistas = [
  { id: 'ahora', label: '🟢 Ahora' },
  { id: 'reporte', label: '📊 Reporte' },
  { id: 'equipo', label: '👥 Equipo' },
]
const presets = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'semana', label: '7 días' },
  { id: 'mes', label: '30 días' },
]
const inputClass = 'w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#152C77]'
const labelClass = 'text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40'

const vista = ref('ahora')
const empleados = ref([])
const loadingEmpleados = ref(false)

const preset = ref('semana')
const desde = ref('')
const hasta = ref('')
const filtroCargo = ref('')
const resumen = ref(null)
const loadingResumen = ref(false)

const form = ref(null)
const errorForm = ref('')
const guardando = ref(false)
const detalle = ref(null)

const activos = computed(() => empleados.value.filter(e => e.activo))
const cargos = computed(() => [...new Set(empleados.value.map(e => e.cargo).filter(Boolean))])
const cargosSugeridos = computed(() => [...new Set(['Guardería', ...cargos.value])])
const formValido = computed(() => form.value?.nombre?.trim() && form.value?.cargo?.trim() &&
  (form.value.tutorId || (form.value.usuario?.trim() && form.value.password?.length >= 4)))

const kpis = computed(() => {
  const ps = resumen.value?.personas || []
  const sum = k => ps.reduce((a, p) => a + p[k], 0)
  const jornada = sum('segJornada')
  return [
    { label: 'Horas de jornada', valor: dur(jornada) },
    { label: 'En tareas', valor: dur(sum('segTareas')), color: 'text-green-600 dark:text-green-400' },
    { label: 'Tiempo muerto', valor: dur(sum('segMuerto')), color: 'text-red-500' },
    { label: 'Ocupación del equipo', valor: (jornada ? Math.round(sum('segTareas') * 100 / jornada) : 0) + '%' },
  ]
})

function fechaLocal(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function dur(seg) {
  seg = seg || 0
  const h = Math.floor(seg / 3600)
  const m = Math.floor((seg % 3600) / 60)
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`
}
function hora(iso) {
  return iso ? new Date(iso).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' }) : ''
}
function barraClase(pct) {
  return pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-500'
}
function itemClase(tipo) {
  if (tipo === 'TAREA') return 'bg-green-50 dark:bg-green-500/10 text-green-900 dark:text-green-200'
  if (tipo === 'ALMUERZO') return 'bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-200'
  return 'bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-300'
}
function estadoVivo(e) {
  if (!e.sesion) return { label: 'Sin jornada', clase: 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/40' }
  if (e.sesion.estado === 'ALMUERZO') return { label: 'Almuerzo', clase: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300' }
  if (e.tareaActual) return { label: 'Trabajando', clase: 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400' }
  return { label: 'Sin tarea', clase: 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400' }
}

async function cargarEmpleados() {
  loadingEmpleados.value = true
  try {
    const { data } = await api.get('/admin/jornada/empleados')
    empleados.value = data
  } finally {
    loadingEmpleados.value = false
  }
}

function aplicarPreset(id) {
  preset.value = id
  const hoy = new Date()
  const ini = new Date()
  if (id === 'semana') ini.setDate(hoy.getDate() - 6)
  if (id === 'mes') ini.setDate(hoy.getDate() - 29)
  desde.value = fechaLocal(ini)
  hasta.value = fechaLocal(hoy)
  cargarResumen()
}

async function cargarResumen() {
  if (!desde.value || !hasta.value) return
  loadingResumen.value = true
  try {
    const { data } = await api.get('/admin/jornada/resumen', {
      params: { desde: desde.value, hasta: hasta.value, cargo: filtroCargo.value || undefined }
    })
    resumen.value = data
  } finally {
    loadingResumen.value = false
  }
}

function abrirDetalle(p) {
  detalle.value = { persona: p, fecha: hasta.value, sesiones: [], cargando: true }
  cargarDetalle()
}

async function cargarDetalle() {
  detalle.value.cargando = true
  try {
    const { data } = await api.get('/admin/jornada/detalle', {
      params: { tutorId: detalle.value.persona.tutorId, fecha: detalle.value.fecha }
    })
    detalle.value.sesiones = data
  } finally {
    detalle.value.cargando = false
  }
}

function abrirForm(e) {
  errorForm.value = ''
  form.value = e
    ? { tutorId: e.tutorId, nombre: e.nombreCorto, apellido: e.apellido, usuario: e.usuario, cargo: e.cargo, password: '' }
    : { nombre: '', apellido: '', usuario: '', cargo: 'Guardería', password: '' }
}

async function guardar() {
  guardando.value = true
  errorForm.value = ''
  try {
    const f = form.value
    if (f.tutorId) {
      const body = { nombre: f.nombre, apellido: f.apellido, cargo: f.cargo }
      if (f.password) body.password = f.password
      await api.patch(`/admin/jornada/empleados/${f.tutorId}`, body)
    } else {
      await api.post('/admin/jornada/empleados', f)
    }
    form.value = null
    cargarEmpleados()
  } catch (e) {
    errorForm.value = e.response?.data?.message || 'No se pudo guardar'
  } finally {
    guardando.value = false
  }
}

async function toggleActivo(e) {
  if (e.activo && !confirm(`¿Desactivar a ${e.nombre}? No podrá entrar, pero su historial se conserva.`)) return
  await api.patch(`/admin/jornada/empleados/${e.tutorId}`, { activo: String(!e.activo) })
  cargarEmpleados()
}

onMounted(() => {
  cargarEmpleados()
  aplicarPreset('semana')
})
</script>
