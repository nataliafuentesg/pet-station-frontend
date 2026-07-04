<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Historial de visitas</p>
        <p class="text-2xl font-[1000] uppercase italic dark:text-white">
          {{ total }} <span class="text-[#DE1F27]">clientes</span>
        </p>
      </div>
      <div class="flex gap-2">
        <button @click="cargar" :disabled="loading"
          class="px-4 py-2 bg-[#152C77] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl disabled:opacity-40">
          {{ loading ? '...' : '↻ Actualizar' }}
        </button>
      </div>
    </div>

    <!-- Filtros rápidos -->
    <div class="flex flex-wrap gap-2">
      <button v-for="f in filtros" :key="f.key" @click="filtroActivo = f.key"
        :class="filtroActivo === f.key
          ? 'bg-[#152C77] text-white'
          : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500'"
        class="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">
        {{ f.label }}
        <span v-if="f.count" class="ml-1 opacity-70">({{ f.count }})</span>
      </button>
    </div>

    <!-- Buscador -->
    <div class="relative">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
      <input v-model="q" @input="buscar" placeholder="Buscar por nombre o teléfono..."
        class="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-[#152C77]" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-20 text-center">
      <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>

    <!-- Lista -->
    <div v-else class="space-y-3">
      <div v-for="c in clientesFiltrados" :key="c.nombre + c.telefono"
        class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-5">

        <div class="flex items-start gap-4">
          <!-- Avatar inicial -->
          <div class="w-11 h-11 rounded-2xl bg-[#152C77]/10 dark:bg-white/10 flex items-center justify-center text-lg font-[1000] text-[#152C77] dark:text-white shrink-0">
            {{ inicial(c.nombre) }}
          </div>

          <!-- Info principal -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="text-sm font-[1000] uppercase italic dark:text-white truncate">{{ c.nombre }}</span>
              <!-- Badge urgencia -->
              <span v-if="c.diasDesdeVisita >= 90" class="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-100 text-[#DE1F27]">
                ⚠️ {{ c.diasDesdeVisita }}d sin visitar
              </span>
              <span v-else-if="c.diasDesdeVisita >= 30" class="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                {{ c.diasDesdeVisita }}d sin visitar
              </span>
            </div>

            <p v-if="c.mascota" class="text-[11px] text-slate-400 font-bold mb-2">🐾 {{ c.mascota }}</p>

            <!-- Servicios con fecha -->
            <div class="flex flex-wrap gap-3 mt-2">
              <div v-if="c.ultimaPeluqueria" class="flex items-center gap-1.5">
                <span class="text-[9px] font-black px-2 py-1 rounded-xl"
                  :class="diasDesde(c.ultimaPeluqueria) >= 28 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'">
                  🛁 Peluquería · {{ diasDesde(c.ultimaPeluqueria) }}d
                </span>
              </div>
              <div v-if="c.ultimaVacuna" class="flex items-center gap-1.5">
                <span class="text-[9px] font-black px-2 py-1 rounded-xl"
                  :class="diasDesde(c.ultimaVacuna) >= 330 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'">
                  💉 Vacuna · {{ diasDesde(c.ultimaVacuna) }}d
                </span>
              </div>
              <div v-if="c.ultimaConsulta" class="flex items-center gap-1.5">
                <span class="text-[9px] font-black px-2 py-1 rounded-xl bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400">
                  🩺 Consulta · {{ diasDesde(c.ultimaConsulta) }}d
                </span>
              </div>
              <div v-if="!c.ultimaPeluqueria && !c.ultimaVacuna && !c.ultimaConsulta" class="text-[9px] text-slate-300 font-bold">
                Sin servicios registrados
              </div>
            </div>
          </div>

          <!-- Acciones contacto -->
          <div class="flex flex-col gap-2 shrink-0">
            <a v-if="c.telefono" :href="waLink(c)" target="_blank"
              class="flex items-center gap-1.5 bg-[#25D366] text-white text-[9px] font-black uppercase px-3 py-2 rounded-xl hover:bg-[#20bd5a] transition-all active:scale-95">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WA
            </a>
            <a v-if="c.email" :href="`mailto:${c.email}`"
              class="flex items-center gap-1.5 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[9px] font-black uppercase px-3 py-2 rounded-xl hover:bg-slate-200 transition-all">
              ✉️ Email
            </a>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="paginas > 1" class="flex justify-center gap-2 pt-4">
        <button v-for="p in paginas" :key="p" @click="irPagina(p - 1)"
          :class="paginaActual === p - 1 ? 'bg-[#152C77] text-white' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500'"
          class="w-9 h-9 rounded-xl text-[10px] font-black transition-all">
          {{ p }}
        </button>
      </div>

      <div v-if="!loading && clientesFiltrados.length === 0" class="py-20 text-center text-slate-400 font-bold text-sm">
        No hay resultados
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/api/axios';

