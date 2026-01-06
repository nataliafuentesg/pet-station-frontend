<template>
  <Teleport to="body">
    <transition name="slide">
      <div v-if="isOpen" class="fixed inset-0 z-[300]">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>
        
        <div class="absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-[#050505] shadow-2xl flex flex-col h-full z-[310]">
          
          <div class="p-8 border-b dark:border-white/10 flex justify-between items-center bg-white dark:bg-[#050505] sticky top-0">
            <div>
              <h2 class="text-2xl font-[1000] text-[#152C77] dark:text-white uppercase italic leading-none">Tu Carrito</h2>
              <p class="text-[10px] font-black text-[#DE1F27] mt-1">{{ cartStore.cartCount }} ARTÍCULOS</p>
            </div>
            <button @click="$emit('close')" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">✕</button>
          </div>

          <div class="flex-grow p-6 overflow-y-auto custom-scrollbar bg-white dark:bg-[#050505]">
            <div v-if="cartStore.items.length > 0" class="space-y-6">
              <div v-for="item in cartStore.items" :key="item.id" class="flex gap-4 group">
                <div class="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-2xl p-2 shrink-0 border border-slate-100 dark:border-white/10">
                  <img :src="item.fotosUrls?.[0]" class="w-full h-full object-contain" />
                </div>
                
                <div class="flex-1">
                  <div class="flex justify-between items-start mb-1">
                    <h4 class="text-[11px] font-[1000] text-[#152C77] dark:text-white uppercase italic leading-tight max-w-[160px]">
                      {{ item.nombre }}
                    </h4>
                    <button @click="cartStore.removeItem(item.id)" class="text-slate-300 hover:text-[#DE1F27] transition-colors text-xs">ELIMINAR</button>
                  </div>
                  
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-3">
                    SKU: {{ item.sku || 'N/A' }} | {{ item.presentacion || 'U' }}
                  </p>

                  <div class="flex justify-between items-center">
                    <div class="flex items-center bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/10 p-1">
                      <button @click="cartStore.updateQty(item.id, item.quantity - 1)" class="w-6 h-6 flex items-center justify-center text-[#DE1F27] font-bold">-</button>
                      <span class="px-2 text-[10px] font-black dark:text-white">{{ item.quantity }}</span>
                      <button @click="cartStore.updateQty(item.id, item.quantity + 1)" class="w-6 h-6 flex items-center justify-center text-[#DE1F27] font-bold">+</button>
                    </div>
                    <span class="font-[1000] text-[#152C77] dark:text-white italic text-sm">
                      ${{ (item.precio * item.quantity).toLocaleString() }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="h-full flex flex-col items-center justify-center py-20 opacity-20 dark:invert">
              <span class="text-7xl mb-4">🛒</span>
              <p class="font-black text-xs uppercase italic tracking-widest">Tu bolsa está vacía</p>
            </div>
          </div>

          <div v-if="cartStore.items.length > 0" class="p-8 border-t dark:border-white/10 bg-slate-50 dark:bg-white/5 sticky bottom-0">
            <div class="flex justify-between mb-6">
              <span class="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Total Estimado</span>
              <span class="text-3xl font-[1000] text-[#152C77] dark:text-white italic">
                ${{ cartStore.totalPrice.toLocaleString() }}
              </span>
            </div>
            
            <button @click="handleWhatsAppOrder" class="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-5 rounded-[2rem] font-[1000] uppercase italic tracking-tighter shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3">
              <span>Enviar Pedido a WhatsApp</span>
              <span class="text-xl">📱</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue';
import { useCartStore } from '../../stores/cartStore'; // AJUSTA LA RUTA SEGÚN TU PROYECTO

const props = defineProps(['isOpen']);
const emit = defineEmits(['close']);
const cartStore = useCartStore();

const handleWhatsAppOrder = () => {
  const phone = "573124965755"; 
  const total = cartStore.totalPrice.toLocaleString();
  const totalItems = cartStore.cartCount;
  
  // Encabezado con Estilo
  let message = `🏥 *ORDEN DE PEDIDO - PETSTATION*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🛒 *Resumen:* ${totalItems} producto(s)\n`;
  message += `📅 *Fecha:* ${new Date().toLocaleDateString()}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  // Cuerpo del mensaje
  cartStore.items.forEach((item, index) => {
    const subtotal = (item.precio * item.quantity).toLocaleString();
    message += `✅ *${item.nombre.toUpperCase()}*\n`;
    message += `   • Cantidad: ${item.quantity}\n`;
    message += `   • SKU: \`${item.sku || 'N/A'}\`\n`;
    if(item.presentacion) message += `   • Formato: ${item.presentacion}\n`;
    message += `   • Subtotal: *$${subtotal}*\n\n`;
  });

  // Cierre de Factura
  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL FINAL: $${total}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `🐾 _Por favor, envíenme el link de pago o datos bancarios para finalizar la compra._`;

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
};

watch(() => props.isOpen, (newVal) => {
  document.body.style.overflow = newVal ? 'hidden' : '';
});
</script>