<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';

const sesiones = ref([]);
const cargando = ref(true);
const sesionActiva = ref(null);
const mensajes = ref([]);
const cargandoMensajes = ref(false);
const busqueda = ref('');

const cargarSesiones = async () => {
    cargando.value = true;
    try {
        const { data } = await api.get('/admin/chat-web/sesiones');
        sesiones.value = data;
    } catch (e) {
        console.error('Error cargando chat web:', e);
    } finally {
        cargando.value = false;
    }
};

const abrirSesion = async (sesion) => {
    sesionActiva.value = sesion;
    cargandoMensajes.value = true;
    mensajes.value = [];
    try {
        const { data } = await api.get(`/admin/chat-web/sesiones/${sesion.sessionId}`);
        mensajes.value = data;
    } catch (e) {
        console.error('Error cargando mensajes:', e);
    } finally {
        cargandoMensajes.value = false;
    }
};

const sesionesFiltrasdas = computed(() => {
    const q = busqueda.value.trim().toLowerCase();
    if (!q) return sesiones.value;
    return sesiones.value.filter(s =>
        (s.nombre || '').toLowerCase().includes(q) ||
        (s.whatsapp || '').includes(q) ||
        (s.correo || '').toLowerCase().includes(q) ||
        (s.ultimoMensaje || '').toLowerCase().includes(q)
    );
});

const formatFecha = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('es-CO', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
        timeZone: 'America/Bogota'
    });
};

const formatFechaLarga = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('es-CO', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
        timeZone: 'America/Bogota'
    });
};

const waUrl = (numero) => {
    const n = (numero || '').replace(/\D/g, '');
    const col = n.length === 10 ? '57' + n : n;
    return `https://wa.me/${col}`;
};

onMounted(cargarSesiones);
</script>

