<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 px-4 transition-colors duration-500 relative">
    
    <Transition name="fade">
      <div v-if="loading" class="fixed inset-0 z-[6000] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
        <div class="w-16 h-16 border-4 border-white/20 border-t-[#DE1F27] rounded-full animate-spin mb-8"></div>
        <h3 class="text-3xl md:text-5xl font-[1000] uppercase italic text-white mb-2 animate-pulse">Agendando Cita...</h3>
        <p class="text-white/60 font-bold uppercase tracking-widest text-xs">Por favor no cierres esta ventana</p>
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
              <input v-model="form.nombreMascota" placeholder="Nombre de la mascota" class="input-style" />
              <select v-model="form.especie" class="input-style">
                <option value="CANINO">Canino</option>
                <option value="FELINO">Felino</option>
              </select>
              <input v-model="form.nombreTutor" placeholder="Tu Nombre" class="input-style" />
              <input v-model="form.emailTutor" placeholder="Tu Email" type="email" class="input-style" />
              <input v-model="form.telefonoTutor" placeholder="Tu Teléfono (10 dígitos)" type="tel" class="input-style" />
            </div>
          </div>

          <div class="space-y-6">
            <h3 class="text-sm font-black uppercase tracking-widest text-[#DE1F27] flex items-center gap-3">
              <span class="w-8 h-[2px] bg-[#DE1F27]"></span> 2. Servicio y Horario
            </h3>
            <p class="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 -mt-3">
              ⚠️ No atendemos domingos ni festivos
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="label-style">Tipo de Servicio</label>
                <select v-model="form.servicioTipo" class="input-style">
                  <option value="CONSULTA">CONSULTA MÉDICA</option>
                  <option value="PELUQUERIA">PELUQUERÍA</option>
                </select>
              </div>
              <div>
                <label class="label-style">Fecha (mín. 6 horas de anticipación)</label>
                <input v-model="tempDate" type="date" :min="minDate" class="input-style" />
              </div>
              <div>
                <label class="label-style">Turnos Disponibles</label>
                <select v-model="tempTime" :disabled="!tempDate || diaNoDisponible || cargandoHoras" class="input-style">
                  <option v-if="cargandoHoras" value="" disabled>Verificando...</option>
                  <option v-else value="" disabled selected>Selecciona una hora</option>

                  <option v-for="turno in filteredHours" :key="turno.horaOriginal"
                          :value="turno.horaOriginal"
                          :disabled="turno.ocupado"
                          :class="{'text-red-500 opacity-50': turno.ocupado}">
                    {{ turno.formato }} {{ turno.ocupado ? '(Ocupado)' : '' }}
                  </option>
                </select>
                <p v-if="esDomingo" class="text-[9px] text-red-500 font-bold mt-2 uppercase">No abrimos los domingos</p>
                <p v-else-if="esFestivoSeleccionado" class="text-[9px] text-red-500 font-bold mt-2 uppercase">🎉 Día festivo — no hay servicio</p>
              </div>
            </div>
          </div>

          <!-- Promo certificado electoral 22-27 jun -->
          <div v-if="promoActiva && form.servicioTipo === 'PELUQUERIA'"
            class="flex items-start gap-3 bg-[#152C77] text-white rounded-2xl p-4 cursor-pointer select-none"
            @click="form.tieneVoto = !form.tieneVoto">
            <div class="w-5 h-5 mt-0.5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all"
              :class="form.tieneVoto ? 'bg-[#DE1F27] border-[#DE1F27]' : 'border-white/50'">
              <span v-if="form.tieneVoto" class="text-[10px] font-black">✓</span>
            </div>
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest">🗳️ Tengo certificado electoral</p>
              <p class="text-[9px] opacity-80 font-bold mt-0.5">30% off — lo verificamos al llegar (22–27 jun)</p>
            </div>
          </div>

          <div class="space-y-2">
            <label class="label-style">Motivo de la cita</label>
            <textarea v-model="form.motivo" placeholder="Describe brevemente el motivo..." class="input-style h-28 resize-none p-6"></textarea>
          </div>

          <button 
            type="submit"
            :disabled="loading || (props.tutor && !form.mascotaId) || !tempTime" 
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
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import { useTracking } from '@/composables/useTracking';
import { useFestivos } from '@/composables/useFestivos';

