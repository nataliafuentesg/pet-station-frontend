<template>
  <div class="wa-panel" :class="{ 'sidebar-open': sidebarOpen }">

    <!-- ── SIDEBAR: lista de conversaciones ─────────────────────────── -->
    <aside class="wa-sidebar">
      <div class="wa-sidebar-header">
        <div class="flex items-center gap-3">
          <img src="/images/logo-pet-station.png" class="w-8 h-8 rounded-full object-cover" alt="logo" />
          <span class="font-bold text-sm text-white">Pet Station</span>
        </div>
        <div class="flex gap-2">
          <span v-if="stats.sinLeer > 0" class="bg-[#25D366] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            {{ stats.sinLeer }}
          </span>
          <button @click="cargarConversaciones" title="Actualizar" class="text-white/60 hover:text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </button>
        </div>
      </div>

      <!-- Buscador -->
      <div class="px-3 py-2 bg-[#1a2936]">
        <input v-model="busqueda" placeholder="Buscar conversación..."
          class="w-full bg-[#2a3942] text-white text-sm rounded-lg px-3 py-2 outline-none placeholder-white/40" />
      </div>

      <!-- Lista -->
      <div class="wa-conv-list">
        <div v-if="conversacionesFiltradas.length === 0" class="p-6 text-center text-white/30 text-sm">
          Sin conversaciones
        </div>
        <button v-for="conv in conversacionesFiltradas" :key="conv.telefono"
          @click="abrirConversacion(conv)"
          class="wa-conv-item"
          :class="{ active: conversacionActual?.telefono === conv.telefono }">
          <!-- Avatar -->
          <div class="wa-avatar" :class="conv.modo === 'HUMAN' ? 'bg-blue-500' : 'bg-[#25D366]'">
            {{ iniciales(conv.nombre || conv.telefono) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <span class="font-semibold text-sm text-white truncate">{{ conv.nombre || formatTel(conv.telefono) }}</span>
              <span class="text-[10px] text-white/40 shrink-0 ml-1">{{ formatHora(conv.ultimoMensajeTs) }}</span>
            </div>
            <div class="flex justify-between items-center mt-0.5">
              <p class="text-xs text-white/50 truncate">
                <span v-if="conv.ultimoMensajeDireccion === 'OUTBOUND'" class="text-[#25D366] mr-1">✓✓</span>
                {{ resumeMensaje(conv) }}
              </p>
              <div class="flex items-center gap-1 shrink-0">
                <span v-if="!conv.ventanaAbierta" title="Ventana cerrada" class="text-[10px]">🔒</span>
                <span v-if="conv.modo === 'HUMAN'" title="Asesor activo" class="text-[10px]">👤</span>
                <span v-if="conv.sinLeer > 0"
                  class="bg-[#25D366] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {{ conv.sinLeer }}
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </aside>

    <!-- ── CHAT: conversación activa ─────────────────────────────────── -->
    <main class="wa-chat" :class="{ 'hidden md:flex': !conversacionActual }">

      <!-- Sin conversación seleccionada -->
      <div v-if="!conversacionActual" class="wa-empty">
        <div class="text-center space-y-3">
          <div class="text-6xl">💬</div>
          <p class="text-white/40 text-sm">Selecciona una conversación</p>
        </div>
      </div>

      <template v-else>
        <!-- Header del chat -->
        <div class="wa-chat-header">
          <button class="md:hidden mr-2 text-white" @click="conversacionActual = null">←</button>
          <div class="wa-avatar-sm" :class="conversacionActual.modo === 'HUMAN' ? 'bg-blue-500' : 'bg-[#25D366]'">
            {{ iniciales(conversacionActual.nombre || conversacionActual.telefono) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-sm text-white truncate">{{ conversacionActual.nombre || formatTel(conversacionActual.telefono) }}</p>
            <p class="text-xs text-white/50">{{ formatTel(conversacionActual.telefono) }} ·
              <span :class="conversacionActual.modo === 'HUMAN' ? 'text-blue-300' : 'text-[#25D366]'">
                {{ conversacionActual.modo === 'HUMAN' ? `Asesor: ${conversacionActual.asesor}` : 'Bot activo' }}
              </span>
              <span v-if="!conversacionActual.ventanaAbierta" class="text-orange-400 ml-1">· 🔒 Ventana cerrada</span>
            </p>
          </div>
          <!-- Acciones -->
          <div class="flex gap-2">
            <button v-if="conversacionActual.modo === 'BOT'" @click="tomarControl"
              class="wa-btn-action bg-blue-600 hover:bg-blue-700">
              👤 Tomar
            </button>
            <button v-else @click="resolver"
              class="wa-btn-action bg-[#25D366] hover:bg-green-600">
              ✅ Resolver
            </button>
          </div>
        </div>

        <!-- Mensajes -->
        <div ref="chatBody" class="wa-messages" @scroll="onScroll">
          <div v-if="cargandoMensajes" class="text-center py-4 text-white/30 text-sm">Cargando...</div>
          <template v-else>
            <div v-for="m in mensajes" :key="m.id" class="wa-msg-wrapper" :class="m.direccion === 'OUTBOUND' ? 'outbound' : 'inbound'">
              <!-- Mensaje citado -->
              <div v-if="m.contextoWamid && getMsgByWamid(m.contextoWamid)" class="wa-quote" @click="scrollToMsg(m.contextoWamid)">
                <p class="text-[10px] text-[#25D366] font-bold mb-0.5">{{ getMsgByWamid(m.contextoWamid)?.direccion === 'OUTBOUND' ? 'Tú' : formatTel(conversacionActual.telefono) }}</p>
                <p class="text-[11px] text-white/70 truncate">{{ getMsgByWamid(m.contextoWamid)?.contenido }}</p>
              </div>

              <div class="wa-bubble" :class="m.direccion === 'OUTBOUND' ? 'outbound' : 'inbound'" :data-wamid="m.wamid">
                <!-- Audio -->
                <div v-if="m.tipo === 'audio'" class="wa-audio">
                  <audio controls :src="mediaUrl(m.mediaId)" class="h-8 max-w-[220px]" preload="none" />
                </div>
                <!-- Imagen -->
                <div v-else-if="m.tipo === 'image'">
                  <img :src="mediaUrl(m.mediaId)" class="rounded-lg max-w-[220px] cursor-pointer" @click="verImagen(m.mediaId)" alt="imagen" loading="lazy" />
                  <p v-if="m.contenido && m.contenido !== '[Imagen]'" class="text-xs mt-1 text-white/80">{{ m.contenido }}</p>
                </div>
                <!-- Documento -->
                <div v-else-if="m.tipo === 'document'" class="wa-doc">
                  <span class="text-2xl">📄</span>
                  <div>
                    <p class="text-xs font-bold text-white">{{ m.contenido }}</p>
                    <a :href="mediaUrl(m.mediaId)" target="_blank" class="text-[10px] text-[#25D366]">Descargar</a>
                  </div>
                </div>
                <!-- Texto / otros -->
                <p v-else class="text-sm text-white whitespace-pre-wrap">{{ m.contenido }}</p>

                <div class="wa-meta">
                  <span>{{ formatHora(m.timestamp) }}</span>
                  <span v-if="m.direccion === 'OUTBOUND'" class="ml-1 text-[#53bdeb]">
                    {{ m.estado === 'read' ? '✓✓' : m.estado === 'delivered' ? '✓✓' : '✓' }}
                  </span>
                </div>
              </div>

              <!-- Botón citar -->
              <button class="wa-quote-btn" @click="citar(m)" title="Responder">↩</button>
            </div>
          </template>
        </div>

        <!-- Barra de entrada -->
        <div class="wa-input-area">
          <!-- Mensaje citado activo -->
          <div v-if="mensajeCitado" class="wa-cite-preview">
            <div class="flex-1 min-w-0">
              <p class="text-[10px] text-[#25D366] font-bold">Respondiendo a</p>
              <p class="text-xs text-white/70 truncate">{{ mensajeCitado.contenido }}</p>
            </div>
            <button @click="mensajeCitado = null" class="text-white/40 hover:text-white text-lg ml-2">×</button>
          </div>

          <!-- Bloqueo si ventana cerrada -->
          <div v-if="!conversacionActual.ventanaAbierta" class="wa-ventana-cerrada">
            🔒 Ventana de 24h cerrada — solo puedes enviar templates aprobados
          </div>

          <div v-else class="flex items-end gap-2">
            <textarea v-model="textoNuevo" ref="inputRef"
              placeholder="Escribe un mensaje..."
              rows="1"
              class="wa-textarea"
              @keydown.enter.exact.prevent="enviar"
              @input="autoResize"
            />
            <button @click="enviar" :disabled="!textoNuevo.trim() || enviando"
              class="wa-send-btn" :class="{ 'opacity-50': !textoNuevo.trim() || enviando }">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      </template>
    </main>

    <!-- Modal imagen -->
    <div v-if="imagenModal" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" @click="imagenModal = null">
      <img :src="imagenModal" class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" />
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import api from '@/api/axios.js';

const conversaciones = ref([]);
const conversacionActual = ref(null);
const mensajes = ref([]);
const cargandoMensajes = ref(false);
const textoNuevo = ref('');
const enviando = ref(false);
const mensajeCitado = ref(null);
const busqueda = ref('');
const chatBody = ref(null);
const inputRef = ref(null);
const imagenModal = ref(null);
const sidebarOpen = ref(true);
const stats = ref({ total: 0, ventanaAbierta: 0, enHumano: 0, sinLeer: 0 });

let ws = null;
let wsReconnectTimer = null;

// ── DATOS ───────────────────────────────────────────────────────────

const conversacionesFiltradas = computed(() => {
  const q = busqueda.value.toLowerCase();
  return conversaciones.value.filter(c =>
    !q || (c.nombre || '').toLowerCase().includes(q) || c.telefono.includes(q)
  );
});

async function cargarConversaciones() {
  const { data } = await api.get('/admin/wa/conversaciones');
  conversaciones.value = data;
  // Actualizar la conversación activa si está abierta
  if (conversacionActual.value) {
    const actualizada = data.find(c => c.telefono === conversacionActual.value.telefono);
    if (actualizada) conversacionActual.value = actualizada;
  }
}

async function cargarStats() {
  const { data } = await api.get('/admin/wa/stats');
  stats.value = data;
}

async function abrirConversacion(conv) {
  conversacionActual.value = conv;
  cargandoMensajes.value = true;
  mensajes.value = [];
  mensajeCitado.value = null;
  try {
    const { data } = await api.get(`/admin/wa/conversaciones/${conv.telefono}/mensajes`);
    mensajes.value = data;
    await api.post(`/admin/wa/conversaciones/${conv.telefono}/leer`);
    conv.sinLeer = 0;
    await nextTick();
    scrollAbajo(true);
  } finally {
    cargandoMensajes.value = false;
  }
}

// ── ACCIONES ────────────────────────────────────────────────────────

async function tomarControl() {
  const asesor = prompt('Tu nombre:') || 'Asesor';
  await api.post(`/admin/wa/conversaciones/${conversacionActual.value.telefono}/tomar`, { asesor });
  conversacionActual.value.modo = 'HUMAN';
  conversacionActual.value.asesor = asesor;
}

async function resolver() {
  if (!confirm('¿Devolver al bot esta conversación?')) return;
  await api.post(`/admin/wa/conversaciones/${conversacionActual.value.telefono}/resolver`);
  conversacionActual.value.modo = 'BOT';
  conversacionActual.value.asesor = null;
}

async function enviar() {
  const texto = textoNuevo.value.trim();
  if (!texto || enviando.value) return;
  enviando.value = true;
  try {
    await api.post(`/admin/wa/conversaciones/${conversacionActual.value.telefono}/enviar`, {
      texto,
      contextoWamid: mensajeCitado.value?.wamid || null,
    });
    textoNuevo.value = '';
    mensajeCitado.value = null;
    if (inputRef.value) inputRef.value.style.height = 'auto';
  } catch (e) {
    const err = e.response?.data?.error;
    if (err === 'ventana_cerrada') {
      conversacionActual.value.ventanaAbierta = false;
    } else {
      alert('Error al enviar: ' + (e.response?.data?.mensaje || e.message));
    }
  } finally {
    enviando.value = false;
  }
}

function citar(m) {
  mensajeCitado.value = m;
  nextTick(() => inputRef.value?.focus());
}

// ── WEBSOCKET ────────────────────────────────────────────────────────

function conectarWS() {
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  const wsBase = `${proto}://${location.hostname}`;
  ws = new WebSocket(`${wsBase}/ws/wa-panel`);

  ws.onmessage = async (e) => {
    const ev = JSON.parse(e.data);
    if (ev.type === 'message') {
      // Agregar mensaje a la conversación activa
      if (conversacionActual.value?.telefono === ev.telefono) {
        mensajes.value.push({
          id: ev.id, wamid: ev.wamid, direccion: ev.direccion,
          tipo: ev.tipoMensaje, contenido: ev.contenido,
          mediaId: ev.mediaId, estado: ev.estado,
          contextoWamid: ev.contextoWamid, timestamp: ev.timestamp,
        });
        await nextTick();
        scrollAbajo();
      }
      // Actualizar lista de conversaciones
      await cargarConversaciones();
    } else if (ev.type === 'status') {
      const m = mensajes.value.find(x => x.wamid === ev.wamid);
      if (m) m.estado = ev.estado;
    }
  };

  ws.onclose = () => {
    wsReconnectTimer = setTimeout(conectarWS, 3000);
  };
}

// ── HELPERS ─────────────────────────────────────────────────────────

function mediaUrl(mediaId) {
  if (!mediaId) return '';
  const base = import.meta.env.VITE_API_URL || 'https://api.petstationvet.com/api';
  return `${base}/admin/wa/media/${mediaId}`;
}

function verImagen(mediaId) {
  imagenModal.value = mediaUrl(mediaId);
}

function getMsgByWamid(wamid) {
  return mensajes.value.find(m => m.wamid === wamid) || null;
}

function scrollToMsg(wamid) {
  const el = chatBody.value?.querySelector(`[data-wamid="${wamid}"]`);
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function scrollAbajo(forzar = false) {
  if (!chatBody.value) return;
  const { scrollTop, scrollHeight, clientHeight } = chatBody.value;
  if (forzar || scrollHeight - scrollTop - clientHeight < 200) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight;
  }
}

function onScroll() {}

function autoResize(e) {
  e.target.style.height = 'auto';
  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
}

function iniciales(nombre) {
  if (!nombre) return '?';
  return nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function formatTel(tel) {
  if (!tel) return '';
  return '+' + tel.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
}

function formatHora(ts) {
  if (!ts) return '';
  const d = new Date(typeof ts === 'number' ? ts : ts);
  const hoy = new Date();
  const esHoy = d.toDateString() === hoy.toDateString();
  if (esHoy) return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' });
}

function resumeMensaje(conv) {
  const tipo = conv.ultimoMensajeTipo;
  if (tipo === 'audio') return '🎤 Nota de voz';
  if (tipo === 'image') return '📷 Imagen';
  if (tipo === 'video') return '🎥 Video';
  if (tipo === 'document') return '📄 Documento';
  return conv.ultimoMensaje || '';
}

// ── CICLO DE VIDA ────────────────────────────────────────────────────

onMounted(async () => {
  await Promise.all([cargarConversaciones(), cargarStats()]);
  conectarWS();
  // Refrescar lista cada 30s como fallback
  const interval = setInterval(cargarConversaciones, 30_000);
  onUnmounted(() => {
    clearInterval(interval);
    clearTimeout(wsReconnectTimer);
    ws?.close();
  });
});
</script>

<style scoped>
.wa-panel {
  display: flex;
  height: 100vh;
  background: #111b21;
  font-family: system-ui, sans-serif;
  overflow: hidden;
}

/* SIDEBAR */
.wa-sidebar {
  width: 360px;
  min-width: 280px;
  border-right: 1px solid #2a3942;
  display: flex;
  flex-direction: column;
  background: #111b21;
  overflow: hidden;
}
.wa-sidebar-header {
  background: #202c33;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.wa-conv-list {
  flex: 1;
  overflow-y: auto;
}
.wa-conv-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid #1f2c34;
  transition: background 0.1s;
  text-align: left;
}
.wa-conv-item:hover, .wa-conv-item.active {
  background: #2a3942;
}
.wa-avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 15px; color: white;
  flex-shrink: 0;
}
.wa-avatar-sm {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 12px; color: white;
  flex-shrink: 0;
}

/* CHAT */
.wa-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #0b141a;
  min-width: 0;
}
.wa-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wa-chat-header {
  background: #202c33;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #2a3942;
  min-height: 56px;
}
.wa-btn-action {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  transition: background 0.15s;
}

/* MENSAJES */
.wa-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect fill='%230b141a' width='60' height='60'/%3E%3C/svg%3E");
}
.wa-msg-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  margin-bottom: 2px;
  position: relative;
}
.wa-msg-wrapper.outbound { flex-direction: row-reverse; }
.wa-msg-wrapper .wa-quote-btn {
  opacity: 0;
  background: #2a3942;
  border-radius: 50%;
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: white;
  transition: opacity 0.15s;
  flex-shrink: 0;
}
.wa-msg-wrapper:hover .wa-quote-btn { opacity: 1; }

