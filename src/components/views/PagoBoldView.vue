<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] flex flex-col items-center justify-center px-4 pt-20 pb-32 text-center">

    <div v-if="cargando" class="space-y-6">
      <div class="w-16 h-16 border-4 border-slate-200 dark:border-white/20 border-t-[#DE1F27] rounded-full animate-spin mx-auto"></div>
      <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Preparando tu pago seguro...</p>
    </div>

    <div v-else-if="error" class="space-y-6 max-w-md">
      <span class="text-5xl">⚠️</span>
      <h1 class="text-2xl font-[1000] uppercase italic text-[#152C77] dark:text-white">No pudimos cargar el pago</h1>
      <p class="text-[11px] font-bold text-slate-500">{{ error }}</p>
      <a :href="waLink" target="_blank"
        class="inline-block bg-[#25D366] text-white px-8 py-4 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest">
        💬 Completar pedido por WhatsApp
      </a>
    </div>

    <div v-else class="space-y-8 max-w-md w-full">
      <div class="space-y-2">
        <h1 class="text-3xl font-[1000] uppercase italic text-[#152C77] dark:text-white">
          Pago <span class="text-[#DE1F27]">Seguro</span>
        </h1>
        <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest">
          Pedido #{{ pedidoId }} · ${{ total.toLocaleString() }}
        </p>
      </div>

      <div class="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-8 border border-slate-100 dark:border-white/10 space-y-4">
        <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400">
          Haz clic en el botón para pagar de forma segura con Bold. Aceptamos tarjeta débito/crédito, PSE, Nequi y Daviplata.
        </p>

        <!-- Aquí se inyecta el botón de Bold -->
        <div ref="boldContainer" class="flex justify-center min-h-[60px]"></div>
      </div>

      <button @click="router.push('/tienda')"
        class="text-[9px] font-black uppercase text-slate-400 hover:text-[#DE1F27] tracking-widest transition-all">
        ← Cancelar y volver a la tienda
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';

const route = useRoute();
const router = useRouter();

const cargando = ref(true);
const error = ref('');
const pedidoId = ref(route.query.pedido || null);
const total = ref(Number(route.query.total) || 0);
const boldContainer = ref(null);

const waLink = `https://wa.me/573053462413?text=${encodeURIComponent('Hola Pet Station! Tuve un problema con el pago en línea de mi pedido #' + (pedidoId.value || ''))}`;

onMounted(async () => {
  if (!pedidoId.value) {
    error.value = 'No se encontró el pedido. Vuelve a intentar desde el carrito.';
    cargando.value = false;
    return;
  }

  try {
    // 1. Pedir los datos del botón al backend (firma de integridad)
    const { data } = await api.post('/pagos/bold/datos-boton', {
      pedidoId: Number(pedidoId.value),
      total: total.value
    });

    // Mostrar el contenedor ANTES de inyectar el script (el div está en v-else)
    cargando.value = false;
    await nextTick();

    // 2. Construir el <script> del botón de Bold
    const script = document.createElement('script');
    script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
    script.setAttribute('data-bold-button', '');
    script.setAttribute('data-order-id', data.orderId);
    script.setAttribute('data-currency', data.currency);
    script.setAttribute('data-amount', data.amount);
    script.setAttribute('data-api-key', data.apiKey);
    script.setAttribute('data-integrity-signature', data.integritySignature);
    script.setAttribute('data-redirection-url', data.redirectUrl);
    script.setAttribute('data-description', `Pedido Pet Station #${pedidoId.value}`);

    boldContainer.value.appendChild(script);

  } catch (e) {
    console.error('Error datos Bold:', e);
    error.value = 'No pudimos preparar el pago en línea. Escríbenos por WhatsApp para completar tu pedido.';
    cargando.value = false;
  }
});
</script>
