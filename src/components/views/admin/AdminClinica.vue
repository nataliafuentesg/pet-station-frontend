<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '@/api/axios';

const hospitalizados = ref([]);
const seleccionado = ref(null);
const signos = ref([]);
const loadingSignos = ref(false);

onMounted(async () => {
  const { data } = await api.get('/clinica/hospitalizados/todos');
  hospitalizados.value = data;
  if (data.length) seleccionar(data[0]);
});

const seleccionar = async (p) => {
  seleccionado.value = p;
  loadingSignos.value = true;
  try {
    const { data } = await api.get(`/clinica/hospitalizados/${p.id}/signos`);
    signos.value = [...data].reverse(); // cronológico
  } finally {
    loadingSignos.value = false;
  }
};

// Solo registros con glucemia
const signosConGlucemia = computed(() =>
  signos.value.filter(s => s.glucemia != null)
);

const tieneGlucemia = computed(() => signosConGlucemia.value.length > 0);

// Escala SVG del gráfico
const CHART_W = 600;
const CHART_H = 160;
const PAD = { top: 16, right: 20, bottom: 32, left: 44 };

const chartData = computed(() => {
  const items = signosConGlucemia.value;
  if (items.length < 1) return null;

  const vals = items.map(s => Number(s.glucemia));
  const min = Math.max(0, Math.min(...vals) - 20);
  const max = Math.max(...vals) + 20;
  const w = CHART_W - PAD.left - PAD.right;
  const h = CHART_H - PAD.top - PAD.bottom;

  const xScale = (i) => items.length === 1 ? w / 2 : (i / (items.length - 1)) * w;
  const yScale = (v) => h - ((v - min) / (max - min)) * h;

  const points = items.map((s, i) => ({
    x: xScale(i) + PAD.left,
    y: yScale(Number(s.glucemia)) + PAD.top,
    val: Number(s.glucemia),
    hora: formatHora(s.fechaHora),
    fecha: formatFecha(s.fechaHora),
  }));

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');

  // Zona de referencia normal perros/gatos: 70–130 mg/dL
  const yRef1 = yScale(70) + PAD.top;
  const yRef2 = yScale(130) + PAD.top;

  // Ticks Y
  const step = Math.ceil((max - min) / 4 / 10) * 10;
  const ticks = [];
  for (let v = Math.ceil(min / step) * step; v <= max; v += step) {
    ticks.push({ v, y: yScale(v) + PAD.top });
  }

  return { points, polyline, yRef1, yRef2, ticks, min, max };
});

const colorDot = (val) => {
  if (val < 70) return '#3b82f6';  // bajo — azul
  if (val > 130) return '#DE1F27'; // alto — rojo
  return '#22c55e';                // normal — verde
};

const ultimaGlucemia = computed(() => {
  const items = signosConGlucemia.value;
  return items.length ? items[items.length - 1] : null;
});

const estadoGlucemia = (val) => {
  if (val == null) return null;
  if (val < 70) return { label: 'HIPOGLUCEMIA', color: 'text-blue-600 dark:text-blue-400' };
  if (val > 130) return { label: 'HIPERGLUCEMIA', color: 'text-[#DE1F27]' };
  return { label: 'NORMAL', color: 'text-green-600 dark:text-green-400' };
};

