<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-10 pb-20 px-4 transition-colors duration-500">

    <div v-if="loading" class="flex flex-col items-center justify-center py-40 gap-4">
      <div class="w-12 h-12 border-4 border-ps-blue border-t-ps-red rounded-full animate-spin"></div>
      <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Sincronizando con la nube...</p>
    </div>

    <div v-else-if="petData" class="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">

      <div
        class="bg-slate-50 dark:bg-white/5 rounded-[3.5rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-2xl border border-slate-100 dark:border-white/5">

        <div class="relative group cursor-pointer" @click="$refs.fileInput.click()">
          <div :class="['w-44 h-44 rounded-[2.5rem] border-4 overflow-hidden shadow-2xl transform -rotate-3 transition-all duration-500 bg-white flex items-center justify-center relative',
            justSavedPhoto ? 'border-green-500 scale-105 rotate-0' : 'border-ps-blue dark:border-ps-red']">

            <img v-if="form.fotoUrl" :src="form.fotoUrl" class="w-full h-full object-cover" />
            <div v-else
              class="w-full h-full bg-ps-blue flex items-center justify-center text-5xl font-black text-white italic">
              {{ form.nombre ? form.nombre.charAt(0) : '?' }}
            </div>

            <div
              class="absolute bottom-3 right-3 bg-white/20 backdrop-blur-md border border-white/50 p-2 rounded-xl shadow-lg z-20">
              <svg v-if="!compressing && !savingPhoto" xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          <div
            class="absolute inset-0 bg-black/40 rounded-[2.5rem] hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform -rotate-3 group-hover:rotate-0">
            <span class="text-white text-[8px] font-black uppercase tracking-widest text-center px-4">Cambiar
              Foto</span>
          </div>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
        </div>

        <div class="flex-1 text-center md:text-left">
          <span
            class="bg-ps-red/10 text-ps-red px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 inline-block italic">Expediente
            Oficial</span>
          <h1
            class="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-ps-blue dark:text-white leading-none mb-4">
            {{ form.nombre }}</h1>
          <p class="text-slate-400 dark:text-white/40 font-black uppercase text-[10px] tracking-[0.4em]">{{ form.especie
            }} • {{ form.raza }}</p>
        </div>
      </div>

      <div class="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 w-fit rounded-2xl">
        <button @click="activeTab = 'pet'"
          :class="['px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', activeTab === 'pet' ? 'bg-ps-blue text-white shadow-xl scale-105' : 'text-slate-400 hover:text-ps-blue']">Mascota</button>
        <button @click="activeTab = 'tutor'"
          :class="['px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', activeTab === 'tutor' ? 'bg-ps-red text-white shadow-xl scale-105' : 'text-slate-400 hover:text-ps-red']">Tutor</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div
          class="lg:col-span-2 bg-slate-50 dark:bg-white/5 rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-white/5">

          <div v-if="activeTab === 'pet'" class="animate-in slide-in-from-left duration-500">
            <h3
              class="text-2xl font-black uppercase italic text-ps-blue dark:text-white mb-10 border-b dark:border-white/10 pb-6">
              Ficha del Paciente</h3>

            <form @submit.prevent="saveProfile" class="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div
                class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-ps-blue/5 p-6 rounded-3xl mb-4 border border-ps-blue/10">
                <div class="flex flex-col gap-2">
                  <label class="label-exp">Nombre de Mascota</label>
                  <input v-model="form.nombre" class="input-dark-expediente" required />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="label-exp">Especie</label>
                  <select v-model="form.especie" class="input-dark-expediente">
                    <option value="CANINO">Perro 🐶</option>
                    <option value="FELINO">Gato 🐱</option>
                  </select>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="label-exp">Fecha Nacimiento</label>
                  <input v-model="form.fechaNacimiento" type="date" class="input-dark-expediente" />
                </div>
              </div>

              <div v-for="(label, key) in medicalFields" :key="key"
                :class="['flex flex-col gap-2', (key === 'alergiasOpcional' || key === 'observacionesMedicas') ? 'md:col-span-2' : '']">
                <label class="label-exp">{{ label }}</label>

                <textarea v-if="key.includes('alergias') || key.includes('observaciones')" v-model="form[key]"
                  class="input-dark-expediente h-24 resize-none"></textarea>

                <input v-else v-model="form[key]"
                  :type="key.includes('ultima') ? 'date' : (key === 'pesoActual' ? 'number' : 'text')" step="0.1"
                  class="input-dark-expediente" />
              </div>

              <button :disabled="saving"
                class="md:col-span-2 bg-ps-blue text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:brightness-110 active:scale-95 transition-all mt-6">
                {{ saving ? 'Sincronizando...' : 'Actualizar Expediente' }}
              </button>
            </form>
          </div>

          <div v-else class="animate-in slide-in-from-right duration-500">
            <h3 class="text-2xl font-black uppercase italic text-ps-red mb-10 border-b dark:border-white/10 pb-6">Datos
              Personales</h3>
            <form @submit.prevent="saveTutor" class="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div v-for="(label, key) in tutorFields" :key="key" :class="key === 'direccion' ? 'md:col-span-2' : ''"
                class="flex flex-col gap-2 relative">

                <label class="label-exp flex justify-between">
                  {{ label }}
                  <span v-if="key === 'email'" class="text-[7px] text-ps-red">🔒 NO EDITABLE</span>
                </label>

                <input v-model="tutorForm[key]" type="text" :readonly="key === 'email'" :class="[
                  'w-full p-4 rounded-2xl border-2 border-transparent outline-none font-bold text-sm transition-all',
                  (key === 'email')
                    ? 'bg-slate-200 dark:bg-white/5 opacity-50 cursor-not-allowed text-slate-500'
                    : 'bg-white dark:bg-white/10 dark:text-white focus:border-ps-red'
                ]" />
              </div>

              <button :disabled="saving"
                class="md:col-span-2 bg-ps-red text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:brightness-110 active:scale-95 transition-all mt-6">
                {{ saving ? 'Sincronizando...' : 'Guardar Información' }}
              </button>
            </form>
          </div>
        </div>

        <div class="space-y-8">

          <div
            class="bg-slate-50 dark:bg-white/5 rounded-[3rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl h-fit">
            <div class="flex items-center justify-between mb-8 border-b dark:border-white/10 pb-4">
              <h3 class="text-xl font-black uppercase italic text-ps-red leading-none">Citas</h3>
              <span class="text-[9px] font-black bg-ps-red/20 text-ps-red px-3 py-1 rounded-full">{{
                filteredAppointments.length }} Pendientes</span>
            </div>
            <div class="space-y-4">
              <div v-if="filteredAppointments.length === 0" class="text-center py-20">
                <p class="opacity-30 font-black uppercase text-[10px] italic dark:text-white mb-4">Sin actividades</p>
                <router-link to="/agendar"
                  class="text-[9px] font-black text-ps-blue uppercase border-b-2 border-ps-blue/20">Agendar
                  servicio</router-link>
              </div>
              <div v-for="cita in filteredAppointments" :key="cita.id"
                class="p-6 bg-white dark:bg-white/10 rounded-[2rem] border-l-4 border-ps-blue shadow-sm hover:scale-[1.02] transition-transform flex justify-between items-start gap-4">
                
                <div>
                  <p class="text-[8px] font-black text-slate-400 uppercase mb-2 tracking-widest">{{ formatDate(cita.fechaHora) }}</p>
                  <h4 class="font-black text-ps-blue dark:text-white uppercase text-xs italic">{{ cita.servicioTipo }}</h4>
                  <p v-if="cita.motivo" class="text-[10px] text-slate-500 mt-2 italic leading-relaxed line-clamp-2">"{{ cita.motivo }}"</p>
                </div>

                <button @click="cancelarCita(cita.id)" title="Cancelar Cita"
                  class="shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-[#DE1F27] hover:text-white hover:rotate-90 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

              </div>
            </div>
          </div>

          <div
            class="bg-slate-50 dark:bg-white/5 rounded-[3rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl animate-in slide-in-from-bottom duration-700">
            <div class="flex items-center justify-between mb-6 border-b dark:border-white/10 pb-4">
              <div class="flex items-center gap-3">
                <h3 class="text-xl font-black uppercase italic text-ps-blue leading-none">Mis Pedidos</h3>
                <span
                  class="bg-ps-blue text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Tienda</span>
              </div>
              <router-link to="/rastrear" class="text-[9px] font-black text-ps-red uppercase tracking-tighter hover:underline">
                Rastrear →
              </router-link>
            </div>

            <div v-if="orders.length === 0" class="text-center py-20">
              <p class="opacity-30 font-black uppercase text-[10px] italic dark:text-white">Sin compras aún</p>
            </div>

            <div v-else class="space-y-5 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">

              <!-- ACTIVOS -->
              <div v-if="ordersActivos.length" class="space-y-3">
                <p class="text-[8px] font-black uppercase text-green-600 tracking-[0.2em] flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Pedidos activos
                </p>
                <div v-for="order in ordersActivos" :key="order.id"
                  :class="['p-5 bg-white dark:bg-white/10 rounded-[2.5rem] shadow-sm border-2', order.estado === 'PENDIENTE_FORMULA' ? 'border-purple-400/40' : 'border-green-500/30']">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <p class="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">{{ order.codigoPedido || ('#' + order.id) }}</p>
                      <p class="text-[9px] font-bold text-slate-500 italic">{{ new Date(order.createdAt).toLocaleDateString('es-CO') }}</p>
                    </div>
                    <span :class="['text-[7px] font-black px-3 py-1 rounded-full uppercase tracking-widest', claseEstadoPedido(order.estado)]">
                      {{ iconoEstadoPedido(order.estado) }} {{ labelEstadoPedido(order.estado) }}
                    </span>
                  </div>
                  <div class="space-y-1 mb-4">
                    <div v-for="item in order.items" :key="item.id"
                      class="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      <span class="truncate pr-4">• {{ item.nombreProducto }}</span>
                      <span class="text-ps-blue">x{{ item.cantidad }}</span>
                    </div>
                  </div>

                  <!-- Bloque de subida de fórmula -->
                  <div v-if="order.estado === 'PENDIENTE_FORMULA'"
                    class="my-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-500/30 rounded-2xl p-4 space-y-3">
                    <p class="text-[9px] font-black uppercase text-purple-700 dark:text-purple-400 tracking-widest">🧾 Fórmula médica requerida</p>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Uno o más productos de este pedido requieren fórmula médica. Adjunta una foto clara de la fórmula para que nuestro equipo la revise y apruebe tu pedido.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      :ref="el => { if (el) formulaRefs[order.id] = el }"
                      @change="handleFormulaUpload(order.id, $event)"
                    />
                    <button
                      @click="formulaRefs[order.id]?.click()"
                      :disabled="subiendoFormula[order.id]"
                      class="w-full py-3 rounded-xl bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      <span v-if="subiendoFormula[order.id]" class="flex items-center gap-1">
                        <span class="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
                        Subiendo...
                      </span>
                      <span v-else>📎 Adjuntar fórmula</span>
                    </button>
                  </div>

                  <div class="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/5">
                    <span class="text-[9px] font-black uppercase text-slate-400">Total</span>
                    <p class="text-sm font-black text-ps-red tracking-tighter">${{ order.total.toLocaleString() }}</p>
                  </div>
                </div>
              </div>

              <!-- HISTORIAL -->
              <div v-if="ordersHistorial.length" class="space-y-3">
                <p class="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em]">Historial</p>
                <div v-for="order in ordersHistorial" :key="order.id"
                  class="p-5 bg-white dark:bg-white/10 rounded-[2.5rem] border border-transparent hover:border-ps-blue/30 transition-all shadow-sm"
                  :class="order.estado === 'CANCELADO' ? 'opacity-60' : ''">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <p class="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">{{ order.codigoPedido || ('#' + order.id) }}</p>
                      <p class="text-[9px] font-bold text-slate-500 italic">{{ new Date(order.createdAt).toLocaleDateString('es-CO') }}</p>
                    </div>
                    <span :class="['text-[7px] font-black px-3 py-1 rounded-full uppercase tracking-widest', claseEstadoPedido(order.estado)]">
                      {{ iconoEstadoPedido(order.estado) }} {{ labelEstadoPedido(order.estado) }}
                    </span>
                  </div>
                  <div class="space-y-1 mb-4">
                    <div v-for="item in order.items" :key="item.id"
                      class="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      <span class="truncate pr-4">• {{ item.nombreProducto }}</span>
                      <span class="text-ps-blue">x{{ item.cantidad }}</span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/5">
                    <span class="text-[9px] font-black uppercase text-slate-400">Total</span>
                    <p class="text-sm font-black text-ps-red tracking-tighter">${{ order.total.toLocaleString() }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, reactive, onMounted, watch, computed } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const props = defineProps(['pet', 'tutor']);
