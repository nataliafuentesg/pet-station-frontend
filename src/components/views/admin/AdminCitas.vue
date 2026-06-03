<template>
  <div class="space-y-4 animate-in slide-in-from-bottom duration-300">
    <div v-for="cita in filtered" :key="cita.id" class="admin-card flex justify-between items-center hover:border-ps-blue/30 transition-all p-4 border rounded-[2rem] bg-white dark:bg-white/5 dark:border-white/10 shadow-sm">
      
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-ps-red/10 text-ps-red flex items-center justify-center font-[1000] italic text-xl">
          {{ cita.mascotaNombre ? cita.mascotaNombre.charAt(0) : '?' }}
        </div>
        <div>
          <h3 class="font-[1000] uppercase italic text-lg leading-none dark:text-white">
            {{ cita.mascotaNombre }} 
            <span class="text-[10px] not-italic opacity-40 ml-2">ID: #{{ cita.id }}</span>
          </h3>
          <p class="text-[10px] font-black text-ps-blue uppercase mt-1">
            {{ cita.servicioTipo }} — {{ formatDate(cita.fechaHora) }}
          </p>
          <p class="text-[9px] font-bold opacity-50 dark:text-white/50">Tutor: {{ cita.tutorNombre }}</p>
        </div>
      </div>

      <div class="flex gap-3 items-center">
        <span :class="[
          'px-4 py-2 rounded-xl text-[9px] font-black uppercase italic tracking-widest',
          cita.estado === 'CANCELADA' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
        ]">
          {{ cita.estado || 'CONFIRMADA' }}
        </span>
        
        <button class="bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-ps-blue hover:text-white transition-all">
          Gestionar
        </button>

        <button @click="eliminarCitaDefinitivamente(cita.id)" title="Destruir de la Base de Datos"
          class="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-xl hover:bg-[#DE1F27] hover:text-white transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Swal from 'sweetalert2';
import api from '@/api/axios'; // Asegúrate de que la ruta sea correcta según tu proyecto

const props = defineProps(['citas', 'searchQuery']);

// Declaramos que este componente avisará al padre cuando borre una cita
const emit = defineEmits(['cita-eliminada']);

const filtered = computed(() => {
  const q = props.searchQuery.toLowerCase();
  return props.citas.filter(c => 
    (c.mascotaNombre && c.mascotaNombre.toLowerCase().includes(q)) || 
    (c.tutorNombre && c.tutorNombre.toLowerCase().includes(q))
  );
});

const formatDate = (ds) => ds ? new Date(ds).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '---';

// --- LÓGICA DE BORRADO FÍSICO ---
const eliminarCitaDefinitivamente = async (citaId) => {
  const result = await Swal.fire({
    title: '¿BORRAR DE LA BASE DE DATOS?',
    text: "Esta acción es irreversible y eliminará la cita por completo del sistema.",
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#000000', // Negro para dar sensación de acción crítica
    cancelButtonColor: '#152C77',
    confirmButtonText: 'SÍ, DESTRUIR',
    cancelButtonText: 'CANCELAR',
    reverseButtons: true,
    customClass: { popup: 'rounded-[2rem] font-sans' }
  });

  if (!result.isConfirmed) return;

  try {
    Swal.showLoading();
    // Llamamos al endpoint del AdminController
    await api.delete(`/admin/citas/${citaId}`);
    
    Swal.fire({ 
      icon: 'success', 
      title: '¡DESTRUIDA!', 
      text: 'La cita ya no existe en la base de datos.',
      timer: 2000, 
      showConfirmButton: false 
    });
    
    // Le avisamos al componente Padre (Dashboard Admin) que quite la cita de su lista
    emit('cita-eliminada', citaId);
    
  } catch (error) {
    Swal.fire({ 
      icon: 'error', 
      title: 'ERROR', 
      text: error.response?.data?.message || 'No se pudo eliminar la cita.' 
    });
  }
};
</script>