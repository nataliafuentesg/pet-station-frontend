<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 px-4 transition-colors">
    <div class="max-w-[1400px] mx-auto">

      <h1 class="text-3xl md:text-5xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white leading-none mb-8">
        FINALIZAR <span class="text-[#DE1F27]">COMPRA.</span>
      </h1>

      <!-- Banner pedido mínimo -->
      <div v-if="cartStore.totalPrice < MINIMO_DOMICILIO" class="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-400/20 rounded-2xl p-4 mb-8 flex items-start gap-3">
        <span class="text-xl shrink-0">⚠️</span>
        <div>
          <p class="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400">Pedido mínimo para domicilio: ${{ MINIMO_DOMICILIO.toLocaleString() }}</p>
          <p class="text-[10px] font-bold text-amber-600 dark:text-amber-300 mt-0.5">
            Te faltan ${{ (MINIMO_DOMICILIO - cartStore.totalPrice).toLocaleString() }} · <router-link to="/tienda" class="underline">Seguir comprando</router-link>
          </p>
        </div>
      </div>

      <!-- Banner logística -->
      <div class="bg-[#152C77]/5 dark:bg-white/5 border border-[#152C77]/10 dark:border-white/10 rounded-2xl p-4 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div>
          <p class="text-lg">🚚</p>
          <p class="text-[9px] font-black uppercase text-[#152C77] dark:text-white">Envío gratis</p>
          <p class="text-[8px] font-bold text-slate-400">en pedidos desde $200.000</p>
        </div>
        <div>
          <p class="text-lg">⏰</p>
          <p class="text-[9px] font-black uppercase text-[#152C77] dark:text-white">Pagas antes de 2PM = mismo día</p>
          <p class="text-[8px] font-bold text-slate-400">después de las 2PM, al día siguiente</p>
        </div>
        <div>
          <p class="text-lg">📅</p>
          <p class="text-[9px] font-black uppercase text-[#152C77] dark:text-white">{{ mensajeEntrega }}</p>
          <p class="text-[8px] font-bold text-slate-400">sin domicilios domingos ni festivos</p>
        </div>
      </div>

      <!-- Panel de pago: aparece tras confirmar el pedido (independiente del carrito) -->
      <div v-if="boldListo" class="max-w-md mx-auto bg-[#152C77] rounded-[3rem] p-10 text-white text-center shadow-2xl">
        <span class="text-4xl">✅</span>
        <h2 class="text-2xl font-[1000] uppercase italic mt-3 mb-1">Pedido Confirmado</h2>
        <p class="text-[10px] font-black uppercase tracking-widest text-green-400 mb-8">Paga para finalizar</p>
        <div ref="boldContainer" class="flex justify-center mb-4"></div>
        <p class="text-[8px] font-bold text-white/40 uppercase leading-relaxed">
          Pago seguro con Bold · Tarjeta · PSE · Nequi · Daviplata
        </p>
      </div>

      <div v-else-if="cartStore.items.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-12">

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
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Correo *</label>
                <input v-model="form.email" type="email" placeholder="tu@correo.com"
                  :class="['w-full bg-white dark:bg-black border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all', errores.email ? 'border-[#DE1F27]' : 'border-slate-200 dark:border-white/10 focus:border-[#DE1F27]']" />
                <p v-if="errores.email" class="text-[10px] text-[#DE1F27] font-bold ml-2">{{ errores.email }}</p>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Confirmar correo *</label>
                <input v-model="form.emailConfirm" type="email" placeholder="repite tu correo" @paste.prevent
                  :class="['w-full bg-white dark:bg-black border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all', errores.emailConfirm ? 'border-[#DE1F27]' : 'border-slate-200 dark:border-white/10 focus:border-[#DE1F27]']" />
                <p v-if="errores.emailConfirm" class="text-[10px] text-[#DE1F27] font-bold ml-2">{{ errores.emailConfirm }}</p>
              </div>

              <div class="md:col-span-2 space-y-4">

                <!-- Botón GPS — acción principal -->
                <button type="button" @click="detectarUbicacion"
                  :disabled="geoEstado === 'cargando'"
                  :class="[
                    'w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 font-[1000] uppercase text-[10px] tracking-widest transition-all',
                    geoResultado?.enCobertura
                      ? 'border-green-400 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                      : 'border-[#152C77]/30 dark:border-white/20 bg-[#152C77]/5 dark:bg-white/5 text-[#152C77] dark:text-white hover:border-[#152C77] hover:bg-[#152C77] hover:text-white'
                  ]">
                  <span class="text-lg">{{ geoEstado === 'cargando' ? '⏳' : geoResultado?.enCobertura ? '✅' : '📍' }}</span>
                  {{ geoEstado === 'cargando' ? 'Detectando tu ubicación...' : geoResultado?.enCobertura ? '¡Estás dentro de cobertura!' : 'Verificar cobertura con GPS' }}
                </button>

                <!-- Resultado GPS -->
                <Transition name="fade-up">
                  <div v-if="geoResultado && !geoResultado.enCobertura"
                    class="rounded-2xl p-4 border-2 bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/30 flex items-start gap-3">
                    <span class="text-xl shrink-0">❌</span>
                    <div>
                      <p class="text-[11px] font-black uppercase text-red-700 dark:text-red-400">
                        Tu ubicación está a {{ geoResultado.distanciaKm }} km — fuera de cobertura
                      </p>
                      <p class="text-[9px] font-bold text-slate-500 mt-1">
                        Cubrimos Chía, Cajicá y Bogotá norte (hasta Calle 53 aprox.)
                      </p>
                      <a href="https://wa.me/573053462413?text=Hola!%20Quiero%20un%20pedido%20pero%20estoy%20fuera%20de%20cobertura%2C%20%C2%BFpueden%20ayudarme%3F"
                        target="_blank"
                        class="text-[9px] font-black uppercase text-[#25D366] underline mt-2 inline-block">
                        💬 Consultar por WhatsApp
                      </a>
                    </div>
                  </div>
                </Transition>

                <!-- Error GPS -->
                <div v-if="geoError" class="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3 border border-amber-200 dark:border-amber-500/30">
                  <p class="text-[9px] font-bold text-amber-700 dark:text-amber-400">⚠️ {{ geoError }}</p>
                </div>

                <!-- Selector manual: ciudad + barrio libre -->
                <div class="space-y-3">
                  <p class="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    {{ geoResultado?.enCobertura ? 'Confirma tu zona:' : 'O ingresa tu zona manualmente:' }}
                  </p>

                  <!-- Selector de ciudad -->
                  <div class="grid grid-cols-3 gap-2">
                    <button v-for="c in CIUDADES" :key="c.nombre" type="button"
                      @click="ciudadSeleccionada = c.nombre; form.zona = c.nombre"
                      :class="[
                        'py-3 px-3 rounded-2xl border-2 text-center transition-all',
                        ciudadSeleccionada === c.nombre
                          ? 'border-[#152C77] bg-[#152C77] text-white'
                          : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 hover:border-[#152C77]/40'
                      ]">
                      <span class="block text-lg mb-1">{{ c.emoji }}</span>
                      <span class="text-[9px] font-black uppercase leading-none">{{ c.nombre }}</span>
                    </button>
                  </div>

                  <!-- Campo libre de barrio/sector -->
                  <Transition name="fade-up">
                    <div v-if="ciudadSeleccionada" class="space-y-1">
                      <label class="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">
                        ¿En qué barrio o sector de {{ ciudadSeleccionada }}?
                      </label>
                      <input v-model="barrioLibre" type="text"
                        :placeholder="`Ej: ${ciudadSeleccionada === 'Bogotá Norte' ? 'Chapinero, Cedritos, Usaquén...' : ciudadSeleccionada === 'Cajicá' ? 'Centro, Zipaquirá...' : 'La Balsa, Fonquetá...'}`"
                        @input="form.zona = ciudadSeleccionada + (barrioLibre ? ' · ' + barrioLibre : '')"
                        class="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold dark:text-white focus:border-[#152C77] outline-none transition-all" />
                    </div>
                  </Transition>
                </div>

                <!-- Nota de cobertura -->
                <div class="bg-slate-50 dark:bg-white/5 rounded-xl p-3 flex items-start gap-2 border border-slate-100 dark:border-white/5">
                  <span class="text-sm shrink-0">🚚</span>
                  <p class="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase leading-relaxed">
                    Cubrimos <strong class="text-slate-500 dark:text-white/50">Chía, Cajicá</strong> y <strong class="text-slate-500 dark:text-white/50">Bogotá norte</strong> (desde Calle 53 hacia el norte).
                    ¿Dudas? <a href="https://wa.me/573053462413" target="_blank" class="text-[#152C77] dark:text-white underline">Escríbenos</a>
                  </p>
                </div>

                <p v-if="errores.zona" class="text-[10px] text-[#DE1F27] font-bold ml-2">{{ errores.zona }}</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 space-y-4">
            <h2 class="text-2xl font-[1000] uppercase italic text-[#152C77] dark:text-white">2. Pago</h2>

            <!-- Bold — único método en la web -->
            <div class="bg-white dark:bg-white/5 rounded-2xl p-5 border-2 border-[#152C77] flex items-center gap-4">
              <div class="w-12 h-12 bg-[#152C77] rounded-xl flex items-center justify-center text-white text-xl shrink-0">💳</div>
              <div class="flex-1">
                <p class="text-[11px] font-black uppercase text-[#152C77] dark:text-white">Pago en línea seguro</p>
                <p class="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Tarjeta débito / crédito · PSE · Nequi · Daviplata</p>
              </div>
              <span class="text-[8px] font-black uppercase bg-[#152C77] text-white px-2 py-1 rounded-lg">Bold</span>
            </div>

            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wide text-center">
              ¿Prefieres pagar en efectivo o por transferencia?
              <a href="https://wa.me/573053462413?text=Hola%20Pet%20Station!%20Quiero%20hacer%20un%20pedido%20y%20pagar%20en%20efectivo%20o%20transferencia."
                target="_blank" class="text-[#25D366] underline ml-1">Escríbenos por WhatsApp →</a>
            </p>
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
              {{ loading ? 'Procesando...' : 'Confirmar Pedido' }}
            </button>
          </div>
        </div>

      </div>

      <div v-else-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center py-20">
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
import { ref, reactive, computed, onMounted, nextTick, Transition } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCartStore } from '../../stores/cartStore';
import api from '../../api/axios';
import Swal from 'sweetalert2';
import { useConfigStore } from '../../stores/configStore';
import { useTracking } from '@/composables/useTracking';

