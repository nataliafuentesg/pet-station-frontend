<template>
  <div class="fixed z-[4500] right-4 top-44 md:top-auto md:right-10 md:bottom-10 flex flex-col items-end gap-3 pointer-events-none">

    <Transition name="slide-up">
      <div v-if="isOpen" class="w-[calc(100vw-2rem)] md:w-[380px] bg-white dark:bg-[#0A0A0A] rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/10 overflow-hidden pointer-events-auto flex flex-col mb-2 origin-bottom-right">

        <div class="bg-gradient-to-r from-[#152C77] to-[#1e3b9e] p-5 flex justify-between items-center text-white relative overflow-hidden">
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

        <div class="p-5 bg-slate-50 dark:bg-[#050505] flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar">

          <!-- MENÚ PRINCIPAL -->
          <div v-if="chatStep === 'menu'">
            <div class="flex items-end gap-2 mb-6">
              <div class="w-8 h-8 bg-[#152C77] rounded-full flex items-center justify-center text-white text-sm shrink-0 shadow-md">🤖</div>
              <div class="bg-white dark:bg-[#152C77] border border-slate-200 dark:border-white/5 p-4 rounded-2xl rounded-bl-none shadow-sm relative">
                <p class="text-[11px] font-bold text-slate-600 dark:text-white leading-relaxed">
                  ¡Guau! Hola 👋 <br><br>Soy el asistente virtual. Para atenderte más rápido, ¿qué necesitas hoy?
                </p>
                <div class="absolute -bottom-1 -left-1 w-3 h-3 bg-white dark:bg-[#152C77] transform rotate-45 border-b border-l border-slate-200 dark:border-transparent"></div>
              </div>
            </div>

            <div class="flex flex-col gap-2 pl-10">
              <button @click="handleOption('agendar')" class="w-full text-left px-4 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all duration-300 transform active:scale-95 border-[#152C77] text-[#152C77] dark:border-white/20 dark:text-white hover:bg-[#152C77] hover:text-white">
                📅 Agendar Cita
              </button>
              <button @click="chatStep = 'info'; track('CHATBOT_OPCION', { opcion: 'horarios' })" class="w-full text-left px-4 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all duration-300 transform active:scale-95 border-[#152C77] text-[#152C77] dark:border-white/20 dark:text-white hover:bg-[#152C77] hover:text-white">
                📍 Horarios y Ubicación
              </button>
              <button @click="chatStep = 'faq'; track('CHATBOT_OPCION', { opcion: 'faq' })" class="w-full text-left px-4 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all duration-300 transform active:scale-95 border-[#152C77] text-[#152C77] dark:border-white/20 dark:text-white hover:bg-[#152C77] hover:text-white">
                💬 Preguntas Frecuentes
              </button>
              <button @click="chatStep = 'viajes'; track('CHATBOT_OPCION', { opcion: 'viajes' })" class="w-full text-left px-4 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all duration-300 transform active:scale-95 border-[#152C77] text-[#152C77] dark:border-white/20 dark:text-white hover:bg-[#152C77] hover:text-white">
                ✈️ Viajes Internacionales
              </button>
              <button @click="chatStep = 'tienda'; track('CHATBOT_OPCION', { opcion: 'tienda' })" class="w-full text-left px-4 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all duration-300 transform active:scale-95 border-[#152C77] text-[#152C77] dark:border-white/20 dark:text-white hover:bg-[#152C77] hover:text-white">
                🛍️ Consultar Producto
              </button>
              <button @click="handleOption('urgencia')" class="w-full text-left px-4 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all duration-300 transform active:scale-95 border-[#DE1F27] text-[#DE1F27] bg-[#DE1F27]/5 hover:bg-[#DE1F27] hover:text-white animate-pulse mt-2">
                🚨 Urgencia Clínica
              </button>
            </div>
          </div>

          <!-- HORARIOS -->
          <div v-else-if="chatStep === 'info'">
            <div class="flex items-end gap-2 mb-6">
              <div class="w-8 h-8 bg-[#152C77] rounded-full flex items-center justify-center text-white text-sm shrink-0 shadow-md">🤖</div>
              <div class="bg-white dark:bg-[#152C77] border border-slate-200 dark:border-white/5 p-4 rounded-2xl rounded-bl-none shadow-sm relative">
                <p class="text-[11px] font-bold text-slate-600 dark:text-white leading-relaxed">
                  Estamos ubicados en <strong class="text-[#DE1F27]">Chía, Cundinamarca</strong>.<br>
                  Via Guaymaral 2km antes, Variante Chía - Cota.<br><br>
                  <strong>⏰ Horarios:</strong><br>
                  Lun - Sáb: 09:00 AM - 07:00 PM<br>
                  Dom - Fest: 10:00 AM - 03:00 PM
                </p>
                <div class="absolute -bottom-1 -left-1 w-3 h-3 bg-white dark:bg-[#152C77] transform rotate-45 border-b border-l border-slate-200 dark:border-transparent"></div>
              </div>
            </div>

            <div class="flex flex-col gap-2.5 pl-10">
              <a href="https://maps.google.com/?q=Pet+Station+Chia" target="_blank" class="w-full text-center px-4 py-3 border rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all duration-300 transform active:scale-95 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center gap-2">
                🗺️ Abrir Maps
              </a>
              <button @click="chatStep = 'menu'" class="w-full text-left px-4 py-3 border rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all duration-300 transform active:scale-95 border-slate-300 text-slate-500 dark:border-white/10 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10">
                ← Volver al menú
              </button>
            </div>
          </div>

          <!-- FAQ -->
          <div v-else-if="chatStep === 'faq'">
            <div class="flex items-end gap-2 mb-4">
              <div class="w-8 h-8 bg-[#152C77] rounded-full flex items-center justify-center text-white text-sm shrink-0 shadow-md">🤖</div>
              <div class="bg-white dark:bg-[#152C77] border border-slate-200 dark:border-white/5 p-4 rounded-2xl rounded-bl-none shadow-sm relative">
                <p class="text-[11px] font-bold text-slate-600 dark:text-white leading-relaxed">
                  Escríbeme tu pregunta y te respondo al instante 👇
                </p>
                <div class="absolute -bottom-1 -left-1 w-3 h-3 bg-white dark:bg-[#152C77] transform rotate-45 border-b border-l border-slate-200 dark:border-transparent"></div>
              </div>
            </div>

            <!-- Chips de preguntas rápidas -->
            <div class="flex flex-wrap gap-2 pl-10 mb-4">
              <button v-for="q in preguntasRapidas" :key="q" @click="buscarFaq(q)"
                class="px-3 py-1.5 bg-[#152C77]/10 dark:bg-white/10 text-[#152C77] dark:text-white text-[9px] font-black uppercase rounded-full border border-[#152C77]/20 dark:border-white/10 hover:bg-[#152C77] hover:text-white transition-all">
                {{ q }}
              </button>
            </div>

            <div class="flex flex-col gap-3 pl-10">
              <div class="flex gap-2">
                <input
                  v-model="faqQuery"
                  type="text"
                  placeholder="Ej: ¿Ofrecen vacunas?"
                  class="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#DE1F27] transition-colors text-slate-600 dark:text-white"
                  @keyup.enter="buscarFaq(faqQuery)"
                >
                <button @click="buscarFaq(faqQuery)" :disabled="!faqQuery.trim()"
                  class="px-4 py-3 bg-[#152C77] text-white rounded-xl text-sm font-black disabled:opacity-40 hover:bg-[#DE1F27] transition-colors">
                  →
                </button>
              </div>

              <!-- Respuesta -->
              <Transition name="fade">
                <div v-if="faqRespuesta" class="mt-1">
                  <div class="flex items-start gap-2">
                    <div class="w-8 h-8 bg-[#152C77] rounded-full flex items-center justify-center text-white text-sm shrink-0 shadow-md mt-1">🤖</div>
                    <div class="bg-white dark:bg-[#152C77] border border-slate-200 dark:border-white/5 p-4 rounded-2xl rounded-bl-none shadow-sm flex-1">
                      <p class="text-[11px] font-bold text-slate-600 dark:text-white leading-relaxed whitespace-pre-line">{{ faqRespuesta.texto }}</p>
                      <a v-if="faqRespuesta.wa" :href="faqRespuesta.wa" target="_blank"
                        class="mt-3 flex items-center gap-2 text-[9px] font-black uppercase text-[#25D366] hover:text-green-700 transition-colors">
                        <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Hablar con un asesor
                      </a>
                    </div>
                  </div>
                  <button @click="faqRespuesta = null; faqQuery = ''" class="mt-3 ml-10 text-[9px] font-black uppercase text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                    Hacer otra pregunta
                  </button>
                </div>
              </Transition>
            </div>

            <button @click="chatStep = 'menu'" class="mt-4 w-full text-center px-4 py-2 text-[10px] font-black uppercase tracking-widest italic transition-all duration-300 text-slate-400 hover:text-slate-600 dark:hover:text-white">
              ← Volver al menú
            </button>
          </div>

          <!-- VIAJES -->
          <div v-else-if="chatStep === 'viajes'">
            <div class="flex items-end gap-2 mb-5">
              <div class="w-8 h-8 bg-[#152C77] rounded-full flex items-center justify-center text-white text-sm shrink-0 shadow-md">🤖</div>
              <div class="bg-white dark:bg-[#152C77] border border-slate-200 dark:border-white/5 p-4 rounded-2xl rounded-bl-none shadow-sm relative">
                <p class="text-[11px] font-bold text-slate-600 dark:text-white leading-relaxed">
                  ¡Viajar con peludos es una aventura! ✈️ <br><br>Para darte la asesoría médica y aduanera exacta, cuéntame un poco más sobre el pasajero:
                </p>
                <div class="absolute -bottom-1 -left-1 w-3 h-3 bg-white dark:bg-[#152C77] transform rotate-45 border-b border-l border-slate-200 dark:border-transparent"></div>
              </div>
            </div>

            <div class="flex flex-col gap-3 pl-10">
              <select v-model="formViaje.destino" class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#DE1F27] transition-colors text-slate-600 dark:text-white">
                <option value="" disabled selected>🌍 Destino del Viaje</option>
                <option value="Estados Unidos">🇺🇸 Estados Unidos</option>
                <option value="Unión Europea">🇪🇺 Unión Europea</option>
                <option value="Latinoamérica">🌎 Latinoamérica</option>
                <option value="Nacional">🇨🇴 Nacional (Colombia)</option>
                <option value="Otro">Otro Destino</option>
              </select>

              <div class="flex gap-2">
                <select v-model="formViaje.especie" class="w-1/2 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#DE1F27] transition-colors text-slate-600 dark:text-white">
                  <option value="" disabled selected>🐾 Especie</option>
                  <option value="Perro">🐶 Perro</option>
                  <option value="Gato">🐱 Gato</option>
                </select>
                <input v-model="formViaje.edad" type="text" placeholder="Edad (Ej: 2 años)" class="w-1/2 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#DE1F27] transition-colors text-slate-600 dark:text-white">
              </div>

              <input v-model="formViaje.fecha" type="text" placeholder="Fecha tentativa (Ej: Dic 2026)" class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#DE1F27] transition-colors text-slate-600 dark:text-white">

              <button
                @click="sendViajeWA"
                :disabled="!isViajeFormValid"
                class="w-full text-center px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-[#25D366] text-white shadow-lg mt-2 flex justify-center items-center gap-2"
              >
                <span>💬</span> Enviar a WhatsApp
              </button>
              <button @click="chatStep = 'menu'" class="w-full text-center px-4 py-2 text-[10px] font-black uppercase tracking-widest italic transition-all duration-300 text-slate-400 hover:text-slate-600 dark:hover:text-white mt-1">
                ← Volver al menú
              </button>
            </div>
          </div>

          <!-- TIENDA -->
          <div v-else-if="chatStep === 'tienda'">
            <div class="flex items-end gap-2 mb-6">
              <div class="w-8 h-8 bg-[#152C77] rounded-full flex items-center justify-center text-white text-sm shrink-0 shadow-md">🤖</div>
              <div class="bg-white dark:bg-[#152C77] border border-slate-200 dark:border-white/5 p-4 rounded-2xl rounded-bl-none shadow-sm relative">
                <p class="text-[11px] font-bold text-slate-600 dark:text-white leading-relaxed">
                  ¡Perfecto! 🛍️ <br>Escríbeme el nombre del producto, medicamento o marca que buscas y te confirmo disponibilidad:
                </p>
                <div class="absolute -bottom-1 -left-1 w-3 h-3 bg-white dark:bg-[#152C77] transform rotate-45 border-b border-l border-slate-200 dark:border-transparent"></div>
              </div>
            </div>

            <div class="flex flex-col gap-3 pl-10">
              <input
                v-model="productoBuscado"
                type="text"
                placeholder="Ej: Bravecto, Royal Canin..."
                class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#DE1F27] transition-colors text-slate-600 dark:text-white"
                @keyup.enter="sendProductoWA"
              >
              <button
                @click="sendProductoWA"
                :disabled="!productoBuscado.trim()"
                class="w-full text-center px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-[#25D366] text-white shadow-lg flex justify-center items-center gap-2"
              >
                <span>💬</span> Enviar por WhatsApp
              </button>
              <button @click="chatStep = 'menu'" class="w-full text-center px-4 py-2 text-[10px] font-black uppercase tracking-widest italic transition-all duration-300 text-slate-400 hover:text-slate-600 dark:hover:text-white mt-1">
                ← Volver al menú
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="!isOpen && !hasOpened" class="bg-white dark:bg-[#152C77] text-[#152C77] dark:text-white px-5 py-3 rounded-2xl rounded-br-none shadow-2xl border border-slate-200 dark:border-white/10 animate-bounce pointer-events-auto origin-bottom-right">
        <p class="text-[10px] md:text-xs font-black uppercase tracking-widest italic flex items-center gap-2">
          <span class="text-lg">🐾</span> ¡Hola! ¿Necesitas ayuda?
        </p>
      </div>
    </Transition>

    <button
      @click="toggleChat"
      class="relative flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl w-12 h-12 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[2rem] bg-[#25D366] text-white pointer-events-auto"
      :class="isOpen ? 'bg-[#152C77] rotate-90 border-transparent' : 'border-b-4 border-green-700'"
    >
      <span v-if="!hasOpened && !isOpen" class="absolute -top-1 -right-1 md:-top-2 md:-right-2 flex h-4 w-4 md:h-5 md:w-5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 md:h-5 md:w-5 bg-[#DE1F27] border-2 border-white dark:border-[#050505] items-center justify-center text-[8px] md:text-[10px] font-black text-white">1</span>
      </span>

      <svg v-if="!isOpen" viewBox="0 0 24 24" class="w-6 h-6 md:w-8 md:h-8 fill-current transition-transform" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span v-else class="text-3xl font-light -rotate-90 block">✕</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLead } from '@/composables/useLead';

