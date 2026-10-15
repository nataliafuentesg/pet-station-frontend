<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import api from '@/api/axios'

const formularios = ref([])
const cargando = ref(true)
const filtroTipo = ref('')
const busqueda = ref('')
const seleccionado = ref(null)
const modalRevision = ref(null)
const enviandoRevision = ref(false)
const revision = reactive({
  ojos: 'Normal', orejas: 'Normal', boca: 'Normal',
  piel: 'Normal', pulpejos: 'Normal', zonaPerianal: 'Normal',
  pesoKg: '', observacionesIngreso: ''
})
const empleadoRevision = ref('')

onMounted(cargar)

async function cargar() {
  cargando.value = true
  try {
    const params = filtroTipo.value ? { tipo: filtroTipo.value } : {}
    const { data } = await api.get('/admin/formularios', { params })
    formularios.value = data
  } finally {
    cargando.value = false
  }
}

const lista = computed(() => {
  const q = busqueda.value.toLowerCase()
  if (!q) return formularios.value
  return formularios.value.filter(f =>
    f.nombreCliente?.toLowerCase().includes(q) ||
    f.cedula?.includes(q) ||
    f.nombreMascota?.toLowerCase().includes(q)
  )
})

async function descargarPdf(id, cedula, tipo) {
  try {
    const resp = await api.get(`/admin/formularios/${id}/pdf`, { responseType: 'blob' })
    const url = URL.createObjectURL(resp.data)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tipo.toLowerCase()}_${cedula}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    alert('Error descargando PDF')
  }
}

function copiarLink(tipo) {
  const base = window.location.origin
  const path = tipo === 'PELUQUERIA' ? '/formularios/peluqueria' : '/formularios/guarderia'
  navigator.clipboard?.writeText(base + path)
    .then(() => alert('Link copiado al portapapeles'))
    .catch(() => alert(base + path))
}

function formatFecha(ts) {
  return new Date(ts).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
}

function checklist(f) {
  try { return JSON.parse(f.checklistJson || '{}') } catch { return {} }
}

function abrirRevision(f) {
  modalRevision.value = f
  Object.assign(revision, {
    ojos: 'Normal', orejas: 'Normal', boca: 'Normal',
    piel: 'Normal', pulpejos: 'Normal', zonaPerianal: 'Normal',
    pesoKg: '', observacionesIngreso: ''
  })
  empleadoRevision.value = ''
}

