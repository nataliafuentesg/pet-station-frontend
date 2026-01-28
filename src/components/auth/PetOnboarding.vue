<template>
  <div
    class="relative w-full max-w-2xl bg-ps-black rounded-[3rem] shadow-2xl border border-white/5 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
    <button @click="$emit('close')"
      class="absolute top-6 right-6 z-[120] w-10 h-10 flex items-center justify-center bg-ps-red text-white rounded-xl shadow-lg hover:rotate-90 transition-all cursor-pointer">✕</button>

    <div class="p-10 md:p-12 overflow-y-auto custom-scrollbar">
      <div class="text-center mb-10">
        <h2 class="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
          {{ tutorExistente ? 'NUEVA' : 'CREAR' }} <span class="text-ps-red">MASCOTA.</span>
        </h2>
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3 italic">Registro de Salud e
          Información</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="!tutorExistente" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="form.nombreTutor" placeholder="Nombre" class="input-dark" required />
          <input v-model="form.apellidoTutor" placeholder="Apellido" class="input-dark" required />
          <input v-model="form.email" type="email" placeholder="Email" class="input-dark md:col-span-2" required />
          <input v-model="form.cedula" placeholder="Cédula" class="input-dark" required />

          <div class="relative">
            <input v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Contraseña"
              class="input-dark pr-12" required />
            <button type="button" @click="showPass = !showPass"
              class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100">
              {{ showPass ? '👁️‍🗨️' : '👁️' }}
            </button>
          </div>

          <div class="relative">
            <input v-model="form.confirmPassword" :type="showConfirmPass ? 'text' : 'password'" placeholder="Confirmar"
              class="input-dark pr-12" required />
            <button type="button" @click="showConfirmPass = !showConfirmPass"
              class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100">
              {{ showConfirmPass ? '👁️‍🗨️' : '👁️' }}
            </button>
          </div>
        </div>

        <div class="h-px bg-white/5 w-full my-6"></div>

        <div class="space-y-4">
          <p class="text-[10px] font-black text-ps-red uppercase tracking-widest text-center italic">Datos del Paciente
          </p>
          <input v-model="form.nombreMascota" placeholder="Nombre de la mascota" class="input-dark" required />

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select v-model="form.especie" class="input-dark">
              <option value="PERRO">Perro 🐶</option>
              <option value="GATO">Gato 🐱</option>
            </select>
            <input v-model="form.raza" placeholder="Raza" class="input-dark" />
            <div class="relative">
              <label
                class="absolute -top-2 left-3 bg-ps-black px-2 text-[8px] text-ps-red font-black uppercase">Nacimiento</label>
              <input v-model="form.fechaNacimiento" type="date" class="input-dark" required />
            </div>
          </div>
        </div>

        <div class="bg-white/5 p-6 rounded-[2rem] space-y-4 border border-white/5">
          <p class="text-[9px] font-black text-ps-blue uppercase tracking-widest italic mb-2">Historial Preventivo</p>

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
            <label class="label-min">Alimento / Marca Actual</label>
            <input v-model="form.marcaComida" placeholder="Ej: Royal Canin Adulto" class="input-dark mt-1" />
          </div>

          <div>
            <label class="label-min">Observaciones Médicas / Alergias</label>
            <textarea v-model="form.observacionesMedicas" placeholder="Alergias, cirugías previas o temperamento..."
              class="input-dark mt-1 h-20 text-xs"></textarea>
          </div>
        </div>

        <button :disabled="loading" type="submit"
          class="w-full bg-white text-ps-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-ps-red hover:text-white active:scale-95 transition-all italic shadow-xl">
          {{ loading ? 'Procesando...' : 'Confirmar Registro' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import api from '@/api/axios'; 

const props = defineProps(['tutorExistente']);
const emit = defineEmits(['finalizado', 'close', 'notify']);
const loading = ref(false);
const showPass = ref(false);
const showConfirmPass = ref(false);

const form = reactive({
  nombreTutor: props.tutorExistente?.nombre || '',
  apellidoTutor: props.tutorExistente?.apellido || '',
  email: props.tutorExistente?.email || '',
  cedula: props.tutorExistente?.cedula || '',
  password: '',
  confirmPassword: '', 
  nombreMascota: '',
  especie: 'PERRO',
  raza: '',
  fechaNacimiento: '',
  ultimaVacuna: null,
  ultimaDesparasitacion: null,
  marcaComida: '',
  observacionesMedicas: ''
});
const passwordsMatch = computed(() => {
  if (props.tutorExistente) return true;
  return form.password === form.confirmPassword;
});
const handleSubmit = async () => {
  if (!props.tutorExistente && (form.password !== form.confirmPassword)) {
    emit('notify', { msg: "Las contraseñas no coinciden", type: 'error' });
    return;
  }

  loading.value = true;
  try {
    const idTutor = props.tutorExistente?.id;
    const url = idTutor ? `/mascotas/tutor/${idTutor}` : '/registro/completo';
    const payload = {
      ...form,
      nombre: form.nombreMascota,
      password: idTutor ? null : form.password 
    };
    
    delete payload.confirmPassword;
    delete payload.nombreMascota;

    const { data } = await api.post(url, payload);

    emit('notify', { msg: "¡Expediente creado!", type: 'success' });
    emit('finalizado', data); 
    
  } catch (e) {
    const errorMsg = e.response?.data?.message || "Error al procesar el registro";
    emit('notify', { msg: errorMsg, type: 'error' });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@reference "../../style.css";

.input-dark {
  @apply w-full bg-white/5 p-4 rounded-2xl border-2 border-transparent focus:border-ps-red outline-none font-bold text-white text-sm transition-all;
}

.label-min {
  @apply text-[8px] font-bold text-slate-400 uppercase ml-2 tracking-widest;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #de1f27;
  border-radius: 10px;
}
</style>