const emit = defineEmits(['update-pet', 'update-tutor', 'notify']);
const router = useRouter();

// Estados de carga y UI
const loading = ref(true);
const saving = ref(false);
const savingPhoto = ref(false);
const compressing = ref(false);
const justSavedPhoto = ref(false);
const activeTab = ref('pet');

// Datos del expediente
const petData = ref(null);
const appointments = ref([]);
const orders = ref([]);

// Pedidos activos = en proceso (pagado / en camino / pendiente fórmula). Historial = el resto.
const ordersActivos = computed(() =>
  orders.value.filter(o => ['PAGADO', 'EN_CAMINO', 'PENDIENTE_FORMULA'].includes(o.estado))
);
const ordersHistorial = computed(() =>
  orders.value.filter(o => !['PAGADO', 'EN_CAMINO', 'PENDIENTE_FORMULA'].includes(o.estado))
);

const iconoEstadoPedido = (e) => ({
  PENDIENTE: '⏳', PENDIENTE_FORMULA: '🧾', PAGADO: '💰', EN_CAMINO: '🚚', ENTREGADO: '🎉', CANCELADO: '❌'
}[e] || '📦');

const labelEstadoPedido = (e) => ({
  PENDIENTE: 'Esperando Pago', PENDIENTE_FORMULA: 'Fórmula Requerida', PAGADO: 'Pagado',
  EN_CAMINO: 'En Camino', ENTREGADO: 'Entregado', CANCELADO: 'Cancelado'
}[e] || e);