.wa-bubble {
  max-width: 65%;
  min-width: 60px;
  padding: 6px 10px 4px;
  border-radius: 8px;
  position: relative;
  word-break: break-word;
}
.wa-bubble.inbound  { background: #202c33; border-bottom-left-radius: 0; }
.wa-bubble.outbound { background: #005c4b; border-bottom-right-radius: 0; }
.wa-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  color: rgba(255,255,255,0.45);
  margin-top: 2px;
}
.wa-quote {
  background: rgba(0,0,0,0.2);
  border-left: 3px solid #25D366;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  cursor: pointer;
}
.wa-audio { padding: 4px 0; }
.wa-doc { display: flex; align-items: center; gap: 10px; padding: 4px 0; }

/* INPUT */
.wa-input-area {
  background: #202c33;
  padding: 10px 16px;
  border-top: 1px solid #2a3942;
}
.wa-textarea {
  flex: 1;
  background: #2a3942;
  color: white;
  border-radius: 24px;
  padding: 9px 16px;
  font-size: 14px;
  resize: none;
  outline: none;
  max-height: 120px;
  line-height: 1.4;
}
.wa-textarea::placeholder { color: rgba(255,255,255,0.4); }
.wa-send-btn {
  background: #25D366;
  color: white;
  border-radius: 50%;
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}
.wa-send-btn:hover:not(:disabled) { background: #128c7e; }
.wa-cite-preview {
  display: flex;
  align-items: center;
  background: #1a2832;
  border-left: 3px solid #25D366;
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 8px;
}
.wa-ventana-cerrada {
  text-align: center;
  color: #f59e0b;
  font-size: 12px;
  font-weight: 600;
  padding: 10px;
  background: rgba(245,158,11,0.1);
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .wa-sidebar { width: 100%; }
  .wa-chat.hidden { display: none; }
}
</style>
