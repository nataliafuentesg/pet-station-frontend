<template>
  <div class="wa-panel" :class="{ 'sidebar-open': sidebarOpen, 'chat-open': !!conversacionActual }">

    <!-- ── SIDEBAR: lista de conversaciones ─────────────────────────── -->
    <aside class="wa-sidebar">
      <div class="wa-sidebar-header">
        <div class="flex items-center gap-3">
          <img src="/images/logo-pet-station.png" class="w-8 h-8 rounded-full object-cover" alt="logo" />
          <span class="font-bold text-sm text-white">Pet Station</span>
        </div>
        <div class="flex gap-2">
          <span v-if="stats.sinLeer > 0" class="bg-[#de1f27] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
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
          class="w-full bg-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none placeholder-white/40" />
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
          <div class="wa-avatar" :class="conv.modo === 'HUMAN' ? 'bg-[#152c77]' : 'bg-[#de1f27]'">
            {{ iniciales(conv.nombre || conv.telefono) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <span class="font-semibold text-sm text-white truncate">{{ conv.nombre || formatTel(conv.telefono) }}</span>
              <span class="text-[10px] text-white/40 shrink-0 ml-1">{{ formatHora(conv.ultimoMensajeTs) }}</span>
            </div>
            <div class="flex justify-between items-center mt-0.5">
              <p class="text-xs text-white/50 truncate">
                <span v-if="conv.ultimoMensajeDireccion === 'OUTBOUND'" class="text-[#de1f27] mr-1">✓✓</span>
                {{ resumeMensaje(conv) }}
              </p>
              <div class="flex items-center gap-1 shrink-0">
                <span v-if="!conv.ventanaAbierta" title="Ventana cerrada" class="text-[10px]">🔒</span>
                <span v-if="conv.modo === 'HUMAN'" title="Asesor activo" class="text-[10px]">👤</span>
                <span v-if="conv.sinLeer > 0"
                  class="bg-[#de1f27] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {{ conv.sinLeer }}
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </aside>

    <!-- ── PERFIL LATERAL ────────────────────────────────────────────── -->
    <aside v-if="perfilAbierto && conversacionActual" class="wa-perfil">
      <div class="wa-perfil-header">
        <button @click="perfilAbierto = false" class="text-white/60 hover:text-white text-lg">✕</button>
        <span class="text-white font-bold text-sm ml-3">Perfil del contacto</span>
      </div>
      <div class="wa-perfil-body">
        <!-- Avatar grande -->
        <div class="flex flex-col items-center py-6 gap-2">
          <div class="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white"
            :class="conversacionActual.modo === 'HUMAN' ? 'bg-[#152c77]' : 'bg-[#de1f27]'">
            {{ iniciales(conversacionActual.nombre || conversacionActual.telefono) }}
          </div>
          <p class="text-white font-bold text-base mt-1">{{ conversacionActual.nombre || 'Sin nombre' }}</p>
          <p class="text-white/50 text-sm">{{ formatTel(conversacionActual.telefono) }}</p>
        </div>
        <!-- Info -->
        <div class="px-4 space-y-3">
          <div class="wa-perfil-row">
            <span class="text-white/40 text-xs">Modo</span>
            <span class="text-white text-sm">{{ conversacionActual.modo === 'HUMAN' ? `👤 Asesor: ${conversacionActual.asesor}` : '🤖 Bot activo' }}</span>
          </div>
          <div class="wa-perfil-row">
            <span class="text-white/40 text-xs">Ventana</span>
            <span class="text-sm" :class="conversacionActual.ventanaAbierta ? 'text-[#de1f27]' : 'text-orange-400'">
              {{ conversacionActual.ventanaAbierta ? '✅ Abierta (24h)' : '🔒 Cerrada' }}
            </span>
          </div>
        </div>
        <!-- Fotos compartidas -->
        <div class="px-4 mt-5">
          <p class="text-white/40 text-xs font-bold uppercase tracking-wider mb-3">Fotos compartidas</p>
          <div class="grid grid-cols-3 gap-1">
            <div v-if="fotosCompartidas.length === 0" class="col-span-3 text-white/30 text-xs py-4 text-center">
              Sin fotos
            </div>
            <img v-for="m in fotosCompartidas" :key="m.id"
              :src="mediaUrl(m.mediaId)"
              class="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80"
              @click="verImagen(m.mediaId)" loading="lazy" />
          </div>
        </div>
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
          <button class="md:hidden mr-2 text-white text-xl leading-none" @click="conversacionActual = null">←</button>
          <div class="wa-avatar-sm cursor-pointer" :class="conversacionActual.modo === 'HUMAN' ? 'bg-[#152c77]' : 'bg-[#de1f27]'"
            @click="perfilAbierto = !perfilAbierto">
            {{ iniciales(conversacionActual.nombre || conversacionActual.telefono) }}
          </div>
          <div class="flex-1 min-w-0 cursor-pointer" @click="perfilAbierto = !perfilAbierto">
            <p class="font-bold text-sm text-white truncate">{{ conversacionActual.nombre || formatTel(conversacionActual.telefono) }}</p>
            <p class="text-xs text-white/50 truncate">{{ formatTel(conversacionActual.telefono) }} ·
              <span :class="conversacionActual.modo === 'HUMAN' ? 'text-blue-200' : 'text-[#de1f27]'">
                {{ conversacionActual.modo === 'HUMAN' ? `Asesor: ${conversacionActual.asesor}` : 'Bot activo' }}
              </span>
              <span v-if="!conversacionActual.ventanaAbierta" class="text-orange-400 ml-1">· 🔒</span>
            </p>
          </div>
          <!-- Acciones -->
          <div class="flex gap-2 shrink-0">
            <button v-if="conversacionActual.modo === 'BOT'" @click="tomarControl"
              class="wa-btn-action bg-[#152c77] hover:bg-[#0c1a3a]">
              👤 Tomar
            </button>
            <button v-else @click="resolver"
              class="wa-btn-action bg-[#de1f27] hover:bg-[#b01920]">
              ✅ Resolver
            </button>
          </div>
        </div>

        <!-- Botón "ir al final" -->
        <button v-if="!atBottom" @click="scrollAbajo(true)"
          class="wa-scroll-bottom">
          ↓
        </button>

        <!-- Mensajes -->
        <div ref="chatBody" class="wa-messages" @scroll="onScroll">
          <div v-if="cargandoMensajes" class="text-center py-4 text-white/30 text-sm">Cargando...</div>
          <template v-else>
            <div v-for="m in mensajes" :key="m.id" class="wa-msg-wrapper" :class="m.direccion === 'OUTBOUND' ? 'outbound' : 'inbound'">
              <div class="wa-bubble" :class="m.direccion === 'OUTBOUND' ? 'outbound' : 'inbound'" :data-wamid="m.wamid">
                <!-- Mensaje citado (dentro del bubble) -->
                <div v-if="m.contextoWamid && getMsgByWamid(m.contextoWamid)" class="wa-quote" @click.stop="scrollToMsg(m.contextoWamid)">
                  <p class="text-[10px] text-[#de1f27] font-bold mb-0.5">{{ getMsgByWamid(m.contextoWamid)?.direccion === 'OUTBOUND' ? 'Tú' : (conversacionActual.nombre || formatTel(conversacionActual.telefono)) }}</p>
                  <p class="text-[11px] text-white/70 truncate">{{ getMsgByWamid(m.contextoWamid)?.contenido }}</p>
                </div>
                <!-- Audio -->
                <div v-if="m.tipo === 'template'" class="space-y-1">
                  <span class="text-[8px] font-black uppercase tracking-widest opacity-50">📋 Plantilla</span>
                  <p class="text-sm text-white whitespace-pre-wrap">{{ m.contenido }}</p>
                </div>
                <div v-else-if="m.tipo === 'audio'" class="wa-audio">
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
                    <a :href="mediaUrl(m.mediaId)" target="_blank" class="text-[10px] text-[#de1f27]">Descargar</a>
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
              <p class="text-[10px] text-[#de1f27] font-bold">Respondiendo a</p>
              <p class="text-xs text-white/70 truncate">{{ mensajeCitado.contenido }}</p>
            </div>
            <button @click="mensajeCitado = null" class="text-white/40 hover:text-white text-lg ml-2">×</button>
          </div>

          <!-- Bloqueo si ventana cerrada -->
          <div v-if="!conversacionActual.ventanaAbierta" class="wa-ventana-cerrada">
            🔒 Ventana de 24h cerrada — solo puedes enviar templates aprobados
          </div>

          <div v-else class="flex items-end gap-2">
            <!-- Input oculto para archivos -->
            <input ref="fileInput" type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
              class="hidden" @change="onFileSelected" />
            <!-- Botón adjuntar -->
            <button @click="fileInput.click()" :disabled="enviando" title="Enviar archivo o foto"
              class="wa-attach-btn">
              📎
            </button>
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
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
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
const fileInput = ref(null);
const imagenModal = ref(null);
const sidebarOpen = ref(true);
const perfilAbierto = ref(false);
const atBottom = ref(true);
const stats = ref({ total: 0, ventanaAbierta: 0, enHumano: 0, sinLeer: 0 });

const fotosCompartidas = computed(() =>
  mensajes.value.filter(m => m.tipo === 'image').slice(-18)
);

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
  perfilAbierto.value = false;
  conversacionActual.value = conv;
  cargandoMensajes.value = true;
  mensajes.value = [];
  mensajeCitado.value = null;
  atBottom.value = true;
  try {
    const { data } = await api.get(`/admin/wa/conversaciones/${conv.telefono}/mensajes`);
    mensajes.value = data;
    await api.post(`/admin/wa/conversaciones/${conv.telefono}/leer`);
    conv.sinLeer = 0;
    await nextTick();
    scrollAbajo(true);
    // Segundo intento por si las imágenes tardan en renderizarse
    setTimeout(() => scrollAbajo(true), 300);
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

async function onFileSelected(e) {
  const file = e.target.files?.[0];
  if (!file || !conversacionActual.value?.telefono) return;
  e.target.value = '';
  enviando.value = true;
  try {
    const form = new FormData();
    form.append('file', file);
    await api.post(
      `/admin/wa/conversaciones/${conversacionActual.value.telefono}/enviar-media`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  } catch (e) {
    const err = e.response?.data?.error;
    if (err === 'ventana_cerrada') {
      conversacionActual.value.ventanaAbierta = false;
    } else {
      alert('Error al enviar archivo: ' + (e.response?.data?.mensaje || e.message));
    }
  } finally {
    enviando.value = false;
  }
}

// ── WEBSOCKET ────────────────────────────────────────────────────────

function conectarWS() {
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  const apiHost = (import.meta.env.VITE_API_URL || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '') || `${location.hostname}:8080`;
  ws = new WebSocket(`${proto}://${apiHost}/ws/wa-panel`);

  ws.onmessage = async (e) => {
    const ev = JSON.parse(e.data);
    if (ev.type === 'message') {
      // Sonido si es mensaje entrante
      if (ev.direccion === 'INBOUND') reproducirSonido();
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
  const distancia = scrollHeight - scrollTop - clientHeight;
  if (forzar || distancia < 200) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight;
    atBottom.value = true;
  }
}

function onScroll() {
  if (!chatBody.value) return;
  const { scrollTop, scrollHeight, clientHeight } = chatBody.value;
  atBottom.value = scrollHeight - scrollTop - clientHeight < 80;
}

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

// ── SONIDO ───────────────────────────────────────────────────────────

function reproducirSonido() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (_) {}
}

// ── CICLO DE VIDA ────────────────────────────────────────────────────

onMounted(async () => {
  await Promise.all([cargarConversaciones(), cargarStats()]);
  conectarWS();
  // Polling cada 3s como fallback cuando WS falla
  const interval = setInterval(async () => {
    await cargarConversaciones();
    if (conversacionActual.value?.telefono) {
      const tel = conversacionActual.value.telefono;
      const resp = await api.get(`/admin/wa/conversaciones/${tel}/mensajes`);
      const nuevos = resp.data;
      if (nuevos.length !== mensajes.value.length) {
        const hayNuevoInbound = nuevos.slice(mensajes.value.length).some(m => m.direccion === 'INBOUND');
        if (hayNuevoInbound) reproducirSonido();
        mensajes.value = nuevos;
        await nextTick();
        scrollAbajo();
      }
    }
  }, 3000);
  onUnmounted(() => {
    clearInterval(interval);
    clearTimeout(wsReconnectTimer);
    ws?.close();
  });
});
</script>

<style scoped>
/* ── PALETA PET STATION ─────────────────────────────────────────────
   Azul oscuro: #0c1a3a  (fondo principal)
   Azul medio:  #152c77  (headers, acciones)
   Azul claro:  #1e3a8a  (hover, inputs)
   Rojo:        #de1f27  (acento, enviar, badges)
   Rojo oscuro: #b01920  (hover rojo)
   ──────────────────────────────────────────────────────────────── */

.wa-panel {
  display: flex;
  height: 100vh;
  background: #0c1a3a;
  font-family: system-ui, sans-serif;
  overflow: hidden;
}

/* SIDEBAR */
.wa-sidebar {
  width: 360px;
  min-width: 280px;
  border-right: 1px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  background: #0c1a3a;
  overflow: hidden;
}
.wa-sidebar-header {
  background: #152c77;
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
  border-bottom: 1px solid rgba(255,255,255,0.05);
  transition: background 0.1s;
  text-align: left;
}
.wa-conv-item:hover { background: rgba(21,44,119,0.4); }
.wa-conv-item.active { background: rgba(21,44,119,0.7); }
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
  background: #091228;
  min-width: 0;
  position: relative;
  overflow: hidden;
}
.wa-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wa-chat-header {
  background: #152c77;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
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

/* MENSAJES — fondo con patrón sutil de huellas */
.wa-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background-color: #091228;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' opacity='0.03'%3E%3Ctext x='10' y='40' font-size='32'%3E🐾%3C/text%3E%3C/svg%3E");
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
  background: rgba(21,44,119,0.6);
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
  border-radius: 10px;
  position: relative;
  word-break: break-word;
}
/* Inbound: azul oscuro con borde izquierdo sutil */
.wa-bubble.inbound {
  background: #152c77;
  border-bottom-left-radius: 0;
}
/* Outbound: rojo Pet Station */
.wa-bubble.outbound {
  background: #de1f27;
  border-bottom-right-radius: 0;
}
.wa-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  color: rgba(255,255,255,0.5);
  margin-top: 2px;
}
.wa-quote {
  background: rgba(0,0,0,0.25);
  border-left: 3px solid rgba(255,255,255,0.5);
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 6px;
  cursor: pointer;
}
.wa-audio { padding: 4px 0; }
.wa-doc { display: flex; align-items: center; gap: 10px; padding: 4px 0; }

/* INPUT */
.wa-input-area {
  background: #152c77;
  padding: 10px 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.wa-textarea {
  flex: 1;
  background: rgba(255,255,255,0.1);
  color: white;
  border-radius: 24px;
  padding: 9px 16px;
  font-size: 14px;
  resize: none;
  outline: none;
  max-height: 120px;
  line-height: 1.4;
  border: 1px solid rgba(255,255,255,0.15);
}
.wa-textarea::placeholder { color: rgba(255,255,255,0.4); }
.wa-send-btn {
  background: #de1f27;
  color: white;
  border-radius: 50%;
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}
.wa-send-btn:hover:not(:disabled) { background: #b01920; }
.wa-cite-preview {
  display: flex;
  align-items: center;
  background: rgba(0,0,0,0.2);
  border-left: 3px solid #de1f27;
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 8px;
}
.wa-ventana-cerrada {
  text-align: center;
  color: #fbbf24;
  font-size: 12px;
  font-weight: 600;
  padding: 10px;
  background: rgba(251,191,36,0.1);
  border-radius: 8px;
}

.wa-attach-btn {
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  transition: background 0.15s;
  border: 1px solid rgba(255,255,255,0.15);
}
.wa-attach-btn:hover:not(:disabled) { background: rgba(255,255,255,0.2); }
.wa-attach-btn:disabled { opacity: 0.5; }

/* Botón ir al final */
.wa-scroll-bottom {
  position: absolute;
  bottom: 80px;
  right: 16px;
  z-index: 20;
  background: #de1f27;
  color: white;
  border-radius: 50%;
  width: 36px; height: 36px;
  font-size: 18px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 10px rgba(222,31,39,0.5);
  transition: background 0.15s;
}
.wa-scroll-bottom:hover { background: #b01920; }

/* PERFIL LATERAL */
.wa-perfil {
  width: 300px;
  min-width: 260px;
  background: #0c1a3a;
  border-left: 1px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.wa-perfil-header {
  background: #152c77;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  min-height: 56px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.wa-perfil-body {
  flex: 1;
  overflow-y: auto;
}
.wa-perfil-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

/* Scrollbars */
.wa-conv-list::-webkit-scrollbar,
.wa-messages::-webkit-scrollbar,
.wa-perfil-body::-webkit-scrollbar { width: 3px; }
.wa-conv-list::-webkit-scrollbar-thumb,
.wa-messages::-webkit-scrollbar-thumb,
.wa-perfil-body::-webkit-scrollbar-thumb { background: #de1f27; border-radius: 10px; }

/* Buscador */
.wa-sidebar input {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  color: white;
}
.wa-sidebar input::placeholder { color: rgba(255,255,255,0.35); }

/* Responsive móvil */
@media (max-width: 768px) {
  .wa-panel { position: relative; overflow: hidden; }

  .wa-sidebar {
    position: absolute;
    inset: 0;
    width: 100%;
    z-index: 10;
    transition: transform 0.25s ease;
  }

  .wa-panel.chat-open .wa-sidebar {
    transform: translateX(-100%);
    pointer-events: none;
  }

  .wa-chat {
    position: absolute;
    inset: 0;
    z-index: 5;
    overflow: hidden;
  }

  .wa-perfil {
    position: absolute;
    inset: 0;
    width: 100%;
    z-index: 15;
    border-left: none;
  }

  .wa-bubble { max-width: 85%; }
  .wa-messages { overflow-x: hidden; }
  .wa-input-area { overflow-x: hidden; }
}
</style>
