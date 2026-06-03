<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 px-4 transition-colors">
    <div class="max-w-[1400px] mx-auto">

      <h1 class="text-5xl md:text-7xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white leading-none mb-12">
        FINALIZAR <span class="text-[#DE1F27]">COMPRA.</span>
      </h1>

      <div v-if="cartStore.items.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-12">

        <div class="lg:col-span-7 space-y-8">

          <div class="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5">
            <h2 class="text-2xl font-[1000] uppercase italic text-[#152C77] dark:text-white mb-8">1. Datos de Envío</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nombre Completo *</label>
                <input v-model="form.nombre" type="text" placeholder="Ej: Juan Pérez"
                  :class="['w-full bg-white dark:bg-black border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all', errores.nombre ? 'border-[#DE1F27]' : 'border-slate-200 dark:border-white/10 focus:border-[#DE1F27]']" />
                <p v-if="errores.nombre" class="text-[10px] text-[#DE1F27] font-bold ml-2">{{ errores.nombre }}</p>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Teléfono WhatsApp *</label>
                <input v-model="form.telefono" type="tel" placeholder="Ej: 310 000 0000"
                  :class="['w-full bg-white dark:bg-black border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all', errores.telefono ? 'border-[#DE1F27]' : 'border-slate-200 dark:border-white/10 focus:border-[#DE1F27]']" />
                <p v-if="errores.telefono" class="text-[10px] text-[#DE1F27] font-bold ml-2">{{ errores.telefono }}</p>
              </div>

              <div class="md:col-span-2 space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Dirección de Entrega *</label>
                <input v-model="form.direccion" type="text" placeholder="Calle, Número, Barrio, Ciudad"
                  :class="['w-full bg-white dark:bg-black border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all', errores.direccion ? 'border-[#DE1F27]' : 'border-slate-200 dark:border-white/10 focus:border-[#DE1F27]']" />
                <p v-if="errores.direccion" class="text-[10px] text-[#DE1F27] font-bold ml-2">{{ errores.direccion }}</p>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Correo (Opcional)</label>
                <input v-model="form.email" type="email" placeholder="para recibir confirmación"
                  class="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold dark:text-white focus:border-[#DE1F27] outline-none transition-all" />
              </div>

              <div class="md:col-span-2 space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Zona de Entrega *</label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    v-for="zona in ZONAS_COBERTURA"
                    :key="zona.nombre"
                    type="button"
                    @click="form.zona = zona.nombre"
                    :class="[
                      'flex items-center gap-2 px-4 py-3 rounded-2xl border-2 text-left transition-all',
                      form.zona === zona.nombre
                        ? 'border-[#DE1F27] bg-[#DE1F27]/5 text-[#DE1F27]'
                        : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 hover:border-slate-400 dark:hover:border-white/30'
                    ]">
                    <span class="text-lg leading-none">{{ zona.emoji }}</span>
                    <span class="text-[11px] font-black uppercase leading-tight">{{ zona.nombre }}</span>
                  </button>
                </div>
                <p v-if="errores.zona" class="text-[10px] text-[#DE1F27] font-bold ml-2">{{ errores.zona }}</p>
                <p class="text-[9px] text-slate-400 dark:text-white/30 font-bold ml-2 uppercase tracking-wide">
                  Cobertura ~5 km alrededor de Pet Station, Chía · ¿Tu zona no aparece? Escríbenos primero
                </p>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5">
            <h2 class="text-2xl font-[1000] uppercase italic text-[#152C77] dark:text-white mb-8">2. Método de Pago</h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button @click="form.metodoPago = 'EFECTIVO'"
                :class="form.metodoPago === 'EFECTIVO' ? 'border-[#DE1F27] bg-[#DE1F27]/5 text-[#DE1F27]' : 'border-slate-200 dark:border-white/10 text-slate-400'"
                class="flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all">
                <span class="text-3xl">💵</span>
                <span class="text-[10px] font-black uppercase">Efectivo</span>
              </button>

              <button @click="form.metodoPago = 'TRANSFERENCIA'"
                :class="form.metodoPago === 'TRANSFERENCIA' ? 'border-[#DE1F27] bg-[#DE1F27]/5 text-[#DE1F27]' : 'border-slate-200 dark:border-white/10 text-slate-400'"
                class="flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all">
                <span class="text-3xl">📲</span>
                <span class="text-[10px] font-black uppercase">Nequi / Daviplata</span>
              </button>

              <button @click="form.metodoPago = 'TARJETA'"
                :class="form.metodoPago === 'TARJETA' ? 'border-[#DE1F27] bg-[#DE1F27]/5 text-[#DE1F27]' : 'border-slate-200 dark:border-white/10 text-slate-400'"
                class="flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all">
                <span class="text-3xl">💳</span>
                <span class="text-[10px] font-black uppercase">Tarjeta</span>
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="bg-[#152C77] rounded-[3rem] p-10 text-white sticky top-32 shadow-2xl">
            <h2 class="text-3xl font-[1000] uppercase italic mb-8">Tu Pedido</h2>

            <div class="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-4 no-scrollbar">
              <div v-for="item in cartStore.items" :key="item.id" class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-xl bg-white/10 overflow-hidden shrink-0">
                  <img :src="item.fotosUrls?.[0]" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                  <p class="text-[11px] font-black uppercase leading-tight">{{ item.nombre }}</p>
                  <p class="text-[10px] opacity-60 font-bold">{{ item.quantity }} x ${{ item.precio.toLocaleString() }}</p>
                </div>
                <p class="text-sm font-black italic">${{ (item.precio * item.quantity).toLocaleString() }}</p>
              </div>
            </div>

            <div class="space-y-4 border-t border-white/10 pt-8">
              <div class="flex justify-between text-sm font-bold opacity-60">
                <span>Subtotal</span>
                <span>${{ cartStore.totalPrice.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm font-bold opacity-60">
                <span>Envío</span>
                <span class="text-green-400 uppercase">Gratis</span>
              </div>
              <div class="flex justify-between items-end pt-4">
                <span class="text-xl font-[1000] uppercase italic">Total</span>
                <span class="text-4xl font-[1000] italic text-[#DE1F27]">${{ cartStore.totalPrice.toLocaleString() }}</span>
              </div>
            </div>

            <button
              @click="procesarCompra"
              :disabled="loading"
              class="w-full bg-[#DE1F27] hover:bg-white hover:text-[#DE1F27] text-white mt-10 py-6 rounded-2xl font-[1000] uppercase italic tracking-tighter transition-all active:scale-95 disabled:opacity-50 disabled:animate-pulse">
              {{ loading ? 'Procesando...' : 'Confirmar y Pagar' }}
            </button>
          </div>
        </div>

      </div>

      <div v-else class="flex flex-col items-center justify-center py-20">
        <span class="text-9xl mb-8">🛒</span>
        <h2 class="text-4xl font-[1000] uppercase italic text-[#152C77] dark:text-white mb-8">Tu carrito está vacío</h2>
        <router-link to="/tienda" class="bg-[#DE1F27] text-white px-10 py-5 rounded-2xl font-black uppercase italic tracking-tighter hover:scale-105 transition-transform">
          Volver a la Tienda
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cartStore';
import api from '../../api/axios';
import { useTracking } from '@/composables/useTracking';

const { trackInicioCheckout, trackCompraCompletada } = useTracking();

const cartStore = useCartStore();
const router = useRouter();
const loading = ref(false);
const emit = defineEmits(['notify']);

const ZONAS_COBERTURA = [
  { nombre: 'Chía Centro',       emoji: '🏙️' },
  { nombre: 'La Balsa',          emoji: '🌳' },
  { nombre: 'Fonquetá',          emoji: '🏡' },
  { nombre: 'El Refugio',        emoji: '🌿' },
  { nombre: 'Cerca de Piedra',   emoji: '⛰️' },
  { nombre: 'Compartir',         emoji: '🏘️' },
  { nombre: 'La Florida',        emoji: '🌸' },
  { nombre: 'Bojacá - Chía',     emoji: '🏞️' },
  { nombre: 'La Convocatoria',   emoji: '🏠' },
  { nombre: 'El Tejar',          emoji: '🧱' },
];

const form = reactive({
  nombre: '',
  telefono: '',
  direccion: '',
  email: '',
  zona: '',
  metodoPago: 'EFECTIVO'
});

const errores = reactive({ nombre: '', telefono: '', direccion: '', zona: '' });

onMounted(() => {
  trackInicioCheckout(cartStore.totalPrice, cartStore.items.length);
});

const validar = () => {
  errores.nombre = '';
  errores.telefono = '';
  errores.direccion = '';
  errores.zona = '';
  let ok = true;

  if (!form.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio';
    ok = false;
  }

  const tel = form.telefono.replace(/\s/g, '');
  if (!tel) {
    errores.telefono = 'El teléfono es obligatorio';
    ok = false;
  } else if (!/^\d{10}$/.test(tel)) {
    errores.telefono = 'Ingresa un número de 10 dígitos';
    ok = false;
  }

  if (!form.direccion.trim()) {
    errores.direccion = 'La dirección de entrega es obligatoria';
    ok = false;
  }

  if (!form.zona) {
    errores.zona = 'Selecciona tu zona de entrega';
    ok = false;
  }

  return ok;
};

const procesarCompra = async () => {
  if (!validar()) {
    emit('notify', { msg: 'Por favor completa los campos obligatorios', type: 'warning' });
    return;
  }

  loading.value = true;

  try {
    const sessionStr = localStorage.getItem('ps_session');
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    const tutorId = session?.tutor?.id || session?.id || null;

    const payload = {
      nombre: form.nombre.trim(),
      telefono: form.telefono.replace(/\s/g, ''),
      direccion: form.direccion.trim(),
      email: form.email.trim() || null,
      zona: form.zona.trim() || null,
      tutorId,
      items: cartStore.items.map(item => ({
        productoId: item.id,
        cantidad: item.quantity,
        nombreProducto: item.nombre,
        precioUnitario: item.precio,
        fotoUrl: item.fotosUrls?.[0] || null
      }))
    };

    await api.post('/pedidos', payload);

    trackCompraCompletada(cartStore.totalPrice, cartStore.items.length);

    emit('notify', { msg: '¡Pedido confirmado! Pronto te contactamos por WhatsApp.', type: 'success' });
    cartStore.clearCart();

    setTimeout(() => router.push('/'), 1500);

  } catch (error) {
    const msg = error.response?.data?.message || 'Hubo un error al procesar tu pedido. Intenta de nuevo.';
    emit('notify', { msg, type: 'error' });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