const formatHora = (dt) => dt ? new Date(dt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : '';
const formatFecha = (dt) => dt ? new Date(dt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) : '';
const formatIngreso = (dt) => dt ? new Date(dt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

const estadoColor = (estado) => ({
  'ACTIVO':    'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400',
  'OBSERVACION': 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
  'ALTA':      'bg-slate-100 dark:bg-white/10 text-slate-500',
}[estado] ?? 'bg-slate-100 text-slate-500');
</script>

<template>
  <div class="space-y-6">

    <div v-if="!hospitalizados.length" class="text-center py-24 text-slate-400 font-black uppercase text-xs tracking-widest">
      No hay pacientes hospitalizados registrados.
    </div>

    <div v-else class="grid lg:grid-cols-[280px_1fr] gap-6 items-start">

      <!-- Lista de pacientes -->
      <div class="space-y-2">
        <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 px-1 mb-3">Pacientes</p>
        <button v-for="p in hospitalizados" :key="p.id"
          @click="seleccionar(p)"
          :class="[
            'w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3',
            seleccionado?.id === p.id
              ? 'border-[#152C77] bg-[#152C77]/5 dark:bg-[#152C77]/20'
              : 'border-slate-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-[#152C77]/30'
          ]">
          <div class="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-white/10">
            <img v-if="p.fotoUrl" :src="p.fotoUrl" :alt="p.nombre" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-lg">🐾</div>
          </div>
          <div class="min-w-0">
            <p class="font-[1000] uppercase italic text-sm text-slate-800 dark:text-white truncate">{{ p.nombre }}</p>
            <p class="text-[9px] font-bold text-slate-400 uppercase truncate">{{ p.especie }} · {{ p.tutor }}</p>
            <span :class="['text-[8px] font-black uppercase px-2 py-0.5 rounded-full mt-1 inline-block', estadoColor(p.estado)]">
              {{ p.estado }}
            </span>
          </div>
        </button>
      </div>

      <!-- Panel del paciente seleccionado -->
      <div v-if="seleccionado" class="space-y-6">

        <!-- Header paciente -->
        <div class="bg-[#152C77] rounded-[2rem] p-6 text-white flex items-center gap-5">
          <div class="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-white/10">
            <img v-if="seleccionado.fotoUrl" :src="seleccionado.fotoUrl" :alt="seleccionado.nombre" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-3xl">🐾</div>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-[1000] uppercase italic leading-none">{{ seleccionado.nombre }}</h2>
            <p class="text-[10px] font-bold uppercase opacity-60 mt-1">{{ seleccionado.especie }} · {{ seleccionado.raza }} · {{ seleccionado.tutor }}</p>
            <p class="text-[9px] font-bold uppercase opacity-40 mt-1">Ingreso: {{ formatIngreso(seleccionado.ingreso) }} · {{ seleccionado.motivo }}</p>
          </div>
          <span :class="['text-[9px] font-black uppercase px-3 py-1.5 rounded-xl shrink-0', estadoColor(seleccionado.estado)]">
            {{ seleccionado.estado }}
          </span>
        </div>

        <div v-if="loadingSignos" class="h-48 bg-slate-100 dark:bg-white/5 rounded-[2rem] animate-pulse"></div>

        <template v-else>

          <!-- Glucemia: sin datos -->
          <div v-if="!tieneGlucemia"
            class="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-8 border-2 border-dashed border-slate-200 dark:border-white/10 text-center">
            <p class="text-4xl mb-3">📊</p>
            <p class="font-black uppercase text-sm text-slate-400 dark:text-white/30 italic">Sin registros de glucemia</p>
            <p class="text-[9px] font-bold uppercase text-slate-300 dark:text-white/20 mt-1">Se mostrará cuando el veterinario registre glicemia en una ronda</p>
          </div>

          <!-- Glucemia: gráfico -->
          <div v-else class="bg-white dark:bg-white/5 rounded-[2rem] p-6 border border-slate-100 dark:border-white/10 shadow-sm">

            <!-- Header gráfico -->
            <div class="flex items-start justify-between mb-6 gap-4 flex-wrap">
              <div>
                <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mb-1">Tendencia de Glucemia</p>
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-[1000] tracking-tighter" :class="estadoGlucemia(ultimaGlucemia?.glucemia)?.color">
                    {{ ultimaGlucemia?.glucemia }}
                  </span>
                  <span class="text-sm font-bold text-slate-400">mg/dL</span>
                  <span v-if="estadoGlucemia(ultimaGlucemia?.glucemia)" class="text-[9px] font-black uppercase italic" :class="estadoGlucemia(ultimaGlucemia?.glucemia)?.color">
                    · {{ estadoGlucemia(ultimaGlucemia?.glucemia)?.label }}
                  </span>
                </div>
                <p class="text-[9px] text-slate-400 font-bold uppercase mt-1">Último: {{ formatFecha(ultimaGlucemia?.fechaHora) }} {{ formatHora(ultimaGlucemia?.fechaHora) }}</p>
              </div>
              <div class="flex items-center gap-4 text-[8px] font-black uppercase">
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>Normal (70–130)</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>Bajo</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-[#DE1F27] inline-block"></span>Alto</span>
              </div>
            </div>

            <!-- SVG gráfico -->
            <div class="overflow-x-auto">
              <svg :viewBox="`0 0 ${CHART_W} ${CHART_H}`" class="w-full" style="min-width:320px; max-height:200px">

                <!-- Zona normal (70–130 mg/dL) -->
                <rect v-if="chartData"
                  :x="PAD.left" :y="chartData.yRef2"
                  :width="CHART_W - PAD.left - PAD.right"
                  :height="chartData.yRef1 - chartData.yRef2"
                  fill="#22c55e" fill-opacity="0.08" />

                <!-- Líneas Y de referencia -->
                <line v-if="chartData" :x1="PAD.left" :y1="chartData.yRef1" :x2="CHART_W - PAD.right" :y2="chartData.yRef1"
                  stroke="#22c55e" stroke-width="1" stroke-dasharray="4,4" opacity="0.5" />
                <line v-if="chartData" :x1="PAD.left" :y1="chartData.yRef2" :x2="CHART_W - PAD.right" :y2="chartData.yRef2"
                  stroke="#22c55e" stroke-width="1" stroke-dasharray="4,4" opacity="0.5" />

                <!-- Ticks Y -->
                <g v-if="chartData" v-for="t in chartData.ticks" :key="t.v">
                  <line :x1="PAD.left - 4" :y1="t.y" :x2="PAD.left" :y2="t.y" stroke="#94a3b8" stroke-width="1" />
                  <text :x="PAD.left - 6" :y="t.y + 4" text-anchor="end" font-size="9" fill="#94a3b8" font-family="sans-serif">{{ t.v }}</text>
                </g>

                <!-- Línea de datos -->
                <polyline v-if="chartData && chartData.points.length > 1"
                  :points="chartData.polyline"
                  fill="none" stroke="#152C77" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round" />

                <!-- Puntos -->
                <g v-if="chartData" v-for="(p, i) in chartData.points" :key="i">
                  <circle :cx="p.x" :cy="p.y" r="5" :fill="colorDot(p.val)" stroke="white" stroke-width="2" />
                  <!-- Valor encima -->
                  <text :x="p.x" :y="p.y - 9" text-anchor="middle" font-size="9" font-weight="bold"
                    :fill="colorDot(p.val)" font-family="sans-serif">{{ p.val }}</text>
                  <!-- Hora debajo -->
                  <text :x="p.x" :y="CHART_H - PAD.bottom + 13" text-anchor="middle" font-size="8"
                    fill="#94a3b8" font-family="sans-serif">{{ p.hora }}</text>
                  <text :x="p.x" :y="CHART_H - PAD.bottom + 23" text-anchor="middle" font-size="7"
                    fill="#cbd5e1" font-family="sans-serif">{{ p.fecha }}</text>
                </g>

                <!-- Eje X -->
                <line :x1="PAD.left" :y1="CHART_H - PAD.bottom" :x2="CHART_W - PAD.right" :y2="CHART_H - PAD.bottom"
                  stroke="#e2e8f0" stroke-width="1" />
              </svg>
            </div>

            <!-- Tabla resumen -->
            <div class="mt-6 overflow-x-auto">
              <table class="w-full text-[9px] font-bold uppercase">
                <thead>
                  <tr class="border-b border-slate-100 dark:border-white/10">
                    <th class="text-left pb-2 text-slate-400 font-black tracking-widest">Fecha / Hora</th>
                    <th class="text-right pb-2 text-slate-400 font-black tracking-widest">Glucemia</th>
                    <th class="text-right pb-2 text-slate-400 font-black tracking-widest">Estado</th>
                    <th class="text-right pb-2 text-slate-400 font-black tracking-widest">Fuente</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in [...signosConGlucemia].reverse()" :key="s.id"
                    class="border-b border-slate-50 dark:border-white/5">
                    <td class="py-2 text-slate-600 dark:text-slate-300">{{ formatFecha(s.fechaHora) }} {{ formatHora(s.fechaHora) }}</td>
                    <td class="py-2 text-right font-[1000] text-lg leading-none" :class="estadoGlucemia(s.glucemia)?.color">
                      {{ s.glucemia }} <span class="text-[8px] font-bold text-slate-400">mg/dL</span>
                    </td>
                    <td class="py-2 text-right italic" :class="estadoGlucemia(s.glucemia)?.color">
                      {{ estadoGlucemia(s.glucemia)?.label }}
                    </td>
                    <td class="py-2 text-right text-slate-400">{{ s.fuente }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Último signo completo -->
          <div v-if="signos.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <template v-for="s in [signos[signos.length - 1]]" :key="s.id">
              <div v-if="s.frecuenciaCardiaca" class="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5 text-center">
                <p class="text-xl font-[1000] text-[#152C77] dark:text-white">{{ s.frecuenciaCardiaca }}</p>
                <p class="text-[8px] font-black uppercase text-slate-400 mt-1">FC (lpm)</p>
              </div>
              <div v-if="s.temperatura" class="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5 text-center">
                <p class="text-xl font-[1000] text-[#152C77] dark:text-white">{{ s.temperatura }}°</p>
                <p class="text-[8px] font-black uppercase text-slate-400 mt-1">Temperatura</p>
              </div>
              <div v-if="s.saturacionO2" class="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5 text-center">
                <p class="text-xl font-[1000] text-[#152C77] dark:text-white">{{ s.saturacionO2 }}%</p>
                <p class="text-[8px] font-black uppercase text-slate-400 mt-1">SpO2</p>
              </div>
              <div v-if="s.frecuenciaRespiratoria" class="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5 text-center">
                <p class="text-xl font-[1000] text-[#152C77] dark:text-white">{{ s.frecuenciaRespiratoria }}</p>
                <p class="text-[8px] font-black uppercase text-slate-400 mt-1">FR (rpm)</p>
              </div>
              <div v-if="s.peso" class="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5 text-center">
                <p class="text-xl font-[1000] text-[#152C77] dark:text-white">{{ s.peso }} kg</p>
                <p class="text-[8px] font-black uppercase text-slate-400 mt-1">Peso</p>
              </div>
            </template>
          </div>

        </template>
      </div>
    </div>
  </div>
</template>