const { trackInicioCheckout, trackCompraCompletada } = useTracking();

const cartStore = useCartStore();
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const emit = defineEmits(['notify']);

// Estado del botón de pago Bold embebido
const boldListo = ref(false);
const boldContainer = ref(null);

const configStore = useConfigStore();
const MINIMO_DOMICILIO = computed(() => configStore.pedidoMinimo);

// Coordenadas exactas de Pet Station (verificadas en Google Maps)
// https://maps.app.goo.gl/32mULMP2jZE6hgdx9
const PET_STATION_LAT = 4.8419462;
const PET_STATION_LNG = -74.0674483;
// Radio de cobertura: ~25km cubre desde Pet Station hasta Chapinero (Cll 53) en Bogotá
const RADIO_KM = 25;

// Solo 3 ciudades — el barrio lo escribe libremente el usuario
const CIUDADES = [
  { nombre: 'Chía',        emoji: '🌳' },
  { nombre: 'Cajicá',      emoji: '🏡' },
  { nombre: 'Bogotá Norte', emoji: '🏙️' },
];

const ciudadSeleccionada = ref('');
const barrioLibre = ref('');

// Geolocalización
const geoEstado   = ref('');      // '' | 'cargando'
const geoResultado = ref(null);   // { enCobertura, mensaje, distanciaKm }
const geoError    = ref('');

