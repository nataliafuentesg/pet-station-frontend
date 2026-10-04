<template>
  <div class="space-y-6 container-reveal">
    <div class="flex gap-2 mb-3 overflow-x-auto pb-2 no-scrollbar">
      <button v-for="st in ['EN PROCESO', 'COMPLETADOS', 'CANCELADOS']"
              :key="st" @click="filtroPrincipal = st"
              :class="[filtroPrincipal === st ? 'bg-ps-red text-white shadow-lg' : 'bg-white dark:bg-white/5 text-slate-400']"
              class="px-5 py-3 rounded-xl text-[9px] font-[1000] uppercase tracking-widest border border-white/5 transition-all italic whitespace-nowrap">
        {{ st }}
      </button>
    </div>
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
      <button v-for="ft in ['TODOS', 'DOMICILIO', 'ENVIO', 'PICKUP']"
              :key="ft" @click="filtroEntrega = ft"
              :class="[filtroEntrega === ft ? 'bg-[#152C77] text-white' : 'bg-white dark:bg-white/5 text-slate-400']"
              class="px-4 py-2 rounded-xl text-[8px] font-[1000] uppercase tracking-widest border border-white/5 transition-all italic whitespace-nowrap">
        {{ ft === 'PICKUP' ? '🏪 Pick-up' : ft === 'DOMICILIO' ? '🏍️ Domicilio' : ft === 'ENVIO' ? '📦 Envío' : 'Todos' }}
      </button>
    </div>

    <div v-for="order in itemsFiltrados" :key="order.id" 
         class="admin-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.02]" 
         :class="statusBorder(order.estado)">
      
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2 flex-wrap">
            <h3 class="font-[1000] uppercase italic text-base leading-none dark:text-white truncate">
              {{ order.nombre || order.nombreCliente || 'Cliente Sin Nombre' }}
            </h3>
            <span class="text-[9px] font-black px-1.5 py-0.5 bg-slate-100 dark:bg-white/10 rounded">{{ order.codigoPedido || ('#' + order.id) }}</span>
            <span v-if="order.tipoEntrega === 'PICKUP'" class="text-[8px] font-black px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg uppercase">🏪 Pick-up</span>
            <span v-if="order.tipoEntrega === 'ENVIO'" class="text-[8px] font-black px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-lg uppercase">📦 Envío nacional</span>
            <!-- Badge de estado visible -->
            <span :class="['text-[9px] font-[1000] px-2.5 py-1 rounded-lg uppercase italic flex items-center gap-1', badgeEstado(order.estado)]">
              {{ iconoEstado(order.estado) }} {{ labelEstado(order.estado) }}
            </span>
        </div>

        <div class="flex flex-wrap gap-x-4 gap-y-1 text-[9px] font-black uppercase opacity-60 italic">
            <span class="truncate max-w-[200px]">📍 {{ order.zona }}: {{ order.direccion || order.direccionEntrega }}</span>
            <a :href="'https://wa.me/' + (order.telefono || order.telefonoWhatsApp)" target="_blank" class="text-green-600 dark:text-green-400">
              📱 {{ order.telefono || order.telefonoWhatsApp }}
            </a>
            <span class="text-ps-red">💰 ${{ order.total.toLocaleString() }}</span>
            <span v-if="order.franjaEntrega" class="text-[#152C77] dark:text-blue-300">
              {{ order.franjaEntrega === 'MANANA' ? '🌅 Mañana 8-12' : '🌇 Tarde 1-5' }}
              <template v-if="order.fechaEntrega"> · {{ order.fechaEntrega }}</template>
            </span>
            <span v-if="order.quiereFactura" class="text-amber-600 dark:text-amber-400">
              🧾 Factura · {{ order.factCedula }} · {{ order.factNombre }}
            </span>
        </div>
      </div>

      <button @click="abrirModal(order)" class="btn-manage w-full md:w-auto">Gestionar</button>
    </div>

    <div v-if="showModal" class="modal-overlay">
        <div class="modal-window modal-reveal">
            
            <div class="flex justify-between items-center mb-6 shrink-0">
                <h2 class="text-2xl font-[1000] uppercase italic dark:text-white leading-none">
                  ORDEN <span class="text-ps-red">{{ form.codigoPedido || ('#' + form.id) }}</span>
                </h2>
                <button @click="showModal = false" class="btn-close-circle">✕</button>
            </div>

            <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                
                <div class="grid grid-cols-2 gap-4 p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10">
                    <div class="col-span-1">
                        <p class="label !ml-0 mb-0">Receptor</p>
                        <p class="text-[10px] font-black dark:text-white uppercase italic truncate">{{ form.nombre }}</p>
                    </div>
                    <div class="col-span-1 text-right">
                        <p class="label !ml-0 mb-0">WhatsApp</p>
                        <p class="text-[10px] font-black text-green-500 italic">{{ form.telefono }}</p>
                    </div>
                    <div class="col-span-2 border-t dark:border-white/5 pt-3 mt-1">
                        <p class="label !ml-0 mb-0">Dirección de Entrega ({{ form.zona }})</p>
                        <p class="text-[10px] font-black dark:text-white uppercase italic">{{ form.direccion }}</p>
                    </div>
                    <div class="col-span-2">
                        <p class="label !ml-0 mb-0">Correo Electrónico</p>
                        <p class="text-[10px] font-black dark:text-white opacity-50">{{ form.email }}</p>
                    </div>
                </div>

                <!-- Datos de facturación -->
                <div v-if="form.quiereFactura" class="p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 space-y-3">
                    <p class="label !ml-0 mb-0 text-ps-blue">🧾 Facturación Electrónica</p>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <p class="label !ml-0 mb-0">Cédula / NIT</p>
                            <p class="text-[10px] font-black dark:text-white uppercase italic">{{ form.factCedula || '—' }}</p>
                        </div>
                        <div>
                            <p class="label !ml-0 mb-0">Nombre / Razón Social</p>
                            <p class="text-[10px] font-black dark:text-white uppercase italic truncate">{{ form.factNombre || '—' }}</p>
                        </div>
                        <div class="col-span-2">
                            <p class="label !ml-0 mb-0">Correo para Factura</p>
                            <p class="text-[10px] font-black dark:text-white opacity-70">{{ form.factEmail || '—' }}</p>
                        </div>
                    </div>
                </div>
                <div v-else class="px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                    <p class="text-[9px] font-black uppercase opacity-40 tracking-widest">🧾 Consumidor Final — Sin factura electrónica</p>
                </div>

                <!-- Detalles de pago -->
                <div class="p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 space-y-3">
                    <p class="label !ml-0 mb-0 text-ps-red">💳 Pago</p>
                    <div class="flex items-center justify-between">
                        <span class="text-[9px] font-black uppercase opacity-50">Estado</span>
                        <span :class="['px-3 py-1 rounded-lg text-[9px] font-black uppercase italic', badgeEstado(form.estado)]">
                            {{ iconoEstado(form.estado) }} {{ labelEstado(form.estado) }}
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-[9px] font-black uppercase opacity-50">ID Transacción Bold</span>
                        <span class="text-[10px] font-bold dark:text-white">{{ form.boldPaymentId || 'No registrado' }}</span>
                    </div>
                    <div v-if="form.receptorEntrega" class="flex items-center justify-between border-t dark:border-white/5 pt-3">
                        <span class="text-[9px] font-black uppercase opacity-50">📦 Recibió</span>
                        <span class="text-[10px] font-black text-green-500 italic">{{ form.receptorEntrega }}</span>
                    </div>
                </div>

                <!-- Aviso de orden bloqueada -->
                <div v-if="!editable" class="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-400/20 rounded-2xl p-3 flex items-start gap-2">
                    <span class="text-sm shrink-0">🔒</span>
                    <p class="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase leading-relaxed">
                        Esta orden ya fue pagada. No se pueden modificar los artículos para evitar errores. Solo puedes cambiar el estado.
                    </p>
                </div>

                <!-- Agregar producto: solo si está PENDIENTE -->
                <div v-if="editable" class="relative shrink-0">
                    <label class="label">Agregar Producto</label>
                    <div class="relative">
                        <input v-model="searchProd" placeholder="Buscar por nombre..." class="admin-input-dark" />
                        <div v-if="searchProd && prodsResultados.length" class="search-dropdown custom-scrollbar">
                            <div v-for="p in prodsResultados" :key="p.id" @click="addProd(p)" class="search-result-item">
                                <span class="font-bold uppercase italic text-[10px] dark:text-white">{{ p.nombre }}</span>
                                <span class="text-ps-red font-black text-[10px]">${{ p.precio.toLocaleString() }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-3">
                    <label class="label">Artículos en la Orden</label>
                    <div v-for="(item, idx) in form.items" :key="idx" class="item-row">
                        <div class="flex-1 min-w-0">
                            <p class="text-[10px] font-[1000] uppercase italic dark:text-white truncate">{{ item.nombreProducto }}</p>
                            <div class="flex items-center gap-2 mt-0.5">
                                <span v-if="item.skuSnapshot" class="text-[8px] font-black text-ps-blue dark:text-blue-400 uppercase tracking-tighter">SKU: {{ item.skuSnapshot }}</span>
                                <span class="text-[8px] font-black opacity-40 uppercase tracking-tighter">Unit: ${{ item.precioSnapshot.toLocaleString() }}</span>
                            </div>
                        </div>
                        <!-- Editable solo si PENDIENTE -->
                        <div v-if="editable" class="flex items-center gap-3">
                            <div class="qty-controls">
                                <button @click="item.cantidad > 1 ? item.cantidad-- : null" type="button" class="qty-btn">-</button>
                                <span class="w-6 text-center text-[10px] font-black dark:text-white">{{ item.cantidad }}</span>
                                <button @click="item.cantidad++" type="button" class="qty-btn">+</button>
                            </div>
                            <button @click="form.items.splice(idx, 1)" type="button" class="text-ps-red text-xs p-1">✕</button>
                        </div>
                        <!-- Solo lectura -->
                        <span v-else class="text-[11px] font-black dark:text-white shrink-0">x{{ item.cantidad }}</span>
                    </div>
                </div>
            </div>

            <div class="mt-6 pt-6 border-t dark:border-white/10 shrink-0">
                <div class="flex justify-between items-center gap-4 mb-6">
                    <div class="w-1/2">
                        <label class="label">Estado</label>
                        <select v-model="form.estado" class="admin-input-dark !py-3 !text-[10px] font-black italic">
                            <option value="PENDIENTE">⏳ PENDIENTE</option>
                            <option value="PAGADO">💳 PAGADO</option>
                            <option value="ENTREGADO">✅ ENTREGADO</option>
                            <option value="CANCELADO">❌ CANCELADO</option>
                        </select>
                    </div>
                    <div class="text-right">
                        <p class="label !mr-0">Total Orden</p>
                        <p class="text-4xl font-[1000] italic text-ps-red leading-none tracking-tighter">${{ totalCalculado.toLocaleString() }}</p>
                    </div>
                </div>
                <!-- Verificación de código para pickup -->
                <div v-if="esPickup && form.estado === 'PAGADO'" class="mb-4 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-400/20 rounded-2xl space-y-3">
                    <p class="text-[9px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-400">🔑 Verificar Código de Retiro</p>
                    <p class="text-[9px] text-blue-600 dark:text-blue-300">Pide al cliente que muestre el código que recibió por WhatsApp.</p>
                    <div v-if="!codigoVerificado" class="flex gap-2">
                        <input v-model="codigoInput" type="text" maxlength="6" placeholder="000000"
                            class="admin-input-dark !py-2 !text-center !text-lg !font-black tracking-[0.5em] w-32" />
                        <button @click="verificarCodigo" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all">
                            Verificar
                        </button>
                    </div>
                    <p v-if="codigoError" class="text-[9px] font-black text-red-500">{{ codigoError }}</p>
                    <p v-if="codigoVerificado" class="text-[9px] font-black text-green-600 dark:text-green-400">✅ Código correcto — puedes marcar como entregado</p>
                </div>

                <button @click="guardarCambios"
                    :disabled="isSaving || !haycambios || (esPickup && form.estado === 'ENTREGADO' && !codigoVerificado && originalForm?.estado !== 'ENTREGADO')"
                    :class="['btn-save-order transition-all', (!haycambios || (esPickup && form.estado === 'ENTREGADO' && !codigoVerificado && originalForm?.estado !== 'ENTREGADO')) ? 'opacity-30 cursor-not-allowed' : '']">
                    {{ isSaving ? 'ACTUALIZANDO...' : 'GUARDAR CAMBIOS' }}
                </button>

                <!-- Cancelar y reembolsar: solo en pedidos ya pagados -->
                <button v-if="['PAGADO', 'EN_CAMINO'].includes(form.estado)"
                    @click="cancelarYReembolsar" :disabled="isSaving"
                    class="w-full mt-3 border-2 border-ps-red text-ps-red py-4 rounded-2xl font-[1000] uppercase italic text-[10px] tracking-widest hover:bg-ps-red hover:text-white active:scale-95 transition-all">
                    💸 Cancelar y Reembolsar (sin stock físico)
                </button>
            </div>
        </div>
    </div>
  </div>

  <!-- Dialog de confirmación -->
  <div v-if="confirmDialog.show" class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <div class="bg-white dark:bg-[#111] rounded-3xl p-8 max-w-sm w-full border border-white/10 space-y-6 shadow-2xl">
      <p class="text-[11px] font-black uppercase tracking-widest dark:text-white leading-relaxed">{{ confirmDialog.mensaje }}</p>
      <div class="flex gap-3">
        <button @click="confirmDialog.show = false" class="flex-1 py-3 rounded-2xl border-2 border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-slate-400 transition-all">
          Cancelar
        </button>
        <button @click="() => { confirmDialog.show = false; confirmDialog.onConfirm(); }" class="flex-1 py-3 rounded-2xl bg-ps-red text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 active:scale-95 transition-all">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import api from '@/api/axios';

const props = defineProps(['orders', 'productos', 'searchQuery']);
const emit = defineEmits(['refresh']);

const filtroPrincipal = ref('EN PROCESO');
const filtroEntrega = ref('TODOS');
const showModal = ref(false);
const searchProd = ref('');
const isSaving = ref(false);
const form = ref({ items: [] });
const originalForm = ref(null);

// Confirmación de estado
const confirmDialog = ref({ show: false, mensaje: '', onConfirm: null });

// Código de retiro para pickup
const codigoInput = ref('');
const codigoError = ref('');
const codigoVerificado = ref(false);

const itemsFiltrados = computed(() => {
    let list = props.orders || [];
    if (filtroPrincipal.value === 'EN PROCESO') {
        list = list.filter(o => ['PENDIENTE', 'PENDIENTE_FORMULA', 'PAGADO', 'EN_CAMINO'].includes(o.estado));
    } else if (filtroPrincipal.value === 'COMPLETADOS') {
        list = list.filter(o => o.estado === 'ENTREGADO');
    } else {
        list = list.filter(o => o.estado === 'CANCELADO');
    }
    if (filtroEntrega.value !== 'TODOS') {
        list = list.filter(o => (o.tipoEntrega || 'DOMICILIO') === filtroEntrega.value);
    }
    const q = (props.searchQuery || '').toLowerCase();
    return list.filter(o => (o.nombre || o.nombreCliente || '').toLowerCase().includes(q) || o.id.toString().includes(q));
});

const prodsResultados = computed(() => {
    if (!searchProd.value) return [];
    return (props.productos || []).filter(p => p.nombre.toLowerCase().includes(searchProd.value.toLowerCase())).slice(0, 5);
});

const totalCalculado = computed(() => {
    return form.value.items.reduce((acc, i) => acc + (Number(i.precioSnapshot) * Number(i.cantidad)), 0);
});

// Solo se pueden editar artículos si el pedido sigue PENDIENTE (sin pagar)
const editable = computed(() => form.value.estado === 'PENDIENTE');

const esPickup = computed(() => (form.value.direccion || '').toLowerCase().includes('recoge') || (form.value.tipoEntrega || '') === 'PICKUP');

const haycambios = computed(() => {
    if (!originalForm.value) return false;
    const o = originalForm.value;
    const f = form.value;
    if (o.estado !== f.estado) return true;
    if (o.items.length !== f.items.length) return true;
    for (let i = 0; i < f.items.length; i++) {
        if (!o.items[i] || o.items[i].cantidad !== f.items[i].cantidad || o.items[i].productoId !== f.items[i].productoId) return true;
    }
    return false;
});

const abrirModal = (order) => {
    codigoInput.value = '';
    codigoError.value = '';
    codigoVerificado.value = false;
    // Clonamos el objeto y mapeamos las llaves para que coincidan con lo que el modal espera (tu DTO)
    form.value = {
        id: order.id,
        codigoPedido: order.codigoPedido,
        nombre: order.nombre || order.nombreCliente || 'Sin Nombre',
        telefono: order.telefono || order.telefonoWhatsApp || '',
        direccion: order.direccion || order.direccionEntrega || '',
        email: order.email || order.emailCliente || '',
        zona: order.zona || 'Chía',
        estado: order.estado,
        boldPaymentId: order.boldPaymentId || null,
        receptorEntrega: order.receptorEntrega || null,
        quiereFactura: order.quiereFactura || false,
        factCedula: order.factCedula || null,
        factNombre: order.factNombre || null,
        factEmail: order.factEmail || null,
        items: (order.items || []).map(item => ({
            id: item.id,
            productoId: item.productoId,
            nombreProducto: item.nombreProducto,
            precioSnapshot: Number(item.precioSnapshot),
            cantidad: Number(item.cantidad)
        }))
    };
    originalForm.value = JSON.parse(JSON.stringify(form.value));
    showModal.value = true;
};

const addProd = (p) => {
    form.value.items.push({
        id: `new-${Date.now()}`,
        productoId: p.id,
        nombreProducto: p.nombre,
        precioSnapshot: Number(p.precio),
        cantidad: 1
    });
    searchProd.value = '';
};

const etiquetaEstado = (s) => ({ PENDIENTE: 'Pendiente', PAGADO: 'Pagado', EN_CAMINO: 'En Camino', ENTREGADO: 'Entregado', CANCELADO: 'Cancelado' }[s] || s);

const verificarCodigo = async () => {
    codigoError.value = '';
    try {
        const { data } = await api.get(`/pedidos/admin/${form.value.id}/codigo-retiro`);
        if (String(data.codigo) === String(codigoInput.value).trim()) {
            codigoVerificado.value = true;
        } else {
            codigoError.value = 'Código incorrecto. Pide al cliente que lo muestre en su WhatsApp.';
        }
    } catch (e) {
        codigoError.value = 'Error al verificar el código.';
    }
};

const confirmarAccion = (mensaje, fn) => {
    confirmDialog.value = { show: true, mensaje, onConfirm: fn };
};

const ejecutarGuardado = async () => {
    isSaving.value = true;
    try {
        const payload = {
            id: form.value.id,
            estado: form.value.estado,
            total: totalCalculado.value,
            items: form.value.items.map(item => ({
                id: (typeof item.id === 'string' && item.id.startsWith('new-')) ? null : item.id,
                productoId: item.productoId,
                nombreProducto: item.nombreProducto,
                precioSnapshot: Number(item.precioSnapshot),
                cantidad: Number(item.cantidad)
            }))
        };
        await api.put(`/pedidos/admin/${form.value.id}`, payload);

        const estadoOriginal = originalForm.value?.estado;
        if (estadoOriginal && estadoOriginal !== form.value.estado) {
            await api.patch(`/pedidos/admin/${form.value.id}/estado`, form.value.estado, {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        showModal.value = false;
        emit('refresh');
    } catch (e) {
        alert("Error al actualizar el pedido.");
    } finally { isSaving.value = false; }
};

const guardarCambios = () => {
    const estadoOriginal = originalForm.value?.estado;
    const estadoNuevo = form.value.estado;
    if (estadoOriginal && estadoOriginal !== estadoNuevo) {
        confirmarAccion(
            `¿Confirmas cambiar el estado de este pedido a "${etiquetaEstado(estadoNuevo)}"? Se notificará al cliente.`,
            ejecutarGuardado
        );
    } else {
        ejecutarGuardado();
    }
};

// Cancela un pedido pagado y dispara el flujo de reembolso (email + alerta Telegram)
const cancelarYReembolsar = async () => {
    const ok = confirm(
        `¿Cancelar y reembolsar el pedido ${form.value.codigoPedido}?\n\n` +
        `Se le avisará al cliente que le devolveremos su dinero y al equipo para procesar el reembolso en Bold. ` +
        `Esta acción no se puede deshacer.`
    );
    if (!ok) return;
    isSaving.value = true;
    try {
        // PATCH estado → CANCELADO (esto envía email de reembolso + alerta Telegram)
        await api.patch(`/pedidos/admin/${form.value.id}/estado`, 'CANCELADO', {
            headers: { 'Content-Type': 'application/json' }
        });
        showModal.value = false;
        emit('refresh');
    } catch (e) {
        alert("Error al cancelar el pedido.");
    } finally { isSaving.value = false; }
};

const statusBorder = (s) => {
    if (s === 'PENDIENTE')         return 'border-amber-400';
    if (s === 'PENDIENTE_FORMULA') return 'border-purple-400';
    if (s === 'PAGADO')            return 'border-green-600';
    if (s === 'EN_CAMINO')         return 'border-blue-500';
    if (s === 'ENTREGADO')         return 'border-green-500';
    if (s === 'CANCELADO')         return 'border-red-500';
    return 'border-ps-blue';
};

const badgeEstado = (s) => {
    if (s === 'PENDIENTE')         return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
    if (s === 'PENDIENTE_FORMULA') return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400';
    if (s === 'PAGADO')            return 'bg-green-600 text-white animate-pulse';
    if (s === 'EN_CAMINO')         return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
    if (s === 'ENTREGADO')         return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
    if (s === 'CANCELADO')         return 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400';
    return 'bg-slate-100 text-slate-500';
};

const iconoEstado = (s) => ({
    PENDIENTE: '⏳', PENDIENTE_FORMULA: '🧾', PAGADO: '💰', EN_CAMINO: '🚚', ENTREGADO: '✅', CANCELADO: '❌'
}[s] || '•');

const labelEstado = (s) => ({
    PENDIENTE: 'Pendiente Pago', PENDIENTE_FORMULA: 'Fórmula Requerida',
    PAGADO: '¡Pagado!', EN_CAMINO: 'En Camino', ENTREGADO: 'Entregado', CANCELADO: 'Cancelado'
}[s] || s);
</script>

<style scoped>
@reference "../../../style.css";

.admin-card { @apply bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 p-5 rounded-3xl transition-all; }
.btn-manage { @apply bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-xl text-[9px] font-black uppercase italic; }

.modal-overlay { @apply fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4; }
.modal-window { @apply bg-white dark:bg-[#080808] w-full max-w-xl h-full md:h-auto max-h-[90vh] rounded-[2.5rem] p-8 flex flex-col border border-white/10 overflow-hidden; }

.admin-input-dark { @apply w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl text-[10px] font-bold outline-none dark:text-white; }
.label { @apply text-[8px] font-black uppercase opacity-40 mb-1 block tracking-widest; }

.search-dropdown { @apply absolute z-10 w-full bg-white dark:bg-[#151515] border border-white/10 rounded-xl mt-1 shadow-2xl max-h-40 overflow-y-auto; }
.search-result-item { @apply p-3 hover:bg-ps-red/10 cursor-pointer flex justify-between border-b border-white/5; }

.item-row { @apply flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5; }
.qty-controls { @apply flex items-center bg-white dark:bg-black p-1 rounded-lg border border-white/10; }
.qty-btn { @apply w-6 h-6 flex items-center justify-center font-black dark:text-white; }

.btn-save-order { @apply w-full bg-ps-red text-white py-5 rounded-2xl font-black uppercase italic text-xs shadow-lg active:scale-95 transition-all; }
.btn-close-circle { @apply w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-full hover:bg-ps-red hover:text-white transition-all; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-ps-red/20 rounded-full; }
</style>