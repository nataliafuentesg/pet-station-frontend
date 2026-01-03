<template>
  <div class="bg-white rounded-t-[2.5rem] md:rounded-[3rem] p-6 md:p-10 max-w-xl w-full shadow-2xl relative text-slate-900 animate-scale-up overflow-y-auto max-h-[90vh]">
    <button @click="$emit('close')" class="absolute top-6 right-6 text-slate-300 hover:text-ps-red text-2xl transition-colors">✕</button>
    
    <div class="mb-6 md:mb-8">
      <h2 class="text-2xl md:text-3xl font-black text-[#152C77] uppercase italic leading-none">
        {{ tutorExistente ? 'Nueva' : 'Registro' }} 
        <span class="text-[#DE1F27]">Mascota</span>
      </h2>
      <p v-if="tutorExistente" class="text-slate-400 text-[10px] font-black uppercase mt-2">
        Agregando a: <span class="text-[#152C77]">{{ tutorExistente.nombre }}</span>
      </p>
      <p v-else class="text-slate-400 text-[10px] font-black uppercase mt-2">
        Crea tu cuenta de tutor y el perfil de tu mascota
      </p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      
      <div v-if="!tutorExistente" class="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input v-model="form.nombreTutor" placeholder="Tu Nombre Completo" class="w-full bg-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#152C77] font-bold text-sm" required />
          <input v-model="form.email" type="email" placeholder="Correo Electrónico" class="w-full bg-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#152C77] font-bold text-sm" required />
        </div>
        
        <div class="space-y-1">
          <label class="px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Identificación (Cédula/NIT)</label>
          <input v-model="form.cedula" type="text" placeholder="Número de documento" class="w-full bg-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#152C77] font-bold text-sm" required />
        </div>
      </div>

      <div class="space-y-3 pt-2 border-t border-slate-100">
        <label class="px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Datos de la Mascota</label>
        
        <input v-model="form.nombre" placeholder="Nombre de la Mascota (Ej: Max)" class="w-full bg-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#152C77] font-bold text-sm" required />
        
        <div class="grid grid-cols-2 gap-3">
          <select v-model="form.especie" class="w-full bg-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#152C77] font-bold text-sm appearance-none">
            <option value="PERRO">Perro 🐶</option>
            <option value="GATO">Gato 🐱</option>
            <option value="Otro">Otro 🐾</option>
          </select>
          <input v-model="form.raza" placeholder="Raza" class="w-full bg-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#152C77] font-bold text-sm" />
        </div>
      </div>

      <button type="submit" :disabled="loading" class="w-full bg-[#152C77] text-white font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-[#DE1F27] transition-all shadow-xl active:scale-95 disabled:opacity-50 mt-4">
        {{ loading ? 'Sincronizando...' : (tutorExistente ? 'Añadir a la familia' : 'Completar Registro') }}
      </button>

      <div v-if="error" class="mt-4 bg-red-50 p-3 rounded-xl border border-red-100 text-[#DE1F27] text-[10px] font-black uppercase text-center italic">
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

// CAMBIO CLAVE: "nombre" en lugar de "nombreMascota" para que Java lo entienda
const form = ref({
  nombreTutor: props.tutorExistente?.nombre || '',
  email: props.tutorExistente?.email || '',
  cedula: props.tutorExistente?.cedula || '',
  nombre: '', 
  especie: 'PERRO',
  raza: ''
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  // Ruta corregida a /api/mascotas/tutor/
  const url = props.tutorExistente 
    ? `http://localhost:8080/api/mascotas/tutor/${props.tutorExistente.id}`
    : 'http://localhost:8080/api/registro/completo';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });

    const data = await res.json();

    if (res.ok) {
      // Emitimos el éxito para que App.vue refresque el tutor
      emit('finalizado', data); 
    } else {
      error.value = data.message || "Error al guardar.";
    }
  } catch (e) {
    error.value = "Sin conexión con PetStation.";
  } finally {
    loading.value = false;
  }
};
</script>