// Fórmula Haversine — distancia entre dos puntos GPS en km
const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const detectarUbicacion = () => {
  geoError.value = '';
  geoResultado.value = null;

  if (!navigator.geolocation) {
    geoError.value = 'Tu browser no soporta geolocalización. Selecciona tu zona manualmente.';
    return;
  }

  geoEstado.value = 'cargando';

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const dist = haversine(
        pos.coords.latitude, pos.coords.longitude,
        PET_STATION_LAT, PET_STATION_LNG
      );
      const km = Math.round(dist * 10) / 10;
      const enCobertura = dist <= RADIO_KM;

      geoResultado.value = {
        enCobertura,
        distanciaKm: km,
        mensaje: enCobertura
          ? `¡Perfecto! Tu ubicación está dentro de nuestra cobertura 🎉`
          : `Tu ubicación está a ${km} km — fuera de nuestra cobertura actual`
      };

      // Auto-seleccionar ciudad aproximada según distancia
      if (enCobertura) {
        if (dist < 12) {
          ciudadSeleccionada.value = 'Chía';
        } else if (dist < 18) {
          ciudadSeleccionada.value = 'Cajicá';
        } else {
          ciudadSeleccionada.value = 'Bogotá Norte';
        }
        form.zona = ciudadSeleccionada.value;
      }

      geoEstado.value = '';
    },
    (err) => {
      geoEstado.value = '';
      if (err.code === 1)
        geoError.value = 'Permiso de ubicación denegado. Selecciona tu zona manualmente.';
      else if (err.code === 2)
        geoError.value = 'No se pudo obtener la ubicación. Verifica tu GPS y vuelve a intentar.';
      else
        geoError.value = 'Error al detectar ubicación. Selecciona tu zona manualmente.';
    },
    { timeout: 10000, maximumAge: 60000 }
  );
};

