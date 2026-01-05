<template>
  <div class="relative w-full max-w-2xl bg-ps-black rounded-[3rem] shadow-2xl border border-white/5 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
    <button @click="$emit('close')" class="absolute top-6 right-6 z-[120] w-10 h-10 flex items-center justify-center bg-ps-red text-white rounded-xl shadow-lg hover:rotate-90 transition-all cursor-pointer">✕</button>

    <div class="p-10 md:p-12 overflow-y-auto custom-scrollbar">
      <div class="text-center mb-10">
        <h2 class="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
          CREAR <span class="text-ps-red">CUENTA.</span>
        </h2>
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3 italic">Registro de Tutor y Mascota</p>
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
          <p class="text-[10px] font-black text-ps-red uppercase tracking-widest text-center italic">Datos de la mascota</p>
          <input v-model="form.nombreMascota" placeholder="Nombre de la mascota" class="input-dark" required />
          <div class="grid grid-cols-2 gap-4">
            <select v-model="form.especie" class="input-dark appearance-none">
              <option value="PERRO">Perro 🐶</option>
              <option value="GATO">Gato 🐱</option>
            </select>
            <input v-model="form.raza" placeholder="Raza" class="input-dark" />
          </div>
        </div>

        <button :disabled="loading" type="submit" class="w-full bg-white text-ps-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-ps-red hover:text-white active:scale-95 transition-all italic shadow-xl">
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
  raza: ''
});

const handleSubmit = async () => {
  loading.value = true;
  const token = localStorage.getItem('ps_token');

  try {
    // Definimos si es un registro de CERO o una mascota ADICIONAL
    const esMascotaNueva = props.tutorExistente?.id;
    
    // Si el tutor existe, usamos la ruta de "añadir", si no, la de "registro completo"
    const url = esMascotaNueva 
      ? `http://localhost:8080/api/mascotas/tutor/${props.tutorExistente.id}` 
      : 'http://localhost:8080/api/registro/completo';

    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // VITAL para que no de 403
      },
      body: JSON.stringify({
        // Si es mascota nueva para un tutor existente, enviamos solo los datos de la mascota
        nombre: form.value.nombreMascota,
        especie: form.value.especie,
        raza: form.value.raza,
        // Si es registro completo, mandamos todo el objeto form.value
        ...(!esMascotaNueva && form.value)
      })
    });

    const data = await res.json();

    if (res.ok) {
      emit('notify', { msg: "¡Nueva mascota vinculada!", type: 'success' });
      // IMPORTANTE: data debe ser el objeto Tutor actualizado con su nueva lista de mascotas
      emit('finalizado', data); 
    } else {
      emit('notify', { msg: data.message || "Error al crear mascota", type: 'error' });
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
.input-dark { @apply w-full bg-white/5 p-4 rounded-2xl border-2 border-transparent focus:border-ps-red outline-none font-bold text-white text-sm transition-all; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #de1f27; border-radius: 10px; }
</style>