const router = useRouter();
const { track } = useLead();
const isOpen = ref(false);
const hasOpened = ref(false);
const chatStep = ref('menu');

const productoBuscado = ref('');
const faqQuery = ref('');
const faqRespuesta = ref(null);

const formViaje = ref({ destino: '', especie: '', edad: '', fecha: '' });

const isViajeFormValid = computed(() =>
  formViaje.value.destino && formViaje.value.especie && formViaje.value.edad.trim() && formViaje.value.fecha.trim()
);

const numeroWhatsAppGeneral = "573053462413";
const numeroWhatsAppViajes = "573208221778";

// ─── Base de conocimiento FAQ ───────────────────────────────────────────────
// Cada entrada: { palabras: [...keywords], texto: '...', wa: 'url o null' }
const FAQ = [
  {
    palabras: ['vacuna', 'vacunas', 'vacunación', 'vacunar', 'inmunización'],
    texto: '💉 ¡Sí ofrecemos servicio de vacunación!\n\nAplicamos vacunas para perros y gatos. Para la cita y conocer el plan de vacunación para tu mascota, puedes agendar directamente en nuestra página.',
    wa: null,
    accion: 'agendar'
  },
  {
    palabras: ['baño', 'peluquería', 'peluqueria', 'bañar', 'corte', 'grooming', 'baño y corte'],
    texto: '✂️ ¡Tenemos servicio de peluquería y spa para mascotas!\n\nIncluye baño, corte, limpieza de oídos y más. Para agendar tu cita de peluquería escríbenos directamente.',
    wa: `https://wa.me/573053462413?text=${encodeURIComponent('Hola! Quiero agendar un baño/peluquería para mi mascota.')}`,
  },
  {
    palabras: ['cirugía', 'cirugia', 'operación', 'operacion', 'castrar', 'castración', 'esterilizar'],
    texto: '🏥 Sí realizamos cirugías veterinarias, incluyendo castración y esterilización.\n\nPara este tipo de procedimientos necesitamos revisar primero al paciente. Te recomendamos agendar una consulta.',
    wa: `https://wa.me/573053462413?text=${encodeURIComponent('Hola! Quiero información sobre cirugías/castración para mi mascota.')}`,
  },
  {
    palabras: ['precio', 'precios', 'costo', 'costos', 'cuánto', 'cuanto', 'valor', 'tarifa', 'consulta médica'],
    texto: '💰 Los precios varían según el servicio y el tamaño de tu mascota.\n\nPara darte un presupuesto exacto, escríbenos por WhatsApp y con gusto te asesoramos.',
    wa: `https://wa.me/573053462413?text=${encodeURIComponent('Hola! Quisiera saber los precios de los servicios veterinarios.')}`,
  },
  {
    palabras: ['domicilio', 'a domicilio', 'van', 'visita', 'casa', 'visita domiciliaria'],
    texto: '🏠 Contamos con servicio de domicilio para entrega de productos de nuestra tienda en Chía.\n\nPor el momento las consultas médicas y procedimientos se realizan únicamente en nuestra clínica.',
    wa: null,
  },
  {
    palabras: ['radiografía', 'radiografia', 'rayos x', 'ecografía', 'ecografia', 'laboratorio', 'exámenes', 'examenes'],
    texto: '🔬 Contamos con servicios de diagnóstico: radiografías, ecografías y toma de muestras de laboratorio.\n\nAgenda una consulta para que el veterinario evalúe qué exámenes necesita tu mascota.',
    wa: null,
    accion: 'agendar'
  },
  {
    palabras: ['urgencia', 'emergencia', 'urgente', 'grave', 'accidente', 'envenenó', 'envenenado', 'atropelló'],
    texto: '🚨 Para urgencias veterinarias llámanos o escríbenos de inmediato por WhatsApp.',
    wa: `https://wa.me/573053462413?text=${encodeURIComponent('🚨 URGENCIA VETERINARIA: Necesito atención inmediata por favor.')}`,
  },
  {
    palabras: ['pago', 'pagos', 'tarjeta', 'efectivo', 'nequi', 'daviplata', 'transferencia', 'pse'],
    texto: '💳 Aceptamos múltiples métodos de pago:\n\n• Tarjeta débito y crédito\n• Efectivo\n• Nequi y Daviplata\n• PSE\n• Transferencia bancaria',
    wa: null,
  },
  {
    palabras: ['estética', 'estetica', 'spa', 'uñas', 'unas', 'limpieza dental', 'dientes'],
    texto: '✨ Ofrecemos servicios de estética y bienestar para tu mascota:\n\n• Corte de uñas\n• Limpieza de oídos\n• Baño y peluquería\n• Limpieza dental (requiere anestesia — agenda cita)',
    wa: `https://wa.me/573053462413?text=${encodeURIComponent('Hola! Quiero información sobre servicios de estética para mi mascota.')}`,
  },
  {
    palabras: ['parque', 'dirección', 'direccion', 'dónde', 'donde', 'ubicación', 'ubicacion', 'cómo llegar', 'como llegar'],
    texto: '📍 Estamos en:\nVía Guaymaral 2km antes, Variante Chía - Cota, Chía, Cundinamarca.\n\n⏰ Lun - Sáb: 9am - 7pm\n⏰ Dom - Fest: 10am - 3pm',
    wa: null,
  },
  {
    palabras: ['desparasitar', 'desparasitación', 'desparasitacion', 'pulgas', 'garrapatas', 'parasitos', 'parásitos'],
    texto: '🐛 Sí manejamos desparasitación interna y externa, además de productos antiparasitarios en nuestra tienda.\n\nPuedes adquirirlos directamente o consultarnos cuál es el más indicado para tu mascota.',
    wa: `https://wa.me/573053462413?text=${encodeURIComponent('Hola! Necesito información sobre desparasitación para mi mascota.')}`,
  },
  {
    palabras: ['microchip', 'chip', 'identificación', 'identificacion'],
    texto: '📡 Sí realizamos implante de microchip para identificación de tu mascota. Es un procedimiento rápido y seguro.\n\nAgenda una cita o escríbenos para más información.',
    wa: `https://wa.me/573053462413?text=${encodeURIComponent('Hola! Quiero información sobre el microchip para mi mascota.')}`,
  },
];

