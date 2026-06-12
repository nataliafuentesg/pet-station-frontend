<template>
  <!-- Lightbox modal -->
  <div v-if="lightboxUrl" @click="lightboxUrl = null"
    class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out">
    <img :src="lightboxUrl" class="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" @click.stop />
    <button @click="lightboxUrl = null"
      class="absolute top-4 right-4 text-white text-2xl font-black bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-all">
      ×
    </button>
  </div>

  <div class="space-y-4 animate-in slide-in-from-bottom duration-300">

    <div v-if="!formulas.length" class="text-center py-16 space-y-3">
      <p class="text-4xl">🧾</p>
      <p class="text-[10px] font-black uppercase text-slate-400 dark:text-white/30 tracking-widest">
        No hay fórmulas pendientes de revisión
      </p>
    </div>

    <div v-for="f in formulas" :key="f.id"
      class="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2rem] p-5 space-y-4">

      <!-- Header -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">
            {{ formatDate(f.fechaSubida) }}
          </p>
          <h3 class="font-[1000] uppercase italic text-base dark:text-white leading-none">
            {{ f.pedido?.nombreCliente || 'Cliente' }}
          </h3>
          <p class="text-[10px] font-black text-ps-blue mt-1">
            {{ f.pedido?.codigoPedido }} · ${{ f.pedido?.total?.toLocaleString() }} COP
          </p>
        </div>
        <span class="px-3 py-1.5 rounded-xl text-[8px] font-black uppercase italic bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 shrink-0">
          ⏳ Pendiente
        </span>
      </div>

      <!-- Foto de la fórmula -->
      <div @click="lightboxUrl = f.imagenUrl"
        class="block rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 hover:opacity-90 transition-opacity cursor-zoom-in">
        <img :src="f.imagenUrl" alt="Fórmula médica"
          class="w-full max-h-64 object-contain bg-slate-50 dark:bg-white/5" />
      </div>
      <p class="text-[9px] text-center text-slate-400 -mt-2">Clic en la imagen para verla completa</p>

      <!-- Productos del pedido con checkboxes -->
      <div class="space-y-2">
        <p class="text-[8px] font-black uppercase text-slate-400 tracking-widest">
          Marca los productos cubiertos por esta fórmula:
        </p>
        <div v-for="item in f.pedido?.items" :key="item.id"
          class="flex items-center gap-3 bg-slate-50 dark:bg-white/5 rounded-xl p-3">
          <input type="checkbox" :value="item.id" v-model="aprobados[f.id]"
            class="w-4 h-4 accent-ps-blue cursor-pointer" />
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-[1000] uppercase italic dark:text-white truncate">{{ item.nombreProducto }}</p>
            <p class="text-[9px] font-black opacity-40 uppercase">
              <span v-if="item.skuSnapshot">SKU: {{ item.skuSnapshot }} · </span>
              x{{ item.cantidad }} · ${{ (item.precioSnapshot * item.cantidad).toLocaleString() }}
            </p>
          </div>
        </div>
      </div>

      <!-- Motivo de rechazo (opcional) -->
      <div>
        <label class="text-[8px] font-black uppercase text-slate-400 tracking-widest block mb-1">
          Motivo de rechazo (solo si vas a rechazar todo)
        </label>
        <input v-model="motivos[f.id]" type="text"
          placeholder="Ej: La fórmula está vencida / no corresponde al medicamento"
          class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold dark:text-white outline-none focus:ring-2 focus:ring-ps-blue" />
      </div>

      <!-- Acciones -->
      <div class="flex gap-3">
        <button @click="aprobar(f)"
          :disabled="guardando[f.id] || !aprobados[f.id]?.length"
          class="flex-1 bg-ps-blue text-white py-3.5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:bg-ps-red transition-all disabled:opacity-40">
          ✅ Aprobar seleccionados
        </button>
        <button @click="rechazar(f)"
          :disabled="guardando[f.id]"
          class="flex-1 border-2 border-ps-red text-ps-red py-3.5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:bg-ps-red hover:text-white transition-all disabled:opacity-40">
          ❌ Rechazar todo
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import api from '@/api/axios';

const props = defineProps(['formulas']);
const emit = defineEmits(['refresh']);

// Para cada fórmula: lista de item IDs marcados como aprobados
const aprobados = ref({});
const motivos = ref({});
const guardando = ref({});
const lightboxUrl = ref(null);

// Inicializar checkboxes con todos marcados por defecto
onMounted(() => {
  props.formulas.forEach(f => {
    aprobados.value[f.id] = f.pedido?.items?.map(i => i.id) || [];
    motivos.value[f.id] = '';
  });
});

const formatDate = (ds) => ds
  ? new Date(ds).toLocaleString('es-CO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '---';

const aprobar = async (formula) => {
  const ids = aprobados.value[formula.id] || [];
  const total = formula.pedido?.items?.length || 0;
  const eliminados = total - ids.length;

  const msg = eliminados > 0
    ? `Se aprobarán ${ids.length} producto(s) y se eliminarán ${eliminados} del pedido. El total se recalculará. ¿Continuar?`
    : `Se aprobarán todos los productos del pedido. ¿Continuar?`;

  const ok = await Swal.fire({
    title: '¿Aprobar fórmula?',
    text: msg,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#152C77',
    cancelButtonColor: '#DE1F27',
    confirmButtonText: 'Sí, aprobar',
    cancelButtonText: 'Cancelar',
    customClass: { popup: 'rounded-[2rem] font-sans' }
  });
  if (!ok.isConfirmed) return;

  guardando.value[formula.id] = true;
  try {
    await api.patch(`/formulas/${formula.id}/revisar`, {
      itemsAprobados: ids,
      motivoRechazo: null
    });
    Swal.fire({ icon: 'success', title: '¡Fórmula aprobada!', text: 'El cliente recibió un email para completar el pago.', timer: 2500, showConfirmButton: false });
    emit('refresh');
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.response?.data?.error || 'No se pudo aprobar.' });
  } finally {
    guardando.value[formula.id] = false;
  }
};

const rechazar = async (formula) => {
  const motivo = motivos.value[formula.id]?.trim();
  if (!motivo) {
    Swal.fire({ icon: 'warning', title: 'Falta el motivo', text: 'Escribe el motivo del rechazo para que el cliente sepa qué corregir.', customClass: { popup: 'rounded-[2rem] font-sans' } });
    return;
  }

  const ok = await Swal.fire({
    title: '¿Rechazar fórmula?',
    text: 'El pedido se cancelará y el cliente recibirá un email con el motivo.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DE1F27',
    cancelButtonColor: '#152C77',
    confirmButtonText: 'Sí, rechazar',
    cancelButtonText: 'Cancelar',
    customClass: { popup: 'rounded-[2rem] font-sans' }
  });
  if (!ok.isConfirmed) return;

  guardando.value[formula.id] = true;
  try {
    await api.patch(`/formulas/${formula.id}/revisar`, {
      itemsAprobados: [],
      motivoRechazo: motivo
    });
    Swal.fire({ icon: 'success', title: 'Fórmula rechazada', text: 'El cliente fue notificado.', timer: 2000, showConfirmButton: false });
    emit('refresh');
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.response?.data?.error || 'No se pudo rechazar.' });
  } finally {
    guardando.value[formula.id] = false;
  }
};
</script>
