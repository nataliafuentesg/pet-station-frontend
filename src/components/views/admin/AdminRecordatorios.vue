<template>
  <div class="space-y-6">

    <!-- Header con contador -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Pendientes de contactar</p>
        <p class="text-2xl font-[1000] uppercase italic dark:text-white">
          {{ total }} <span class="text-[#DE1F27]">recordatorios</span>
        </p>
      </div>
      <button @click="cargar" :disabled="loading"
        class="px-4 py-2 bg-[#152C77] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl disabled:opacity-40">
        {{ loading ? '...' : '↻ Actualizar' }}
      </button>
    </div>

    <!-- Filtros -->
    <div class="flex gap-2">
      <button v-for="f in ['TODOS', 'BAÑO', 'VACUNA']" :key="f"
        @click="filtro = f"
        :class="filtro === f
          ? 'bg-[#152C77] text-white'
          : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400'"
        class="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">
        {{ f === 'BAÑO' ? '🛁 Baños' : f === 'VACUNA' ? '💉 Vacunas' : '📋 Todos' }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-20 text-center">
      <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>

    <!-- Lista -->
    <div v-else class="space-y-3">
      <div v-for="r in filtrados" :key="r.mascotaId + r.tipo"
        class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-5 flex items-center gap-4">

        <!-- Icono tipo -->
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
          :class="r.tipo === 'BAÑO' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-green-50 dark:bg-green-900/20'">
          {{ r.tipo === 'BAÑO' ? '🛁' : '💉' }}
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-base font-[1000] uppercase italic dark:text-white">{{ r.mascota }}</span>
            <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
              :class="r.tipo === 'BAÑO'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'">
              {{ r.tipo }}
            </span>
            <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
              :class="r.diasDesde >= 35 ? 'bg-red-100 text-[#DE1F27]' : 'bg-amber-100 text-amber-700'">
              Hace {{ r.diasDesde }} días
            </span>
          </div>
          <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate mt-0.5">
            👤 {{ r.tutor }}
            <span v-if="r.telefono" class="ml-2 opacity-60">· {{ r.telefono }}</span>
          </p>
          <p class="text-[10px] opacity-40 font-bold mt-0.5">
            Último {{ r.tipo === 'BAÑO' ? 'baño' : 'vacuna' }}:
            {{ r.tipo === 'BAÑO' ? r.ultimoBano : r.ultimaVacuna }}
          </p>
        </div>

        <!-- Botón WhatsApp -->
        <a v-if="r.telefono" :href="waLink(r)" target="_blank"
          class="shrink-0 flex items-center gap-2 bg-[#25D366] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-2xl hover:bg-[#20bd5a] transition-all active:scale-95">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Enviar
        </a>
        <span v-else class="shrink-0 text-[10px] font-bold text-slate-300 dark:text-slate-600">Sin teléfono</span>
      </div>

      <div v-if="!filtrados.length" class="py-20 text-center text-slate-400 font-bold text-sm">
        No hay recordatorios pendientes {{ filtro !== 'TODOS' ? 'de ' + filtro.toLowerCase() : '' }} en este momento
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/api/axios';

const recordatorios = ref([]);
const total = ref(0);
const loading = ref(false);
const filtro = ref('TODOS');

const filtrados = computed(() =>
  filtro.value === 'TODOS'
    ? recordatorios.value
    : recordatorios.value.filter(r => r.tipo === filtro.value)
);

const cargar = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/recordatorios');
    recordatorios.value = data.recordatorios;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

const waLink = (r) => {
  const tel = '57' + r.telefono.replace(/[^0-9]/g, '');
  const tipo = r.tipo === 'BAÑO' ? 'baño' : 'vacuna anual';
  const msg = `Hola ${r.tutor.split(' ')[0]} 🐾 Ya pasó un mes del ${tipo} de ${r.mascota}. ¿Le agendamos? Puedes escribirnos o agendar en petstationvet.com 💙`;
  return `https://wa.me/${tel}?text=${encodeURIComponent(msg)}`;
};

onMounted(cargar);
</script>
