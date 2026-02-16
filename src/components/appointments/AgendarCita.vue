<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 px-4 transition-colors duration-500 relative">
    
    <Transition name="fade">
      <div v-if="loading" class="fixed inset-0 z-[6000] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
        <div class="w-16 h-16 border-4 border-white/20 border-t-[#DE1F27] rounded-full animate-spin mb-8"></div>
        
        <h3 class="text-3xl md:text-5xl font-[1000] uppercase italic text-white mb-2 animate-pulse">
          Agendando Cita...
        </h3>
        <p class="text-white/60 font-bold uppercase tracking-widest text-xs">
          Por favor no cierres esta ventana
        </p>
      </div>
    </Transition>

    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white">
          RESERVAR <span class="text-[#DE1F27]">TURNO</span>
        </h1>
        <p class="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">
          {{ props.tutor ? `HOLA ${props.tutor.nombre}, SELECCIONA TU MASCOTA` : 'COMPLETA LOS DATOS PARA AGENDAR' }}
        </p>
      </div>

      <div class="bg-slate-50 dark:bg-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-white/5">
        <form @submit.prevent="handleSubmit" class="space-y-10">
          
          <div v-if="props.tutor" class="space-y-6">
            <h3 class="text-sm font-black uppercase tracking-widest text-[#DE1F27] flex items-center gap-3">
              <span class="w-8 h-[2px] bg-[#DE1F27]"></span> 1. ¿Para quién es la cita?
            </h3>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="m in props.availablePets" :key="m.id" 
                @click="seleccionarMascota(m)"
                :class="[
                  'cursor-pointer p-5 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3',
                  form.mascotaId === m.id 
                    ? 'border-[#152C77] bg-[#152C77] text-white shadow-xl scale-105' 
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-slate-400'
                ]">
                <div class="w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-white/20">
                  <img v-if="m.fotoUrl" :src="m.fotoUrl" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center font-black text-xl text-[#152C77]">{{ m.nombre[0] }}</div>
                </div>
                <span class="text-[11px] font-black uppercase tracking-tighter">{{ m.nombre }}</span>
              </div>
            </div>
          </div>

          <div v-else class="space-y-6">
            <h3 class="text-sm font-black uppercase tracking-widest text-[#DE1F27] flex items-center gap-3">
              <span class="w-8 h-[2px] bg-[#DE1F27]"></span> 1. Información del Paciente
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input v-model="form.nombreMascota" placeholder="Nombre de la mascota" required class="input-style" />
              <select v-model="form.especie" class="input-style">
                <option value="CANINO">Canino</option>
                <option value="FELINO">Felino</option>
              </select>
              <input v-model="form.nombreTutor" placeholder="Tu Nombre" required class="input-style" />
              <input v-model="form.emailTutor" placeholder="Tu Email" required type="email" class="input-style" />
            </div>
          </div>

          <div class="space-y-6">
            <h3 class="text-sm font-black uppercase tracking-widest text-[#DE1F27] flex items-center gap-3">
              <span class="w-8 h-[2px] bg-[#DE1F27]"></span> 2. Servicio y Horario
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="label-style">Tipo de Servicio</label>
                <select v-model="form.servicioTipo" class="input-style">
                  <option value="CONSULTA">CONSULTA MÉDICA</option>
                  <option value="PELUQUERIA">PELUQUERÍA</option>
                </select>
              </div>
              <div>
                <label class="label-style">Fecha (Anticipación 24h)</label>
                <input v-model="tempDate" type="date" :min="minDate" required class="input-style" />
              </div>
              <div>
                <label class="label-style">Turnos Disponibles</label>
                <select v-model="tempTime" :disabled="!tempDate || filteredHours.length === 0" class="input-style">
                  <option v-for="h in filteredHours" :key="h" :value="h">
                    {{ formatHora(h) }}
                  </option>
                </select>
                <p v-if="esDomingo" class="text-[9px] text-red-500 font-bold mt-2 uppercase">No abrimos los domingos</p>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="label-style">Motivo de la cita</label>
            <textarea v-model="form.motivo" placeholder="Describe brevemente el motivo..." required class="input-style h-28 resize-none p-6"></textarea>
          </div>

          <button 
            type="submit"
            :disabled="loading || (props.tutor && !form.mascotaId)" 
            class="w-full bg-[#DE1F27] text-white py-8 rounded-[2.5rem] font-[1000] uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Confirmar Cita
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios'; 

const props = defineProps(['tutor', 'pet', 'availablePets']);
const emit = defineEmits(['notify']);
const router = useRouter();
const loading = ref(false);

const tempDate = ref('');
const tempTime = ref('08:00');
const TURNOS_PERMITIDOS = ['08:00', '10:00', '12:00', '14:00'];

const form = reactive({
  mascotaId: null,
  nombreTutor: '',
  apellidoTutor: '',
  cedula: '',
  emailTutor: '',
  telefonoTutor: '',
  nombreMascota: '',
  especie: 'CANINO',
  servicioTipo: 'CONSULTA',
  fechaHora: '',
  motivo: ''
});

// ... (TUS COMPUTED minDate, esDomingo, filteredHours y formatHora IGUAL QUE ANTES) ...
const minDate = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
});

