<template>
  <div class="bg-white rounded-[2.5rem] p-8 max-w-xl w-full shadow-2xl relative text-slate-900 animate-in zoom-in duration-300">
    <button @click="$emit('close')" class="absolute top-6 right-6 text-slate-300 hover:text-ps-red text-2xl">✕</button>
    
    <div class="mb-8">
      <h2 class="text-3xl font-black text-[#152C77] uppercase italic tracking-tighter">
        {{ tutorExistente ? 'Nueva Mascota' : 'Crear Cuenta' }}
      </h2>
      <p class="text-slate-400 text-[10px] font-black uppercase mt-1">
        {{ tutorExistente ? `Para: ${tutorExistente.nombre}` : 'Regístrate para gestionar tus mascotas' }}
      </p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      
      <div v-if="!tutorExistente" class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <input v-model="form.nombreTutor" placeholder="Nombre" class="input-ps" required />
          <input v-model="form.apellidoTutor" placeholder="Apellido" class="input-ps" required />
        </div>
        <input v-model="form.email" type="email" placeholder="Email" class="input-ps" required />
        <input v-model="form.cedula" type="text" placeholder="Cédula" class="input-ps" required />
        <div class="space-y-1">
          <label class="px-2 text-[9px] font-black text-slate-400 uppercase">Establecer Contraseña</label>
          <input v-model="form.password" type="password" placeholder="Mínimo 6 caracteres" class="input-ps border-ps-red/20" required minlength="6" />
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 space-y-4">
        <label class="px-2 text-[9px] font-black text-[#152C77] uppercase italic">Datos de la Mascota</label>
        <input v-model="form.nombreMascota" placeholder="Nombre de la Mascota" class="input-ps" required />
        <div class="grid grid-cols-2 gap-3">
          <select v-model="form.especie" class="input-ps">
            <option value="PERRO">Perro</option>
            <option value="GATO">Gato</option>
          </select>
          <input v-model="form.raza" placeholder="Raza" class="input-ps" />
        </div>
      </div>

      <button type="submit" :disabled="loading" class="w-full bg-[#152C77] text-white font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-[#DE1F27] transition-all shadow-xl disabled:opacity-50">
        {{ loading ? 'Sincronizando...' : 'Confirmar Registro' }}
      </button>

      <div v-if="error" class="bg-red-50 p-3 rounded-xl text-[#DE1F27] text-[10px] font-black uppercase text-center italic border border-red-100">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps(['tutorExistente']);
const emit = defineEmits(['finalizado', 'close']);

const loading = ref(false);
const error = ref('');

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
  error.value = '';

  const url = props.tutorExistente 
    ? `http://localhost:8080/api/mascotas/tutor/${props.tutorExistente.id}` // Agregar mascota a tutor logueado
    : 'http://localhost:8080/api/registro/completo'; // Registro inicial de todo

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });
    const data = await res.json();
    if (res.ok) { emit('finalizado', data); } 
    else { error.value = data.error || "Error al registrar."; }
  } catch (e) { error.value = "Error de red."; }
  finally { loading.value = false; }
};
</script>

<style scoped>
.input-ps {
  width: 100%;
  background-color: #f1f5f9;
  padding: 1rem;
  border-radius: 1rem;
  outline: none;
  font-weight: 700;
  font-size: 0.875rem;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.input-ps:focus {
  box-shadow: 0 0 0 2px #152C77; /* Reemplaza el ring-2 */
}

/* Animación de entrada para el modal */
.animate-in {
  animation: zoomIn 0.3s ease-out;
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>