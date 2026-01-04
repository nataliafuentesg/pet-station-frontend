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
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nombre Completo</label>
                <input v-model="form.nombre" type="text" placeholder="Ej: Juan Pérez" class="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold dark:text-white focus:border-[#DE1F27] outline-none transition-all">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Teléfono</label>
                <input v-model="form.telefono" type="tel" placeholder="Ej: 310..." class="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold dark:text-white focus:border-[#DE1F27] outline-none transition-all">
              </div>
              <div class="md:col-span-2 space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Dirección de Entrega</label>
                <input v-model="form.direccion" type="text" placeholder="Calle, Número, Barrio, Ciudad" class="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold dark:text-white focus:border-[#DE1F27] outline-none transition-all">
              </div>
            </div>
          </div>

          <div class="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5">
            <h2 class="text-2xl font-[1000] uppercase italic text-[#152C77] dark:text-white mb-8">2. Método de Pago</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button @click="form.metodoPago = 'EFECTIVO'" 
                :class="form.metodoPago === 'EFECTIVO' ? 'border-[#DE1F27] bg-[#DE1F27]/5 text-[#DE1F27]' : 'border-slate-200 dark:border-white/10 text-slate-400'"
                class="flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all group">
                <span class="text-3xl">💵</span>
                <span class="text-[10px] font-black uppercase">Efectivo</span>
              </button>
              
              <button @click="form.metodoPago = 'TRANSFERENCIA'" 
                :class="form.metodoPago === 'TRANSFERENCIA' ? 'border-[#DE1F27] bg-[#DE1F27]/5 text-[#DE1F27]' : 'border-slate-200 dark:border-white/10 text-slate-400'"
                class="flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all group">
                <span class="text-3xl">📲</span>
                <span class="text-[10px] font-black uppercase">Nequi / Daviplata</span>
              </button>

              <button @click="form.metodoPago = 'TARJETA'" 
                :class="form.metodoPago === 'TARJETA' ? 'border-[#DE1F27] bg-[#DE1F27]/5 text-[#DE1F27]' : 'border-slate-200 dark:border-white/10 text-slate-400'"
                class="flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all group">
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
                  <p class="text-[10px] opacity-60 font-bold">{{ item.cantidad }} x ${{ item.precio.toLocaleString() }}</p>
                </div>
                <p class="text-sm font-black italic">${{ (item.precio * item.cantidad).toLocaleString() }}</p>
              </div>
            </div>

            <div class="space-y-4 border-t border-white/10 pt-8">
              <div class="flex justify-between text-sm font-bold opacity-60">
                <span>Subtotal</span>
                <span>${{ cartStore.total.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm font-bold opacity-60">
                <span>Envío</span>
                <span class="text-green-400 uppercase">Gratis</span>
              </div>
              <div class="flex justify-between items-end pt-4">
                <span class="text-xl font-[1000] uppercase italic">Total</span>
                <span class="text-4xl font-[1000] italic text-[#DE1F27]">${{ cartStore.total.toLocaleString() }}</span>
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cartStore';

const cartStore = useCartStore();
const router = useRouter();
const loading = ref(false);
const emit = defineEmits(['notify']);

const form = reactive({
  nombre: '',
  telefono: '',
  direccion: '',
  metodoPago: 'EFECTIVO'
});

const procesarCompra = async () => {
  // Validación básica
  if (!form.nombre || !form.telefono || !form.direccion) {
    emit('notify', 'Por favor completa todos los campos de envío', 'error');
    return;
  }

  loading.value = true;

  try {
    // Aquí iría tu fetch al Backend para guardar la orden
    // const res = await fetch('http://localhost:8080/api/ordenes', { ... })
    
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 2000));

    emit('notify', '¡Compra realizada con éxito! Recibirás un mensaje pronto.', 'success');
    
    cartStore.clearCart(); // Limpiamos el carrito
    router.push('/'); // Volvemos al inicio o a una página de éxito
    
  } catch (error) {
    emit('notify', 'Hubo un error al procesar tu pedido', 'error');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>