// Calcula el próximo día hábil de entrega
/**
 * Calcula la fecha estimada de entrega:
 *  - Antes de las 2:00 PM en día hábil → MISMO DÍA (ruta de la tarde)
 *  - Después de las 2:00 PM → siguiente día hábil
 *  - No se entrega domingos (se corre al lunes)
 */
const calcularFechaEntrega = () => {
  const d = new Date();
  if (d.getHours() >= 14) {
    d.setDate(d.getDate() + 1); // pasó el corte → día siguiente
    d.setHours(9, 0, 0, 0);
  }
  // Saltar domingos
  while (d.getDay() === 0) {
    d.setDate(d.getDate() + 1);
  }
  return d;
};

// El mensaje de entrega lo dicta el BACK (incluye festivos colombianos).
// Si la llamada falla, usamos el cálculo local como respaldo (solo salta domingos).
const mensajeEntrega = ref('Calculando entrega...');

const mensajeEntregaLocal = () => {
  const entrega = calcularFechaEntrega();
  const hoy = new Date();
  if (entrega.toDateString() === hoy.toDateString()) return 'Entrega HOY en la tarde';
  const manana = new Date(hoy); manana.setDate(hoy.getDate() + 1);
  if (entrega.toDateString() === manana.toDateString()) return 'Entrega MAÑANA';
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `Entrega el ${dias[entrega.getDay()]} ${entrega.getDate()} ${meses[entrega.getMonth()]}`;
};


const form = reactive({
  nombre: '',
  telefono: '',
  direccion: '',
  email: '',
  emailConfirm: '',
  zona: '',
});

const errores = reactive({ nombre: '', telefono: '', direccion: '', email: '', emailConfirm: '', zona: '' });

// Pre-llena el formulario con los datos del usuario logueado (editable)
const prellenarDatos = () => {
  try {
    const sessionStr = localStorage.getItem('ps_session');
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    const tutor = session?.tutor || session;
    if (!tutor) return;
    form.nombre = [tutor.nombre, tutor.apellido].filter(Boolean).join(' ').trim();
    form.telefono = tutor.telefono || '';
    form.direccion = tutor.direccion || '';
    form.email = tutor.email || '';
    form.emailConfirm = tutor.email || ''; // si viene de su cuenta, ya está confirmado
  } catch (e) { /* invitado: queda vacío */ }
};

onMounted(async () => {
  // Modo "retomar pedido existente" — viene del email de fórmula aprobada
  const codigoRetomar = route.query.retomar;
  if (codigoRetomar) {
    loading.value = true;
    try {
      // Buscar el pedido por código
      const sessionStr = localStorage.getItem('ps_session');
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      const tutorId = session?.tutor?.id || session?.id || null;

      let pedidoId = null;
      if (tutorId) {
        const { data: pedidos } = await api.get(`/pedidos/tutor/${tutorId}`);
        const pedido = pedidos.find(p => p.codigoPedido === codigoRetomar && p.estado === 'PENDIENTE');
        if (pedido) pedidoId = pedido.id;
      }

      if (!pedidoId) {
        Swal.fire({ icon: 'warning', title: 'Pedido no encontrado', text: 'No encontramos un pedido pendiente con ese código. Puede que ya haya sido pagado o cancelado.', customClass: { popup: 'rounded-[2rem] font-sans' } });
        loading.value = false;
        return;
      }

      // Ir directo al botón Bold sin crear nuevo pedido
      const { data: bold } = await api.post('/pagos/bold/datos-boton', { pedidoId });
      boldListo.value = true;
      await nextTick();
      const script = document.createElement('script');
      script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
      script.setAttribute('data-bold-button', '');
      script.setAttribute('data-order-id', bold.orderId);
      script.setAttribute('data-currency', bold.currency);
      script.setAttribute('data-amount', bold.amount);
      script.setAttribute('data-api-key', bold.apiKey);
      script.setAttribute('data-integrity-signature', bold.integritySignature);
      script.setAttribute('data-redirection-url', bold.redirectUrl);
      script.setAttribute('data-description', `Pedido Pet Station ${codigoRetomar}`);
      boldContainer.value.appendChild(script);
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar el pago. Intenta de nuevo.' });
    } finally {
      loading.value = false;
    }
    return; // no continuar con el flujo normal
  }

  trackInicioCheckout(cartStore.totalPrice, cartStore.items.length);
  prellenarDatos();
  try {
    const { data } = await api.get('/pedidos/info-entrega');
    mensajeEntrega.value = data.mensajeEntrega || mensajeEntregaLocal();
  } catch (e) {
    mensajeEntrega.value = mensajeEntregaLocal();
  }
});

