<template>
  <Teleport to="body">
    <Transition name="slide">
      <div v-if="isOpen" class="fixed inset-0 z-[10000]">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="$emit('close')"></div>

        <div class="absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-[#080808] shadow-2xl flex flex-col h-full z-[10010]">

          <!-- Header -->
          <div class="p-6 border-b dark:border-white/10 flex justify-between items-center shrink-0">
            <div>
              <h2 class="text-2xl font-[1000] text-[#152C77] dark:text-white uppercase italic leading-none tracking-tighter">
                Tu Bolsa.
              </h2>
              <p class="text-[10px] font-black text-[#DE1F27] mt-1 tracking-widest uppercase">
                {{ cartStore.cartCount }} {{ cartStore.cartCount === 1 ? 'artículo' : 'artículos' }}
              </p>
            </div>
            <button @click="$emit('close')"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 hover:bg-[#DE1F27] hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Items -->
          <div class="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar">

            <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center h-full opacity-20 py-20">
              <span class="text-7xl mb-4">🛒</span>
              <p class="font-black text-xs uppercase italic tracking-widest dark:text-white">Tu bolsa está vacía</p>
            </div>

            <div v-for="item in cartStore.items" :key="item.id" class="flex gap-4 group">
              <div class="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-2xl p-2 shrink-0 border border-slate-100 dark:border-white/10">
                <img :src="item.fotosUrls?.[0]" class="w-full h-full object-contain" />
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="text-[11px] font-[1000] text-[#152C77] dark:text-white uppercase italic leading-tight max-w-[160px]">
                    {{ item.nombre }}
                  </h4>
                  <button @click="cartStore.removeItem(item.id)"
                    class="text-slate-300 hover:text-[#DE1F27] transition-colors text-[9px] font-black uppercase">
                    Eliminar
                  </button>
                </div>
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-3">
                  {{ item.presentacion || 'Unidad' }}
                </p>
                <div class="flex justify-between items-center">
                  <div class="flex items-center bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/10 p-1">
                    <button @click="cartStore.updateQty(item.id, item.quantity - 1)"
                      class="w-6 h-6 flex items-center justify-center text-[#DE1F27] font-bold">-</button>
                    <span class="px-2 text-[10px] font-black dark:text-white">{{ item.quantity }}</span>
                    <button @click="cartStore.updateQty(item.id, item.quantity + 1)"
                      class="w-6 h-6 flex items-center justify-center text-[#DE1F27] font-bold">+</button>
                  </div>
                  <span class="font-[1000] text-[#152C77] dark:text-white italic text-sm">
                    ${{ (item.precio * item.quantity).toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="cartStore.items.length > 0"
            class="p-6 border-t dark:border-white/10 bg-white dark:bg-[#080808] shrink-0 space-y-4 pb-10 md:pb-6">

            <!-- Progreso pedido mínimo -->
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  {{ alcanzaMinimo ? '✅ Pedido mínimo alcanzado' : `Faltan $${faltanParaMinimo.toLocaleString()} para el mínimo` }}
                </span>
                <span class="text-[9px] font-black uppercase text-slate-400">${{ configStore.pedidoMinimo.toLocaleString() }}</span>
              </div>
              <div class="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="alcanzaMinimo ? 'bg-green-500' : 'bg-[#DE1F27]'"
                  :style="{ width: Math.min(progresoMinimo, 100) + '%' }">
                </div>
              </div>
              <p v-if="!alcanzaMinimo" class="text-[8px] font-bold text-slate-400 uppercase">
                🚚 Mínimo ${{ configStore.pedidoMinimo.toLocaleString() }} con domicilio · Gratis desde ${{ configStore.envioGratisDesde.toLocaleString() }}
              </p>
              <p v-else class="text-[8px] font-bold text-slate-400 uppercase">
                🎁 Envío gratis desde ${{ configStore.envioGratisDesde.toLocaleString() }} · {{ cartStore.totalPrice >= configStore.envioGratisDesde ? '¡Lo tienes!' : `Faltan $${(configStore.envioGratisDesde - cartStore.totalPrice).toLocaleString()}` }}
              </p>
            </div>

            <!-- Total -->
            <div class="flex justify-between items-end">
              <span class="font-black text-slate-400 uppercase text-[10px] tracking-widest">Total</span>
              <span class="text-3xl font-[1000] text-[#152C77] dark:text-white italic">
                ${{ cartStore.totalPrice.toLocaleString() }}
              </span>
            </div>

            <!-- Aviso entrega -->
            <div :class="[
              'rounded-2xl px-4 py-3 flex items-center gap-3 border',
              proximaEntrega.urgente
                ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-400/20'
                : 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-400/20'
            ]">
              <span class="text-lg shrink-0">{{ proximaEntrega.urgente ? '📅' : '🚚' }}</span>
              <div>
                <p :class="['text-[10px] font-black uppercase', proximaEntrega.urgente ? 'text-amber-700 dark:text-amber-400' : 'text-green-700 dark:text-green-400']">
                  {{ proximaEntrega.label }}
                </p>
                <p class="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Sin domicilios domingos ni festivos</p>
              </div>
            </div>

            <!-- Botón -->
            <template v-if="TIENDA_ACTIVA">
              <button @click="irACheckout"
                :disabled="!alcanzaMinimo"
                :class="[
                  'w-full py-5 rounded-[2rem] font-[1000] uppercase italic shadow-xl transition-all active:scale-95',
                  alcanzaMinimo
                    ? 'bg-[#152C77] hover:bg-[#DE1F27] text-white'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-white/30 cursor-not-allowed'
                ]">
                {{ alcanzaMinimo ? 'Ir a pagar →' : `Faltan $${faltanParaMinimo.toLocaleString()}` }}
              </button>
            </template>
            <template v-else>
              <div class="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-400/20 rounded-2xl p-3 text-center">
                <p class="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400">🚧 Tienda temporalmente pausada</p>
                <p class="text-[9px] font-bold text-amber-600 dark:text-amber-500 mt-0.5">Pronto habilitaremos las compras en línea.</p>
              </div>
              <a href="https://wa.me/573053462413?text=Hola%20Pet%20Station!%20Quiero%20hacer%20un%20pedido." target="_blank"
                class="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-5 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-widest hover:bg-green-600 active:scale-95 transition-all">
                💬 Pedir por WhatsApp
              </a>
            </template>

            <router-link to="/tienda" @click="$emit('close')"
              class="block text-center text-[9px] font-black uppercase text-slate-400 hover:text-[#DE1F27] tracking-widest transition-all">
              + Seguir comprando
            </router-link>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cartStore';
import { useConfigStore } from '../../stores/configStore';
import { TIENDA_ACTIVA } from '@/config';

const props = defineProps(['isOpen', 'tutor']);
const emit = defineEmits(['close', 'notify']);

const cartStore = useCartStore();
const configStore = useConfigStore();
const router = useRouter();

const progresoMinimo = computed(() => (cartStore.totalPrice / configStore.pedidoMinimo) * 100);
const alcanzaMinimo  = computed(() => cartStore.totalPrice >= configStore.pedidoMinimo);
const faltanParaMinimo = computed(() => Math.max(0, configStore.pedidoMinimo - cartStore.totalPrice));

// Festivos Colombia 2025-2026 (Ley Emiliani)
const FESTIVOS = new Set([
  '2025-08-07','2025-08-18','2025-10-13','2025-11-03','2025-11-17',
  '2025-12-08','2025-12-25','2026-01-01','2026-01-12','2026-03-23',
  '2026-04-02','2026-04-03','2026-05-01','2026-05-18','2026-06-08',
  '2026-06-29','2026-07-20','2026-08-07','2026-08-17','2026-10-12',
  '2026-11-02','2026-11-16','2026-12-08','2026-12-25',
]);

const esDiaHabil = (d) => {
  const iso = d.toISOString().split('T')[0];
  return d.getDay() !== 0 && !FESTIVOS.has(iso); // no domingo ni festivo
};

const proximaEntrega = computed(() => {
  const ahora = new Date();
  const corte = new Date(ahora); corte.setHours(14, 0, 0, 0);
  const d = new Date(ahora);
  if (ahora >= corte) { d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); }
  while (!esDiaHabil(d)) d.setDate(d.getDate() + 1);

  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const manana = new Date(hoy); manana.setDate(hoy.getDate() + 1);
  d.setHours(0,0,0,0);

  if (d.getTime() === hoy.getTime()) return { label: 'Entrega HOY en la tarde', urgente: false };
  if (d.getTime() === manana.getTime()) return { label: 'Entrega MAÑANA', urgente: false };

  const dias = ['dom','lun','mar','mié','jue','vie','sáb'];
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  const diasDiff = Math.round((d - hoy) / 86400000);
  return {
    label: `Entrega el ${dias[d.getDay()]} ${d.getDate()} ${meses[d.getMonth()]}`,
    urgente: diasDiff >= 2,
  };
});

const irACheckout = () => {
  if (!alcanzaMinimo.value) return;
  emit('close');
  router.push('/checkout');
};

watch(() => props.isOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.slide-enter-active, .slide-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); opacity: 0; }
</style>