const preguntasRapidas = [
  '¿Tienen vacunas?', '¿Precios de consulta?', '¿Hacen cirugías?',
  '¿Servicio de baño?', '¿Cómo pagar?', '¿Dónde están?'
];

const WA_NO_SE = `https://wa.me/573053462413?text=${encodeURIComponent('Hola! Tengo una pregunta sobre los servicios de Pet Station.')}`;

const buscarFaq = (q) => {
  if (!q || !q.trim()) return;
  faqQuery.value = q;
  track('CHATBOT_FAQ', { pregunta: q.trim() });

  const texto = q.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const entrada = FAQ.find(f =>
    f.palabras.some(p => texto.includes(p.normalize('NFD').replace(/[̀-ͯ]/g, '')))
  );

  if (entrada) {
    faqRespuesta.value = {
      texto: entrada.texto,
      wa: entrada.wa || null,
      accion: entrada.accion || null,
    };
  } else {
    faqRespuesta.value = {
      texto: 'Hmm, no tengo una respuesta exacta para eso 🤔\n\nPero nuestro equipo puede ayudarte de inmediato por WhatsApp.',
      wa: WA_NO_SE,
    };
  }
};

// Google Tag Manager
const trackChatbot = (accion) => {
  if (window.dataLayer) window.dataLayer.push({ event: 'interaccion_chatbot', accion_bot: accion });
};

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    hasOpened.value = true;
    chatStep.value = 'menu';
    productoBuscado.value = '';
    faqQuery.value = '';
    faqRespuesta.value = null;
    formViaje.value = { destino: '', especie: '', edad: '', fecha: '' };
    trackChatbot('abrir_chat');
    track('CHATBOT_ABIERTO', { pagina: window.location.pathname });
  }
};

