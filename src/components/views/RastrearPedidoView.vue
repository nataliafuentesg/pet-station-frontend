<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-10 md:pt-32 pb-32 px-4 transition-colors">
    <div class="max-w-lg mx-auto">

      <div class="text-center mb-8">
        <p class="text-4xl mb-3">📦</p>
        <h1 class="text-3xl md:text-4xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight">
          Rastrea tu <span class="text-[#DE1F27]">Pedido</span>
        </h1>
        <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">
          Ingresa tu código y el correo o teléfono de la compra
        </p>
      </div>

      <!-- Formulario -->
      <div v-if="!pedido" class="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-8 border border-slate-100 dark:border-white/10 space-y-5">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Código del pedido</label>
          <input v-model="codigo" type="text" placeholder="Ej: PS-2026-0008"
            @keyup.enter="rastrear"
            class="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold dark:text-white focus:border-[#DE1F27] outline-none transition-all uppercase" />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Correo o teléfono</label>
          <input v-model="contacto" type="text" placeholder="El que usaste al comprar"
            @keyup.enter="rastrear"
            class="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold dark:text-white focus:border-[#DE1F27] outline-none transition-all" />
        </div>

        <p v-if="error" class="text-[11px] text-[#DE1F27] font-bold text-center">{{ error }}</p>

        <button @click="rastrear" :disabled="cargando"
          class="w-full bg-[#152C77] text-white py-4 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:bg-[#DE1F27] active:scale-95 transition-all disabled:opacity-50">
          {{ cargando ? 'Buscando...' : 'Buscar mi pedido' }}
        </button>
      </div>

      <!-- Resultado -->
      <div v-else class="space-y-6 animate-in fade-in duration-500">
        <div class="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-8 border border-slate-100 dark:border-white/10">

          <!-- Estado grande -->
          <div class="text-center mb-6">
            <span class="text-5xl">{{ iconoEstado(pedido.estado) }}</span>
            <h2 class="text-2xl font-[1000] uppercase italic text-[#152C77] dark:text-white mt-2">{{ labelEstado(pedido.estado) }}</h2>
            <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">{{ pedido.codigoPedido }}</p>
          </div>

          <!-- Pendiente de fórmula médica -->
          <div v-if="pedido.estado === 'PENDIENTE_FORMULA'" class="bg-purple-50 dark:bg-purple-500/10 border-2 border-purple-300 dark:border-purple-400/30 rounded-2xl p-5 mb-6 space-y-4">
            <p class="text-[11px] font-black uppercase text-purple-700 dark:text-purple-400 text-center">
              💊 Este pedido requiere fórmula médica
            </p>
            <p class="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center">
              Sube una foto de tu fórmula para que podamos procesarlo.
            </p>

            <div v-if="!formulaSubida">
              <!-- Preview imagen -->
              <div v-if="formulaPreview" class="rounded-xl overflow-hidden mb-3 border border-purple-200 dark:border-purple-400/20">
                <img :src="formulaPreview" class="w-full max-h-48 object-contain bg-black/5" />
              </div>

              <input ref="formulaInput" type="file" accept="image/*" class="hidden" @change="onFormulaSeleccionada" />

              <button @click="formulaInput.click()"
                class="w-full border-2 border-dashed border-purple-300 dark:border-purple-400/40 rounded-2xl py-4 text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all">
                {{ formulaPreview ? '📷 Cambiar foto' : '📷 Seleccionar foto de fórmula' }}
              </button>

              <button v-if="formulaPreview" @click="subirFormula" :disabled="subiendoFormula"
                class="w-full mt-3 bg-purple-600 text-white py-4 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50">
                {{ subiendoFormula ? 'Enviando...' : '✅ Enviar fórmula' }}
              </button>
            </div>

            <div v-else class="text-center space-y-1">
              <p class="text-2xl">✅</p>
              <p class="text-[11px] font-black uppercase text-green-600 dark:text-green-400">¡Fórmula recibida!</p>
              <p class="text-[10px] font-bold text-slate-500">Nuestro equipo la revisará pronto y te avisaremos.</p>
            </div>
          </div>

          <!-- Pendiente de pago: botón para pagar -->
          <div v-if="pedido.estado === 'PENDIENTE'" class="bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-300 dark:border-amber-400/30 rounded-2xl p-5 mb-6 text-center space-y-3">
            <p class="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400">
              ⏳ Este pedido está pendiente de pago
            </p>
            <p class="text-[10px] font-bold text-slate-600 dark:text-slate-400">
              Total a pagar: <strong class="text-[#152C77] dark:text-white">${{ pedido.total.toLocaleString() }}</strong>
            </p>
            <div v-if="!boldListo">
              <button @click="iniciarPago" :disabled="pagando"
                class="w-full bg-[#152C77] text-white py-4 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:bg-[#DE1F27] active:scale-95 transition-all disabled:opacity-50">
                {{ pagando ? 'Preparando pago...' : '💳 Pagar ahora' }}
              </button>
            </div>
            <div v-else ref="boldContainer" class="flex justify-center"></div>
          </div>

          <!-- Línea de progreso -->
          <div class="flex items-center justify-between mb-8 px-2">
            <div v-for="(paso, i) in pasos" :key="paso.estado" class="flex-1 flex flex-col items-center relative">
              <div v-if="i > 0" class="absolute right-1/2 top-3 w-full h-0.5"
                :class="pasoActivo >= i ? 'bg-green-500' : 'bg-slate-200 dark:bg-white/10'"></div>
              <div :class="['w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black relative z-10',
                pasoActivo >= i ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-400']">
                {{ pasoActivo > i ? '✓' : (i + 1) }}
              </div>
              <span class="text-[7px] font-black uppercase text-slate-400 mt-1.5 text-center leading-tight">{{ paso.label }}</span>
            </div>
          </div>

          <!-- Detalles -->
          <div class="space-y-2 border-t dark:border-white/10 pt-5 text-[11px]">
            <div class="flex justify-between">
              <span class="font-black uppercase text-slate-400 text-[9px] tracking-widest">Fecha</span>
              <span class="font-bold dark:text-white">{{ new Date(pedido.createdAt).toLocaleDateString('es-CO') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-black uppercase text-slate-400 text-[9px] tracking-widest">Entrega</span>
              <span class="font-bold dark:text-white text-right">{{ pedido.zona }}</span>
            </div>
            <div v-if="pedido.receptorEntrega" class="flex justify-between">
              <span class="font-black uppercase text-slate-400 text-[9px] tracking-widest">Recibió</span>
              <span class="font-bold text-green-600">{{ pedido.receptorEntrega }}</span>
            </div>
            <div class="flex justify-between pt-2 border-t dark:border-white/10">
              <span class="font-black uppercase text-[#152C77] dark:text-white text-[10px]">Total</span>
              <span class="font-[1000] text-[#DE1F27]">${{ pedido.total.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Productos -->
          <div class="mt-5 space-y-1">
            <div v-for="item in pedido.items" :key="item.id" class="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
              <span class="truncate pr-3">• {{ item.nombreProducto }}</span>
              <span class="text-[#152C77] dark:text-white shrink-0">x{{ item.cantidad }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <button @click="reset" class="text-[9px] font-black uppercase text-slate-400 hover:text-[#DE1F27] tracking-widest transition-all">
            ← Buscar otro pedido
          </button>
          <a href="https://wa.me/573053462413" target="_blank"
            class="w-full bg-[#25D366] text-white py-4 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest text-center">
            💬 ¿Dudas? Escríbenos
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { nextTick } from 'vue';
import api from '@/api/axios';

const route = useRoute();
const codigo = ref(route.query.codigo || '');
const contacto = ref('');
const pedido = ref(null);
const cargando = ref(false);
const error = ref('');

// Pago de pedido pendiente
const pagando = ref(false);
const boldListo = ref(false);
const boldContainer = ref(null);

const iniciarPago = async () => {
  pagando.value = true;
  try {
    const { data } = await api.post('/pagos/bold/datos-boton', { pedidoId: pedido.value.id });
    boldListo.value = true;
    await nextTick();
    const script = document.createElement('script');
    script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
    script.setAttribute('data-bold-button', '');
    script.setAttribute('data-order-id', data.orderId);
    script.setAttribute('data-currency', data.currency);
    script.setAttribute('data-amount', data.amount);
    script.setAttribute('data-api-key', data.apiKey);
    script.setAttribute('data-integrity-signature', data.integritySignature);
    script.setAttribute('data-redirection-url', data.redirectUrl);
    script.setAttribute('data-description', `Pedido Pet Station ${data.codigoPedido}`);
    boldContainer.value.appendChild(script);
  } catch (e) {
    error.value = e.response?.data?.error || 'No pudimos preparar el pago. Intenta de nuevo.';
    boldListo.value = false;
  } finally {
    pagando.value = false;
  }
};

const pasos = [
  { estado: 'PAGADO',    label: 'Pagado' },
  { estado: 'EN_CAMINO', label: 'En camino' },
  { estado: 'ENTREGADO', label: 'Entregado' },
];

const pasoActivo = computed(() => {
  if (!pedido.value) return -1;
  const e = pedido.value.estado;
  if (e === 'ENTREGADO') return 2;
  if (e === 'EN_CAMINO') return 1;
  if (e === 'PAGADO') return 0;
  return -1; // PENDIENTE, PENDIENTE_FORMULA o CANCELADO
});

const iconoEstado = (e) => ({
  PENDIENTE: '⏳', PENDIENTE_FORMULA: '💊', PAGADO: '💰', EN_CAMINO: '🚚', ENTREGADO: '🎉', CANCELADO: '❌'
}[e] || '📦');

const labelEstado = (e) => ({
  PENDIENTE: 'Esperando Pago', PENDIENTE_FORMULA: 'Fórmula Requerida', PAGADO: '¡Pago Confirmado!',
  EN_CAMINO: 'En Camino', ENTREGADO: '¡Entregado!', CANCELADO: 'Cancelado'
}[e] || e);

// Subir fórmula
const formulaInput = ref(null);
const formulaPreview = ref('');
const subiendoFormula = ref(false);
const formulaSubida = ref(false);

const onFormulaSeleccionada = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1200;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        const ratio = Math.min(MAX / width, MAX / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      formulaPreview.value = canvas.toDataURL('image/jpeg', 0.75);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
};

const subirFormula = async () => {
  if (!formulaPreview.value || !pedido.value) return;
  subiendoFormula.value = true;
  try {
    await api.post('/formulas/subir', {
      pedidoId: pedido.value.id,
      imagenUrl: formulaPreview.value,
    });
    formulaSubida.value = true;
  } catch (e) {
    error.value = e.response?.data?.error || 'Error al enviar la fórmula. Intenta de nuevo.';
  } finally {
    subiendoFormula.value = false;
  }
};

const rastrear = async () => {
  if (!codigo.value.trim() || !contacto.value.trim()) {
    error.value = 'Ingresa el código y tu correo o teléfono';
    return;
  }
  cargando.value = true;
  error.value = '';
  try {
    const { data } = await api.get('/pedidos/rastrear', {
      params: { codigo: codigo.value.trim(), contacto: contacto.value.trim() }
    });
    pedido.value = data;
  } catch (e) {
    error.value = e.response?.data?.error || 'No encontramos un pedido con esos datos.';
  } finally {
    cargando.value = false;
  }
};

const reset = () => {
  pedido.value = null;
  codigo.value = '';
  contacto.value = '';
  error.value = '';
};
</script>