const validar = () => {
  errores.nombre = '';
  errores.telefono = '';
  errores.direccion = '';
  errores.email = '';
  errores.emailConfirm = '';
  errores.zona = '';
  let ok = true;

  if (cartStore.totalPrice < MINIMO_DOMICILIO.value) {
    emit('notify', { msg: `El pedido mínimo para domicilio es $${MINIMO_DOMICILIO.value.toLocaleString()}`, type: 'warning' });
    return false;
  }

  if (!form.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio';
    ok = false;
  }

  // Correo obligatorio + formato + confirmación
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) {
    errores.email = 'El correo es obligatorio';
    ok = false;
  } else if (!emailRegex.test(form.email.trim())) {
    errores.email = 'Correo inválido. Revisa el formato';
    ok = false;
  }
  if (form.email.trim().toLowerCase() !== form.emailConfirm.trim().toLowerCase()) {
    errores.emailConfirm = 'Los correos no coinciden';
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

    // 1. Crear pedido en PENDIENTE (o PENDIENTE_FORMULA si requiere receta)
    const { data: pedidoCreado } = await api.post('/pedidos', payload);

    // Si el pedido quedó en PENDIENTE_FORMULA, redirigir al expediente
    if (pedidoCreado.estado === 'PENDIENTE_FORMULA') {
      cartStore.clearCart();
      await Swal.fire({
        icon: 'info',
        title: '🧾 Fórmula médica requerida',
        html: `Tu pedido <strong>${pedidoCreado.codigoPedido}</strong> fue creado.<br><br>
               Uno o más productos requieren fórmula médica. <br>
               Ve a tu expediente y adjunta la foto de la fórmula para que nuestro equipo la revise y apruebe tu pedido.`,
        confirmButtonText: 'Ir a mi expediente',
        confirmButtonColor: '#152C77',
        customClass: { popup: 'rounded-[2rem] font-sans' }
      });
      router.push('/seleccionar-perfil');
      return;
    }

    const totalPedido = cartStore.totalPrice;

    // 2. Pedir los datos del botón de Bold
    const { data: bold } = await api.post('/pagos/bold/datos-boton', {
      pedidoId: pedidoCreado.id,
      total: totalPedido
    });

    trackCompraCompletada(totalPedido, cartStore.items.length);

    // 3. Mostrar el botón de Bold en la misma página
    boldListo.value = true;
    await nextTick();

    const script = document.createElement('script');
    script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
    script.setAttribute('data-bold-button', '');
    script.setAttribute('data-order-id', bold.orderId);
    script.setAttribute('data-currency', bold.currency);
    script.setAttribute('data-amount', bold.amount);
    script.setAttribute('data-api-key', bold.apiKey);
    script.setAttribute('data-integrity-signature', bold.integritySignature);
    script.setAttribute('data-redirection-url', bold.redirectUrl);
    script.setAttribute('data-description', `Pedido Pet Station ${pedidoCreado.codigoPedido || '#' + pedidoCreado.id}`);
    boldContainer.value.appendChild(script);

    // Limpiar carrito (el pedido ya quedó creado en el back)
    cartStore.clearCart();

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
.fade-up-enter-active { transition: all 0.4s ease; }
.fade-up-enter-from  { opacity: 0; transform: translateY(8px); }
.fade-up-leave-active { transition: all 0.2s ease; }
.fade-up-leave-to   { opacity: 0; }
</style>
