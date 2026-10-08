<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import api from '@/api/axios';

const health = ref(null);
const loading = ref(true);
const error = ref(null);
const lastUpdated = ref(null);
const errors = ref([]);
const clearingErrors = ref(false);
let interval = null;

const stateConfig = {
  ok:      { label: 'OK',       bg: 'bg-green-100 dark:bg-green-500/10',  text: 'text-green-700 dark:text-green-400',  dot: 'bg-green-500' },
  warning: { label: 'ALERTA',   bg: 'bg-amber-100 dark:bg-amber-500/10',  text: 'text-amber-700 dark:text-amber-400',  dot: 'bg-amber-400' },
  error:   { label: 'ERROR',    bg: 'bg-red-100 dark:bg-red-500/10',      text: 'text-red-700 dark:text-red-400',      dot: 'bg-red-500 animate-pulse' },
};

const serviceLabels = {
  database:  { icon: '🗄️',  name: 'Base de Datos' },
  openai:    { icon: '🤖',  name: 'OpenAI' },
  telegram:  { icon: '📲',  name: 'Telegram Bot' },
};

const fetchHealth = async () => {
  try {
    const [h, e] = await Promise.all([
      api.get('/health'),
      api.get('/health/errors')
    ]);
    health.value = h.data;
    errors.value = e.data;
    lastUpdated.value = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    error.value = null;
  } catch (e) {
    error.value = 'No se pudo conectar al backend.';
    health.value = null;
  } finally {
    loading.value = false;
  }
};

const limpiarErrores = async () => {
  clearingErrors.value = true;
  try {
    await api.delete('/health/errors');
    errors.value = [];
  } finally {
    clearingErrors.value = false;
  }
};

const formatFecha = (ts) => new Date(ts).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });

const services = (h) => Object.entries(h)
  .filter(([k]) => k in serviceLabels)
  .map(([k, v]) => ({ key: k, ...serviceLabels[k], state: v.state, detail: v.detail }));

onMounted(() => {
  fetchHealth();
  interval = setInterval(fetchHealth, 30000);
});

onUnmounted(() => clearInterval(interval));
</script>

<template>
  <div class="space-y-8">

    <!-- Header con estado global -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mb-1">Estado del sistema</p>
        <div v-if="health" class="flex items-center gap-3">
          <span :class="['w-3 h-3 rounded-full', stateConfig[health.status]?.dot ?? 'bg-slate-400']"></span>
          <span class="text-2xl font-[1000] uppercase italic"
            :class="health.status === 'ok' ? 'text-green-600 dark:text-green-400' : 'text-[#DE1F27]'">
            {{ health.status === 'ok' ? 'Todos los servicios operativos' : 'Sistema degradado' }}
          </span>
        </div>
        <div v-else-if="error" class="text-[#DE1F27] font-black uppercase text-sm italic">{{ error }}</div>
        <div v-else class="text-slate-400 font-black uppercase text-sm italic animate-pulse">Consultando...</div>
      </div>
      <div class="flex items-center gap-4">
        <span v-if="lastUpdated" class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Actualizado {{ lastUpdated }}
        </span>
        <button @click="fetchHealth" :disabled="loading"
          class="px-4 py-2 bg-[#152C77] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#DE1F27] transition-colors active:scale-95 disabled:opacity-50">
          ↺ Refrescar
        </button>
      </div>
    </div>

    <!-- Cards de servicios -->
    <div v-if="health" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="s in services(health)" :key="s.key"
        :class="['rounded-[2rem] p-6 border-2 transition-all', stateConfig[s.state]?.bg ?? 'bg-slate-100', s.state === 'error' ? 'border-red-300 dark:border-red-500/30' : s.state === 'warning' ? 'border-amber-200 dark:border-amber-500/20' : 'border-green-200 dark:border-green-500/20']">
        <div class="flex items-start justify-between mb-4">
          <span class="text-3xl">{{ s.icon }}</span>
          <span :class="['text-[8px] font-black uppercase px-2 py-1 rounded-lg tracking-widest', stateConfig[s.state]?.text ?? '', stateConfig[s.state]?.bg ?? '']">
            {{ stateConfig[s.state]?.label ?? s.state }}
          </span>
        </div>
        <h3 class="font-[1000] uppercase italic text-sm text-slate-800 dark:text-white mb-1">{{ s.name }}</h3>
        <p class="text-[9px] font-bold uppercase leading-relaxed text-slate-500 dark:text-slate-400">{{ s.detail }}</p>
      </div>
    </div>

    <!-- Skeleton mientras carga -->
    <div v-else-if="loading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="rounded-[2rem] p-6 bg-slate-100 dark:bg-white/5 animate-pulse h-36"></div>
    </div>

    <!-- Timestamp del backend -->
    <div v-if="health" class="flex items-center gap-3 text-[9px] font-bold uppercase text-slate-400 tracking-widest">
      <span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20"></span>
      Hora servidor: {{ health.timestamp?.replace('T', ' ').substring(0, 19) }}
      <span class="ml-2">· Refresco automático cada 30s</span>
    </div>

    <!-- Tabla de errores -->
    <div class="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h3 class="text-[11px] font-black uppercase tracking-widest text-slate-500">⚠️ Errores recientes</h3>
          <p class="text-[9px] text-slate-400 mt-0.5">Últimos 50 errores del servidor · Ya no se envían a Telegram</p>
        </div>
        <button v-if="errors.length" @click="limpiarErrores" :disabled="clearingErrors"
          class="px-4 py-2 text-[9px] font-black uppercase tracking-widest bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 transition-colors disabled:opacity-50">
          🗑 Limpiar
        </button>
      </div>

      <div v-if="errors.length" class="overflow-x-auto">
        <table class="w-full text-[11px]">
          <thead>
            <tr class="text-left text-slate-400 font-black uppercase tracking-widest text-[9px] border-b border-slate-200 dark:border-white/10">
              <th class="pb-2 pr-4">Fecha</th>
              <th class="pb-2 pr-4">Ruta</th>
              <th class="pb-2 pr-4">Tipo</th>
              <th class="pb-2">Mensaje</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in errors" :key="e.id"
              class="border-b border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-300">
              <td class="py-2 pr-4 whitespace-nowrap text-slate-400">{{ formatFecha(e.timestamp) }}</td>
              <td class="py-2 pr-4 font-mono text-[10px] text-[#152C77] dark:text-blue-300">{{ e.path }}</td>
              <td class="py-2 pr-4 whitespace-nowrap">
                <span class="bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase">{{ e.tipo }}</span>
              </td>
              <td class="py-2 max-w-[300px] truncate text-slate-500 dark:text-slate-400">{{ e.mensaje }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-slate-400 text-sm text-center py-6">✅ Sin errores registrados</p>
    </div>

  </div>
</template>
