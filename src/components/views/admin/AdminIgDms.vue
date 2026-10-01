<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Authorization: 'Bearer ' + localStorage.getItem('ps_token') }
});

const conversaciones = ref([]);
const mensajes = ref([]);
const conv = ref(null);
const textoEnvio = ref('');
const enviando = ref(false);
const cargando = ref(true);
const contenedorRef = ref(null);

let ws = null;
let wsTimer = null;

// ── DATOS ────────────────────────────────────────────────────────────────

async function cargarConversaciones() {
  try {
    const r = await api.get('/admin/ig/dm/conversaciones');
    conversaciones.value = r.data;
  } catch (e) {
    console.error('Error cargando convs IG', e);
  } finally {
    cargando.value = false;
  }
}

async function seleccionar(c) {
  conv.value = c;
  const r = await api.get(`/admin/ig/dm/conversaciones/${c.igUserId}/mensajes`);
  mensajes.value = r.data;
  await nextTick();
  scrollAbajo();
}

async function enviar() {
  if (!textoEnvio.value.trim() || !conv.value) return;
  enviando.value = true;
  try {
    await api.post(`/admin/ig/dm/conversaciones/${conv.value.igUserId}/enviar`, {
      texto: textoEnvio.value
    });
    textoEnvio.value = '';
    const r = await api.get(`/admin/ig/dm/conversaciones/${conv.value.igUserId}/mensajes`);
    mensajes.value = r.data;
    await nextTick();
    scrollAbajo();
  } catch (e) {
    alert('Error enviando mensaje');
  } finally {
    enviando.value = false;
  }
}

function scrollAbajo() {
  if (contenedorRef.value) {
    contenedorRef.value.scrollTop = contenedorRef.value.scrollHeight;
  }
}

function formatFecha(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleString('es-CO', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
}

const nombre = computed(() => conv.value?.nombre || conv.value?.igUserId || '');

// ── WEBSOCKET ────────────────────────────────────────────────────────────

function conectarWS() {
  const apiHost = (import.meta.env.VITE_API_URL || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '') || `${location.hostname}:8080`;
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  ws = new WebSocket(`${proto}://${apiHost}/ws/ig-dm`);

  ws.onmessage = async (e) => {
    try {
      const data = JSON.parse(e.data);
      if (data.tipo === 'nuevo_mensaje') {
        await cargarConversaciones();
        if (conv.value && data.igUserId === conv.value.igUserId) {
          const r = await api.get(`/admin/ig/dm/conversaciones/${conv.value.igUserId}/mensajes`);
          mensajes.value = r.data;
          await nextTick();
          scrollAbajo();
        }
      }
    } catch {}
  };

  ws.onclose = () => {
    wsTimer = setTimeout(conectarWS, 3000);
  };
}

// ── CICLO ────────────────────────────────────────────────────────────────

onMounted(async () => {
  await cargarConversaciones();
  conectarWS();
});

onUnmounted(() => {
  clearTimeout(wsTimer);
  ws?.close();
});
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

    <!-- Header -->
    <div class="flex items-center gap-3 p-4 border-b border-white/10">
      <div class="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
           style="background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)">
        📩
      </div>
      <div>
        <h1 class="text-base font-bold leading-tight">Instagram DMs</h1>
        <p class="text-xs text-white/40">{{ conversaciones.length }} conversaciones</p>
      </div>
    </div>

    <!-- Layout dos columnas -->
    <div class="flex flex-1 overflow-hidden">

      <!-- Lista de conversaciones -->
      <div class="w-72 shrink-0 border-r border-white/10 overflow-y-auto">
        <div v-if="cargando" class="p-4 text-sm text-white/40">Cargando...</div>

        <div v-else-if="!conversaciones.length" class="p-4 text-sm text-white/30 text-center mt-8">
          <p class="text-3xl mb-2">📭</p>
          <p>Sin DMs aún</p>
          <p class="text-xs mt-1">Los mensajes entrantes aparecerán aquí</p>
        </div>

        <button
          v-for="c in conversaciones"
          :key="c.igUserId"
          @click="seleccionar(c)"
          class="w-full text-left p-3 border-b border-white/6 hover:bg-white/5 transition"
          :class="{ 'bg-white/8': conv?.igUserId === c.igUserId }">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-sm font-bold shrink-0">
              {{ (c.nombre || c.igUserId)[0].toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold truncate">{{ c.nombre || c.igUserId }}</p>
              <p class="text-xs text-white/40 truncate">
                <span v-if="c.ultimoDireccion === 'OUTBOUND'" class="text-purple-400">Tú: </span>
                {{ c.ultimoMensaje }}
              </p>
            </div>
            <p class="text-[10px] text-white/30 shrink-0">{{ formatFecha(c.ultimoTs) }}</p>
          </div>
        </button>
      </div>

      <!-- Área de chat -->
      <div class="flex-1 flex flex-col overflow-hidden">

        <!-- Sin conversación seleccionada -->
        <div v-if="!conv" class="flex-1 flex items-center justify-center text-white/20 text-sm">
          <div class="text-center">
            <p class="text-4xl mb-3">📩</p>
            <p>Selecciona una conversación</p>
          </div>
        </div>

        <template v-else>
          <!-- Header conversación -->
          <div class="p-3 border-b border-white/10 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-sm font-bold">
              {{ nombre[0]?.toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-semibold">{{ nombre }}</p>
              <p class="text-xs text-white/40">{{ conv.igUserId }}</p>
            </div>
          </div>

          <!-- Mensajes -->
          <div ref="contenedorRef" class="flex-1 overflow-y-auto p-4 space-y-2">
            <div
              v-for="m in mensajes"
              :key="m.id"
              class="flex"
              :class="m.direccion === 'OUTBOUND' ? 'justify-end' : 'justify-start'">
              <div
                class="max-w-[75%] px-3 py-2 rounded-2xl text-sm"
                :class="m.direccion === 'OUTBOUND'
                  ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-br-sm'
                  : 'bg-white/10 text-white rounded-bl-sm'">
                <p class="whitespace-pre-wrap break-words">{{ m.contenido }}</p>
                <p class="text-[10px] mt-1 opacity-60 text-right">{{ formatFecha(m.timestamp) }}</p>
              </div>
            </div>
          </div>

          <!-- Input envío -->
          <div class="p-3 border-t border-white/10 flex gap-2">
            <input
              v-model="textoEnvio"
              @keydown.enter.prevent="enviar"
              type="text"
              placeholder="Escribe un mensaje..."
              class="flex-1 bg-white/8 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50" />
            <button
              @click="enviar"
              :disabled="enviando || !textoEnvio.trim()"
              class="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-40 transition"
              style="background: linear-gradient(135deg, #833ab4, #fd1d1d)">
              {{ enviando ? '...' : 'Enviar' }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
