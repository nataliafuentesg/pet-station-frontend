<template>
  <div class="space-y-6">
    
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
      
      <div class="stat-card border-t-ps-red">
        <p class="label-kpi">Ingresos Totales</p>
        <h2 class="number-kpi text-ps-red">${{ formatCurrency(stats.ventasTotales) }}</h2>
      </div>

      <div class="stat-card border-t-ps-blue">
        <p class="label-kpi">Citas Agendadas (Total)</p>
        <h2 class="number-kpi">{{ stats.totalCitasHistorico || 0 }}</h2>
        <div class="growth-indicator">Volumen total de servicios</div>
      </div>

      <div class="stat-card">
        <p class="label-kpi">Pedidos</p>
        <h2 class="number-kpi">{{ stats.totalPedidos || 0 }}</h2>
      </div>

      <div class="stat-card">
        <p class="label-kpi">Ticket Promedio</p>
        <h2 class="number-kpi text-ps-blue">${{ formatCurrency(stats.ticketPromedio) }}</h2>
      </div>
    </div>

    <!-- Ventas perdidas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      <div class="stat-card">
        <p class="label-kpi">Ventas Perdidas</p>
        <h2 class="number-kpi text-red-600 dark:text-red-400">${{ formatCurrency(stats.ventasPerdidasMonto) }}</h2>
        <div class="growth-indicator">{{ stats.ventasPerdidasCount || 0 }} pedidos pagados y cancelados</div>
      </div>
      <div class="stat-card">
        <p class="label-kpi">Carritos Abandonados</p>
        <h2 class="number-kpi text-amber-600 dark:text-amber-400">${{ formatCurrency(stats.carritosAbandonadosMonto) }}</h2>
        <div class="growth-indicator">{{ stats.carritosAbandonadosCount || 0 }} pedidos que nunca pagaron</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      
      <div class="admin-card">
        <h3 class="header-title">
          <span class="w-2 h-2 bg-ps-red rounded-full"></span> 
          Balance de Inventario
        </h3>
        <div class="space-y-6">
          <div class="space-y-2">
            <div class="flex justify-between text-xs font-medium text-slate-600 dark:text-white/70">
              <span>Nutrición</span>
              <span class="text-ps-blue">{{ stats.catNutricion || 0 }} unid.</span>
            </div>
            <div class="progress-bg">
              <div class="progress-bar bg-ps-blue" :style="{ width: calculatePercent(stats.catNutricion) + '%' }"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-xs font-medium text-slate-600 dark:text-white/70">
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
        <div class="space-y-1">
          <div v-for="c in (stats.agendaFutura || []).slice(0, 6)" :key="c.id" 
               class="flex justify-between items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <div>
              <p class="text-sm font-semibold dark:text-white">{{ c.mascotaNombre }}</p>
              <p class="text-xs text-slate-400 dark:text-white/40">{{ c.servicioTipo }}</p>
            </div>
            <span class="shrink-0 text-xs font-medium text-ps-blue dark:text-white/80 bg-ps-blue/[0.06] dark:bg-white/10 px-2.5 py-1 rounded-lg">
              {{ formatDate(c.fechaHora) }}
            </span>
          </div>
          <div v-if="!stats.agendaFutura?.length" class="text-center py-10 text-sm text-slate-400 dark:text-white/40">
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

const formatCurrency = (v) => Number(v || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 });

const calculatePercent = (val) => {
    const total = (props.stats.catNutricion || 0) + (props.stats.catFarmacia || 0);
    return total > 0 ? (val / total) * 100 : 0;
};

const formatDate = (ds) => ds ? new Date(ds).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '---';
</script>

<style scoped>
@reference "../../../style.css";
.stat-card { @apply p-4 md:p-5 rounded-2xl flex flex-col justify-center min-h-[104px] bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06]; }
.border-t-ps-red { @apply border-t-2 border-t-ps-red; }
.border-t-ps-blue { @apply border-t-2 border-t-ps-blue; }
.label-kpi { @apply text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-slate-500 dark:text-white/50; }
.number-kpi { @apply text-xl xl:text-2xl font-extrabold leading-tight tabular-nums text-ps-blue dark:text-white; }
.growth-indicator { @apply text-xs text-slate-400 dark:text-white/40 mt-1; }
.progress-bg { @apply w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden; }
.progress-bar { @apply h-full transition-all duration-1000 rounded-full; }
.admin-card { @apply bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] p-5 md:p-6 rounded-2xl; }
.header-title { @apply font-semibold text-sm flex items-center gap-2 text-slate-800 dark:text-white mb-5; }
</style>