const claseEstadoPedido = (e) => {
  if (e === 'PAGADO')            return 'bg-green-600 text-white';
  if (e === 'EN_CAMINO')         return 'bg-blue-100 text-blue-700';
  if (e === 'ENTREGADO')         return 'bg-green-100 text-green-700';
  if (e === 'CANCELADO')         return 'bg-red-100 text-red-600';
  if (e === 'PENDIENTE_FORMULA') return 'bg-purple-100 text-purple-700';
  return 'bg-amber-100 text-amber-600';
};

// ---- Subida de fórmula médica ----
const subiendoFormula = ref({});   // { [pedidoId]: true/false }
const formulaRefs = ref({});       // refs dinámicos para los inputs file

const handleFormulaUpload = (pedidoId, event) => {
  const file = event.target.files[0];
  if (!file) return;

  subiendoFormula.value[pedidoId] = true;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const MAX = 1200;
      let w = img.width, h = img.height;
      if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
      if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const base64 = canvas.toDataURL('image/jpeg', 0.75);

      try {
        await api.post('/formulas/subir', { pedidoId, imagenUrl: base64 });
        // Refrescar pedidos para que salga del estado PENDIENTE_FORMULA
        const resO = props.tutor?.id
          ? await api.get(`/pedidos/tutor/${props.tutor.id}`)
          : { data: [] };
        orders.value = (resO.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        Swal.fire({
          icon: 'success',
          title: '¡Fórmula enviada!',
          text: 'Nuestro equipo la revisará y te notificaremos por email.',
          timer: 3000,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.error || 'No se pudo subir la fórmula. Intenta de nuevo.' });
      } finally {
        subiendoFormula.value[pedidoId] = false;
      }
    };
  };
  reader.readAsDataURL(file);
};

