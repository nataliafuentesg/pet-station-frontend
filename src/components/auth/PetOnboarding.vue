<template>
  <div class="relative w-full max-w-2xl bg-[#050505] rounded-[3rem] shadow-2xl border border-white/5 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
    
    <Transition name="fade">
      <div v-if="loading" class="absolute inset-0 z-[150] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
        <div class="w-12 h-12 border-4 border-white/20 border-t-[#DE1F27] rounded-full animate-spin mb-6"></div>
        <h3 class="text-2xl font-[1000] uppercase italic text-white mb-2 animate-pulse">
          {{ tutorExistente ? 'Guardando Mascota...' : 'Creando Cuenta...' }}
        </h3>
        <p class="text-white/50 font-bold uppercase tracking-widest text-[9px]">
          Estamos generando el expediente digital
        </p>
      </div>
    </Transition>

    <button @click="$emit('close')" 
      class="absolute top-6 right-6 z-[120] w-10 h-10 flex items-center justify-center bg-[#DE1F27] text-white rounded-xl shadow-lg hover:rotate-90 transition-all cursor-pointer">
      ✕
    </button>

    <div class="p-8 md:p-12 overflow-y-auto custom-scrollbar">
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-[1000] uppercase italic tracking-tighter text-white leading-none">
          {{ tutorExistente ? 'NUEVA' : 'CREAR' }} <span class="text-[#DE1F27]">MASCOTA.</span>
        </h2>
        <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3 italic">Registro de Salud e Información</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <div v-if="!tutorExistente" class="space-y-4">
          <p class="text-[9px] font-black text-[#DE1F27] uppercase tracking-widest text-center italic mb-2">Datos del Tutor</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="form.nombreTutor" placeholder="Nombre" class="input-dark" required />
            <input v-model="form.apellidoTutor" placeholder="Apellido" class="input-dark" required />
            <input v-model="form.emailTutor" type="email" placeholder="Email" class="input-dark md:col-span-2" required />
            <input v-model="form.cedula" placeholder="Cédula" class="input-dark md:col-span-2" required />
            
            <div class="relative">
              <input v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Contraseña" class="input-dark pr-10" required />
              <button type="button" @click="showPass = !showPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                {{ showPass ? '👁️' : '🔒' }}
              </button>
            </div>
            
            <div class="relative">
              <input v-model="form.confirmPassword" :type="showConfirmPass ? 'text' : 'password'" placeholder="Confirmar" class="input-dark pr-10" required />
              <button type="button" @click="showConfirmPass = !showConfirmPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                {{ showConfirmPass ? '👁️' : '🔒' }}
              </button>
            </div>
          </div>
          <div class="h-px bg-white/10 w-full my-6"></div>
        </div>

        <div class="space-y-4">
          <p class="text-[9px] font-black text-[#DE1F27] uppercase tracking-widest text-center italic mb-2">Datos del Paciente</p>
          
          <input v-model="form.nombreMascota" placeholder="Nombre de la mascota" class="input-dark" required />

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select v-model="form.especie" class="input-dark">
              <option value="CANINO">Perro 🐶</option>
              <option value="FELINO">Gato 🐱</option>
            </select>
            <input v-model="form.raza" placeholder="Raza" class="input-dark" required />
            <div class="relative">
              <label class="absolute -top-2 left-3 bg-[#050505] px-1 text-[7px] text-[#DE1F27] font-black uppercase">Fecha Nacimiento</label>
              <input v-model="form.fechaNacimiento" type="date" class="input-dark" required />
            </div>
          </div>
        </div>

        <div class="bg-white/5 p-6 rounded-[2rem] space-y-4 border border-white/5">
          <p class="text-[8px] font-black text-[#152C77] dark:text-ps-blue uppercase tracking-widest italic mb-2">Historial Clínico Básico</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label-min">Última Vacuna</label>
              <input v-model="form.ultimaVacuna" type="date" class="input-dark mt-1" />
            </div>
            <div>
              <label class="label-min">Última Desparasitación</label>
              <input v-model="form.ultimaDesparasitacion" type="date" class="input-dark mt-1" />
            </div>
          </div>

          <div>
            <label class="label-min">Alimento Actual</label>
            <input v-model="form.marcaComida" placeholder="Ej: Royal Canin Adulto" class="input-dark mt-1" />
          </div>

          <div>
            <label class="label-min">Observaciones / Alergias</label>
            <textarea v-model="form.observacionesMedicas" placeholder="Alergias, cirugías previas..." class="input-dark mt-1 h-20 text-xs resize-none"></textarea>
          </div>
        </div>

        <button :disabled="loading" type="submit"
          class="w-full bg-white text-black py-5 rounded-2xl font-[1000] uppercase tracking-widest hover:bg-[#DE1F27] hover:text-white active:scale-95 transition-all italic shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
          {{ loading ? 'Procesando...' : 'Confirmar Registro' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import api from '@/api/axios';

const props = defineProps(['tutorExistente']);
const emit = defineEmits(['finalizado', 'close', 'notify']);
const loading = ref(false);
const showPass = ref(false);
const showConfirmPass = ref(false);

const form = reactive({
  // Si existe tutor, precargamos sus datos (aunque no se muestren en el form, sirven de referencia)
  nombreTutor: props.tutorExistente?.nombre || '',
  apellidoTutor: props.tutorExistente?.apellido || '',
  emailTutor: props.tutorExistente?.email || '',
  cedula: props.tutorExistente?.cedula || '',
  password: '',
  confirmPassword: '',
  
  // Datos Mascota
  nombreMascota: '',
  especie: 'CANINO', // Valor por defecto seguro para el backend
  raza: '',
  fechaNacimiento: '',
  ultimaVacuna: '',
  ultimaDesparasitacion: '',
  marcaComida: '',
  observacionesMedicas: ''
});

const handleSubmit = async () => {
  // Validación de contraseña solo si es registro nuevo
  if (!props.tutorExistente) {
    if (form.password !== form.confirmPassword) {
      emit('notify', { msg: "Las contraseñas no coinciden", type: 'error' });
      return;
    }
    if (form.password.length < 6) {
      emit('notify', { msg: "La contraseña debe tener mínimo 6 caracteres", type: 'error' });
      return;
    }
  }

  // Validación de fecha básica
  if (!form.fechaNacimiento) {
    emit('notify', { msg: "La fecha de nacimiento es obligatoria", type: 'error' });
    return;
  }

  loading.value = true; // ACTIVAR OVERLAY

  try {
    const url = props.tutorExistente?.id 
      ? `/mascotas/tutor/${props.tutorExistente.id}` 
      : '/auth/registro-completo'; 
    const payload = {
      nombre: form.nombreMascota, // El backend suele esperar "nombre" no "nombreMascota"
      especie: form.especie,
      raza: form.raza,
      fechaNacimiento: form.fechaNacimiento,
      peso: 0, // Valor por defecto
      sexo: 'MACHO', // Valor por defecto o agrega un select si quieres
      tutor: !props.tutorExistente ? {
        nombre: form.nombreTutor,
        apellido: form.apellidoTutor,
        email: form.emailTutor,
        cedula: form.cedula,
        password: form.password,
        rol: 'USER'
      } : undefined
    };

    if (form.ultimaVacuna) payload.ultimaVacuna = form.ultimaVacuna;
    if (form.marcaComida) payload.marcaComida = form.marcaComida;

    const { data } = await api.post(url, payload);

    emit('notify', { msg: "¡Expediente creado correctamente!", type: 'success' });
    
    setTimeout(() => {
      loading.value = false;
      emit('finalizado', data); 
    }, 1500);

  } catch (e) {
    loading.value = false;
    console.error(e);
    const errorMsg = e.response?.data?.message || "Error al procesar el registro";
    emit('notify', { msg: errorMsg, type: 'error' });
  }
};
</script>

<style scoped>
@reference "../../style.css";

.input-dark {
  @apply w-full bg-white/5 p-4 rounded-2xl border-2 border-transparent focus:border-[#DE1F27] outline-none font-bold text-white text-sm transition-all placeholder:text-white/30;
}

.label-min {
  @apply text-[7px] font-black text-slate-400 uppercase ml-2 tracking-widest mb-1 block;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #de1f27;
  border-radius: 10px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>