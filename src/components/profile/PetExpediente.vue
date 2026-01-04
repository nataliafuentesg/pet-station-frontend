<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 px-4 transition-colors duration-500">
    
    <div v-if="loading" class="flex flex-col items-center justify-center py-40 gap-4">
      <div class="w-12 h-12 border-4 border-[#152C77] border-t-[#DE1F27] rounded-full animate-spin"></div>
      <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Sincronizando...</p>
    </div>

    <div v-else-if="petData" class="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      <div class="bg-slate-50 dark:bg-white/5 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-2xl border border-slate-100 dark:border-white/5">
        <div class="relative group cursor-pointer" @click="$refs.fileInput.click()">
          <div :class="['w-44 h-44 rounded-[2.5rem] border-4 overflow-hidden shadow-2xl transform -rotate-3 transition-all duration-500 bg-white flex items-center justify-center', 
            justSavedPhoto ? 'border-green-500 scale-105 rotate-0' : 'border-[#152C77] dark:border-[#DE1F27]']">
            <img v-if="form.fotoUrl" :src="form.fotoUrl" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-[#152C77] flex items-center justify-center text-5xl font-black text-white italic">
              {{ petData.nombre.charAt(0) }}
            </div>
          </div>
          <div class="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform -rotate-3 group-hover:rotate-0">
            <div class="flex flex-col items-center gap-2">
              <div v-if="compressing || savingPhoto" class="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              <span class="text-white text-[8px] font-black uppercase tracking-widest text-center px-4">Cambiar Foto</span>
            </div>
          </div>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
        </div>

        <div class="flex-1 text-center md:text-left">
          <h1 class="text-6xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white mb-2">{{ petData.nombre }}</h1>
          <p class="text-slate-400 dark:text-white/40 font-bold uppercase text-xs tracking-[0.2em]">{{ petData.especie }} • {{ petData.raza }}</p>
        </div>
      </div>

      <div class="flex gap-4 mb-4">
        <button @click="activeTab = 'pet'" :class="['px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all', activeTab === 'pet' ? 'bg-[#152C77] text-white shadow-lg' : 'bg-slate-100 text-slate-400 dark:bg-white/5']">Expediente Médico</button>
        <button @click="activeTab = 'tutor'" :class="['px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all', activeTab === 'tutor' ? 'bg-[#DE1F27] text-white shadow-lg' : 'bg-slate-100 text-slate-400 dark:bg-white/5']">Mi Perfil (Tutor)</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 bg-white dark:bg-white/5 rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-white/5">
          
          <div v-if="activeTab === 'pet'">
            <h3 class="text-xl font-black uppercase italic text-[#152C77] dark:text-white mb-8 border-b dark:border-white/10 pb-6">Ficha de Salud</h3>
            <form @submit.prevent="saveProfile" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="(label, key) in medicalFields" :key="key" :class="key === 'alergiasOpcional' || key === 'observacionesMedicas' ? 'md:col-span-2' : ''" class="flex flex-col gap-2">
                <label class="text-[9px] font-black uppercase text-slate-400 dark:text-white/30 ml-4 tracking-widest">{{ label }}</label>
                <textarea v-if="key.includes('alergias') || key.includes('observaciones')" v-model="form[key]" class="w-full bg-slate-50 dark:bg-white/10 p-4 rounded-2xl border-2 border-transparent focus:border-[#152C77] outline-none font-bold dark:text-white text-sm h-24 resize-none"></textarea>
                <input v-else v-model="form[key]" :type="key.includes('ultima') ? 'date' : 'text'" class="w-full bg-slate-50 dark:bg-white/10 p-4 rounded-2xl border-2 border-transparent focus:border-[#152C77] outline-none font-bold dark:text-white text-sm" />
              </div>
              <button :disabled="saving" class="md:col-span-2 bg-[#152C77] text-white py-6 rounded-3xl font-black uppercase shadow-xl hover:scale-[1.02] transition-all">
                {{ saving ? 'Guardando...' : 'Actualizar Expediente' }}
              </button>
            </form>
          </div>

          <div v-else>
            <h3 class="text-xl font-black uppercase italic text-[#DE1F27] mb-8 border-b dark:border-white/10 pb-6">Información Personal</h3>
            <form @submit.prevent="saveTutor" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="(label, key) in tutorFields" :key="key" :class="key === 'direccion' ? 'md:col-span-2' : ''" class="flex flex-col gap-2">
                <label class="text-[9px] font-black uppercase text-slate-400 dark:text-white/30 ml-4 tracking-widest">{{ label }}</label>
                
                <input 
                  v-model="tutorForm[key]" 
                  type="text" 
                  :readonly="key === 'email' || key === 'cedula'"
                  :class="[
                    'w-full p-4 rounded-2xl border-2 border-transparent outline-none font-bold text-sm transition-all',
                    (key === 'email' || key === 'cedula') 
                      ? 'bg-slate-200 dark:bg-white/5 opacity-50 cursor-not-allowed text-slate-500' 
                      : 'bg-slate-50 dark:bg-white/10 focus:border-[#DE1F27] dark:text-white'
                  ]" 
                />
              </div>
              <button :disabled="saving" class="md:col-span-2 bg-[#DE1F27] text-white py-6 rounded-3xl font-black uppercase shadow-xl hover:scale-[1.02] transition-all mt-4">
                {{ saving ? 'Guardando...' : 'Actualizar mis datos' }}
              </button>
            </form>
          </div>
        </div>

        <div class="bg-slate-50 dark:bg-white/5 rounded-[3rem] p-10 border border-slate-100 dark:border-white/5 shadow-xl h-fit">
          <h3 class="text-xl font-black uppercase italic text-[#DE1F27] mb-8 border-b dark:border-white/10 pb-4">Próximas Visitas</h3>
          <div class="space-y-4">
            <div v-if="filteredAppointments.length === 0" class="text-center py-10 opacity-30 font-black uppercase text-[10px] italic dark:text-white">
              No hay citas pendientes
            </div>
            <div v-for="cita in filteredAppointments" :key="cita.id" class="p-6 bg-white dark:bg-white/5 rounded-[2rem] border-l-8 border-[#152C77] shadow-sm">
              <p class="text-[9px] font-black text-slate-400 uppercase mb-1">{{ formatDate(cita.fechaHora) }}</p>
              <h4 class="font-black text-[#152C77] dark:text-white uppercase text-sm italic">{{ cita.servicioTipo }}</h4>
              <p class="text-[10px] text-slate-500 mt-2 italic">"{{ cita.motivo }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';