// Formulario reactivo para la Mascota
const form = reactive({
  nombre: '',
  especie: 'CANINO', // Valor por defecto seguro 
  raza: '',
  fechaNacimiento: '',
  fotoUrl: '',
  pesoActual: '',
  ultimaVacuna: '',
  ultimaDesparasitacion: '',
  marcaComida: '',
  frecuenciaBano: '',
  snacksFavoritos: '',
  alergiasOpcional: '',
  observacionesMedicas: ''
});

const tutorForm = reactive({
  nombre: '',
  apellido: '',
  cedula: '',
  telefono: '',
  email: '',
  direccion: ''
});

const medicalFields = {
  raza: 'Raza / Cruce',
  pesoActual: 'Peso Actual (kg)',
  ultimaVacuna: 'Última Vacuna',
  ultimaDesparasitacion: 'Última Desparasitación',
  marcaComida: 'Marca de Alimento',
  frecuenciaBano: 'Frecuencia de Baño',
  snacksFavoritos: 'Snacks Favoritos',
  alergiasOpcional: 'Alergias o Condiciones',
  observacionesMedicas: 'Observaciones Médicas'
};

const tutorFields = {
  nombre: 'Nombre',
  apellido: 'Apellido',
  cedula: 'Cédula',
  telefono: 'Teléfono',
  email: 'Email',
  direccion: 'Dirección'
};

const filteredAppointments = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return appointments.value
    .filter(cita => new Date(cita.fechaHora) >= today && cita.estado !== 'CANCELADA')
    .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));
});

const formatDate = (dateStr) => {
  if (!dateStr) return '---';
  return new Date(dateStr).toLocaleString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });
};