async function guardarRevision() {
  if (!modalRevision.value) return
  enviandoRevision.value = true
  try {
    await api.patch(`/admin/formularios/${modalRevision.value.id}/revision`, {
      revisionJson: JSON.stringify(revision),
      empleado: empleadoRevision.value
    })
    await cargar()
    modalRevision.value = null
  } finally {
    enviandoRevision.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Formularios digitales</p>
        <h1 class="text-2xl font-[1000] uppercase italic text-slate-800 dark:text-white">Formularios</h1>
      </div>
      <div class="flex gap-2">
        <button @click="copiarLink('PELUQUERIA')"
          class="px-4 py-2 text-[9px] font-black uppercase tracking-widest bg-[#152C77]/10 text-[#152C77] dark:text-blue-300 rounded-xl hover:bg-[#152C77]/20 transition-colors">
          📋 Link Peluquería
        </button>
        <button @click="copiarLink('GUARDERIA')"
          class="px-4 py-2 text-[9px] font-black uppercase tracking-widest bg-[#152C77]/10 text-[#152C77] dark:text-blue-300 rounded-xl hover:bg-[#152C77]/20 transition-colors">
          📋 Link Guardería
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="flex flex-col sm:flex-row gap-3">
      <input v-model="busqueda" type="text" placeholder="Buscar por nombre, cédula o mascota..."
        class="flex-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#152C77] dark:text-white" />
      <select v-model="filtroTipo" @change="cargar"
        class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#152C77] dark:text-white">
        <option value="">Todos los tipos</option>
        <option value="PELUQUERIA">Peluquería</option>
        <option value="GUARDERIA">Guardería</option>
      </select>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white dark:bg-white/5 rounded-2xl p-4 text-center border border-slate-100 dark:border-white/10">
        <p class="text-2xl font-[1000]">{{ formularios.length }}</p>
        <p class="text-[9px] font-black uppercase text-slate-400 tracking-widest">Total</p>
      </div>
      <div class="bg-white dark:bg-white/5 rounded-2xl p-4 text-center border border-slate-100 dark:border-white/10">
        <p class="text-2xl font-[1000]">{{ formularios.filter(f => f.tipo === 'PELUQUERIA').length }}</p>
        <p class="text-[9px] font-black uppercase text-slate-400 tracking-widest">Peluquería</p>
      </div>
      <div class="bg-white dark:bg-white/5 rounded-2xl p-4 text-center border border-slate-100 dark:border-white/10">
        <p class="text-2xl font-[1000]">{{ formularios.filter(f => f.tipo === 'GUARDERIA').length }}</p>
        <p class="text-[9px] font-black uppercase text-slate-400 tracking-widest">Guardería</p>
      </div>
    </div>

    <!-- Lista -->
    <div v-if="cargando" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-20 bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse"></div>
    </div>

    <div v-else-if="lista.length === 0" class="text-center py-12 text-slate-400">
      <p class="text-4xl mb-3">📋</p>
      <p class="font-bold text-sm uppercase tracking-widest">Sin formularios</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="f in lista" :key="f.id"
        class="bg-white dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/10 cursor-pointer hover:border-[#152C77]/30 transition-colors"
        @click="seleccionado = seleccionado?.id === f.id ? null : f">

        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <span :class="['text-[8px] font-black uppercase px-2 py-1 rounded-lg whitespace-nowrap',
              f.tipo === 'PELUQUERIA' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300']">
              {{ f.tipo === 'PELUQUERIA' ? '✂️ Pelu' : '🏡 Guard' }}
            </span>
            <div class="min-w-0">
              <p class="font-black text-sm text-slate-800 dark:text-white truncate">{{ f.nombreCliente }}</p>
              <p class="text-[10px] text-slate-400">CC {{ f.cedula }} · 🐾 {{ f.nombreMascota }}</p>
            </div>
          </div>
          <div class="text-right shrink-0">
            <p class="text-[9px] text-slate-400">{{ formatFecha(f.timestamp) }}</p>
            <span v-if="f.otpVerificado" class="text-[8px] text-green-600 font-bold">✓ Verificado</span>
          </div>
        </div>

        <!-- Detalle expandible -->
        <div v-if="seleccionado?.id === f.id" class="mt-4 pt-4 border-t border-slate-100 dark:border-white/10 space-y-3 text-sm">
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div v-if="f.telefono">
              <span class="text-slate-400 font-bold uppercase text-[9px]">Teléfono</span>
              <p>{{ f.telefono }}</p>
            </div>
            <div v-if="f.email">
              <span class="text-slate-400 font-bold uppercase text-[9px]">Email</span>
              <p>{{ f.email }}</p>
            </div>
            <div v-if="f.especie">
              <span class="text-slate-400 font-bold uppercase text-[9px]">Mascota</span>
              <p>{{ f.especie }} · {{ f.raza }} · {{ f.sexo }}</p>
            </div>
            <div v-if="f.servicioSolicitado">
              <span class="text-slate-400 font-bold uppercase text-[9px]">Servicio</span>
              <p>{{ f.servicioSolicitado }}</p>
            </div>
            <div v-if="f.fechaIngreso">
              <span class="text-slate-400 font-bold uppercase text-[9px]">Ingreso</span>
              <p>{{ f.fechaIngreso }}</p>
            </div>
            <div v-if="f.fechaSalida">
              <span class="text-slate-400 font-bold uppercase text-[9px]">Salida</span>
              <p>{{ f.fechaSalida }}</p>
            </div>
          </div>

          <div v-if="f.observaciones" class="text-xs">
            <span class="text-slate-400 font-bold uppercase text-[9px]">Observaciones</span>
            <p class="text-slate-600 dark:text-slate-300">{{ f.observaciones }}</p>
          </div>

          <!-- Firma preview -->
          <div v-if="f.firmaBase64" class="text-xs">
            <span class="text-slate-400 font-bold uppercase text-[9px] block mb-1">Firma</span>
            <img :src="f.firmaBase64" alt="Firma" class="h-16 border border-slate-200 dark:border-white/10 rounded-lg bg-white" />
          </div>

          <div class="flex gap-2">
            <button v-if="!f.revisionCompletada" @click.stop="abrirRevision(f)"
              class="flex-1 py-2 bg-amber-500 text-white font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-amber-600 transition-colors">
              🔍 Completar revisión
            </button>
            <span v-else class="flex-1 py-2 text-center text-[9px] font-black uppercase text-green-600 bg-green-50 rounded-xl">
              ✓ Revisión completada
            </span>
            <button @click.stop="descargarPdf(f.id, f.cedula, f.tipo)"
              class="flex-1 py-2 bg-[#152C77] text-white font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-[#DE1F27] transition-colors">
              ⬇ PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal revisión de ingreso -->
  <Teleport to="body">
    <div v-if="modalRevision" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="modalRevision = null"></div>
      <div class="relative bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div>
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Revisión de ingreso</p>
            <h3 class="font-black text-slate-800 dark:text-white">{{ modalRevision.nombreMascota }}</h3>
            <p class="text-xs text-slate-400">{{ modalRevision.nombreCliente }} · {{ modalRevision.tipo }}</p>
          </div>
          <button @click="modalRevision = null" class="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>

        <div class="p-5 space-y-4">
          <!-- Peso -->
          <div>
            <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Peso (kg)</label>
            <input v-model="revision.pesoKg" type="number" step="0.1" placeholder="Ej: 4.5"
              class="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#152C77]" />
          </div>

          <!-- Estado físico -->
          <div>
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Estado físico al ingreso</p>
            <div class="space-y-2">
              <div v-for="(label, campo) in { ojos: 'Ojos', orejas: 'Orejas', boca: 'Boca', piel: 'Piel', pulpejos: 'Pulpejos', zonaPerianal: 'Zona perianal' }"
                :key="campo" class="flex items-center justify-between gap-3">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-200 w-28 shrink-0">{{ label }}</span>
                <div class="flex gap-2 flex-1">
                  <button v-for="op in ['Normal', 'Anormal']" :key="op"
                    @click="revision[campo] = op"
                    :class="['flex-1 py-1.5 text-[9px] font-black uppercase rounded-xl border transition-colors',
                      revision[campo] === op
                        ? op === 'Normal' ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500'
                        : 'border-slate-200 dark:border-white/10 text-slate-400 hover:border-slate-300']">
                    {{ op }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Observaciones -->
          <div>
            <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Observaciones del ingreso</label>
            <textarea v-model="revision.observacionesIngreso" rows="3" placeholder="Estado general, comportamiento, notas del empleado..."
              class="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#152C77]"></textarea>
          </div>

          <!-- Empleado -->
          <div>
            <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Nombre del empleado que recibe</label>
            <input v-model="empleadoRevision" type="text" placeholder="Tu nombre"
              class="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#152C77]" />
          </div>

          <button @click="guardarRevision" :disabled="enviandoRevision"
            class="w-full py-3.5 bg-[#152C77] text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-[#DE1F27] transition-colors disabled:opacity-50">
            {{ enviandoRevision ? 'Guardando...' : '✓ Guardar revisión y regenerar PDF' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
