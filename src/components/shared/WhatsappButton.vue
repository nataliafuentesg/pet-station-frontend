<template>
  <div class="fixed z-[4500] right-4 top-44 md:top-auto md:right-10 md:bottom-10 flex flex-col items-end gap-3 pointer-events-none">

    <Transition name="slide-up">
      <div v-if="isOpen" class="w-[calc(100vw-2rem)] md:w-[380px] bg-white dark:bg-[#0A0A0A] rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/10 overflow-hidden pointer-events-auto flex flex-col mb-2 origin-bottom-right" style="max-height: min(80vh, 600px)">

        <!-- Header -->
        <div class="bg-gradient-to-r from-[#152C77] to-[#1e3b9e] p-5 flex justify-between items-center text-white relative overflow-hidden shrink-0">
          <div class="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div class="flex items-center gap-3 relative z-10">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl shadow-inner border border-white/30">🐾</div>
            <div>
              <h3 class="font-[1000] uppercase tracking-widest text-sm italic leading-none">Asistente Pet Station</h3>
              <p class="text-[9px] text-green-300 font-black uppercase flex items-center gap-1 mt-1">
                <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> En línea
              </p>
            </div>
          </div>
          <button @click="toggleChat" class="relative z-10 text-white/60 hover:text-white text-3xl p-1 transition-colors leading-none">×</button>
        </div>

        <!-- Chat: se escribe de una, sin pedir datos antes -->
          <!-- Mensajes -->
          <div ref="mensajesRef" class="p-4 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-3">
            <div v-for="(msg, i) in mensajes" :key="i" class="flex gap-2" :class="msg.rol === 'USER' ? 'flex-row-reverse' : 'flex-row'">
              <!-- Avatar bot -->
              <div v-if="msg.rol === 'BOT'" class="w-7 h-7 bg-[#152C77] rounded-full flex items-center justify-center text-white text-xs shrink-0 shadow-md mt-1">🤖</div>
              <!-- Burbuja -->
              <div
                class="max-w-[80%] px-4 py-3 rounded-2xl text-[11px] font-semibold leading-relaxed shadow-sm"
                :class="msg.rol === 'USER'
                  ? 'bg-[#152C77] text-white rounded-tr-none'
                  : 'bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-tl-none'"
              >
                <span v-if="msg.rol === 'BOT'" class="whitespace-pre-wrap" v-html="formatearBot(msg.contenido)"></span>
                <span v-else class="whitespace-pre-wrap">{{ msg.contenido }}</span>
                <a v-if="msg.rol === 'BOT' && waLinkDe(msg.contenido)"
                  :href="waLinkDe(msg.contenido)" target="_blank" rel="noopener"
                  class="mt-2 flex items-center gap-2 w-full bg-[#25D366] hover:bg-green-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-2.5 rounded-xl transition-all active:scale-95">
                  <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Escribir por WhatsApp
                </a>
              </div>
            </div>

            <!-- Datos de contacto: opcionales, después de la primera respuesta -->
            <div v-if="mostrarTarjetaContacto" class="ml-9 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-3 flex flex-col gap-2">
              <p class="text-[10px] font-bold text-slate-600 dark:text-white/80 leading-snug">📲 ¿Quieres que el equipo te escriba por WhatsApp? Déjanos tu número (opcional).</p>
              <input v-model="lead.nombre" type="text" placeholder="Tu nombre" maxlength="60"
                class="w-full px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#152C77] text-slate-700 dark:text-white placeholder-slate-400" />
              <input v-model="lead.whatsapp" type="tel" placeholder="Tu WhatsApp (10 dígitos)" maxlength="15"
                class="w-full px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#152C77] text-slate-700 dark:text-white placeholder-slate-400"
                @keyup.enter="guardarContacto" />
              <p v-if="errorForm" class="text-[10px] font-bold text-[#DE1F27]">{{ errorForm }}</p>
              <div class="flex gap-2">
                <button @click="guardarContacto" :disabled="!lead.whatsapp.trim()"
                  class="flex-1 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-[#152C77] text-white disabled:opacity-50">Enviar</button>
                <button @click="contacto = 'omitido'"
                  class="px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50">Ahora no</button>
              </div>
            </div>

            <!-- Typing indicator -->
            <div v-if="cargando" class="flex gap-2 items-end">
              <div class="w-7 h-7 bg-[#152C77] rounded-full flex items-center justify-center text-white text-xs shrink-0 shadow-md">🤖</div>
              <div class="bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-white/10 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay:0ms"></span>
                <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay:150ms"></span>
                <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay:300ms"></span>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="p-3 border-t border-slate-200 dark:border-white/10 shrink-0">
            <!-- Anti-bots: invisible, solo aparece si Cloudflare necesita un clic -->
            <div class="flex justify-center empty:hidden">
              <CfTurnstile v-if="CF_SITE_KEY !== 'PENDING' && turnstileKey" :key="turnstileKey" :site-key="CF_SITE_KEY" size="compact" appearance="interaction-only"
                @verified="tokenListo" @error="tokenFallo" @expired="turnstileToken = ''" />
            </div>
            <p v-if="errorChat" class="text-[10px] font-bold text-[#DE1F27] text-center mb-2">{{ errorChat }}</p>
            <div class="flex gap-2 items-end">
              <textarea
                v-model="inputMensaje"
                ref="inputRef"
                rows="1"
                placeholder="Escribe tu mensaje..."
                maxlength="500"
                class="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#152C77] transition-colors text-slate-700 dark:text-white placeholder-slate-400 resize-none overflow-hidden"
                style="max-height: 100px"
                @keydown.enter.prevent="enviarMensaje"
                @input="autoResize"
              ></textarea>
              <button
                @click="enviarMensaje"
                :disabled="!inputMensaje.trim() || cargando"
                class="w-10 h-10 bg-[#152C77] text-white rounded-xl flex items-center justify-center text-base font-black disabled:opacity-40 hover:bg-[#DE1F27] transition-colors shrink-0"
              >→</button>
            </div>
            <p class="text-[8px] font-bold text-slate-400 text-center mt-2 leading-snug">Asistente automático: puede equivocarse. Los precios y condiciones válidos son los de la tienda y tu factura.</p>
          </div>

      </div>
    </Transition>

    <!-- Burbuja de bienvenida -->
    <Transition name="fade">
      <div v-if="!isOpen && !hasOpened" class="bg-white dark:bg-[#152C77] text-[#152C77] dark:text-white px-5 py-3 rounded-2xl rounded-br-none shadow-2xl border border-slate-200 dark:border-white/10 animate-bounce pointer-events-auto origin-bottom-right">
        <p class="text-[10px] md:text-xs font-black uppercase tracking-widest italic flex items-center gap-2">
          <span class="text-lg">🐾</span> ¡Hola! ¿Necesitas ayuda?
        </p>
      </div>
    </Transition>

    <!-- Botón flotante -->
    <button
      @click="toggleChat"
      class="relative flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl w-12 h-12 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[2rem] text-white pointer-events-auto"
      :class="isOpen ? 'bg-[#152C77] border-transparent' : 'bg-[#DE1F27] border-b-4 border-[#a8151b]'"
      :aria-label="isOpen ? 'Cerrar chat' : 'Abrir chat de Pet Station'"
    >
      <span v-if="!hasOpened && !isOpen" class="absolute -top-1 -right-1 md:-top-2 md:-right-2 flex h-4 w-4 md:h-5 md:w-5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 md:h-5 md:w-5 bg-[#DE1F27] border-2 border-white dark:border-[#050505] items-center justify-center text-[8px] md:text-[10px] font-black text-white">1</span>
      </span>

      <!-- Ícono propio: globo de chat con huella (el chat responde aquí, no es WhatsApp) -->
      <svg v-if="!isOpen" viewBox="0 0 24 24" class="w-7 h-7 md:w-9 md:h-9" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="currentColor" d="M12 2.5c5.25 0 9.5 3.7 9.5 8.25S17.25 19 12 19c-.9 0-1.77-.1-2.6-.3L4.6 21.3a.6.6 0 0 1-.86-.66l.9-3.6C3.3 15.55 2.5 13.75 2.5 10.75 2.5 6.2 6.75 2.5 12 2.5z"/>
        <g fill="#DE1F27">
          <ellipse cx="12" cy="12.6" rx="2.6" ry="2.1"/>
          <circle cx="8.9" cy="9.9" r="1.05"/>
          <circle cx="10.9" cy="8.2" r="1.05"/>
          <circle cx="13.1" cy="8.2" r="1.05"/>
          <circle cx="15.1" cy="9.9" r="1.05"/>
        </g>
      </svg>
      <span v-else class="text-3xl font-light block">✕</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import api from '@/api/axios';