const loadAllData = async () => {
  if (!props.pet?.id) return;
  loading.value = true;

  try {
    const [resP, resT, resC, resO] = await Promise.all([
      api.get(`/mascotas/${props.pet.id}`),
      props.tutor?.id ? api.get(`/tutores/${props.tutor.id}`) : Promise.resolve({ data: {} }),
      api.get(`/citas/mascota/${props.pet.id}`),
      props.tutor?.id ? api.get(`/pedidos/tutor/${props.tutor.id}`) : Promise.resolve({ data: [] })
    ]);

    if (resP.data) {
      petData.value = resP.data;
      Object.assign(form, resP.data);
      if (form.especie === 'PERRO') form.especie = 'CANINO';
      if (form.especie === 'GATO') form.especie = 'FELINO';
    }
    if (resT.data) Object.assign(tutorForm, resT.data);
    appointments.value = resC.data || [];
    if (resO.data) orders.value = resO.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  } catch (error) {
    console.error("Error al sincronizar expediente:", error);

    if (error.response && error.response.status === 404) {
      emit('notify', { msg: 'Esta mascota ya no existe. Redirigiendo...', type: 'error' });

      localStorage.removeItem('ps_active_pet');
      setTimeout(() => {
        router.push('/seleccionar-perfil');
      }, 1500);

    } else {
      emit('notify', { msg: 'Error de conexión', type: 'error' });
    }
  } finally {
    loading.value = false;
  }
};


const saveProfile = async () => {
  saving.value = true;
  try {
    const { data } = await api.put(`/mascotas/${props.pet.id}`, form); //
    petData.value = data;
    emit('update-pet', data);
    emit('notify', { msg: 'Expediente actualizado con éxito', type: 'success' });
  } catch (e) {
    emit('notify', { msg: 'No se pudo guardar el expediente', type: 'error' });
  } finally {
    saving.value = false;
  }
};

const saveTutor = async () => {
  if (!props.tutor?.id) return;
  saving.value = true;
  try {
    // IMPORTANTE: NO enviamos mascotas en el PUT de tutor para evitar recursividad o cargas pesadas
    const { mascotas, ...datosLimpios } = tutorForm;
    const { data } = await api.put(`/tutores/${props.tutor.id}`, datosLimpios);
    Object.assign(tutorForm, data);
    emit('update-tutor', data);
    emit('notify', { msg: 'Datos de contacto guardados', type: 'success' });
  } catch (e) {
    emit('notify', { msg: 'Error al actualizar el perfil', type: 'error' });
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
      if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } }
      else { if (h > MAX) { w *= MAX / h; h = MAX; } }
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
    const { data } = await api.put(`/mascotas/${props.pet.id}`, {
      ...form,
      fotoUrl: form.fotoUrl
    });
    emit('update-pet', data);
    justSavedPhoto.value = true;
    setTimeout(() => justSavedPhoto.value = false, 2000);
  } catch (e) {
    emit('notify', { msg: 'Error al subir la imagen', type: 'error' });
  } finally {
    savingPhoto.value = false;
  }
};

onMounted(loadAllData);

watch(() => props.pet?.id, (newVal) => {
  if (newVal) loadAllData();
}, { immediate: true });

watch(() => props.tutor?.id, (newVal) => {
  if (newVal) loadAllData();
});

// LÓGICA PARA CANCELAR LA CITA
const cancelarCita = async (citaId) => {
  const result = await Swal.fire({
    title: '¿CANCELAR CITA?',
    text: "Se liberará este cupo. Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DE1F27',
    cancelButtonColor: '#152C77',
    confirmButtonText: 'SÍ, CANCELAR',
    cancelButtonText: 'VOLVER',
    reverseButtons: true,
    customClass: { popup: 'rounded-[2rem] font-sans' }
  });

  if (!result.isConfirmed) return;

  try {
    Swal.showLoading();
    await api.put(`/citas/${citaId}/cancelar`);
    
    appointments.value = appointments.value.filter(c => c.id !== citaId);
    
    Swal.fire({ 
      icon: 'success', 
      title: '¡CANCELADA!', 
      text: 'El horario ha sido liberado exitosamente.',
      timer: 2500, 
      showConfirmButton: false 
    });
    
  } catch (error) {
    Swal.fire({ 
      icon: 'error', 
      title: 'ERROR', 
      text: error.response?.data?.message || 'No se pudo cancelar la cita. Intenta de nuevo.' 
    });
  }
};
</script>

<style scoped>
@reference "../../style.css";

.label-exp {
  @apply text-[9px] font-black uppercase text-slate-400 dark:text-white/30 ml-4 tracking-widest;
}

.input-dark-expediente {
  @apply w-full bg-white dark:bg-white/10 p-4 rounded-2xl border-2 border-transparent focus:border-ps-blue outline-none font-bold dark:text-white text-sm transition-all;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #DE1F27;
  border-radius: 10px;
}
</style>