const { trackCitaAgendada } = useTracking();
const { esFestivo } = useFestivos();

const props = defineProps(['tutor', 'pet', 'availablePets']);
const emit = defineEmits(['notify']);
const router = useRouter();
const loading = ref(false);
const cargandoHoras = ref(false);

const tempDate = ref('');
const tempTime = ref(''); // Cambiado para que empiece vacío y obligue a seleccionar
const TURNOS_PERMITIDOS = ['08:00', '10:00', '12:00', '14:00'];
const horasOcupadasBackend = ref([]); // Aquí guardaremos las horas que el Back dice que están llenas

const promoActiva = (() => {
  const hoy = new Date();
  return hoy <= new Date('2026-06-27T23:59:59');
})();

const fechaEnPromo = (fechaStr) => {
  if (!fechaStr) return false;
  const f = new Date(fechaStr);
  return f >= new Date('2026-06-22') && f <= new Date('2026-06-27T23:59:59');
};

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
  motivo: '',
  tieneVoto: false
});

// Fecha mínima = hoy + 4h (si son las 10pm, el mínimo sigue siendo hoy → muestra mañana igualmente)
const minDate = computed(() => {
  const en4h = new Date(Date.now() + 6 * 60 * 60 * 1000);
  const y = en4h.getFullYear();
  const m = String(en4h.getMonth() + 1).padStart(2, '0');
  const d = String(en4h.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
});

// Hora mínima válida si la fecha seleccionada es exactamente el día mínimo
const horaMinSiEsDiaMinimo = computed(() => {
  const en4h = new Date(Date.now() + 6 * 60 * 60 * 1000);
  return en4h.getHours();
});

const esDomingo = computed(() => {
  if (!tempDate.value) return false;
  // Truco para evitar problemas de zona horaria al calcular el domingo
  const date = new Date(`${tempDate.value}T12:00:00`); 
  return date.getDay() === 0;
});

const esFestivoSeleccionado = computed(() => {
  if (!tempDate.value) return false;
  return esFestivo(tempDate.value);
});

// No hay atención en domingos ni festivos
const diaNoDisponible = computed(() => esDomingo.value || esFestivoSeleccionado.value);

const formatHora = (h) => {
  const [hora] = h.split(':');
  const hInt = parseInt(hora);
  const suffix = hInt >= 12 ? 'PM' : 'AM';
  const displayHora = hInt > 12 ? hInt - 12 : (hInt === 0 ? 12 : hInt);
  return `${displayHora}:00 ${suffix}`;
};

// NUEVO: Computed inteligente para cruzar las horas permitidas con las ocupadas del backend
const filteredHours = computed(() => {
  if (diaNoDisponible.value || !tempDate.value) return [];

  const esDiaMinimo = tempDate.value === minDate.value;

  return TURNOS_PERMITIDOS.map(turno => {
    const horaNumero = parseInt(turno.split(':')[0]);
    const ocupadoBackend = horasOcupadasBackend.value.includes(horaNumero);
    // Si es el día mínimo, también bloquear horas que no cumplen las 24h
    const fueraDe24h = esDiaMinimo && horaNumero < horaMinSiEsDiaMinimo.value;

    return {
      horaOriginal: turno,
      formato: formatHora(turno),
      ocupado: ocupadoBackend || fueraDe24h
    };
  });
});

// NUEVO: Watcher que se dispara cuando cambia la FECHA o el SERVICIO
watch([tempDate, () => form.servicioTipo], async ([newDate, newService]) => {
  if (!newDate) return;

  // Validar que la fecha no sea anterior al mínimo permitido (fix para móvil que ignora :min)
  const fechaElegida = new Date(`${newDate}T12:00:00`);
  const fechaMinima = new Date(`${minDate.value}T12:00:00`);
  if (fechaElegida < fechaMinima) {
    tempDate.value = minDate.value;
    tempTime.value = '';
    return;
  }

  if (diaNoDisponible.value) {
    horasOcupadasBackend.value = [];
    tempTime.value = '';
    return;
  }

  cargandoHoras.value = true;
  tempTime.value = ''; // Resetea la hora seleccionada porque cambiaron las condiciones

  try {
    // Llama al nuevo endpoint del backend
    const response = await api.get('/citas/ocupadas', {
      params: { fecha: newDate, servicioTipo: newService }
    });
    // El backend nos responde con un array de enteros, ej: [8, 14]
    horasOcupadasBackend.value = response.data;
  } catch (error) {
    console.error("Error al consultar disponibilidad:", error);
    emit('notify', { msg: 'Error al verificar la disponibilidad de horarios', type: 'error' });
    horasOcupadasBackend.value = []; 
  } finally {
    cargandoHoras.value = false;
  }
});

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

const handleSubmit = async () => {
  // Bloqueo de domingos y festivos
  if (diaNoDisponible.value) {
    emit('notify', { msg: 'No atendemos domingos ni festivos. Elige otra fecha.', type: 'warning' });
    return;
  }

  // Validaciones explícitas con mensajes amigables
  if (props.tutor && !form.mascotaId) {
    emit('notify', { msg: 'Selecciona la mascota para la cita', type: 'warning' });
    return;
  }

  if (!props.tutor) {
    if (!form.nombreMascota.trim()) {
      emit('notify', { msg: 'Escribe el nombre de la mascota', type: 'warning' });
      return;
    }
    if (!form.nombreTutor.trim()) {
      emit('notify', { msg: 'Escribe tu nombre', type: 'warning' });
      return;
    }
    if (!form.emailTutor.trim()) {
      emit('notify', { msg: 'Escribe tu correo electrónico', type: 'warning' });
      return;
    }
    if (!form.telefonoTutor.trim()) {
      emit('notify', { msg: 'Escribe tu número de teléfono', type: 'warning' });
      return;
    }
    if (!/^\d{10}$/.test(form.telefonoTutor.replace(/\s/g, ''))) {
      emit('notify', { msg: 'El teléfono debe tener 10 dígitos', type: 'warning' });
      return;
    }
  }

  if (!tempDate.value) {
    emit('notify', { msg: 'Selecciona la fecha de la cita', type: 'warning' });
    return;
  }

  if (!tempTime.value) {
    emit('notify', { msg: 'Selecciona un horario disponible', type: 'warning' });
    return;
  }

  if (!form.motivo.trim()) {
    emit('notify', { msg: 'Describe brevemente el motivo de la cita', type: 'warning' });
    return;
  }

  loading.value = true;
  form.fechaHora = `${tempDate.value}T${tempTime.value}:00`;
  if (form.tieneVoto && form.servicioTipo === 'PELUQUERIA' && fechaEnPromo(tempDate.value)) {
    form.motivo = `[PROMO-VOTO] ${form.motivo}`;
  }

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  try {
    await api.post('/citas/agendar', {
      ...form,
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc'),
    });
    trackCitaAgendada(
      form.servicioTipo,
      form.especie,
      props.tutor ? 'usuario_registrado' : 'usuario_nuevo'
    );
    emit('notify', { msg: '¡ÉXITO! TU CITA HA SIDO AGENDADA.', type: 'success' });
    
    // Forzamos una actualización de las horas ocupadas por si el usuario se queda en la página
    horasOcupadasBackend.value.push(parseInt(tempTime.value.split(':')[0]));
    tempTime.value = '';
    tempDate.value = '';

    setTimeout(() => {
      loading.value = false;
      if (props.tutor) {
        router.push('/expediente');
      } else {
        router.push('/');
      }
    }, 1500);

  } catch (e) {
    loading.value = false;
    const errorMsg = e.response?.data?.message || 'Error al agendar la cita';
    emit('notify', { msg: errorMsg, type: 'error' });
  }
};
</script>

<style scoped>
/* LOS MISMOS ESTILOS DE ANTES */
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
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>