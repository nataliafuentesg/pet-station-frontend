<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios'

const formularios = ref([])
const cargando = ref(true)
const filtroTipo = ref('')
const busqueda = ref('')
const seleccionado = ref(null)

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

          <button @click.stop="descargarPdf(f.id, f.cedula, f.tipo)"
            class="w-full py-2 bg-[#152C77] text-white font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-[#DE1F27] transition-colors">
            ⬇ Descargar PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
