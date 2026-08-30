<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const stats = ref(null);
const cargandoStats = ref(false);
const enviando = ref(false);
const resultado = ref(null);
const error = ref(null);

const cargarStats = async () => {
    cargandoStats.value = true;
    try {
        const { data } = await api.get('/admin/marketing/stats-lanzamiento');
        stats.value = data;
    } catch (e) {
        // stats opcionales, no bloqueante
    } finally {
        cargandoStats.value = false;
    }
};

const lanzar = async () => {
    enviando.value = true;
    resultado.value = null;
    error.value = null;
    try {
        const { data } = await api.post('/admin/marketing/campana-lanzamiento-web');
        resultado.value = data;
        await cargarStats();
    } catch (e) {
        error.value = 'Error al conectar con el servidor.';
    } finally {
        enviando.value = false;
    }
};

onMounted(cargarStats);
</script>

<template>
<div class="space-y-8 max-w-2xl">

    <!-- Título -->
    <div>
        <h2 class="text-2xl font-[1000] uppercase italic text-[#152C77] dark:text-white">Campaña de Lanzamiento Web</h2>
        <p class="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Correo masivo a tutores suscritos</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4">
        <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-5 text-center">
            <p class="text-3xl font-[1000] text-[#152C77] dark:text-white">
                {{ cargandoStats ? '…' : (stats?.enviados ?? '—') }}
            </p>
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Enviados</p>
        </div>
        <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-5 text-center">
            <p class="text-3xl font-[1000] text-amber-500">
                {{ cargandoStats ? '…' : (stats?.pendientes ?? '—') }}
            </p>
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Pendientes</p>
        </div>
        <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-5 text-center">
            <p class="text-3xl font-[1000] text-slate-400">
                {{ cargandoStats ? '…' : (stats?.total ?? '—') }}
            </p>
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Total</p>
        </div>
    </div>

    <!-- Estado campaña -->
    <div v-if="stats" class="flex items-center gap-3 px-5 py-4 rounded-2xl"
        :class="stats.pendientes === 0
            ? 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20'
            : 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20'">
        <span class="text-2xl">{{ stats.pendientes === 0 ? '✅' : '📬' }}</span>
        <div>
            <p class="text-xs font-black uppercase tracking-widest"
                :class="stats.pendientes === 0 ? 'text-green-700 dark:text-green-400' : 'text-blue-700 dark:text-blue-400'">
                {{ stats.pendientes === 0 ? 'Campaña completada' : 'Campaña en curso o lista para iniciar' }}
            </p>
            <p class="text-[10px] text-slate-500 mt-0.5">
                {{ stats.pendientes === 0
                    ? 'Todos los contactos suscritos recibieron el correo.'
                    : `Quedan ${stats.pendientes} contactos. El servidor envía 280 automáticamente cada día a las 9am una vez que inicies.` }}
            </p>
        </div>
    </div>

    <!-- Botón lanzar -->
    <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-6 space-y-4">
        <div>
            <p class="text-sm font-black text-slate-700 dark:text-white">Disparar primer lote</p>
            <p class="text-[11px] text-slate-400 mt-1">
                Envía los primeros 280 correos ahora. A partir de ahí el servidor continúa solo cada día a las 9am hasta completar todos los contactos pendientes.
            </p>
        </div>

        <button @click="lanzar" :disabled="enviando || (stats && stats.pendientes === 0)"
            class="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            :class="enviando ? 'bg-slate-200 text-slate-500' : 'bg-[#152C77] text-white hover:bg-[#DE1F27]'">
            {{ enviando ? '⏳ Enviando...' : (stats?.pendientes === 0 ? '✅ Completado' : '🚀 Iniciar campaña') }}
        </button>
    </div>

    <!-- Resultado -->
    <div v-if="resultado" class="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-5 space-y-2">
        <p class="text-xs font-black uppercase tracking-widest text-green-700 dark:text-green-400">✅ Lote enviado</p>
        <div class="grid grid-cols-2 gap-3 mt-3">
            <div>
                <p class="text-2xl font-[1000] text-green-700 dark:text-green-400">{{ resultado.enviados }}</p>
                <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Enviados ahora</p>
            </div>
            <div>
                <p class="text-2xl font-[1000] text-amber-500">{{ resultado.restantes }}</p>
                <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Pendientes</p>
            </div>
        </div>
        <p v-if="resultado.hayMas" class="text-[10px] text-slate-500">
            El servidor continuará enviando los siguientes lotes automáticamente cada día a las 9am.
        </p>
        <p v-else class="text-[10px] text-green-600 dark:text-green-400 font-bold">
            ¡Campaña completada! Todos los contactos recibieron el correo.
        </p>
    </div>

    <!-- Error -->
    <div v-if="error" class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-5">
        <p class="text-xs font-black uppercase tracking-widest text-red-600">⚠️ {{ error }}</p>
    </div>

</div>
</template>
