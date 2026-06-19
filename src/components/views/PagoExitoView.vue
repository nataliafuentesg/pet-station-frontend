<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] flex flex-col items-center justify-center px-4 text-center pt-20 pb-32">

    <!-- PAGO APROBADO -->
    <Transition name="pop" appear v-if="aprobado">
      <div class="space-y-8 max-w-md">

        <!-- Ícono animado -->
        <div class="w-24 h-24 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto border-4 border-green-400">
          <span class="text-4xl">✅</span>
        </div>

        <div class="space-y-3">
          <h1 class="text-3xl md:text-4xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight">
            ¡Pago <span class="text-green-500">Confirmado!</span>
          </h1>
          <p v-if="pedidoId" class="text-[10px] font-black uppercase text-slate-400 dark:text-white/30 tracking-widest">
            Pedido {{ pedidoId }}
          </p>
        </div>

        <div class="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-6 border border-slate-100 dark:border-white/10 space-y-3 text-left">
          <div class="flex items-start gap-3">
            <span class="text-lg shrink-0">📧</span>
            <p class="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Recibirás un correo con la confirmación de tu compra.
            </p>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-lg shrink-0">🚚</span>
            <p class="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Tu pedido será entregado en la <strong class="text-[#152C77] dark:text-white">franja que elegiste</strong>. Te escribimos al WhatsApp antes de salir.
            </p>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-lg shrink-0">💬</span>
            <p class="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Te contactaremos por WhatsApp para coordinar la entrega.
            </p>
          </div>
        </div>

        <div class="bg-[#152C77]/5 dark:bg-white/5 rounded-2xl p-4 border border-[#152C77]/10 dark:border-white/10">
          <p class="text-[10px] font-bold text-slate-600 dark:text-slate-400">
            💡 Guarda tu código <strong class="text-[#152C77] dark:text-white">{{ pedidoId }}</strong> para
            <router-link :to="`/rastrear?codigo=${pedidoId}`" class="text-[#DE1F27] underline font-black">rastrear tu pedido</router-link>
            cuando quieras.
          </p>
        </div>

        <div class="flex flex-col gap-3">
          <router-link to="/tienda"
            class="w-full bg-[#152C77] text-white py-5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:bg-[#DE1F27] active:scale-95 transition-all">
            Seguir Comprando
          </router-link>
          <a href="https://wa.me/573053462413?text=Hola%20Pet%20Station!%20Acabo%20de%20pagar%20mi%20pedido."
            target="_blank"
            class="w-full bg-[#25D366] text-white py-5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:bg-green-600 active:scale-95 transition-all">
            💬 Contactar por WhatsApp
          </a>
        </div>

      </div>
    </Transition>

    <!-- PAGO RECHAZADO -->
    <Transition name="pop" appear v-if="!aprobado">
      <div class="space-y-8 max-w-md">
        <div class="w-24 h-24 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto border-4 border-red-400">
          <span class="text-4xl">❌</span>
        </div>
        <div class="space-y-3">
          <h1 class="text-3xl md:text-4xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight">
            Pago <span class="text-red-500">No Completado</span>
          </h1>
          <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            Tu pago no se pudo procesar. Tu pedido {{ pedidoId || '' }} no fue confirmado.
          </p>
        </div>
        <div class="flex flex-col gap-3">
          <router-link to="/checkout"
            class="w-full bg-[#152C77] text-white py-5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:bg-[#DE1F27] active:scale-95 transition-all">
            Intentar de Nuevo
          </router-link>
          <a href="https://wa.me/573053462413?text=Hola%20Pet%20Station!%20Tuve%20un%20problema%20con%20el%20pago%20de%20mi%20pedido."
            target="_blank"
            class="w-full bg-[#25D366] text-white py-5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:bg-green-600 active:scale-95 transition-all">
            💬 Contactar por WhatsApp
          </a>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTracking } from '@/composables/useTracking';

const route = useRoute();
const { trackCompraCompletada } = useTracking();

const pedidoId = computed(() => {
  const boldOrder = route.query['bold-order-id'];
  if (boldOrder) return String(boldOrder);
  return route.query.pedido || null;
});
const estadoPago = computed(() => route.query['bold-tx-status'] || 'approved');
const aprobado = computed(() => estadoPago.value === 'approved');

onMounted(() => {
  if (!aprobado.value || !pedidoId.value) return;
  // Extraer el ID numérico de "PS-2026-0006" → 6 para que coincida con el event_id del servidor
  const numericId = parseInt(pedidoId.value.split('-').pop());
  trackCompraCompletada(null, null, numericId);
});
</script>

<style scoped>
.pop-enter-active { animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes pop {
  from { opacity: 0; transform: scale(0.85) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
