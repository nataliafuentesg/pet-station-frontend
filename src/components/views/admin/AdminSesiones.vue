<template>
  <div class="space-y-6">

    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-[1000] uppercase italic dark:text-white">Sesiones abiertas</h2>
        <p class="text-[10px] text-slate-500 dark:text-white/30 uppercase tracking-widest">Quién del equipo tiene sesión, desde dónde y cuándo la usó por última vez</p>
      </div>
      <button @click="cargar"
        class="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#152C77] dark:text-blue-300 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
        ↻ Actualizar
      </button>
    </div>

    <div class="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl px-5 py-4 text-[11px] font-bold text-[#152C77] dark:text-blue-200 space-y-1">
      <p>Las sesiones del panel se cierran tras 12 horas sin usarlo (y como máximo a los 30 días). Las de Mi Jornada y la clínica duran 30 días.</p>
      <p>Las sesiones abiertas antes de esta actualización no salen en la lista. Para sacar a alguien que entró antes, usa «Cerrar todas» en su nombre.</p>
    </div>

    <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-x-auto">
      <div v-if="loading" class="py-20 text-center">
        <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
      <div v-else-if="error" class="py-16 text-center text-red-500 text-[12px] font-bold">{{ error }}</div>
      <div v-else-if="!activas.length" class="py-16 text-center text-slate-400 dark:text-white/30 text-[11px] uppercase tracking-widest">
        No hay sesiones registradas todavía
      </div>
      <table v-else class="w-full text-left min-w-[720px]">
        <thead class="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
          <tr>
            <th v-for="h in ['Persona', 'Equipo', 'IP', 'Entró', 'Último uso', '']" :key="h"
              class="px-5 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest dark:text-white">{{ h }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-white/5">
          <tr v-for="s in activas" :key="s.id">
            <td class="px-5 py-3">
              <p class="font-[1000] uppercase italic text-[12px] dark:text-white">{{ s.nombre }}</p>
              <p class="text-[9px] font-black uppercase text-slate-400 dark:text-white/40">{{ rolNombre(s.rol) }}</p>
              <span v-if="s.actual" class="inline-block mt-1 text-[8px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400 font-black uppercase">Esta sesión</span>
            </td>
            <td class="px-5 py-3 text-[11px] font-bold text-slate-600 dark:text-slate-300">{{ s.equipo }}</td>
            <td class="px-5 py-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">{{ s.ip || '—' }}</td>
            <td class="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ fecha(s.creada) }}</td>
            <td class="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ hace(s.ultimaActividad) }}</td>
            <td class="px-5 py-3 text-right whitespace-nowrap space-x-3">
              <button v-if="!s.actual" @click="cerrar(s)" :disabled="ocupado"
                class="text-[9px] font-black uppercase text-[#DE1F27] hover:underline disabled:opacity-30">Cerrar</button>
              <button @click="cerrarTodas(s)" :disabled="ocupado"
                class="text-[9px] font-black uppercase text-slate-400 hover:text-[#DE1F27] disabled:opacity-30">Cerrar todas</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="recientes.length">
      <button @click="verHistorial = !verHistorial"
        class="text-[10px] font-black uppercase tracking-widest text-[#152C77] dark:text-blue-300">
        {{ verHistorial ? '▾' : '▸' }} Últimos inicios de sesión ({{ recientes.length }})
      </button>
      <div v-if="verHistorial" class="mt-3 bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-x-auto">
        <table class="w-full text-left min-w-[640px]">
          <tbody class="divide-y divide-slate-100 dark:divide-white/5">
            <tr v-for="s in recientes" :key="s.id">
              <td class="px-5 py-2.5 text-[11px] font-black uppercase italic dark:text-white">{{ s.nombre }}</td>
              <td class="px-5 py-2.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">{{ s.equipo }}</td>
              <td class="px-5 py-2.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">{{ s.ip || '—' }}</td>
              <td class="px-5 py-2.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ fecha(s.creada) }}</td>
              <td class="px-5 py-2.5">
                <span class="text-[9px] px-2.5 py-1 rounded-full font-black uppercase" :class="estadoClase[s.estado]">{{ estadoNombre[s.estado] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const activas = ref([])
const recientes = ref([])
const loading = ref(false)
const error = ref('')
const ocupado = ref(false)
const verHistorial = ref(false)

const ROLES = {
  ROLE_ADMIN: 'Administrador', ADMIN: 'Administrador', ROLE_GESTOR: 'Administrador limitado',
  ROLE_VET: 'Veterinario', ROLE_EMPLEADO: 'Colaborador'
}
const rolNombre = (rol) => ROLES[rol] || rol

const estadoNombre = { activa: 'Activa', vencida: 'Vencida', cerrada: 'Cerrada desde el panel', salio: 'Salió' }
const estadoClase = {
  activa: 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400',
  vencida: 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/40',
  cerrada: 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400',
  salio: 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/40'
}

function fecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit' })
}

function hace(iso) {
  if (!iso) return '—'
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (min < 6) return 'Ahora'
  if (min < 60) return `Hace ${min} min`
  if (min < 24 * 60) return `Hace ${Math.round(min / 60)} h`
  return fecha(iso)
}

async function cargar() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/admin/sesiones')
    activas.value = data.activas
    recientes.value = data.recientes
  } catch (e) {
    error.value = e.response?.status === 404 ? 'El servidor todavía no tiene esta función (falta desplegar el backend).' : 'No se pudo cargar'
  } finally {
    loading.value = false
  }
}

async function cerrar(s) {
  if (!confirm(`¿Cerrar la sesión de ${s.nombre} en ${s.equipo}? Tendrá que volver a entrar en ese equipo.`)) return
  ocupado.value = true
  try {
    await api.post(`/admin/sesiones/${s.id}/cerrar`)
    await cargar()
  } catch {
    alert('No se pudo cerrar la sesión')
  } finally {
    ocupado.value = false
  }
}

async function cerrarTodas(s) {
  const aviso = s.actual
    ? 'Esto también cierra TU sesión aquí y tendrás que volver a entrar.'
    : 'Tendrá que volver a entrar en todos sus equipos, también en Mi Jornada.'
  if (!confirm(`¿Cerrar TODAS las sesiones de ${s.nombre}? ${aviso}`)) return
  ocupado.value = true
  try {
    await api.post(`/admin/sesiones/persona/${s.tutorId}/cerrar-todas`)
    await cargar()
  } catch {
    alert('No se pudieron cerrar las sesiones')
  } finally {
    ocupado.value = false
  }
}

onMounted(cargar)
</script>
