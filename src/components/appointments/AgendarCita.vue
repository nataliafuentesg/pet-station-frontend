<template>
  <div class="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500 px-4 md:px-0 pb-20 pt-28 md:pt-40">
    <div class="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
      
      <div class="bg-[#152C77] p-6 md:p-10 text-white relative overflow-hidden">
        <div class="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        <h2 class="text-2xl md:text-4xl font-black uppercase italic tracking-tighter relative z-10">
          Reservar <span class="text-[#DE1F27]">Cupo</span>
        </h2>
        <p class="text-[9px] md:text-[11px] font-bold uppercase tracking-widest opacity-80 mt-2 italic relative z-10">
          {{ tutorLogueado ? `Agendando para la mascota: ${pet?.nombre}` : 'Completa los datos para agendar y crear tu cuenta automáticamente' }}
        </p>
      </div>

      <form @submit.prevent="handleAgendar" class="p-5 md:p-12 text-left">
        
        <div v-if="!tutorLogueado" class="mb-12 space-y-6">
          <div class="flex items-center gap-4 mb-6">
            <span class="bg-[#DE1F27] text-white w-8 h-8 rounded-lg flex items-center justify-center font-black italic shadow-lg shadow-[#DE1F27]/20">1</span>
            <h3 class="text-[#152C77] font-black uppercase text-[12px] tracking-widest italic border-b-2 border-slate-100 pb-1">Datos del Propietario</h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-1">
              <label class="ml-4 text-[8px] font-black text-slate-400 uppercase">Nombre</label>
              <input v-model="publicForm.nombreTutor" type="text" placeholder="Ej: Natalia" required 
                class="input-ps" />
            </div>
            <div class="space-y-1">
              <label class="ml-4 text-[8px] font-black text-slate-400 uppercase">Apellido</label>
              <input v-model="publicForm.apellidoTutor" type="text" placeholder="Ej: Fuentes" required 
                class="input-ps" />
            </div>
            <div class="space-y-1">
              <label class="ml-4 text-[8px] font-black text-slate-400 uppercase">Cédula / ID</label>
              <input v-model="publicForm.cedula" type="text" placeholder="Número de identificación" required 
                class="input-ps" />
            </div>
            <div class="space-y-1">
              <label class="ml-4 text-[8px] font-black text-slate-400 uppercase">Email de contacto</label>
              <input v-model="publicForm.emailTutor" type="email" placeholder="correo@ejemplo.com" required 
                class="input-ps" />
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="ml-4 text-[8px] font-black text-slate-400 uppercase">Teléfono Móvil</label>
              <input v-model="publicForm.telefonoTutor" type="tel" placeholder="3xx xxxxxxx" required 
                class="input-ps" />
            </div>

            <div class="h-px bg-slate-100 md:col-span-2 my-4"></div>
            <div class="space-y-1">
              <label class="ml-4 text-[8px] font-black text-slate-400 uppercase">Nombre Mascota</label>
              <input v-model="publicForm.nombreMascota" type="text" placeholder="Ej: Quione" required 
                class="input-ps" />
            </div>
            <div class="space-y-1">
              <label class="ml-4 text-[8px] font-black text-slate-400 uppercase">Especie</label>
              <select v-model="publicForm.especie" required class="input-ps">
                <option value="" disabled>Seleccionar...</option>
                <option value="CANINO">Canino (Perro)</option>
                <option value="FELINO">Felino (Gato)</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <div class="flex items-center gap-4 mb-2">
            <span class="bg-[#152C77] text-white w-8 h-8 rounded-lg flex items-center justify-center font-black italic shadow-lg shadow-[#152C77]/20">
              {{ tutorLogueado ? '1' : '2' }}
            </span>
            <h3 class="text-[#152C77] font-black uppercase text-[12px] tracking-widest italic border-b-2 border-slate-100 pb-1">Configuración del Servicio</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="ml-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Tipo de Atención</label>
                <div class="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
                  <button type="button" @click="servicioTipo = 'CONSULTA'" 
                    :class="servicioTipo === 'CONSULTA' ? 'bg-[#152C77] text-white shadow-md' : 'text-slate-500'"
                    class="flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all">Médica</button>
                  <button type="button" @click="servicioTipo = 'PELUQUERIA'" 
                    :class="servicioTipo === 'PELUQUERIA' ? 'bg-[#DE1F27] text-white shadow-md' : 'text-slate-500'"
                    class="flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all">Estética</button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="ml-4 text-[9px] font-black text-slate-400 uppercase italic">Fecha</label>
                  <input v-model="fecha" type="date" :min="minDate" required class="input-ps" />
                </div>
                <div class="space-y-2">
                  <label class="ml-4 text-[9px] font-black text-slate-400 uppercase italic">Hora</label>
                  <select v-model="hora" required class="input-ps">
                    <option value="" disabled>--:--</option>
                    <option v-for="h in ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']" :key="h" :value="h">{{ h }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="ml-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Notas Adicionales / Motivo</label>
              <textarea v-model="motivo" placeholder="Cuéntanos un poco sobre lo que necesita tu mascota..." required
                class="w-full bg-slate-100 p-5 rounded-3xl border-2 border-transparent font-bold text-slate-900 text-sm h-full min-h-[150px] md:min-h-[180px] resize-none outline-none focus:border-[#152C77] focus:bg-white transition-all shadow-sm"></textarea>
            </div>
          </div>
        </div>

        <div class="mt-12">
          <div v-if="error" class="mb-4 p-4 bg-red-50 text-[#DE1F27] text-[11px] font-black uppercase rounded-2xl border border-red-100 text-center italic">
            {{ error }}
          </div>

          <div v-if="exito" class="mb-4 p-8 bg-green-50 rounded-[2.5rem] border border-green-100 text-center animate-in zoom-in">
            <div class="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">✓</div>
            <p class="text-green-800 text-sm font-black uppercase mb-2 tracking-tighter">¡Reserva Exitosa!</p>
            <p class="text-slate-500 text-[11px] font-bold uppercase italic mb-8">Si eres nuevo, revisa tu email para activar tu cuenta.</p>
            <div class="flex flex-col md:flex-row gap-4 justify-center">
               <a :href="googleCalendarLink" target="_blank" class="bg-slate-900 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#152C77] transition-all">Añadir a Calendario</a>
               <button @click="resetForm" type="button" class="text-slate-400 font-black text-[10px] uppercase py-5 hover:text-slate-600">Agendar otra cita</button>
            </div>
          </div>

          <button v-if="!exito" type="submit" :disabled="loading"
            class="w-full bg-slate-900 text-white font-black py-7 rounded-2xl uppercase tracking-[0.2em] text-[12px] hover:bg-[#152C77] transition-all shadow-xl disabled:opacity-30 active:scale-95">
            {{ loading ? 'Conectando con Recepción...' : 'Confirmar Reserva Premium' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const props = defineProps(['pet', 'tutor', 'tutorLogueado']);
const emit = defineEmits(['cita-agendada']);

const loading = ref(false);
const error = ref('');
const exito = ref(false);
const googleCalendarLink = ref('');

const fecha = ref('');
const hora = ref('');
const servicioTipo = ref('PELUQUERIA');
const motivo = ref('');

const publicForm = reactive({
  nombreTutor: '',
  apellidoTutor: '',
  cedula: '',
  emailTutor: '',
  telefonoTutor: '',
  nombreMascota: '',
  especie: ''
});

const minDate = new Date().toISOString().split('T')[0];

const handleAgendar = async () => {
  loading.value = true;
  error.value = '';
  
  const fechaHoraStr = `${fecha.value}T${hora.value}:00`;
  let requestBody = {};

  if (props.tutorLogueado) {
    requestBody = {
      nombreTutor: props.tutor.nombre,
      apellidoTutor: props.tutor.apellido,
      cedula: props.tutor.cedula,
      emailTutor: props.tutor.email,
      telefonoTutor: props.tutor.telefono,
      nombreMascota: props.pet.nombre,
      especie: props.pet.especie,
      servicioTipo: servicioTipo.value,
      fechaHora: fechaHoraStr,
      motivo: motivo.value
    };
  } else {
    requestBody = {
      ...publicForm,
      servicioTipo: servicioTipo.value,
      fechaHora: fechaHoraStr,
      motivo: motivo.value
    };
  }

  try {
    const res = await fetch('http://localhost:8080/api/citas/agendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await res.json();
    if (res.ok) {
      exito.value = true;
      googleCalendarLink.value = data.googleCalendarLink;
      emit('cita-agendada', data);
    } else {
      error.value = data.message || "Lo sentimos, este horario ya está ocupado.";
    }
  } catch (e) {
    error.value = "Error de conexión. El servidor no responde.";
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  exito.value = false;
  fecha.value = '';
  hora.value = '';
  motivo.value = '';
  Object.keys(publicForm).forEach(k => publicForm[k] = '');
};
</script>

<style scoped>
/* Estilo unificado para los inputs sin @apply para evitar errores */
.input-ps {
  width: 100%;
  background-color: #f1f5f9; /* slate-100 */
  padding: 1rem;
  border-radius: 1rem;
  border-width: 2px;
  border-color: transparent;
  font-weight: 700;
  color: #0f172a; /* slate-900 */
  outline: none;
  transition: all 0.2s;
  font-size: 0.875rem; /* text-sm */
}

.input-ps:focus {
  border-color: #152C77;
  background-color: #ffffff;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: invert(0.2);
}

@media screen and (max-width: 768px) {
  input, select, textarea {
    font-size: 16px !important;
  }
}
</style>