<template>
    <div class="flex gap-6 h-[calc(100vh-220px)] min-h-[500px]">

        <!-- Panel izquierdo: lista de sesiones -->
        <div class="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-3" :class="sesionActiva ? 'hidden lg:flex' : 'flex'">

            <!-- Buscador -->
            <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                <input v-model="busqueda" placeholder="Buscar por nombre, WhatsApp…"
                    class="w-full bg-white dark:bg-[#050505] border-2 border-slate-200 dark:border-white/10 pl-10 pr-4 py-3 rounded-2xl text-[10px] font-bold outline-none focus:border-[#152C77] dark:focus:border-white transition-all" />
            </div>

            <!-- Stats rápidos -->
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-white dark:bg-[#050505] border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-center">
                    <p class="text-2xl font-[1000] text-[#152C77] dark:text-white">{{ sesiones.length }}</p>
                    <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Conversaciones</p>
                </div>
                <div class="bg-white dark:bg-[#050505] border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-center">
                    <p class="text-2xl font-[1000] text-[#DE1F27]">{{ sesiones.reduce((a, s) => a + (s.totalMensajes || 0), 0) }}</p>
                    <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Mensajes totales</p>
                </div>
            </div>

            <!-- Lista -->
            <div class="flex-1 overflow-y-auto flex flex-col gap-2 custom-scrollbar pr-1">
                <div v-if="cargando" class="py-10 text-center">
                    <div class="w-6 h-6 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Cargando…</p>
                </div>
                <div v-else-if="!sesionesFiltrasdas.length" class="py-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Sin conversaciones
                </div>
                <button v-else v-for="s in sesionesFiltrasdas" :key="s.sessionId"
                    @click="abrirSesion(s)"
                    class="w-full text-left bg-white dark:bg-[#050505] border-2 rounded-2xl p-4 transition-all duration-200 active:scale-[0.98]"
                    :class="sesionActiva?.sessionId === s.sessionId
                        ? 'border-[#152C77] dark:border-[#152C77] shadow-lg'
                        : 'border-slate-200 dark:border-white/10 hover:border-[#152C77]/40'">
                    <div class="flex items-start justify-between gap-2 mb-1.5">
                        <p class="text-[11px] font-[1000] uppercase italic text-slate-800 dark:text-white truncate">{{ s.nombre || 'Sin nombre' }}</p>
                        <span class="text-[8px] font-bold text-slate-400 shrink-0">{{ formatFecha(s.ultimoTimestamp) }}</span>
                    </div>
                    <p class="text-[10px] font-bold text-[#152C77] dark:text-blue-300 mb-1">{{ s.whatsapp }}</p>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-2">{{ s.ultimoMensaje }}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="text-[8px] font-black uppercase bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-full">
                            {{ s.totalMensajes }} mensajes
                        </span>
                        <span v-if="s.correo" class="text-[8px] font-black uppercase bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
                            con correo
                        </span>
                    </div>
                </button>
            </div>
        </div>

        <!-- Panel derecho: conversación -->
        <div class="flex-1 flex flex-col bg-white dark:bg-[#050505] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden">

            <!-- Sin sesión seleccionada -->
            <div v-if="!sesionActiva" class="flex-1 flex items-center justify-center flex-col gap-4 text-center p-8">
                <div class="text-5xl">💬</div>
                <p class="text-[11px] font-[1000] uppercase italic tracking-widest text-slate-400">Selecciona una conversación</p>
            </div>

            <template v-else>
                <!-- Header de la sesión -->
                <div class="bg-gradient-to-r from-[#152C77] to-[#1e3b9e] p-5 flex items-center justify-between shrink-0">
                    <div class="flex items-center gap-4">
                        <button @click="sesionActiva = null" class="lg:hidden text-white/60 hover:text-white text-2xl leading-none mr-1">←</button>
                        <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-[1000] text-white border border-white/30">
                            {{ (sesionActiva.nombre || '?').charAt(0).toUpperCase() }}
                        </div>
                        <div>
                            <p class="text-sm font-[1000] uppercase italic text-white leading-none">{{ sesionActiva.nombre }}</p>
                            <p class="text-[9px] text-white/60 font-bold mt-0.5">
                                {{ sesionActiva.whatsapp }}
                                <span v-if="sesionActiva.correo"> · {{ sesionActiva.correo }}</span>
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <a :href="waUrl(sesionActiva.whatsapp)" target="_blank"
                            class="flex items-center gap-2 bg-[#25D366] text-white text-[9px] font-black uppercase px-3 py-2 rounded-xl transition-all hover:bg-green-600 active:scale-95">
                            <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            WhatsApp
                        </a>
                        <span class="text-[8px] font-bold text-white/50">{{ formatFechaLarga(sesionActiva.inicio) }}</span>
                    </div>
                </div>

                <!-- Mensajes -->
                <div class="flex-1 overflow-y-auto p-5 flex flex-col gap-3 custom-scrollbar bg-slate-50 dark:bg-[#080808]">
                    <div v-if="cargandoMensajes" class="py-10 text-center">
                        <div class="w-6 h-6 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                    <template v-else>
                        <div v-for="(msg, i) in mensajes" :key="i"
                            class="flex gap-2"
                            :class="msg.rol === 'USER' ? 'flex-row-reverse' : 'flex-row'">
                            <!-- Avatar -->
                            <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shrink-0 mt-1 font-[1000] shadow-md"
                                :class="msg.rol === 'USER' ? 'bg-[#DE1F27]' : 'bg-[#152C77]'">
                                {{ msg.rol === 'USER' ? (sesionActiva.nombre || '?').charAt(0).toUpperCase() : '🤖' }}
                            </div>
                            <!-- Burbuja -->
                            <div class="max-w-[75%] flex flex-col gap-1" :class="msg.rol === 'USER' ? 'items-end' : 'items-start'">
                                <div class="px-4 py-3 rounded-2xl text-[11px] font-semibold leading-relaxed shadow-sm"
                                    :class="msg.rol === 'USER'
                                        ? 'bg-[#152C77] text-white rounded-tr-none'
                                        : 'bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-tl-none'">
                                    <span class="whitespace-pre-wrap">{{ msg.contenido }}</span>
                                </div>
                                <span class="text-[8px] font-bold text-slate-400 px-1">{{ formatFecha(msg.timestamp) }}</span>
                            </div>
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
