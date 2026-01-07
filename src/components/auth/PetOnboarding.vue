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
          <input v-model="form.password" type="password" placeholder="Contraseña" class="input-dark" required />
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
import { ref } from 'vue';
const props = defineProps(['tutorExistente']);
const emit = defineEmits(['finalizado', 'close', 'notify']);
const loading = ref(false);

const form = ref({
  nombreTutor: props.tutorExistente?.nombre || '',
  apellidoTutor: props.tutorExistente?.apellido || '',
  email: props.tutorExistente?.email || '',
  cedula: props.tutorExistente?.cedula || '',
  password: '',
  nombreMascota: '',
  especie: 'PERRO',
  raza: '',
  fechaNacimiento: '', // Agregado
  ultimaVacuna: null,
  ultimaDesparasitacion: null,
  marcaComida: '',
  observacionesMedicas: ''
});

const handleSubmit = async () => {
  loading.value = true;
  const token = localStorage.getItem('ps_token');

  try {
    const esMascotaNueva = props.tutorExistente?.id;
    const url = esMascotaNueva
      ? `https://api.petstationvet.com/api/mascotas/tutor/${props.tutorExistente.id}`
      : 'https://api.petstationvet.com/api/registro/completo';

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nombreTutor: form.value.nombreTutor,
        apellidoTutor: form.value.apellidoTutor,
        email: form.value.email,
        cedula: form.value.cedula,
        password: form.value.password,

        nombreMascota: form.value.nombreMascota, // ¡Aquí es donde antes decía solo 'nombre'!
        especie: form.value.especie,
        raza: form.value.raza,
        fechaNacimiento: form.value.fechaNacimiento
      })
    });

    const data = await res.json();

    if (res.ok) {
      emit('notify', { msg: "¡Expediente creado!", type: 'success' });
      if (esMascotaNueva) {
        emit('finalizado', { nuevaMascota: data });
      } else {
        emit('finalizado', data); // Si es registro completo, suele venir el tutor
      }
    } else {
      emit('notify', { msg: data.message || "Error al registrar", type: 'error' });
    }
  } catch (e) {
    emit('notify', { msg: "Error de conexión", type: 'error' });
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