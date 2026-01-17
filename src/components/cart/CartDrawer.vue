<template>
  <Teleport to="body">
    <transition name="slide">
      <div v-if="isOpen" class="fixed inset-0 z-[10000]">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="closeAndReset"></div>

        <div
          class="absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-[#080808] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col h-full z-[10010]">

          <div
            class="p-8 border-b dark:border-white/10 flex justify-between items-center bg-white dark:bg-[#080808] shrink-0">
            <div class="flex items-center gap-4">
              <button v-if="step === 2" @click="step = 1"
                class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-[#DE1F27] hover:scale-110 transition-all">
                <span class="text-xl font-bold">←</span>
              </button>
              <div>
                <h2
                  class="text-3xl font-[1000] text-[#152C77] dark:text-white uppercase italic leading-none tracking-tighter">
                  {{ step === 1 ? 'Tu Bolsa.' : 'Envío.' }}
                </h2>
                <p class="text-[10px] font-black text-[#DE1F27] mt-1 tracking-widest">
                  {{ step === 1 ? `${cartStore.cartCount} ARTÍCULOS` : 'CONFIRMA TUS DATOS' }}
                </p>
              </div>
            </div>
            <button @click="closeAndReset"
              class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">✕</button>
          </div>

          <div class="flex-grow p-6 overflow-y-auto no-scrollbar bg-white dark:bg-[#080808]">

            <div v-if="step === 1" class="space-y-8">
              <div v-if="cartStore.items.length > 0" class="space-y-6">
                <div v-for="item in cartStore.items" :key="item.id" class="flex gap-4 group">
                  <div
                    class="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-2xl p-2 shrink-0 border border-slate-100 dark:border-white/10 relative">
                    <img :src="item.fotosUrls?.[0]" class="w-full h-full object-contain" />
                  </div>

                  <div class="flex-1">
                    <div class="flex justify-between items-start mb-1">
                      <h4
                        class="text-[11px] font-[1000] text-[#152C77] dark:text-white uppercase italic leading-tight max-w-[160px]">
                        {{ item.nombre }}
                      </h4>
                      <button @click="cartStore.removeItem(item.id)"
                        class="text-slate-300 hover:text-[#DE1F27] transition-colors text-[9px] font-black uppercase tracking-tighter">
                        Eliminar
                      </button>
                    </div>

                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-3">
                      {{ item.presentacion || 'Unidad' }}
                    </p>

                    <div class="flex justify-between items-center">
                      <div
                        class="flex items-center bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/10 p-1">
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
              <div v-else class="h-full flex flex-col items-center justify-center py-20 opacity-20">
                <span class="text-7xl mb-4">🛒</span>
                <p class="font-black text-xs uppercase italic tracking-widest">Tu bolsa está vacía</p>
              </div>
            </div>

            <div v-if="step === 2" class="p-2 space-y-6 animate-fade-in">
              <div class="space-y-5">
                <div v-for="field in ['nombre', 'telefono', 'email', 'direccion']" :key="field" class="flex flex-col">
                  <label class="text-[9px] font-[1000] text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">
                    {{ field === 'telefono' ? 'WhatsApp' : field }}
                  </label>
                  <input v-model="form[field]" :type="field === 'email' ? 'email' : 'text'" class="custom-input"
                    :placeholder="`Tu ${field}...`" />
                </div>
                <div class="flex flex-col">
                  <label class="text-[9px] font-[1000] text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Zona de
                    Entrega</label>
                  <select v-model="form.zona" class="custom-input appearance-none">
                    <option value="" disabled>Selecciona zona</option>
                    <option value="Chía">Chía</option>
                    <option value="Cajicá">Cajicá</option>
                    <option value="Zipaquirá">Zipaquirá</option>
                    <option value="Bogotá">Bogotá Norte</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div v-if="cartStore.items.length > 0"
            class="p-8 border-t dark:border-white/10 bg-slate-50 dark:bg-white/5 pb-10 md:pb-8 shrink-0">

            <div class="flex justify-between mb-6">
              <span class="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Total Estimado</span>
              <span class="text-3xl font-[1000] text-[#152C77] dark:text-white italic">
                ${{ cartStore.totalPrice.toLocaleString() }}
              </span>
            </div>

            <button v-if="step === 1" @click="goToStep2"
              class="w-full bg-[#152C77] hover:bg-[#DE1F27] text-white py-5 rounded-[2rem] font-[1000] uppercase italic shadow-xl transition-all active:scale-95">
              Continuar con el pedido
            </button>

            <button v-else @click="handleFinalizeOrder" :disabled="!isFormValid || loading"
              class="w-full bg-[#25D366] hover:bg-[#128C7E] disabled:bg-slate-300 text-white py-5 rounded-[2rem] font-[1000] uppercase italic shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3">
              <span>{{ loading ? 'Procesando...' : 'Confirmar y WhatsApp' }}</span>
              <span v-if="!loading" class="text-xl">📱</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useCartStore } from '../../stores/cartStore'; //