const esDomingo = computed(() => {
  if (!tempDate.value) return false;
  const date = new Date(tempDate.value + 'T00:00:00');
  return date.getDay() === 0;
});

const filteredHours = computed(() => esDomingo.value ? [] : TURNOS_PERMITIDOS);

const formatHora = (h) => {
  const [hora] = h.split(':');
  const hInt = parseInt(hora);
  const suffix = hInt >= 12 ? 'PM' : 'AM';
  const displayHora = hInt > 12 ? hInt - 12 : hInt;
  return `${displayHora}:00 ${suffix}`;
};

const seleccionarMascota = (m) => {
  form.mascotaId = m.id;
  form.nombreMascota = m.nombre;
  form.especie = m.especie;
};

onMounted(() => {
  if (props.tutor) {
    Object.assign(form, {
      nombreTutor: props.tutor.nombre,
      apellidoTutor: props.tutor.apellido,
      cedula: props.tutor.cedula,
      emailTutor: props.tutor.email,
      telefonoTutor: props.tutor.telefono
    });
    if (props.pet) seleccionarMascota(props.pet);
  }
});

// 2. LÓGICA DE ENVÍO MEJORADA CON BLOQUEO
const handleSubmit = async () => {
  loading.value = true; // Activa el overlay negro
  form.fechaHora = `${tempDate.value}T${tempTime.value}:00`;

  try {
    await api.post('/citas/agendar', form);
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'conversion_cita',
        servicio_tipo: form.servicioTipo,
        mascota_especie: form.especie,
        tutor_nombre: form.nombreTutor,
        metodo: props.tutor ? 'usuario_registrado' : 'usuario_nuevo'
      });
    }
    emit('notify', { msg: '¡ÉXITO! TU CITA HA SIDO AGENDADA.', type: 'success' });
    setTimeout(() => {
      loading.value = false;
      if (props.tutor) {
        router.push('/expediente');
      } else {
        router.push('/');
      }
    }, 1500);

  } catch (e) {
    loading.value = false; // Solo quitamos el loading si hay error
    const errorMsg = e.response?.data?.message || 'Error al agendar la cita';
    emit('notify', { msg: errorMsg, type: 'error' });
  }
};
</script>

<style scoped>
.input-style {
  width: 100%;
  background-color: white;
  padding: 1.25rem;
  border-radius: 1rem;
  border: 2px solid transparent;
  outline: none;
  font-weight: 700;
  transition: all 0.3s;
}
.dark .input-style {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}
.input-style:focus { border-color: #152C77; }
.label-style {
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  color: #94a3b8;
  margin-left: 1rem;
  margin-bottom: 0.5rem;
  display: block;
}

/* ESTILO PARA LA TRANSICIÓN DEL OVERLAY */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>