import CfTurnstile from '@/components/shared/CfTurnstile.vue';

const generarUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

const isOpen = ref(false);
const hasOpened = ref(false);

// Los datos de contacto son opcionales: se piden en una tarjeta después de la primera respuesta
const lead = ref({ nombre: '', whatsapp: '' });
const contacto = ref('pendiente'); // 'pendiente' | 'guardado' | 'omitido'
const errorForm = ref('');
const errorChat = ref('');

const CF_SITE_KEY = import.meta.env.VITE_CF_TURNSTILE_KEY || 'PENDING';
const turnstileToken = ref('');
const turnstileKey = ref(0); // al cambiarla se vuelve a montar el widget y pide un token nuevo
const verificado = ref(false); // el back ya validó esta sesión
let avisarToken = null;

const sessionId = ref(generarUUID());
const mensajes = ref([]);
const inputMensaje = ref('');
const cargando = ref(false);
const mensajesRef = ref(null);
const inputRef = ref(null);

const mostrarTarjetaContacto = computed(() =>
  contacto.value === 'pendiente' && !cargando.value && mensajes.value.some(m => m.rol === 'USER'));

const WA_REGEX = /https?:\/\/wa\.me\/[^\s)\]>]*/i;

const waLinkDe = (texto) => {
  const m = texto?.match(WA_REGEX);
  return m ? m[0] : null;
};

