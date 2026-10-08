<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const dias = ref(30)
const stats = ref(null)
const viewStats = ref(null)
const loading = ref(true)

const cargar = async () => {
  loading.value = true
  try {
    const [r1, r2] = await Promise.all([
      api.get(`/tracking/wa-stats?dias=${dias.value}`),
      api.get(`/tracking/view-stats?dias=${dias.value}`)
    ])
    stats.value = r1.data
    viewStats.value = r2.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(cargar)

const fuenteEmoji = (f) => {
  const map = { google: '🔍', facebook: '📘', instagram: '📸', tiktok: '🎵', youtube: '▶️', whatsapp: '💬', direct: '🔗' }
  return map[f] || '🌐'
}

const formatFecha = (ts) => new Date(ts).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h2 class="text-lg font-black uppercase italic text-[#152C77] dark:text-white">Clicks a WhatsApp</h2>
        <p class="text-xs text-slate-400">De dónde viene la gente que hace click en WhatsApp</p>
      </div>
      <div class="flex gap-2">
        <button v-for="d in [7, 30, 90]" :key="d" @click="dias = d; cargar()"
          :class="['px-4 py-2 rounded-xl text-[11px] font-black uppercase', dias === d ? 'bg-[#152C77] text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white']">
          {{ d }}d
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-400 text-sm">Cargando...</div>

    <template v-else-if="stats">
      <!-- Totales -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div class="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/10">
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total clicks</p>
          <p class="text-3xl font-[1000] text-[#152C77] dark:text-white">{{ stats.total }}</p>
        </div>
        <div v-for="f in stats.porFuente.slice(0, 2)" :key="f.fuente"
          class="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/10">
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{{ fuenteEmoji(f.fuente) }} {{ f.fuente }}</p>
          <p class="text-3xl font-[1000] text-[#152C77] dark:text-white">{{ f.clicks }}</p>
        </div>
      </div>

      <!-- Top productos y servicios -->
      <div v-if="viewStats" class="grid md:grid-cols-2 gap-4">
        <div class="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-200 dark:border-white/10">
          <h3 class="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">🛍️ Productos más vistos</h3>
          <div class="space-y-2">
            <div v-for="p in viewStats.topProductos" :key="p.slug" class="flex justify-between items-center">
              <span class="text-sm font-medium text-slate-600 dark:text-slate-300 truncate max-w-[75%]">{{ p.nombre }}</span>
              <span class="text-sm font-black text-[#152C77] dark:text-white">{{ p.vistas }}</span>
            </div>
            <p v-if="!viewStats.topProductos.length" class="text-slate-400 text-sm">Sin datos aún</p>
          </div>
        </div>
        <div class="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-200 dark:border-white/10">
          <h3 class="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">🏥 Servicios más vistos</h3>
          <div class="space-y-2">
            <div v-for="s in viewStats.topServicios" :key="s.slug" class="flex justify-between items-center">
              <span class="text-sm font-medium text-slate-600 dark:text-slate-300 truncate max-w-[75%]">{{ s.nombre }}</span>
              <span class="text-sm font-black text-[#152C77] dark:text-white">{{ s.vistas }}</span>
            </div>
            <p v-if="!viewStats.topServicios.length" class="text-slate-400 text-sm">Sin datos aún</p>
          </div>
        </div>
      </div>

      <!-- Por fuente -->
      <div class="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-200 dark:border-white/10">
        <h3 class="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">Por fuente</h3>
        <div class="space-y-3">
          <div v-for="f in stats.porFuente" :key="f.fuente" class="flex items-center gap-3">
            <span class="text-lg w-6">{{ fuenteEmoji(f.fuente) }}</span>
            <span class="text-sm font-bold text-slate-700 dark:text-white w-28 truncate capitalize">{{ f.fuente }}</span>
            <div class="flex-1 bg-slate-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
              <div class="bg-[#152C77] dark:bg-blue-400 h-2 rounded-full"
                :style="{ width: (f.clicks / stats.porFuente[0].clicks * 100) + '%' }"></div>
            </div>
            <span class="text-sm font-black text-[#152C77] dark:text-white w-8 text-right">{{ f.clicks }}</span>
          </div>
          <p v-if="!stats.porFuente.length" class="text-slate-400 text-sm">Sin datos aún</p>
        </div>
      </div>

      <!-- Por página -->
      <div class="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-200 dark:border-white/10">
        <h3 class="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">Por página</h3>
        <div class="space-y-2">
          <div v-for="p in stats.porPagina" :key="p.pagina" class="flex justify-between items-center">
            <span class="text-sm font-medium text-slate-600 dark:text-slate-300 truncate max-w-[70%]">{{ p.pagina }}</span>
            <span class="text-sm font-black text-[#152C77] dark:text-white">{{ p.clicks }}</span>
          </div>
          <p v-if="!stats.porPagina.length" class="text-slate-400 text-sm">Sin datos aún</p>
        </div>
      </div>

      <!-- Recientes -->
      <div class="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-200 dark:border-white/10">
        <h3 class="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">Últimos 100 clicks</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-[12px]">
            <thead>
              <tr class="text-left text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-200 dark:border-white/10">
                <th class="pb-2">Fecha</th>
                <th class="pb-2">Fuente</th>
                <th class="pb-2">Página</th>
                <th class="pb-2">Referrer</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in stats.recientes" :key="r.id"
                class="border-b border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-300">
                <td class="py-2 pr-4 whitespace-nowrap">{{ formatFecha(r.timestamp) }}</td>
                <td class="py-2 pr-4">{{ fuenteEmoji(r.fuente) }} {{ r.fuente }}</td>
                <td class="py-2 pr-4 max-w-[150px] truncate">{{ r.pagina }}</td>
                <td class="py-2 max-w-[200px] truncate text-slate-400">{{ r.referrer || '—' }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="!stats.recientes.length" class="text-slate-400 text-sm mt-2">Sin datos aún</p>
        </div>
      </div>
    </template>
  </div>
</template>
