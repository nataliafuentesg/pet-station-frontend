<template>
  <div class="min-h-screen bg-[#050505] px-4 pb-16 pt-8 text-white" style="padding-top: max(2rem, env(safe-area-inset-top))">

    <!-- Login -->
    <div v-if="!logueado" class="flex flex-col items-center justify-center min-h-[80vh]">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <p class="text-4xl mb-3">⏱️</p>
          <h1 class="text-2xl font-[1000] uppercase italic">Mi <span class="text-[#DE1F27]">Jornada</span></h1>
          <p class="text-[10px] font-black uppercase text-white/30 tracking-widest mt-2">Pet Station · Equipo</p>
        </div>
        <form @submit.prevent="login" class="bg-white/5 rounded-[2rem] p-7 border border-white/10 space-y-4">
          <div class="space-y-1">
            <label class="text-[9px] font-black uppercase text-white/40 tracking-widest ml-2">Usuario</label>
            <input v-model="usuario" autocapitalize="none" autocomplete="username"
              class="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-base font-bold outline-none focus:border-[#DE1F27]" />
          </div>
          <div class="space-y-1">
            <label class="text-[9px] font-black uppercase text-white/40 tracking-widest ml-2">Contraseña</label>
            <input v-model="password" type="password" autocomplete="current-password"
              class="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-base font-bold outline-none focus:border-[#DE1F27]" />
          </div>
          <p v-if="error" class="text-[11px] text-[#DE1F27] font-bold text-center">{{ error }}</p>
          <button type="submit" :disabled="!usuario || !password || cargando"
            class="w-full bg-[#DE1F27] py-5 rounded-2xl font-[1000] uppercase tracking-widest text-[11px] active:scale-95 transition-all disabled:opacity-40">
            {{ cargando ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </div>
    </div>

    <div v-else class="w-full max-w-md mx-auto space-y-5">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-[1000] uppercase italic">Hola, <span class="text-[#DE1F27]">{{ estado?.nombre || '' }}</span></h1>
          <p class="text-[9px] font-black uppercase text-white/30 tracking-widest">{{ fechaHoy }}</p>
        </div>
        <button @click="logout" class="text-[9px] font-black uppercase text-white/30 hover:text-[#DE1F27]">Salir</button>
      </div>

      <!-- Avisos -->
      <div v-if="iosSinInstalar" class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-[12px] leading-relaxed text-amber-200">
        <p class="font-black uppercase text-[10px] tracking-widest mb-1">Para recibir los avisos</p>
        Toca <b>Compartir</b> <span class="inline-block">⬆️</span> en Safari → <b>Agregar a inicio</b>, y abre "Mi Jornada" desde el ícono.
      </div>
      <button v-else-if="puedePedirPermiso && permiso !== 'granted'" @click="activarAvisos"
        class="w-full bg-blue-500/15 border border-blue-500/30 rounded-2xl p-4 text-left">
        <p class="font-black uppercase text-[10px] tracking-widest text-blue-300">🔔 Activar avisos</p>
        <p class="text-[12px] text-blue-200/70 mt-1">
          {{ permiso === 'denied' ? 'Los avisos están bloqueados. Actívalos en los ajustes del navegador.' : 'Te avisaremos cada 15 minutos para preguntarte si ya terminaste.' }}
        </p>
      </button>
      <p v-else-if="permiso === 'granted'" class="text-[10px] font-black uppercase tracking-widest text-green-400/70 text-center">🔔 Avisos activados</p>

      <div v-if="!estado" class="py-20 text-center">
        <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>

      <!-- Sin jornada -->
      <div v-else-if="!sesion" class="bg-white/5 rounded-[2rem] p-8 border border-white/10 text-center space-y-5">
        <p class="text-5xl">☀️</p>
        <p class="text-sm text-white/60">Cuando llegues, inicia tu jornada.</p>
        <button @click="accion('/jornada/iniciar')" :disabled="enviando"
          class="w-full bg-[#DE1F27] py-5 rounded-2xl font-[1000] uppercase tracking-widest text-[12px] active:scale-95 transition-all disabled:opacity-40">
          Iniciar jornada
        </button>
      </div>

      <template v-else>
        <!-- Resumen del día -->
        <div class="grid grid-cols-3 gap-2">
          <div class="bg-white/5 rounded-2xl p-3 text-center border border-white/10">
            <p class="text-lg font-[1000] tabular-nums">{{ dur(segJornada) }}</p>
            <p class="text-[8px] font-black uppercase text-white/30 tracking-widest mt-1">En jornada</p>
          </div>
          <div class="bg-green-500/10 rounded-2xl p-3 text-center border border-green-500/20">
            <p class="text-lg font-[1000] text-green-400 tabular-nums">{{ dur(segTareas) }}</p>
            <p class="text-[8px] font-black uppercase text-green-400/60 tracking-widest mt-1">En tareas</p>
          </div>
          <div class="bg-white/5 rounded-2xl p-3 text-center border border-white/10">
            <p class="text-lg font-[1000] tabular-nums">{{ tareasTerminadas }}</p>
            <p class="text-[8px] font-black uppercase text-white/30 tracking-widest mt-1">Terminadas</p>
          </div>
        </div>

        <!-- Almuerzo -->
        <div v-if="sesion.estado === 'ALMUERZO'" class="bg-amber-500/10 rounded-[2rem] p-7 border border-amber-500/30 text-center space-y-4">
          <p class="text-5xl">🍽️</p>
          <p class="text-[10px] font-black uppercase tracking-widest text-amber-300">En almuerzo</p>
          <p class="text-4xl font-[1000] tabular-nums">{{ reloj(segPausa) }}</p>
          <p v-if="tareaActual" class="text-[12px] text-white/50">Pausada: <b class="text-white/80">{{ tareaActual.descripcion }}</b></p>
          <button @click="accion('/jornada/almuerzo/volver')" :disabled="enviando"
            class="w-full bg-amber-500 text-black py-5 rounded-2xl font-[1000] uppercase tracking-widest text-[12px] active:scale-95 transition-all disabled:opacity-40">
            Ya volví
          </button>
        </div>

        <!-- Tarea en curso -->
        <div v-else-if="tareaActual" class="bg-green-500/10 rounded-[2rem] p-6 border border-green-500/30 space-y-4">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <p class="text-[10px] font-black uppercase tracking-widest text-green-300">Haciendo ahora</p>
          </div>
          <p class="text-xl font-[1000] leading-tight break-words">{{ tareaActual.descripcion }}</p>
          <p class="text-5xl font-[1000] tabular-nums text-center py-2">{{ reloj(segTareaActual) }}</p>
          <button @click="pedirNota('terminar')" :disabled="enviando"
            class="w-full bg-green-500 text-black py-5 rounded-2xl font-[1000] uppercase tracking-widest text-[12px] active:scale-95 transition-all disabled:opacity-40">
            ✅ Ya terminé
          </button>
          <p class="text-[10px] text-white/30 text-center">Te preguntaremos de nuevo en {{ Math.ceil(segParaCheck / 60) }} min</p>
        </div>

        <!-- Nueva tarea -->
        <div v-if="sesion.estado === 'ACTIVA'" class="bg-white/5 rounded-[2rem] p-6 border border-white/10 space-y-4">
          <p class="text-[10px] font-black uppercase tracking-widest text-white/40">
            {{ tareaActual ? '¿Cambias de tarea?' : '¿Qué vas a hacer ahora?' }}
          </p>
          <textarea v-model="nuevaTarea" rows="2" maxlength="300" placeholder="Ej: Bañar a Toby, limpiar caniles, paseo grupo 2..."
            class="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold outline-none focus:border-[#DE1F27] resize-none placeholder:text-white/20"></textarea>
          <div v-if="sugerenciasFiltradas.length" class="flex flex-wrap gap-2">
            <button v-for="s in sugerenciasFiltradas" :key="s" @click="nuevaTarea = s"
              class="text-[11px] font-bold bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-white/70 active:bg-white/20">
              {{ s }}
            </button>
          </div>
          <button @click="iniciarTarea" :disabled="!nuevaTarea.trim() || enviando"
            class="w-full bg-[#DE1F27] py-5 rounded-2xl font-[1000] uppercase tracking-widest text-[12px] active:scale-95 transition-all disabled:opacity-40">
            {{ tareaActual ? 'Terminar actual e iniciar esta' : 'Iniciar tarea' }}
          </button>
        </div>

        <!-- Guardería: entrada y salida de perros -->
        <div v-if="guarderia" class="bg-white/5 rounded-[2rem] p-6 border border-white/10 space-y-4">
          <div class="flex items-center justify-between gap-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-white/40">🐕 Perros adentro · {{ guarderia.adentro.length }}</p>
            <button v-if="sesion.estado === 'ACTIVA'" @click="abrirRecepcion" :disabled="enviando"
              class="bg-blue-500 text-white px-4 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-40">
              ➕ Recibir perro
            </button>
          </div>
          <p v-if="!guarderia.adentro.length" class="text-[12px] text-white/30">No hay perros registrados adentro.</p>
          <div v-for="p in guarderia.adentro" :key="p.id" class="flex items-center justify-between gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
            <div class="min-w-0">
              <p class="text-[14px] font-bold truncate">
                {{ p.perro }}
                <span class="ml-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full align-middle"
                  :class="p.tipo === 'HOTEL' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'">
                  {{ p.tipo === 'HOTEL' ? 'Hotel' : 'Día' }}
                </span>
              </p>
              <p class="text-[10px] text-white/30">Entró {{ desde(p.entrada) }}<span v-if="p.recibidoPor"> · {{ p.recibidoPor }}</span></p>
            </div>
            <button @click="entregar(p)" :disabled="enviando"
              class="shrink-0 bg-white/10 px-3 py-2 rounded-xl font-black uppercase tracking-widest text-[9px] active:scale-95 disabled:opacity-40">
              Entregado
            </button>
          </div>
        </div>

        <p v-if="error" class="text-[11px] text-[#DE1F27] font-bold text-center">{{ error }}</p>

        <!-- Acciones de jornada -->
        <div v-if="sesion.estado === 'ACTIVA'" class="grid grid-cols-2 gap-3">
          <button @click="salirAlmuerzo" :disabled="enviando"
            class="bg-amber-500/15 border border-amber-500/30 text-amber-300 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-40">
            🍽️ Salgo a almorzar
          </button>
          <button @click="cerrarJornada" :disabled="enviando"
            class="bg-white/5 border border-white/10 text-white/60 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-40">
            🏁 Terminar jornada
          </button>
        </div>

        <!-- Tareas de hoy -->
        <div v-if="tareasHoy.length" class="space-y-2">
          <p class="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Hoy</p>
          <div v-for="t in tareasHoy" :key="t.id" class="flex items-center justify-between gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
            <div class="min-w-0">
              <p class="text-[13px] font-bold truncate">{{ t.descripcion }}</p>
              <p class="text-[10px] text-white/30">{{ hora(t.inicio) }}<span v-if="t.fin"> – {{ hora(t.fin) }}</span></p>
              <p v-if="t.nota" class="text-[10px] text-amber-300/80 truncate">⚠️ {{ t.nota }}</p>
            </div>
            <span class="text-[12px] font-black tabular-nums shrink-0" :class="t.estado === 'TERMINADA' ? 'text-white/60' : 'text-green-400'">
              {{ dur(t.estado === 'EN_CURSO' ? segTareaActual : t.segundos) }}
            </span>
          </div>
        </div>
      </template>
    </div>

    <!-- Recibir un perro -->
    <Teleport to="body">
      <div v-if="recepcion" class="fixed inset-0 z-[9001] flex items-end sm:items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="recepcion = null"></div>
        <div class="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-[2rem] p-6 space-y-4 text-white">
          <p class="text-lg font-[1000] leading-tight">🐕 ¿Qué perro llegó?</p>
          <input v-model="recepcion.perro" maxlength="100" placeholder="Nombre del perro" autocapitalize="words"
            class="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold outline-none focus:border-blue-500 placeholder:text-white/20" />
          <div v-if="perrosSugeridos.length" class="flex flex-wrap gap-2">
            <button v-for="n in perrosSugeridos" :key="n" @click="recepcion.perro = n"
              class="text-[11px] font-bold bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-white/70 active:bg-white/20">
              {{ n }}
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="t in [['DIA', '☀️ Guardería día'], ['HOTEL', '🌙 Hotel']]" :key="t[0]" @click="recepcion.tipo = t[0]"
              class="py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-colors"
              :class="recepcion.tipo === t[0] ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/60'">
              {{ t[1] }}
            </button>
          </div>
          <p v-if="tareaActual" class="text-[11px] text-white/40">Se cerrará "{{ tareaActual.descripcion }}" y empieza la recepción.</p>
          <div class="grid grid-cols-2 gap-3">
            <button @click="recepcion = null" class="bg-white/10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Cancelar</button>
            <button @click="confirmarRecepcion" :disabled="!recepcion.perro.trim() || enviando"
              class="bg-blue-500 py-4 rounded-2xl font-[1000] uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-40">
              Empezar recepción
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Nota de imprevistos al cerrar una tarea -->
    <Teleport to="body">
      <div v-if="cierre && tareaActual" class="fixed inset-0 z-[9001] flex items-end sm:items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="cierre = null"></div>
        <div class="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-[2rem] p-6 space-y-4 text-white">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-white/40">Cerrando: {{ tareaActual.descripcion }} · {{ dur(segTareaActual) }}</p>
            <p v-if="tareaActual.recepcion" class="text-lg font-[1000] leading-tight mt-1">¿Qué le hiciste a {{ tareaActual.recepcion }}?</p>
          </div>
          <div v-if="tareaActual.recepcion" class="space-y-2">
            <button v-for="c in CHECKLIST" :key="c.id" @click="cierre.checklist[c.id] = !cierre.checklist[c.id]"
              class="w-full flex items-center gap-3 rounded-2xl px-4 py-3 border text-left text-[13px] font-bold transition-colors"
              :class="cierre.checklist[c.id] ? 'bg-green-500/15 border-green-500/40 text-green-200' : 'bg-white/5 border-white/10 text-white/60'">
              <span class="w-5 h-5 rounded-md border flex items-center justify-center text-[12px]"
                :class="cierre.checklist[c.id] ? 'bg-green-500 border-green-500 text-black' : 'border-white/30'">{{ cierre.checklist[c.id] ? '✓' : '' }}</span>
              {{ c.label }}
            </button>
          </div>
          <p class="text-lg font-[1000] leading-tight" :class="tareaActual.recepcion ? 'text-base' : ''">¿Pasó algo que te retrasó?</p>
          <div class="flex flex-wrap gap-2">
            <button v-for="imp in IMPREVISTOS" :key="imp" @click="agregarImprevisto(imp)"
              class="text-[11px] font-bold rounded-full px-3 py-1.5 border transition-colors"
              :class="cierre.nota.includes(imp) ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 border-white/10 text-white/70'">
              {{ imp }}
            </button>
          </div>
          <textarea v-model="cierre.nota" rows="2" maxlength="500" placeholder="Cuéntanos qué pasó (opcional)"
            class="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold outline-none focus:border-amber-500 resize-none placeholder:text-white/20"></textarea>
          <div class="grid grid-cols-2 gap-3">
            <button @click="confirmarCierre('')" :disabled="enviando"
              class="bg-white/10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-40">
              No, todo normal
            </button>
            <button @click="confirmarCierre(cierre.nota)" :disabled="!cierre.nota.trim() || enviando"
              class="bg-amber-500 text-black py-4 rounded-2xl font-[1000] uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-40">
              Guardar nota
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Pregunta de los 15 minutos -->
    <Teleport to="body">
      <div v-if="mostrarCheck && tareaActual" class="fixed inset-0 z-[9000] flex items-end sm:items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-[2rem] p-7 space-y-5 text-white">
          <p class="text-4xl text-center">⏰</p>
          <p class="text-center text-[11px] font-black uppercase tracking-widest text-white/40">¿Ya terminaste?</p>
          <p class="text-center text-lg font-[1000] leading-tight break-words">{{ tareaActual.descripcion }}</p>
          <p class="text-center text-[12px] text-white/40">Llevas {{ dur(segTareaActual) }}</p>
          <div class="grid grid-cols-2 gap-3">
            <button @click="responderCheck(false)" :disabled="enviando"
              class="bg-white/10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] active:scale-95 disabled:opacity-40">
              Todavía no
            </button>
            <button @click="responderCheck(true)" :disabled="enviando"
              class="bg-green-500 text-black py-4 rounded-2xl font-[1000] uppercase tracking-widest text-[11px] active:scale-95 disabled:opacity-40">
              Sí, terminé
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '@/api/axios'
import { messaging, onMessage } from '@/firebase'
import { obtenerTokenPush } from '@/composables/usePushNotifications'

const ROLES_PERMITIDOS = ['ROLE_EMPLEADO', 'ROLE_VET', 'ROLE_ADMIN', 'ADMIN']

const usuario = ref('')
const password = ref('')
const cargando = ref(false)
const enviando = ref(false)
const error = ref('')
const logueado = ref(false)

const estado = ref(null)
const nuevaTarea = ref('')
const mostrarCheck = ref(false)
const cierre = ref(null)

const recepcion = ref(null)
const CHECKLIST = [
  { id: 'comidaMarcada', label: 'Recibí y marqué la comida' },
  { id: 'revisado', label: 'Revisé al perro' },
  { id: 'unasCortadas', label: 'Le corté las uñas' },
]

const IMPREVISTOS = [
  'Me llamaron a ayudar en hospital',
  'Me llamaron a limpiar algo',
  'Recibí un perrito que llegaba',
  'Entregué un perrito',
  'Atendí a un cliente',
]

// Los segundos vienen del servidor; localmente solo sumamos lo que pasó desde la última respuesta
const recibidoEn = ref(0)
const ahora = ref(Date.now())
let ticker = null
let quitarOnMessage = null

const permiso = ref(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported')
const esIos = /iPad|iPhone|iPod/.test(navigator.userAgent)
const instalada = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
const iosSinInstalar = esIos && !instalada
const puedePedirPermiso = typeof Notification !== 'undefined' && 'serviceWorker' in navigator

const sesion = computed(() => estado.value?.sesion || null)
const guarderia = computed(() => estado.value?.guarderia || null)
const perrosSugeridos = computed(() => {
  const adentro = new Set((guarderia.value?.adentro || []).map(p => p.perro.toLowerCase()))
  const q = recepcion.value?.perro.trim().toLowerCase() || ''
  return (guarderia.value?.sugerencias || [])
    .filter(n => !adentro.has(n.toLowerCase()) && (!q || (n.toLowerCase().includes(q) && n.toLowerCase() !== q)))
    .slice(0, 10)
})
const tareaActual = computed(() => estado.value?.tareaActual || null)
const tareasHoy = computed(() => [...(estado.value?.tareas || [])].reverse())
const tareasTerminadas = computed(() => (estado.value?.tareas || []).filter(t => t.estado === 'TERMINADA').length)
const transcurrido = computed(() => Math.max(0, Math.floor((ahora.value - recibidoEn.value) / 1000)))
const corriendo = computed(() => tareaActual.value?.estado === 'EN_CURSO')

const segJornada = computed(() => {
  if (!sesion.value) return 0
  const pausa = sesion.value.segundosEnPausa != null ? sesion.value.segundosEnPausa + transcurrido.value : 0
  return sesion.value.segundosDesdeInicio + transcurrido.value - pausa - (sesion.value.segundosPausasCerradas || 0)
})
const segTareas = computed(() => (sesion.value?.segundosEnTareas || 0) + (corriendo.value ? transcurrido.value : 0))
const segPausa = computed(() => (sesion.value?.segundosEnPausa || 0) + transcurrido.value)
const segTareaActual = computed(() => (tareaActual.value?.segundos || 0) + (corriendo.value ? transcurrido.value : 0))
const segParaCheck = computed(() => Math.max(0, (tareaActual.value?.segundosParaCheck ?? 0) - transcurrido.value))

const sugerenciasFiltradas = computed(() => {
  const q = nuevaTarea.value.trim().toLowerCase()
  const lista = (estado.value?.sugerencias || []).filter(s => s !== tareaActual.value?.descripcion)
  return (q ? lista.filter(s => s.toLowerCase().includes(q) && s.toLowerCase() !== q) : lista).slice(0, 8)
})

const fechaHoy = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })

function dur(seg) {
  const h = Math.floor(seg / 3600)
  const m = Math.floor((seg % 3600) / 60)
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`
}
function reloj(seg) {
  const h = Math.floor(seg / 3600)
  const m = Math.floor((seg % 3600) / 60)
  const s = seg % 60
  return (h > 0 ? `${h}:` : '') + `${String(m).padStart(h > 0 ? 2 : 1, '0')}:${String(s).padStart(2, '0')}`
}
function desde(iso) {
  const d = new Date(iso)
  const dias = Math.floor((Date.now() - d) / 86400000)
  if (dias >= 1) return `hace ${dias} día${dias > 1 ? 's' : ''}`
  return 'a las ' + hora(iso)
}
function hora(iso) {
  return iso ? new Date(iso).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' }) : ''
}

function aplicarEstado(data) {
  estado.value = data
  recibidoEn.value = Date.now()
  ahora.value = Date.now()
  if (data?.tareaActual?.checkPendiente) abrirCheck()
}

async function cargar() {
  try {
    const { data } = await api.get('/jornada/estado')
    aplicarEstado(data)
  } catch (e) {
    error.value = e.response?.data?.message || 'No se pudo cargar tu jornada'
  }
}

async function accion(url, body) {
  enviando.value = true
  error.value = ''
  try {
    const { data } = await api.post(url, body)
    aplicarEstado(data)
    return true
  } catch (e) {
    error.value = e.response?.data?.message || 'Algo falló, intenta de nuevo'
    return false
  } finally {
    enviando.value = false
  }
}

function iniciarTarea() {
  if (tareaActual.value) return pedirNota('cambiar')
  crearTarea()
}

async function crearTarea(notaAnterior, checklist) {
  const ok = await accion('/jornada/tarea', { descripcion: nuevaTarea.value, notaAnterior, checklist })
  if (ok) nuevaTarea.value = ''
  return ok
}

function pedirNota(tipo) {
  cierre.value = { tipo, nota: '', checklist: { comidaMarcada: false, revisado: false, unasCortadas: false } }
}

function abrirRecepcion() {
  recepcion.value = { perro: '', tipo: 'DIA' }
}

// Si hay una tarea en curso, primero se cierra con su nota (y checklist si era otra recepción)
function confirmarRecepcion() {
  if (tareaActual.value) {
    pedirNota('recibir')
    return
  }
  recibirPerro()
}

async function recibirPerro(extra = {}) {
  const { perro, tipo } = recepcion.value
  const ok = await accion('/jornada/guarderia/recibir', { perro, tipo, ...extra })
  if (ok) recepcion.value = null
  return ok
}

function entregar(p) {
  if (confirm(`¿Entregaste a ${p.perro}?`)) accion(`/jornada/guarderia/${p.id}/entregar`)
}

function agregarImprevisto(imp) {
  const n = cierre.value.nota.trim()
  if (n.includes(imp)) return
  cierre.value.nota = n ? `${n}. ${imp}` : imp
}

async function confirmarCierre(nota) {
  const { tipo } = cierre.value
  const checklist = tareaActual.value?.recepcion ? cierre.value.checklist : undefined
  let ok
  if (tipo === 'cambiar') ok = await crearTarea(nota, checklist)
  else if (tipo === 'recibir') ok = await recibirPerro({ notaAnterior: nota, checklist })
  else ok = await accion('/jornada/tarea/terminar', { nota, checklist })
  if (ok) cierre.value = null
}

function salirAlmuerzo() {
  if (confirm('¿Sales a almorzar? Tu tarea actual queda en pausa.')) accion('/jornada/almuerzo/salir')
}

function cerrarJornada() {
  if (confirm('¿Terminar tu jornada de hoy?')) accion('/jornada/cerrar')
}

async function responderCheck(termino) {
  if (termino) {
    cerrarCheck()
    return pedirNota('terminar')
  }
  if (await accion('/jornada/tarea/seguir')) cerrarCheck()
}

function abrirCheck() {
  if (mostrarCheck.value || cierre.value) return
  mostrarCheck.value = true
  sonarAlarma()
  alarma = setInterval(sonarAlarma, 4000)
}

function cerrarCheck() {
  mostrarCheck.value = false
  clearInterval(alarma)
  alarma = null
}

// iOS/Android solo permiten audio si el contexto se creó o reanudó tras un toque del usuario
let audioCtx = null
let alarma = null
function desbloquearAudio() {
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)()
    if (audioCtx.state === 'suspended') audioCtx.resume()
  } catch { /* sin audio */ }
}

function sonarAlarma() {
  navigator.vibrate?.([500, 200, 500, 200, 500])
  if (!audioCtx) return
  const t0 = audioCtx.currentTime
  for (let i = 0; i < 3; i++) {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'square'
    osc.frequency.value = i % 2 ? 1320 : 990
    gain.gain.value = 1
    osc.connect(gain).connect(audioCtx.destination)
    osc.start(t0 + i * 0.35)
    osc.stop(t0 + i * 0.35 + 0.25)
  }
}

function tick() {
  ahora.value = Date.now()
  if (corriendo.value && tareaActual.value.segundosParaCheck != null && segParaCheck.value === 0) {
    // El servidor marca el check al mismo tiempo; recargar trae checkPendiente=true y abre el modal
    abrirCheck()
  }
}

async function registrarPush() {
  try {
    const token = await obtenerTokenPush()
    if (!token) return 'Firebase no entregó token'
    await api.post('/jornada/push-token', { token })
    return null
  } catch (e) {
    return e?.message || String(e)
  }
}

async function activarAvisos() {
  const p = await Notification.requestPermission()
  permiso.value = p
  if (p === 'granted') registrarPush()
}

async function login() {
  cargando.value = true
  error.value = ''
  try {
    const { data } = await api.post('/tutores/login', { email: usuario.value.trim(), password: password.value })
    if (!ROLES_PERMITIDOS.includes(data.tutor?.rol)) {
      error.value = 'Esta cuenta no tiene acceso al control de jornada'
      return
    }
    localStorage.setItem('ps_token', data.token)
    localStorage.setItem('ps_session', JSON.stringify({ tutor: { nombre: data.tutor.nombre, email: data.tutor.email, rol: data.tutor.rol } }))
    password.value = ''
    entrar()
  } catch (e) {
    error.value = e.response?.status === 404 || e.response?.status === 401 ? 'Usuario o contraseña incorrectos' : 'No se pudo entrar, intenta de nuevo'
  } finally {
    cargando.value = false
  }
}

function entrar() {
  logueado.value = true
  cargar()
  if (permiso.value === 'granted') registrarPush()
}

function logout() {
  localStorage.removeItem('ps_token')
  localStorage.removeItem('ps_session')
  logueado.value = false
  estado.value = null
}

function alVolverAPantalla() {
  if (document.visibilityState === 'visible' && logueado.value) cargar()
}

function instalarManifest() {
  const agregados = []
  const add = (tag, attrs) => {
    const el = document.createElement(tag)
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
    document.head.appendChild(el)
    agregados.push(el)
  }
  add('link', { rel: 'manifest', href: '/equipo.webmanifest' })
  add('link', { rel: 'apple-touch-icon', href: '/images/logo-pet-station.png' })
  add('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' })
  add('meta', { name: 'apple-mobile-web-app-title', content: 'Mi Jornada' })
  add('meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' })
  return () => agregados.forEach(el => el.remove())
}

let quitarManifest = null

onMounted(() => {
  quitarManifest = instalarManifest()
  const session = JSON.parse(localStorage.getItem('ps_session') || 'null')
  if (localStorage.getItem('ps_token') && ROLES_PERMITIDOS.includes(session?.tutor?.rol)) entrar()
  ticker = setInterval(tick, 1000)
  document.addEventListener('pointerdown', desbloquearAudio)
  document.addEventListener('visibilitychange', alVolverAPantalla)
  try {
    quitarOnMessage = onMessage(messaging, (payload) => {
      if (payload.data?.tag === 'jornada') cargar()
    })
  } catch { /* navegador sin soporte de push */ }
})

onUnmounted(() => {
  clearInterval(ticker)
  clearInterval(alarma)
  document.removeEventListener('pointerdown', desbloquearAudio)
  document.removeEventListener('visibilitychange', alVolverAPantalla)
  quitarOnMessage?.()
  quitarManifest?.()
})
</script>