const escaparHtml = (t) => t
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// GPT a veces responde con Markdown: se limpia y solo se dejan negritas y links clicables.
// El link de WhatsApp se quita del texto porque va en el botón verde.
const formatearBot = (texto) => {
  if (!texto) return '';
  let t = texto
    .replace(/\[([^\]]*)\]\(\s*(https?:\/\/[^\s)]+)\s*\)/g, (_, txt, url) => (WA_REGEX.test(url) ? '' : url))
    .replace(new RegExp(WA_REGEX.source, 'gi'), '')
    .replace(/\[\s*\]|\(\s*\)/g, '')
    .replace(/:\s*([.!])/g, '$1')
    .replace(/\*?\[?\s*WhatsApp\s*\]?\*?:\s*$/gim, '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  t = escaparHtml(t)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*\*/g, '')
    .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, '<a href="$1" target="_blank" rel="noopener" class="underline break-all">$1</a>');
  return t;
};

const scrollAbajo = async () => {
  await nextTick();
  if (mensajesRef.value) mensajesRef.value.scrollTop = mensajesRef.value.scrollHeight;
};

const autoResize = (e) => {
  const el = e.target;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
};

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (!isOpen.value) return;
  hasOpened.value = true;
  if (!mensajes.value.length) {
    mensajes.value.push({
      rol: 'BOT',
      contenido: '¡Hola! 👋 Soy el asistente virtual de Pet Station. Pregúntame lo que necesites: servicios, precios, productos u horarios 🐾'
    });
  }
  if (!turnstileKey.value) turnstileKey.value = 1;
  scrollAbajo();
  nextTick(() => inputRef.value?.focus());
};

const tokenListo = (token) => {
  turnstileToken.value = token;
  avisarToken?.();
};

// Si Turnstile falla no se deja a la persona esperando: el back decide
const tokenFallo = () => {
  turnstileToken.value = '';
  avisarToken?.();
};

// Turnstile trabaja en segundo plano; si la persona escribe muy rápido, se espera el token un momento
const esperarToken = () => {
  if (CF_SITE_KEY === 'PENDING' || verificado.value || turnstileToken.value) return Promise.resolve();
  return new Promise(resolve => {
    const t = setTimeout(resolve, 15000);
    avisarToken = () => { clearTimeout(t); avisarToken = null; resolve(); };
  });
};

const enviarMensaje = async () => {
  const texto = inputMensaje.value.trim();
  if (!texto || cargando.value) return;

  errorChat.value = '';
  mensajes.value.push({ rol: 'USER', contenido: texto });
  inputMensaje.value = '';
  if (inputRef.value) { inputRef.value.style.height = 'auto'; }
  cargando.value = true;
  scrollAbajo();

  try {
    await esperarToken();
    const conDatos = contacto.value === 'guardado';
    const { data } = await api.post('/chat/mensaje', {
      sessionId: sessionId.value,
      nombre: conDatos ? lead.value.nombre.trim() || undefined : undefined,
      whatsapp: conDatos ? lead.value.whatsapp.replace(/\D/g, '') : undefined,
      mensaje: texto,
      turnstileToken: turnstileToken.value || undefined,
    });
    verificado.value = true;
    mensajes.value.push({ rol: 'BOT', contenido: data.respuesta });
  } catch (e) {
    if (e.response?.status === 403 && e.response?.data?.error === 'turnstile') {
      // Token vencido o inválido: se pide uno nuevo (si Cloudflare duda, aparece la casilla) y se deja el mensaje para reenviar
      mensajes.value.pop();
      inputMensaje.value = texto;
      turnstileToken.value = '';
      verificado.value = false;
      turnstileKey.value++;
      errorChat.value = 'No pudimos verificar que no eres un robot. Vuelve a enviar tu mensaje.';
      return;
    }
    mensajes.value.push({
      rol: 'BOT',
      contenido: 'Disculpa, no pude procesar tu mensaje ahora mismo. Escríbenos directamente al WhatsApp 3053462413 🙏'
    });
  } finally {
    cargando.value = false;
    scrollAbajo();
    nextTick(() => inputRef.value?.focus());
  }
};

const guardarContacto = async () => {
  const whatsapp = lead.value.whatsapp.replace(/\D/g, '');
  errorForm.value = '';
  if (whatsapp.length < 7) { errorForm.value = 'Ingresa un número de WhatsApp válido.'; return; }
  try {
    await api.post('/chat/contacto', {
      sessionId: sessionId.value,
      nombre: lead.value.nombre.trim() || undefined,
      whatsapp,
    });
    contacto.value = 'guardado';
    const nombre = lead.value.nombre.trim();
    mensajes.value.push({
      rol: 'BOT',
      contenido: `¡Gracias${nombre ? ' ' + nombre : ''}! 🙌 Ya tenemos tu número. Si necesitas algo más, sigue escribiendo por aquí.`
    });
    scrollAbajo();
  } catch {
    errorForm.value = 'No pudimos guardar tu número. Inténtalo de nuevo.';
  }
};
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; }
</style>
