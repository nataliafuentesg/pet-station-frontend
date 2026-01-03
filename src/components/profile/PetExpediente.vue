<template>
  <div v-if="pet && tutor" class="max-w-7xl mx-auto px-4 md:px-8 space-y-10 pb-32 pt-32 md:pt-44 text-slate-900">
    
    <transition name="fade">
      <div v-if="mensaje" 
           :class="mensaje.tipo === 'error' ? 'bg-red-500' : 'bg-[#152C77]'" 
           class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[500] px-8 py-4 rounded-full text-white font-black uppercase text-[11px] shadow-2xl backdrop-blur-md flex items-center gap-3 border border-white/20">
        <span class="text-lg">{{ mensaje.tipo === 'error' ? '⚠️' : '✨' }}</span>
        {{ mensaje.texto }}
      </div>
    </transition>

    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h2 class="text-4xl font-black text-[#152C77] uppercase italic leading-none tracking-tighter">
          Expediente <span class="text-[#DE1F27]">Digital</span>
        </h2>
        <p class="text-slate-400 text-[10px] font-black uppercase mt-2 tracking-[0.2em]">Gestión centralizada de salud y servicios</p>
      </div>

      <div class="flex p-1 bg-slate-200/60 backdrop-blur-sm rounded-2xl border border-slate-300/50 shadow-inner">
        <button @click="tab = 'pet'" 
          :class="tab === 'pet' ? 'bg-white text-[#152C77] shadow-md' : 'text-slate-500 hover:text-slate-800'"
          class="px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all">
          Mascota
        </button>
        <button @click="tab = 'tutor'" 
          :class="tab === 'tutor' ? 'bg-white text-[#152C77] shadow-lg' : 'text-slate-500 hover:text-slate-800'"
          class="px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all">
          Tutor
        </button>
      </div>
    </div>

    <div v-if="tab === 'pet'" class="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <form @submit.prevent="updatePet" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
            <h3 class="text-[#152C77] font-black uppercase text-[11px] tracking-widest italic flex items-center gap-2 mb-8 border-b border-slate-50 pb-4">
              <span class="bg-[#152C77] text-white p-2 rounded-xl not-italic shadow-lg shadow-[#152C77]/20">🐾</span> Identidad
            </h3>
            
            <div class="space-y-6">
              <div>
                <label class="ml-4 text-[9px] font-black text-slate-400 uppercase tracking-tighter">Nombre de la Mascota</label>
                <input v-model="formPet.nombre" type="text" class="input-field" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="ml-4 text-[9px] font-black text-slate-400 uppercase tracking-tighter">Especie</label>
                  <select v-model="formPet.especie" class="input-field cursor-pointer">
                    <option value="PERRO">Perro</option>
                    <option value="GATO">Gato</option>
                  </select>
                </div>
                <div>
                  <label class="ml-4 text-[9px] font-black text-slate-400 uppercase tracking-tighter">Sexo</label>
                  <select v-model="formPet.sexo" class="input-field cursor-pointer">
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="ml-4 text-[9px] font-black text-slate-400 uppercase tracking-tighter">Peso Actual (Kg)</label>
                <input v-model.number="formPet.pesoActual" type="number" step="0.1" class="input-field" />
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8 bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          <h3 class="text-[#152C77] font-black uppercase text-[11px] tracking-widest italic flex items-center gap-2 mb-10 border-b border-slate-50 pb-4">
            <span class="bg-[#DE1F27] text-white p-2 rounded-xl not-italic shadow-lg shadow-[#DE1F27]/20">🩺</span> Historial Clínico
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div v-for="(label, key) in medicalFields" :key="key" class="space-y-1">
              <label class="ml-4 text-[9px] font-black text-slate-400 uppercase tracking-tighter">{{ label }}</label>
              <input v-model="formPet[key]" :type="key.includes('ultima') ? 'date' : 'text'" 
                class="input-field" />
            </div>

            <div class="md:col-span-2 space-y-1">
              <label class="ml-4 text-[9px] font-black text-slate-400 uppercase tracking-tighter">Observaciones Médicas</label>
              <textarea v-model="formPet.observacionesMedicas" 
                class="w-full bg-slate-50 p-6 rounded-[2rem] border-2 border-transparent focus:border-[#152C77] focus:bg-white text-sm font-bold h-32 resize-none outline-none transition-all shadow-sm"></textarea>
            </div>
          </div>

          <div class="mt-10">
            <button type="submit" :disabled="loading" 
              class="w-full bg-[#152C77] text-white font-black py-6 rounded-2xl uppercase text-xs tracking-[0.2em] hover:bg-[#DE1F27] transition-all shadow-xl disabled:opacity-50">
              {{ loading ? 'Sincronizando...' : 'Actualizar Expediente' }}
            </button>
          </div>
        </div>
      </form>

      <div class="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-xl border border-slate-100">
        <h3 class="text-[#152C77] font-black uppercase text-[11px] tracking-widest italic flex items-center gap-2 mb-8">
          <span class="bg-amber-100 text-amber-600 p-2 rounded-xl not-italic shadow-sm">📅</span> Próximas Citas
        </h3>
        <div v-if="citas.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="cita in citas" :key="cita.id" 
            class="group bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:border-[#152C77]/30 transition-all relative overflow-hidden">
            <div :class="cita.servicioTipo === 'PELUQUERIA' ? 'bg-[#DE1F27]' : 'bg-[#152C77]'" class="absolute left-0 top-0 bottom-0 w-2"></div>
            <h4 class="font-black text-slate-800 uppercase text-lg italic">{{ formatFecha(cita.fechaHora) }}</h4>
            <p class="text-[10px] font-black text-slate-400 mt-2 uppercase">{{ cita.servicioTipo }}</p>
          </div>
        </div>
        <div v-else class="text-center py-20 bg-slate-50/50 rounded-[3rem] border-4 border-dashed border-slate-100">
          <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest italic">Sin citas programadas</p>
        </div>
      </div>
    </div>

    <div v-if="tab === 'tutor'" class="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <form @submit.prevent="updateTutor" class="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100">
        <h3 class="text-[#152C77] font-black uppercase text-[11px] tracking-widest italic flex items-center gap-2 mb-10 border-b border-slate-50 pb-4">
          <span class="bg-green-100 text-green-600 p-2 rounded-xl not-italic shadow-sm">👤</span> Perfil Responsable
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="field in tutorFields" :key="field.id" class="space-y-1">
            <label class="ml-4 text-[9px] font-black text-slate-400 uppercase tracking-tighter">{{ field.label }}</label>
            <input v-model="formTutor[field.id]" type="text" class="input-field" />
          </div>
        </div>
        <button type="submit" :disabled="loading" 
          class="w-full bg-[#DE1F27] text-white font-black py-6 rounded-2xl uppercase text-[11px] tracking-[0.2em] mt-10 hover:bg-[#152C77] transition-all shadow-xl">
          {{ loading ? 'Sincronizando...' : 'Guardar Información de Contacto' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps(['pet', 'tutor']);
const emit = defineEmits(['update-pet', 'update-tutor']);

const tab = ref('pet');
const loading = ref(false);
const mensaje = ref(null);
const citas = ref([]);

const formPet = ref({});
const formTutor = ref({});

const medicalFields = {
  ultimaVacuna: 'Vacunación',
  ultimaDesparasitacion: 'Desparasitación',
  marcaComida: 'Alimentación',
  snacksFavoritos: 'Premios',
  frecuenciaBano: 'Baño',
  alergiasOpcional: 'Alergias'
};

const tutorFields = [
  { id: 'nombre', label: 'Nombre' },
  { id: 'apellido', label: 'Apellido' },
  { id: 'telefono', label: 'Teléfono' },
  { id: 'direccion', label: 'Dirección' }
];

const cargarCitas = async () => {
  if (!props.pet?.id) return;
  try {
    const res = await fetch(`http://localhost:8080/api/citas/mascota/${props.pet.id}`);
    if (res.ok) {
      citas.value = await res.json();
    }
  } catch (e) {
    console.warn("Error al cargar citas");
  }
};

const formatFecha = (fechaStr) => {
  return new Date(fechaStr).toLocaleString('es-CO', { 
    day: '2-digit', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const mostrarFeedback = (texto, tipo = 'success') => {
  mensaje.value = { texto, tipo };
  setTimeout(() => { mensaje.value = null; }, 3000);
};

const updatePet = async () => {
  loading.value = true;
  try {
    const res = await fetch(`http://localhost:8080/api/mascotas/${props.pet.id}/completar-perfil`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formPet.value)
    });
    if (res.ok) {
      const data = await res.json();
      emit('update-pet', data);
      mostrarFeedback('¡Expediente actualizado!');
    }
  } catch (e) {
    mostrarFeedback('Error de conexión', 'error');
  } finally {
    loading.value = false;
  }
};

const updateTutor = async () => {
  loading.value = true;
  try {
    const res = await fetch(`http://localhost:8080/api/tutores/${props.tutor.id}/actualizar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formTutor.value)
    });
    if (res.ok) {
      const data = await res.json();
      emit('update-tutor', data);
      mostrarFeedback('Tutor actualizado');
    }
  } catch (e) {
    mostrarFeedback('Error al actualizar tutor', 'error');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (props.pet) {
    formPet.value = JSON.parse(JSON.stringify(props.pet));
    cargarCitas();
  }
  if (props.tutor) {
    formTutor.value = JSON.parse(JSON.stringify(props.tutor));
  }
});

watch(() => props.pet?.id, (newId) => {
  if (newId) {
    formPet.value = JSON.parse(JSON.stringify(props.pet));
    cargarCitas();
  }
}, { immediate: true });
</script>

<style scoped>
.input-field {
  width: 100%;
  background-color: #f8fafc; /* slate-50 */
  padding: 1rem;
  border-radius: 1rem;
  border-width: 2px;
  border-color: transparent;
  font-size: 0.875rem; /* text-sm */
  font-weight: 700;
  outline: none;
  transition: all 0.3s;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.input-field:focus {
  border-color: #152C77;
  background-color: white;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>