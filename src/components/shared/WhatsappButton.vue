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

        <!-- PASO 1: Formulario de datos -->
        <div v-if="paso === 'form'" class="p-5 overflow-y-auto custom-scrollbar flex-1">
          <div class="flex items-end gap-2 mb-5">
            <div class="w-8 h-8 bg-[#152C77] rounded-full flex items-center justify-center text-white text-sm shrink-0 shadow-md">🤖</div>
            <div class="bg-white dark:bg-[#152C77] border border-slate-200 dark:border-white/5 p-4 rounded-2xl rounded-bl-none shadow-sm relative">
              <p class="text-[11px] font-bold text-slate-600 dark:text-white leading-relaxed">
                ¡Hola! 👋 Soy el asistente virtual de Pet Station.<br><br>
                Antes de empezar, cuéntame cómo te llamas y tu número de WhatsApp para poder ayudarte mejor.
              </p>
              <div class="absolute -bottom-1 -left-1 w-3 h-3 bg-white dark:bg-[#152C77] transform rotate-45 border-b border-l border-slate-200 dark:border-transparent"></div>
            </div>
          </div>

          <div class="flex flex-col gap-3 pl-10">
            <input
              v-model="lead.nombre"
              type="text"
              placeholder="Tu nombre *"
              maxlength="60"
              class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#152C77] transition-colors text-slate-700 dark:text-white placeholder-slate-400"
              @keyup.enter="lead.whatsapp && lead.nombre && iniciarChat()"
            />
            <input
              v-model="lead.whatsapp"
              type="tel"
              placeholder="Tu WhatsApp (10 dígitos) *"
              maxlength="15"
              class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#152C77] transition-colors text-slate-700 dark:text-white placeholder-slate-400"
              @keyup.enter="lead.whatsapp && lead.nombre && iniciarChat()"
            />
            <input
              v-model="lead.correo"
              type="email"
              placeholder="Correo electrónico (opcional)"
              maxlength="80"
              class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#152C77] transition-colors text-slate-700 dark:text-white placeholder-slate-400"
              @keyup.enter="lead.whatsapp && lead.nombre && iniciarChat()"
            />
            <p v-if="errorForm" class="text-[10px] font-bold text-[#DE1F27]">{{ errorForm }}</p>
            <button
              @click="iniciarChat"
              :disabled="!lead.nombre.trim() || !lead.whatsapp.trim()"
              class="w-full text-center px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-[#152C77] text-white shadow-lg mt-1"
            >
              Empezar chat →
            </button>
          </div>
        </div>

        <!-- PASO 2: Chat -->
        <template v-else-if="paso === 'chat'">
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
                <span class="whitespace-pre-wrap">{{ msg.contenido }}</span>
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
            <p class="text-[8px] font-bold text-slate-400 text-center mt-2 uppercase tracking-widest">Pet Station · Chía, Cundinamarca</p>
          </div>
        </template>

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
      :class="isOpen ? 'bg-[#152C77] border-transparent' : 'bg-[#25D366] border-b-4 border-green-700'"
    >
      <span v-if="!hasOpened && !isOpen" class="absolute -top-1 -right-1 md:-top-2 md:-right-2 flex h-4 w-4 md:h-5 md:w-5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 md:h-5 md:w-5 bg-[#DE1F27] border-2 border-white dark:border-[#050505] items-center justify-center text-[8px] md:text-[10px] font-black text-white">1</span>
      </span>

      <svg v-if="!isOpen" viewBox="0 0 24 24" class="w-6 h-6 md:w-8 md:h-8 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span v-else class="text-3xl font-light block">✕</span>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import api from '@/api/axios';

const isOpen = ref(false);
const hasOpened = ref(false);
const paso = ref('form'); // 'form' | 'chat'

const lead = ref({ nombre: '', whatsapp: '', correo: '' });
const errorForm = ref('');
const sessionId = ref('');
const mensajes = ref([]);
const inputMensaje = ref('');
const cargando = ref(false);
const mensajesRef = ref(null);
const inputRef = ref(null);

const generarUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

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
  if (isOpen.value) {
    hasOpened.value = true;
    if (paso.value === 'chat') {
      scrollAbajo();
      nextTick(() => inputRef.value?.focus());
    }
  }
};

const iniciarChat = () => {
  const nombre = lead.value.nombre.trim();
  const whatsapp = lead.value.whatsapp.trim().replace(/\D/g, '');
  errorForm.value = '';

  if (!nombre) { errorForm.value = 'Por favor ingresa tu nombre.'; return; }
  if (whatsapp.length < 7) { errorForm.value = 'Ingresa un número de WhatsApp válido.'; return; }

  sessionId.value = generarUUID();
  mensajes.value = [];
  paso.value = 'chat';

  // Mensaje de bienvenida del bot
  mensajes.value.push({
    rol: 'BOT',
    contenido: `¡Hola ${nombre}! 😊 Estoy aquí para ayudarte con información sobre los servicios de Pet Station. ¿En qué te puedo ayudar hoy?`
  });

  nextTick(() => {
    scrollAbajo();
    inputRef.value?.focus();
  });
};

const enviarMensaje = async () => {
  const texto = inputMensaje.value.trim();
  if (!texto || cargando.value) return;

  mensajes.value.push({ rol: 'USER', contenido: texto });
  inputMensaje.value = '';
  if (inputRef.value) { inputRef.value.style.height = 'auto'; }
  cargando.value = true;
  scrollAbajo();

  try {
    const { data } = await api.post('/chat/mensaje', {
      sessionId: sessionId.value,
      nombre: lead.value.nombre.trim(),
      whatsapp: lead.value.whatsapp.trim().replace(/\D/g, ''),
      correo: lead.value.correo.trim() || undefined,
      mensaje: texto,
    });
    mensajes.value.push({ rol: 'BOT', contenido: data.respuesta });
  } catch {
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
