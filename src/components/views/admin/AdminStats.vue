<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      
      <div class="stat-card bg-ps-red text-white shadow-xl shadow-red-500/20">
        <p class="label-kpi">Ingresos Totales</p>
        <h2 class="number-kpi">${{ formatCurrency(stats.ventasTotales) }}</h2>
      </div>

      <div class="stat-card bg-ps-blue text-white shadow-xl shadow-blue-500/20">
        <p class="label-kpi">Citas Agendadas (Total)</p>
        <h2 class="number-kpi">{{ stats.totalCitasHistorico || 0 }}</h2>
        <div class="growth-indicator mt-2">📊 Volumen total de servicios</div>
      </div>

      <div class="stat-card bg-black text-white shadow-xl">
        <p class="label-kpi">Pedidos</p>
        <h2 class="number-kpi">{{ stats.totalPedidos || 0 }}</h2>
      </div>

      <div class="stat-card bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <p class="label-kpi text-slate-400">Ticket Promedio</p>
        <h2 class="number-kpi text-ps-blue">${{ formatCurrency(stats.ticketPromedio) }}</h2>
      </div>
    </div>

    <!-- Ventas perdidas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="stat-card border-2 border-dashed border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-900/10">
        <p class="label-kpi text-red-400">Ventas Perdidas</p>
        <h2 class="number-kpi text-red-500">${{ formatCurrency(stats.ventasPerdidasMonto) }}</h2>
        <div class="growth-indicator text-red-400 mt-2">{{ stats.ventasPerdidasCount || 0 }} pedidos pagados y cancelados</div>
      </div>
      <div class="stat-card border-2 border-dashed border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-900/10">
        <p class="label-kpi text-amber-500">Carritos Abandonados</p>
        <h2 class="number-kpi text-amber-500">${{ formatCurrency(stats.carritosAbandonadosMonto) }}</h2>
        <div class="growth-indicator text-amber-400 mt-2">{{ stats.carritosAbandonadosCount || 0 }} pedidos que nunca pagaron</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div class="admin-card">
        <h3 class="header-title">
          <span class="w-2 h-2 bg-ps-red rounded-full"></span> 
          Balance de Inventario
        </h3>
        <div class="mt-8 space-y-8">
          <div class="space-y-2">
            <div class="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span>Nutrición</span>
              <span class="text-ps-blue">{{ stats.catNutricion || 0 }} unid.</span>
            </div>
            <div class="progress-bg">
              <div class="progress-bar bg-ps-blue" :style="{ width: calculatePercent(stats.catNutricion) + '%' }"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span>Farmacia</span>
              <span class="text-ps-red">{{ stats.catFarmacia || 0 }} unid.</span>
            </div>
            <div class="progress-bg">
              <div class="progress-bar bg-ps-red" :style="{ width: calculatePercent(stats.catFarmacia) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="admin-card">
        <h3 class="header-title">
          <span class="w-2 h-2 bg-ps-blue rounded-full"></span> 
          Agenda Próxima (Control del Día)
        </h3>
        <div class="space-y-3">
          <div v-for="c in (stats.agendaFutura || []).slice(0, 6)" :key="c.id" 
               class="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border-l-4 border-ps-blue transition-all hover:translate-x-1">
            <div>
              <p class="text-xs font-[1000] uppercase italic dark:text-white">{{ c.mascotaNombre }}</p>
              <p class="text-[9px] font-black opacity-40 uppercase">{{ c.servicioTipo }}</p>
            </div>
            <span class="text-[10px] font-black bg-white dark:bg-black px-3 py-1 rounded-lg shadow-sm dark:text-white">
              {{ formatDate(c.fechaHora) }}
            </span>
          </div>
          <div v-if="!stats.agendaFutura?.length" class="text-center py-10 opacity-20 font-black uppercase italic text-[10px]">
            No hay citas pendientes para hoy
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps(['stats']);

const formatCurrency = (v) => Number(v || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 });

const calculatePercent = (val) => {
    const total = (props.stats.catNutricion || 0) + (props.stats.catFarmacia || 0);
    return total > 0 ? (val / total) * 100 : 0;
};

const formatDate = (ds) => ds ? new Date(ds).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '---';
</script>

<style scoped>
@reference "../../../style.css";
.stat-card { @apply p-6 rounded-[2.5rem] flex flex-col justify-center min-h-[140px] transition-all; }
.label-kpi { @apply text-[9px] font-[1000] uppercase tracking-widest mb-1 opacity-70; }
.number-kpi { @apply text-3xl font-[1000] italic leading-none; }
.growth-indicator { @apply text-[7px] font-black uppercase tracking-widest; }
.progress-bg { @apply w-full bg-slate-100 dark:bg-white/5 h-3 rounded-full overflow-hidden; }
.progress-bar { @apply h-full transition-all duration-1000 rounded-full; }
.admin-card { @apply bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/5 p-8 rounded-[3rem] shadow-sm; }
.header-title { @apply font-[1000] uppercase italic text-sm flex items-center gap-3 dark:text-white mb-6; }
</style>