const props = defineProps(['pet', 'tutor']);
const emit = defineEmits(['update-pet', 'update-tutor', 'notify']);

const loading = ref(true);
const saving = ref(false);
const savingPhoto = ref(false);
const compressing = ref(false);
const justSavedPhoto = ref(false);
const activeTab = ref('pet');
const petData = ref(null);
const appointments = ref([]);

// Form Mascota
const form = reactive({
  fotoUrl: '', pesoActual: '', ultimaVacuna: '', ultimaDesparasitacion: '',
  marcaComida: '', frecuenciaBano: '', snacksFavoritos: '', alergiasOpcional: '', observacionesMedicas: ''
});

// Form Tutor
const tutorForm = reactive({ 
  nombre: '', 
  apellido: '', 
  cedula: '', 
  telefono: '', 
  email: '', 
  direccion: '' 
});

const medicalFields = {
  pesoActual: 'Peso Actual (kg)', ultimaVacuna: 'Última Vacuna',
  ultimaDesparasitacion: 'Última Desparasitación', marcaComida: 'Marca de Alimento',
  frecuenciaBano: 'Frecuencia Baño', snacksFavoritos: 'Snacks Favoritos',
  alergiasOpcional: 'Alergias o Condiciones', observacionesMedicas: 'Observaciones'
};

const tutorFields = { 
  nombre: 'Nombre', 
  apellido: 'Apellido', 
  cedula: 'Cédula (No editable)', 
  telefono: 'Teléfono', 
  email: 'Email (No editable)', 
  direccion: 'Dirección' 
};

// Citas futuras
const filteredAppointments = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return appointments.value
    .filter(cita => new Date(cita.fechaHora) >= today)
    .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));
});

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('es-ES', { 
    weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
  });
};

const loadAllData = async () => {
  if (!props.pet?.id) return;
  loading.value = true;
  try {
    const [resP, resT, resC] = await Promise.all([
      fetch(`http://localhost:8080/api/mascotas/${props.pet.id}`),
      props.tutor?.id ? fetch(`http://localhost:8080/api/tutores/${props.tutor.id}`) : null,
      fetch(`http://localhost:8080/api/citas/mascota/${props.pet.id}`)
    ]);
    
    if (resP.ok) {
      const data = await resP.json();
      petData.value = data;
      Object.assign(form, data);
    }
    
    if (resT && resT.ok) {
      const tData = await resT.json();
      Object.assign(tutorForm, tData);
    }
    
    if (resC.ok) appointments.value = await resC.json();
  } catch (error) {
    emit('notify', 'Error al cargar datos', 'error');
  } finally { 
    loading.value = false; 
  }
};

const saveProfile = async () => {
  saving.value = true;
  try {
    const res = await fetch(`http://localhost:8080/api/mascotas/${props.pet.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...petData.value, ...form })
    });
    if (res.ok) {
      const updated = await res.json();
      emit('update-pet', updated);
      emit('notify', 'Expediente médico actualizado');
    }
  } finally { saving.value = false; }
};

const saveTutor = async () => {
  saving.value = true;
  try {
    const res = await fetch(`http://localhost:8080/api/tutores/${props.tutor.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tutorForm)
    });
    if (res.ok) {
      const updated = await res.json();
      Object.assign(tutorForm, updated);
      emit('update-tutor', updated);
      emit('notify', 'Datos del tutor actualizados');
    } else {
      emit('notify', 'Error al guardar (Verifica el Backend)', 'error');
    }
  } catch (e) {
    emit('notify', 'Error de red', 'error');
  } finally { 
    saving.value = false; 
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  compressing.value = true;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 800;
      let w = img.width, h = img.height;
      if (w > h) { if (w > MAX) { h *= MAX/w; w = MAX; } }
      else { if (h > MAX) { w *= MAX/h; h = MAX; } }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      form.fotoUrl = canvas.toDataURL('image/jpeg', 0.7);
      compressing.value = false;
      autoSavePhoto();
    };
  };
  reader.readAsDataURL(file);
};

const autoSavePhoto = async () => {
  savingPhoto.value = true;
  try {
    const res = await fetch(`http://localhost:8080/api/mascotas/${props.pet.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...petData.value, fotoUrl: form.fotoUrl })
    });
    if (res.ok) {
      const updated = await res.json();
      petData.value = updated;
      emit('update-pet', updated);
      justSavedPhoto.value = true;
      setTimeout(() => justSavedPhoto.value = false, 2000);
    }
  } finally { savingPhoto.value = false; }
};

onMounted(loadAllData);
watch(() => props.pet?.id, loadAllData);
</script>