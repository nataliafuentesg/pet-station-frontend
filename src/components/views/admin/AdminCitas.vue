<template>
  <div class="space-y-4 animate-in slide-in-from-bottom duration-300">

    <!-- Filtros de fecha -->
    <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button v-for="f in filtrosFecha" :key="f.id" @click="filtroActivo = f.id"
        :class="[filtroActivo === f.id ? 'bg-ps-red text-white shadow-lg' : 'bg-white dark:bg-white/5 text-slate-400']"
        class="px-5 py-3 rounded-xl text-[9px] font-[1000] uppercase tracking-widest border border-white/5 transition-all italic whitespace-nowrap">
        {{ f.label }} <span v-if="f.id === 'hoy'" class="ml-1 font-black">{{ conteoHoy }}</span>
      </button>
    </div>

    <div v-if="filtered.length === 0" class="text-center py-12 text-slate-400 dark:text-white/30 font-black uppercase text-[10px] tracking-widest">
      Sin citas para mostrar
    </div>

    <div v-for="cita in filtered" :key="cita.id"
      class="admin-card flex justify-between items-center hover:border-ps-blue/30 transition-all p-4 border rounded-[2rem] bg-white dark:bg-white/5 dark:border-white/10 shadow-sm"
      :class="esHoy(cita.fechaHora) ? 'border-l-4 border-l-ps-red' : ''">

      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-ps-red/10 text-ps-red flex items-center justify-center font-[1000] italic text-xl">
          {{ cita.mascotaNombre ? cita.mascotaNombre.charAt(0) : '?' }}
        </div>
        <div>
          <h3 class="font-[1000] uppercase italic text-base leading-none dark:text-white">
            {{ cita.mascotaNombre }}
            <span class="text-[10px] not-italic opacity-40 ml-2">#{{ cita.id }}</span>
          </h3>
          <p class="text-[10px] font-black text-ps-blue uppercase mt-1">
            {{ cita.servicioTipo }} — {{ formatDate(cita.fechaHora) }}
          </p>
          <p class="text-[9px] font-bold opacity-50 dark:text-white/50">Tutor: {{ cita.tutorNombre }}</p>
        </div>
      </div>

      <div class="flex gap-2 items-center shrink-0">
        <span :class="[
          'px-3 py-1.5 rounded-xl text-[8px] font-black uppercase italic tracking-widest hidden sm:inline',
          cita.estado === 'CANCELADA'   ? 'bg-red-100 text-red-600' :
          cita.estado === 'COMPLETADA'  ? 'bg-blue-100 text-blue-600' :
                                          'bg-green-100 text-green-600'
        ]">{{ cita.estado || 'CONFIRMADA' }}</span>

        <button @click="abrirGestionar(cita)"
          class="bg-[#152C77] text-white px-4 py-2.5 rounded-xl text-[9px] font-black uppercase italic hover:bg-ps-red transition-all">
          Gestionar
        </button>

        <button @click="eliminarCitaDefinitivamente(cita.id)" title="Eliminar permanentemente"
          class="bg-red-50 text-red-500 dark:bg-red-900/20 p-2.5 rounded-xl hover:bg-ps-red hover:text-white transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal Gestionar Cita -->
    <Transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        @click.self="showModal = false">
        <div class="bg-white dark:bg-[#0a0a0a] w-full max-w-md rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">

          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-[1000] uppercase italic dark:text-white">
              Cita <span class="text-ps-red">#{{ citaActual?.id }}</span>
            </h2>
            <button @click="showModal = false" class="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-ps-red hover:text-white transition-all flex items-center justify-center text-sm">✕</button>
          </div>

          <!-- Info -->
          <div class="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 space-y-3 mb-6 border border-slate-100 dark:border-white/5">
            <div class="grid grid-cols-2 gap-3 text-[10px]">
              <div>
                <p class="font-black uppercase opacity-40 tracking-widest text-[8px]">Paciente</p>
                <p class="font-[1000] uppercase italic dark:text-white">{{ citaActual?.mascotaNombre }}</p>
              </div>
              <div>
                <p class="font-black uppercase opacity-40 tracking-widest text-[8px]">Servicio</p>
                <p class="font-[1000] uppercase italic text-ps-red">{{ citaActual?.servicioTipo }}</p>
              </div>
              <div>
                <p class="font-black uppercase opacity-40 tracking-widest text-[8px]">Tutor</p>
                <p class="font-bold uppercase dark:text-white">{{ citaActual?.tutorNombre }}</p>
              </div>
              <div>
                <p class="font-black uppercase opacity-40 tracking-widest text-[8px]">Fecha y Hora</p>
                <p class="font-bold uppercase dark:text-white">{{ formatDate(citaActual?.fechaHora) }}</p>
              </div>
            </div>
            <div v-if="citaActual?.motivo">
              <p class="font-black uppercase opacity-40 tracking-widest text-[8px] mb-1">Motivo</p>
              <p v-if="citaActual.motivo.startsWith('[PROMO-VOTO]')"
                class="text-[10px] font-black text-green-600 dark:text-green-400">
                🗳️ PROMO ELECTORAL · {{ citaActual.motivo.replace('[PROMO-VOTO] ', '') }}
              </p>
              <p v-else class="text-[10px] font-bold dark:text-white/70">{{ citaActual.motivo }}</p>
            </div>
          </div>

          <!-- Estado actual -->
          <div class="flex items-center gap-3 mb-6">
            <span class="text-[8px] font-black uppercase opacity-40 tracking-widest">Estado:</span>
            <span :class="[
              'px-4 py-2 rounded-xl text-[9px] font-black uppercase italic',
              citaActual?.estado === 'CANCELADA'  ? 'bg-red-100 text-red-600' :
              citaActual?.estado === 'COMPLETADA' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-green-100 text-green-600'
            ]">{{ citaActual?.estado || 'CONFIRMADA' }}</span>
          </div>

          <!-- Reagendar -->
          <div v-if="citaActual?.estado !== 'CANCELADA' && citaActual?.estado !== 'COMPLETADA'" class="mb-4">
            <p class="text-[8px] font-black uppercase opacity-40 tracking-widest mb-2">Reagendar</p>
            <div class="flex gap-2">
              <input v-model="nuevaFechaHora" type="datetime-local"
                class="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-ps-blue" />
              <button @click="reagendarCita" :disabled="!nuevaFechaHora || reagendando"
                class="bg-ps-blue text-white px-4 py-2.5 rounded-xl text-[9px] font-black uppercase italic hover:bg-ps-red transition-all disabled:opacity-40">
                {{ reagendando ? '...' : '📅 Ok' }}
              </button>
            </div>
          </div>

          <!-- Acciones -->
          <div class="space-y-3">
            <a v-if="citaActual?.tutorTelefono" :href="waLink" target="_blank"
              class="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-4 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:bg-green-600 active:scale-95 transition-all">
              💬 Contactar al Tutor por WhatsApp
            </a>
            <div v-else class="w-full bg-slate-100 dark:bg-white/5 text-slate-400 py-4 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest text-center">
              📵 Sin teléfono registrado
            </div>

            <button v-if="citaActual?.estado !== 'CANCELADA' && citaActual?.estado !== 'COMPLETADA'" @click="cancelarCita"
              :disabled="cancelando"
              class="w-full border-2 border-ps-red text-ps-red py-4 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:bg-ps-red hover:text-white active:scale-95 transition-all disabled:opacity-50">
              {{ cancelando ? 'Cancelando...' : '✕ Cancelar esta Cita' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import api from '@/api/axios';

const props = defineProps(['citas', 'searchQuery']);
const emit = defineEmits(['cita-eliminada']);

const filtroActivo = ref('proximas');
const showModal = ref(false);
const citaActual = ref(null);
const cancelando = ref(false);
const reagendando = ref(false);
const nuevaFechaHora = ref('');

const filtrosFecha = [
  { id: 'hoy',    label: 'Hoy' },
  { id: 'proximas', label: 'Próximas' },
  { id: 'pasadas',  label: 'Pasadas' },
  { id: 'todas',    label: 'Todas' },
];

const esHoy = (fecha) => {
  if (!fecha) return false;
  const d = new Date(fecha);
  const hoy = new Date();
  return d.getDate() === hoy.getDate() && d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear();
};

const conteoHoy = computed(() => {
  if (!Array.isArray(props.citas)) return 0;
  return props.citas.filter(c => esHoy(c.fechaHora)).length;
});

const filtered = computed(() => {
  if (!Array.isArray(props.citas)) return [];
  const q = (props.searchQuery || '').toLowerCase();
  const ahora = new Date();

  let lista = props.citas.filter(c =>
    !q || (c.mascotaNombre?.toLowerCase().includes(q) || c.tutorNombre?.toLowerCase().includes(q))
  );

  if (filtroActivo.value === 'hoy') {
    lista = lista.filter(c => esHoy(c.fechaHora));
  } else if (filtroActivo.value === 'proximas') {
    lista = lista.filter(c => new Date(c.fechaHora) > ahora && !esHoy(c.fechaHora));
  } else if (filtroActivo.value === 'pasadas') {
    lista = lista.filter(c => new Date(c.fechaHora) < ahora && !esHoy(c.fechaHora));
  }

  // Más recientes primero
  return lista.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
});

const formatDate = (ds) => ds
  ? new Date(ds).toLocaleString('es-CO', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '---';

const waLink = computed(() => {
  if (!citaActual.value) return '#';
  const msg = `Hola! Le contactamos de Pet Station sobre la cita de *${citaActual.value.mascotaNombre}* del ${formatDate(citaActual.value.fechaHora)}.`;
  const tel = citaActual.value.tutorTelefono
    ? `57${citaActual.value.tutorTelefono.replace(/\D/g, '')}` // quita caracteres no numéricos
    : '57';
  return `https://wa.me/${tel}?text=${encodeURIComponent(msg)}`;
});

const abrirGestionar = (cita) => {
  citaActual.value = cita;
  nuevaFechaHora.value = '';
  showModal.value = true;
};

const cancelarCita = async () => {
  cancelando.value = true;
  try {
    await api.put(`/citas/${citaActual.value.id}/cancelar`);
    citaActual.value = { ...citaActual.value, estado: 'CANCELADA' };
    emit('cita-eliminada', null); // Trigger refresh
    Swal.fire({ icon: 'success', title: 'Cita cancelada', timer: 1500, showConfirmButton: false });
    showModal.value = false;
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cancelar la cita.' });
  } finally {
    cancelando.value = false;
  }
};

const reagendarCita = async () => {
  if (!nuevaFechaHora.value) return;
  reagendando.value = true;
  try {
    await api.put(`/citas/${citaActual.value.id}/reagendar`, {
      fechaHora: nuevaFechaHora.value
    });
    emit('cita-eliminada', null); // refresca la lista
    Swal.fire({ icon: 'success', title: 'Cita reagendada', text: 'El cliente recibirá un email de confirmación.', timer: 2000, showConfirmButton: false });
    showModal.value = false;
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.response?.data?.message || 'No se pudo reagendar.' });
  } finally {
    reagendando.value = false;
  }
};

const eliminarCitaDefinitivamente = async (citaId) => {
  const result = await Swal.fire({
    title: '¿BORRAR DE LA BASE DE DATOS?',
    text: 'Esta acción es irreversible.',
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#000',
    cancelButtonColor: '#152C77',
    confirmButtonText: 'SÍ, DESTRUIR',
    cancelButtonText: 'CANCELAR',
    reverseButtons: true,
    customClass: { popup: 'rounded-[2rem] font-sans' }
  });
  if (!result.isConfirmed) return;

  try {
    Swal.showLoading();
    await api.delete(`/admin/citas/${citaId}`);
    Swal.fire({ icon: 'success', title: '¡Eliminada!', timer: 1500, showConfirmButton: false });
    emit('cita-eliminada', citaId);
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'ERROR', text: error.response?.data?.message || 'No se pudo eliminar.' });
  }
};
</script>

<style scoped>
@reference "../../../style.css";
.admin-card { @apply bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-all; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