import { usePedidoStore } from '../../stores/usePedidoStore';

const props = defineProps(['isOpen', 'tutor']);
const emit = defineEmits(['close', 'notify']);

const cartStore = useCartStore();
const pedidoStore = usePedidoStore();

const step = ref(1);
const loading = ref(false);

const form = reactive({
  nombre: '',
  telefono: '',
  email: '',
  direccion: '',
  zona: ''
});

// Pre-llenado automático con los datos del tutor (usando 'rol' como estándar)
const prefillForm = () => {
  if (props.tutor) {
    form.nombre = `${props.tutor.nombre} ${props.tutor.apellido || ''}`.trim();
    form.telefono = props.tutor.telefono || '';
    form.email = props.tutor.email || '';
    form.direccion = props.tutor.direccion || '';
    // Si el backend no envía zona, queda vacío para que el usuario elija
    form.zona = props.tutor.zona || ''; 
  }
};

const isFormValid = computed(() => 
  form.nombre && form.telefono && form.email && form.direccion && form.zona
);

const goToStep2 = () => {
  prefillForm();
  step.value = 2;
};

const closeAndReset = () => {
  step.value = 1;
  emit('close');
};

const handleFinalizeOrder = async () => {
  if (!isFormValid.value) return;
  loading.value = true;

  try {
    // 1. Guardar en Backend usando la lógica de Axios en el Store
    const pedidoGuardado = await pedidoStore.crearPedido(
      form,
      cartStore.items,
      props.tutor?.id
    );

    // 2. Notificación visual al usuario
    emit('notify', { msg: "¡Pedido #"+ pedidoGuardado.id +" registrado!", type: 'success' });

    // 3. Abrir WhatsApp con el ID real retornado por el servidor
    sendWhatsApp(pedidoGuardado.id);

    // 4. Limpiar carrito y cerrar drawer
    cartStore.clearCart();
    closeAndReset();

  } catch (error) {
    emit('notify', { msg: error.message, type: 'error' });
  } finally {
    loading.value = false;
  }
};

const sendWhatsApp = (orderId) => {
  const phone = "573124965755";
  const iconOrder = "🚀";
  const iconUser = "👤";
  const iconLoc = "📍";
  const iconMoney = "💰";

  let message = `${iconOrder} *ORDEN #${orderId} - PET STATION*\n`;
  message += `------------------------------------------\n`;
  message += `${iconUser} *Cliente:* ${form.nombre}\n`;
  message += `${iconLoc} *Entrega:* ${form.direccion} (${form.zona})\n`;
  message += `------------------------------------------\n\n`;

  cartStore.items.forEach(i => {
    message += `• ${i.nombre} (x${i.quantity})\n`;
  });

  message += `\n${iconMoney} *TOTAL: $${cartStore.totalPrice.toLocaleString()}*\n`;
  message += `------------------------------------------\n`;
  message += `_Confirmar pedido generado en web._`;

  const encodedMsg = encodeURIComponent(message).replace(/\*/g, '%2A');
  window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
};

watch(() => props.isOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
  if (!val) step.value = 1;
});
</script>

<style scoped>
@reference "../../style.css";

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.custom-input {
  @apply w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 py-4 text-xs font-black uppercase italic outline-none focus:border-[#DE1F27] transition-all dark:text-white;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>