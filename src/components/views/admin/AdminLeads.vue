<script setup>
import { computed } from 'vue';

const props = defineProps({ data: { type: Object, default: null } });

const TIPO_META = {
    WHATSAPP_PRODUCTO:  { label: 'WhatsApp Producto',   color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',  icon: '💬' },
    AGOTADO_CONSULTAR:  { label: 'Consultar Agotado',   color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',          icon: '😔' },
    CHATBOT_ABIERTO:    { label: 'Chatbot abierto',     color: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300',      icon: '🤖' },
    CHATBOT_OPCION:     { label: 'Opción chatbot',      color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',      icon: '📋' },
    CHATBOT_VIAJE:      { label: 'Consulta viaje',      color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400', icon: '✈️' },
    CHATBOT_TIENDA:     { label: 'Búsqueda tienda',     color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',  icon: '🔍' },
};

const resumen = computed(() => props.data?.resumen ?? {});
const leads   = computed(() => props.data?.leads ?? []);

const summaryCards = computed(() =>
    Object.entries(TIPO_META).map(([tipo, meta]) => ({
        tipo, ...meta, count: resumen.value[tipo] ?? 0
    }))
);

function parseDatos(raw) {
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return { raw }; }
}

function formatFecha(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'America/Bogota' });
}

function metaFor(tipo) {
    return TIPO_META[tipo] ?? { label: tipo, color: 'bg-slate-100 text-slate-500', icon: '📌' };
}

function datosLabel(tipo, datos) {
    if (tipo === 'WHATSAPP_PRODUCTO' || tipo === 'AGOTADO_CONSULTAR') {
        return datos.nombre ? `${datos.nombre}` + (datos.precio ? ` · $${Number(datos.precio).toLocaleString('es-CO')}` : '') : '';
    }
    if (tipo === 'CHATBOT_OPCION') return datos.opcion ?? '';
    if (tipo === 'CHATBOT_VIAJE') return [datos.destino, datos.especie, datos.edad, datos.fecha].filter(Boolean).join(' · ');
    if (tipo === 'CHATBOT_TIENDA') return datos.producto ?? '';
    if (tipo === 'CHATBOT_ABIERTO') return datos.pagina ?? '';
    return JSON.stringify(datos);
}
</script>

<template>
    <div class="space-y-8">
        <!-- Summary cards -->
        <div v-if="!data" class="text-center py-20 text-slate-400 font-black uppercase text-[10px] tracking-widest">
            Cargando datos de leads…
        </div>

        <template v-else>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div v-for="card in summaryCards" :key="card.tipo"
                    class="bg-white dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/10 flex items-center gap-4">
                    <span class="text-3xl">{{ card.icon }}</span>
                    <div>
                        <p class="text-3xl font-[1000] text-[#152C77] dark:text-white leading-none">{{ card.count }}</p>
                        <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{{ card.label }}</p>
                    </div>
                </div>
            </div>

            <!-- Lead feed -->
            <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center gap-3">
                    <span class="text-lg">📡</span>
                    <span class="text-[10px] font-black uppercase tracking-widest">Actividad reciente</span>
                    <span class="ml-auto text-[9px] font-bold text-slate-400">{{ leads.length }} eventos</span>
                </div>

                <div v-if="leads.length === 0" class="py-16 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    Sin actividad registrada
                </div>

                <div v-else class="divide-y divide-slate-100 dark:divide-white/5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div v-for="lead in leads" :key="lead.id"
                        class="px-6 py-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">

                        <span class="text-xl shrink-0 mt-0.5">{{ metaFor(lead.tipo).icon }}</span>

                        <div class="flex-1 min-w-0">
                            <div class="flex flex-wrap items-center gap-2 mb-1">
                                <span :class="['px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest', metaFor(lead.tipo).color]">
                                    {{ metaFor(lead.tipo).label }}
                                </span>
                                <span v-if="lead.ip" class="text-[8px] font-bold text-slate-300 dark:text-white/20">{{ lead.ip }}</span>
                            </div>
                            <p class="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">
                                {{ datosLabel(lead.tipo, parseDatos(lead.datos)) || '—' }}
                            </p>
                        </div>

                        <span class="text-[9px] font-bold text-slate-400 shrink-0 mt-1">{{ formatFecha(lead.createdAt) }}</span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