const handleOption = (opcion) => {
  trackChatbot(`click_${opcion}`);
  track('CHATBOT_OPCION', { opcion, pagina: window.location.pathname });

  if (opcion === 'agendar') {
    isOpen.value = false;
    router.push('/agendar');
    return;
  }

  let textoWA = opcion === 'urgencia'
    ? '🚨 URGENCIA VETERINARIA: Necesito atención inmediata por favor.'
    : 'Hola Pet Station, me gustaría hablar con un asesor.';

  isOpen.value = false;
  window.open(`https://wa.me/${numeroWhatsAppGeneral}?text=${encodeURIComponent(textoWA)}`, '_blank');
};

const sendViajeWA = () => {
  if (!isViajeFormValid.value) return;
  trackChatbot(`viaje_${formViaje.value.destino}`);
  track('CHATBOT_VIAJE', { ...formViaje.value });
  const textoWA = `Hola Pet Station! ✈️ Necesito asesoría y cotización para viajar con mi mascota. Aquí están los datos del pasajero:\n\n🌍 *Destino:* ${formViaje.value.destino}\n🐾 *Especie:* ${formViaje.value.especie}\n🎂 *Edad:* ${formViaje.value.edad}\n📅 *Fecha Tentativa:* ${formViaje.value.fecha}\n\nQuedo atento(a) a los requisitos. ¡Gracias!`;
  isOpen.value = false;
  formViaje.value = { destino: '', especie: '', edad: '', fecha: '' };
  window.open(`https://wa.me/${numeroWhatsAppViajes}?text=${encodeURIComponent(textoWA)}`, '_blank');
};

const sendProductoWA = () => {
  if (!productoBuscado.value.trim()) return;
  trackChatbot('busqueda_tienda_wa');
  track('CHATBOT_TIENDA', { producto: productoBuscado.value.trim() });
  const textoWA = `Hola Pet Station! 🛍️ Quiero confirmar si tienen disponibilidad o precio de: *${productoBuscado.value}*`;
  isOpen.value = false;
  productoBuscado.value = '';
  window.open(`https://wa.me/${numeroWhatsAppGeneral}?text=${encodeURIComponent(textoWA)}`, '_blank');
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
