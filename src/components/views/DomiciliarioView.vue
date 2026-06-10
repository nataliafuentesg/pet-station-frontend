<template>
  <div class="min-h-screen bg-[#050505] px-4 pb-20 pt-10">

    <!-- PIN Screen -->
    <div v-if="!autenticado" class="flex flex-col items-center justify-center min-h-[80vh]">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <p class="text-4xl mb-3">🚚</p>
          <h1 class="text-2xl font-[1000] uppercase italic text-white">Portal <span class="text-[#DE1F27]">Domiciliario</span></h1>
          <p class="text-[10px] font-black uppercase text-white/30 tracking-widest mt-2">Pet Station · Acceso interno</p>
        </div>
        <div class="bg-white/5 rounded-[2rem] p-8 border border-white/10 space-y-6">
          <div class="space-y-2">
            <label class="text-[9px] font-black uppercase text-white/40 tracking-widest ml-2">PIN de acceso</label>
            <input v-model="pin" type="password" inputmode="numeric" placeholder="••••••"
              @keyup.enter="verificarPin"
              class="w-full bg-white/10 border border-white/10 rounded-2xl p-5 text-white text-2xl font-black tracking-[1rem] text-center outline-none focus:border-[#DE1F27] transition-all" />
          </div>
          <p v-if="pinError" class="text-[10px] text-[#DE1F27] font-bold text-center">{{ pinError }}</p>
          <button @click="verificarPin" :disabled="!pin"
            class="w-full bg-[#DE1F27] text-white py-5 rounded-2xl font-[1000] uppercase tracking-widest text-[10px] hover:bg-red-600 active:scale-95 transition-all disabled:opacity-40">
            Entrar
          </button>
        </div>
      </div>
    </div>

    <!-- Panel domiciliario -->
    <div v-else class="w-full max-w-2xl mx-auto space-y-5">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-[1000] uppercase italic text-white">Mi <span class="text-[#DE1F27]">Ruta</span></h1>
          <p class="text-[9px] font-black uppercase text-white/30 tracking-widest">{{ fechaHoy }}</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="cargarPedidos" class="text-white/40 hover:text-white transition-all text-base">🔄</button>
          <button @click="autenticado = false" class="text-[9px] font-black uppercase text-white/30 hover:text-[#DE1F27] transition-all">Salir</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-green-500/10 rounded-2xl p-4 text-center border border-green-500/20">
          <p class="text-2xl font-[1000] text-green-400">{{ countPagado }}</p>
          <p class="text-[8px] font-black uppercase text-green-400/60 tracking-widest mt-1">Por entregar</p>
        </div>
        <div class="bg-blue-500/10 rounded-2xl p-4 text-center border border-blue-500/20">
          <p class="text-2xl font-[1000] text-blue-400">{{ countCamino }}</p>
          <p class="text-[8px] font-black uppercase text-blue-400/60 tracking-widest mt-1">En camino</p>
        </div>
        <div class="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
          <p class="text-2xl font-[1000] text-white/70">{{ entregadosHoy.length }}</p>
          <p class="text-[8px] font-black uppercase text-white/30 tracking-widest mt-1">Entregados hoy</p>
        </div>
      </div>

      <!-- Buscador -->
      <div class="relative">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
        <input v-model="busqueda" type="text" placeholder="Buscar por # de pedido o cliente..."
          class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-11 text-white text-[12px] font-bold outline-none focus:border-[#DE1F27] transition-all placeholder:text-white/20" />
      </div>

      <div v-if="cargando" class="text-center py-12 text-white/30 font-black uppercase text-[10px] tracking-widest">Cargando...</div>

      <div v-else class="space-y-6">

        <!-- RUTA: por entregar -->
        <div v-if="paraEntregar.length" class="space-y-3">
          <p class="text-[9px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2">
            🛵 Ruta sugerida ({{ paraEntregar.length }}) · ordenada por cercanía
          </p>

          <div v-for="(p, idx) in paraEntregar" :key="p.id"
            class="bg-white/5 rounded-[2rem] border transition-all"
            :class="p.estado === 'EN_CAMINO' ? 'border-blue-500/40' : 'border-green-500/30'">

            <div class="p-5">
              <div class="flex items-start gap-3 mb-4">
                <!-- Número de parada -->
                <div class="w-9 h-9 rounded-xl bg-[#DE1F27] text-white flex items-center justify-center font-[1000] text-sm shrink-0">
                  {{ idx + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="text-[8px] font-black uppercase text-white/30 tracking-widest">{{ p.codigoPedido || ('#' + p.id) }}</span>
                    <span :class="['px-2 py-0.5 rounded-md text-[8px] font-black uppercase italic', badgeEstado(p.estado)]">
                      {{ iconoEstado(p.estado) }} {{ labelEstado(p.estado) }}
                    </span>
                  </div>
                  <h3 class="text-base font-[1000] uppercase italic text-white leading-none">{{ p.nombreCliente }}</h3>
                </div>
                <p class="text-base font-[1000] italic text-[#DE1F27] shrink-0">${{ p.total?.toLocaleString() }}</p>
              </div>

              <!-- Dirección -->
              <div class="bg-white/5 rounded-2xl p-4 space-y-1.5 mb-4">
                <p class="text-[9px] font-black text-[#DE1F27] uppercase tracking-widest">📍 {{ p.zona }}</p>
                <p class="text-[12px] font-bold text-white leading-relaxed">{{ p.direccionEntrega }}</p>
                <a :href="mapsUrl(p)" target="_blank"
                  class="inline-flex items-center gap-1.5 text-[9px] font-black uppercase text-blue-400 hover:text-blue-300 transition-all mt-1">
                  🗺️ Abrir en Maps →
                </a>
              </div>

              <!-- Items -->
              <div class="space-y-1 mb-4">
                <p class="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Verificar productos</p>
                <div v-for="item in p.items" :key="item.id" class="flex justify-between text-[11px]">
                  <span class="font-bold text-white/70 truncate mr-2">• {{ item.nombreProducto }}</span>
                  <span class="font-black text-white shrink-0">x{{ item.cantidad }}</span>
                </div>
              </div>

              <!-- WhatsApp -->
              <a :href="`https://wa.me/57${(p.telefonoWhatsApp || '').replace(/\D/g,'')}`" target="_blank"
                class="flex items-center gap-2 text-[10px] font-black uppercase text-green-400 mb-4">
                💬 {{ p.telefonoWhatsApp }} · Llamar/Escribir
              </a>

              <!-- Acción: PAGADO → salir -->
              <button v-if="p.estado === 'PAGADO'" @click="cambiarEstado(p, 'EN_CAMINO')"
                class="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:bg-blue-500 active:scale-95 transition-all">
                🚚 Salir a Entregar
              </button>

              <!-- Acción: EN_CAMINO → entregar -->
              <div v-else-if="p.estado === 'EN_CAMINO'" class="space-y-3">
                <div class="space-y-1.5">
                  <label class="text-[8px] font-black uppercase text-white/40 tracking-widest ml-1">¿Quién recibió el pedido?</label>
                  <input v-model="receptores[p.id]" type="text" placeholder="Nombre de quien recibió"
                    class="w-full bg-white/10 border border-white/10 rounded-xl p-3.5 text-white text-[12px] font-bold outline-none focus:border-green-400 transition-all placeholder:text-white/20" />
                </div>
                <button @click="marcarEntregado(p)" :disabled="!receptores[p.id]?.trim()"
                  class="w-full bg-green-600 text-white py-3.5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:bg-green-500 active:scale-95 transition-all disabled:opacity-30">
                  ✅ Confirmar Entrega
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Vacío -->
        <div v-if="paraEntregar.length === 0 && entregadosHoy.length === 0" class="text-center py-16 space-y-3">
          <p class="text-4xl">📭</p>
          <p class="text-[10px] font-black uppercase text-white/30 tracking-widest">
            {{ busqueda ? 'Sin resultados' : 'No hay pedidos para entregar' }}
          </p>
        </div>

        <!-- Entregados hoy -->
        <div v-if="entregadosHoy.length" class="space-y-3">
          <p class="text-[9px] font-black uppercase text-white/30 tracking-widest">✅ Entregados hoy ({{ entregadosHoy.length }})</p>
          <div v-for="p in entregadosHoy" :key="p.id"
            class="bg-white/[0.02] rounded-2xl border border-green-500/20 p-4 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[11px] font-[1000] uppercase italic text-white/70 truncate">{{ p.nombreCliente }}</p>
              <p class="text-[8px] font-black uppercase text-white/30 tracking-widest">{{ p.codigoPedido || ('#'+p.id) }} · {{ p.zona }}</p>
              <p v-if="p.receptorEntrega" class="text-[9px] font-bold text-green-400 mt-0.5">Recibió: {{ p.receptorEntrega }}</p>
            </div>
            <span class="text-green-400 text-lg shrink-0">✅</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import api from '@/api/axios';

// El PIN se valida en el servidor — aquí solo lo usamos para enviar la petición.
// Ponlo en .env.local como VITE_DOMICILIARIO_PIN=xxxx (nunca lo subas al repo)
const PIN_CORRECTO = import.meta.env.VITE_DOMICILIARIO_PIN || '2413';

const autenticado = ref(false);
const pin = ref('');
const pinError = ref('');
const cargando = ref(false);
const pedidos = ref([]);
const receptores = ref({});
const busqueda = ref('');

const fechaHoy = computed(() => new Date().toLocaleDateString('es-CO', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
}));

// Prioridad de zona para la ruta (Pet Station está en Chía → más cerca primero)
const prioridadZona = (zona) => {
  const z = (zona || '').toLowerCase();
  if (z.includes('chía') || z.includes('chia')) return 1;
  if (z.includes('cajicá') || z.includes('cajica')) return 2;
  if (z.includes('bogot')) return 3;
  return 4;
};

const aplicarBusqueda = (lista) => {
  const q = busqueda.value.trim().toLowerCase();
  if (!q) return lista;
  return lista.filter(p =>
    (p.codigoPedido || '').toLowerCase().includes(q) ||
    (p.nombreCliente || '').toLowerCase().includes(q) ||
    String(p.id).includes(q)
  );
};

// Por entregar: PAGADO + EN_CAMINO (de cualquier fecha), ordenados por ruta
const paraEntregar = computed(() => {
  const lista = pedidos.value
    .filter(p => ['PAGADO', 'EN_CAMINO'].includes(p.estado))
    .sort((a, b) => {
      const pz = prioridadZona(a.zona) - prioridadZona(b.zona);
      if (pz !== 0) return pz;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  return aplicarBusqueda(lista);
});

// Entregados de hoy
const entregadosHoy = computed(() => {
  const hoy = new Date().toDateString();
  const lista = pedidos.value.filter(p =>
    p.estado === 'ENTREGADO' && p.createdAt && new Date(p.createdAt).toDateString() === hoy
  );
  return aplicarBusqueda(lista);
});

const countPagado = computed(() => pedidos.value.filter(p => p.estado === 'PAGADO').length);
const countCamino = computed(() => pedidos.value.filter(p => p.estado === 'EN_CAMINO').length);

const verificarPin = () => {
  if (pin.value === PIN_CORRECTO) {
    autenticado.value = true;
    pinError.value = '';
    cargarPedidos();
  } else {
    pinError.value = 'PIN incorrecto. Intenta de nuevo.';
    pin.value = '';
  }
};

const cargarPedidos = async () => {
  cargando.value = true;
  try {
    const { data } = await api.get('/domiciliario/pedidos', { params: { pin: PIN_CORRECTO } });
    pedidos.value = Array.isArray(data) ? data : (data.content || []);
  } catch (e) {
    console.error('Error cargando pedidos:', e);
  } finally {
    cargando.value = false;
  }
};

const cambiarEstado = async (pedido, nuevoEstado) => {
  try {
    await api.patch(`/domiciliario/pedidos/${pedido.id}/camino`, null, { params: { pin: PIN_CORRECTO } });
    pedido.estado = nuevoEstado;
  } catch (e) {
    alert('Error al actualizar el estado.');
  }
};

const marcarEntregado = async (pedido) => {
  const receptor = receptores.value[pedido.id]?.trim();
  if (!receptor) return;
  try {
    await api.patch(`/domiciliario/pedidos/${pedido.id}/entregado`, null, {
      params: { pin: PIN_CORRECTO, receptor }
    });
    pedido.estado = 'ENTREGADO';
    pedido.receptorEntrega = receptor;
  } catch (e) {
    alert('Error al marcar como entregado.');
  }
};

// Link de Google Maps con dirección + ciudad (limpia el "· barrio" de la zona)
const mapsUrl = (p) => {
  const ciudad = (p.zona || '').split('·')[0].trim(); // "Chía · La Balsa" → "Chía"
  const query = [p.direccionEntrega, ciudad, 'Colombia'].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const badgeEstado = (e) => {
  if (e === 'PAGADO')    return 'bg-green-500/20 text-green-400';
  if (e === 'EN_CAMINO') return 'bg-blue-600/30 text-blue-300';
  return 'bg-white/10 text-white/50';
};
const iconoEstado = (e) => ({ PAGADO: '💰', EN_CAMINO: '🚚' }[e] || '•');
const labelEstado = (e) => ({ PAGADO: 'Listo', EN_CAMINO: 'En camino' }[e] || e);
</script>