const clientes = ref([]);
const total = ref(0);
const paginas = ref(1);
const paginaActual = ref(0);
const loading = ref(false);
const q = ref('');
const filtroActivo = ref('todos');

const filtros = computed(() => [
  { key: 'todos', label: '📋 Todos' },
  { key: 'peluqueria', label: '🛁 Baño vencido', count: clientes.value.filter(c => c.ultimaPeluqueria && diasDesde(c.ultimaPeluqueria) >= 28).length },
  { key: 'vacuna', label: '💉 Vacuna próxima', count: clientes.value.filter(c => c.ultimaVacuna && diasDesde(c.ultimaVacuna) >= 330).length },
  { key: 'inactivos', label: '😴 +90 días', count: clientes.value.filter(c => c.diasDesdeVisita >= 90).length },
]);

const clientesFiltrados = computed(() => {
  if (filtroActivo.value === 'peluqueria') return clientes.value.filter(c => c.ultimaPeluqueria && diasDesde(c.ultimaPeluqueria) >= 28);
  if (filtroActivo.value === 'vacuna') return clientes.value.filter(c => c.ultimaVacuna && diasDesde(c.ultimaVacuna) >= 330);
  if (filtroActivo.value === 'inactivos') return clientes.value.filter(c => c.diasDesdeVisita >= 90);
  return clientes.value;
});

const cargar = async (p = 0) => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/clientes/historial', { params: { q: q.value, page: p, size: 50 } });
    clientes.value = data.clientes;
    total.value = data.total;
    paginas.value = data.paginas;
    paginaActual.value = p;
  } finally {
    loading.value = false;
  }
};

let timeout;
const buscar = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => cargar(0), 400);
};

const irPagina = (p) => cargar(p);

const diasDesde = (fechaStr) => {
  const hoy = new Date();
  const fecha = new Date(fechaStr);
  return Math.floor((hoy - fecha) / (1000 * 60 * 60 * 24));
};

const inicial = (nombre) => nombre ? nombre.trim()[0].toUpperCase() : '?';

const waLink = (c) => {
  const tel = '57' + (c.telefono || '').replace(/[^0-9]/g, '');
  let msg = `Hola ${c.nombre?.split(' ')[0] || ''} 🐾 `;
  if (c.ultimaPeluqueria && diasDesde(c.ultimaPeluqueria) >= 28)
    msg += `Ya pasó más de un mes desde el último baño de ${c.mascota || 'tu mascota'}. ¿Le agendamos? 💙`;
  else if (c.ultimaVacuna && diasDesde(c.ultimaVacuna) >= 330)
    msg += `Es momento de renovar la vacuna anual de ${c.mascota || 'tu mascota'}. ¿Le agendamos? 💉`;
  else
    msg += `Te extrañamos en PetStation. ¿Cómo está ${c.mascota || 'tu mascota'}? Estamos para lo que necesites 🐾`;
  return `https://wa.me/${tel}?text=${encodeURIComponent(msg)}`;
};

onMounted(() => cargar());
</script>
