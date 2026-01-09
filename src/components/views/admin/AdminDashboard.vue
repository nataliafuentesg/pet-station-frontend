<template>
    <div class="flex min-h-screen bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-white">

        <aside
            class="w-64 border-r border-slate-200 dark:border-white/10 p-6 flex flex-col gap-8 hidden lg:flex bg-white dark:bg-black shrink-0">
            <div class="text-xl font-[1000] uppercase italic tracking-tighter">
                <span class="text-ps-red">PS</span> <span class="text-ps-blue dark:text-white">ADMIN</span>
            </div>

            <nav class="flex flex-col gap-2">
                <button @click="currentTab = 'stats'; fetchStats()" :class="tabClass(currentTab === 'stats')">📊
                    Resumen</button>
                <button @click="currentTab = 'pedidos'; fetchPedidosAdmin()"
                    :class="tabClass(currentTab === 'pedidos')">🛍️ Ventas</button>
                <button @click="currentTab = 'mascotas'; fetchMascotas()"
                    :class="tabClass(currentTab === 'mascotas')">🐾 Pacientes</button>
                <button @click="currentTab = 'citas'; fetchCitas()" :class="tabClass(currentTab === 'citas')">📅
                    Citas</button>
                <button @click="currentTab = 'usuarios'; fetchTutores()" :class="tabClass(currentTab === 'usuarios')">👥
                    Clientes</button>
                <button @click="currentTab = 'inventario'; fetchProductos()"
                    :class="tabClass(currentTab === 'inventario')">🛒 Inventario</button>
            </nav>

            <router-link to="/"
                class="mt-auto text-[10px] font-black uppercase opacity-50 hover:opacity-100 flex items-center gap-2">
                ← Salir al Inicio
            </router-link>
        </aside>

        <main class="flex-1 p-6 md:p-12 pb-32 overflow-y-auto">
            <header class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 class="text-4xl font-[1000] uppercase italic leading-none">{{ tabTitle }}</h1>
                    <p class="text-xs font-bold opacity-50 uppercase tracking-widest mt-2">Torre de control PetStation
                    </p>
                </div>

                <div class="relative w-full md:w-80 group">
                    <span
                        class="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
                    <input v-model="searchQuery" placeholder="BUSCAR..."
                        class="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 pl-12 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:border-ps-blue outline-none transition-all shadow-xl" />
                </div>

                <button v-if="currentTab === 'inventario'" @click="abrirModalProducto()"
                    class="bg-ps-blue text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all">
                    + Agregar Producto
                </button>
            </header>

            <section v-if="currentTab === 'stats'" class="space-y-8 animate-in fade-in duration-500">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="admin-card bg-ps-blue text-white border-none shadow-blue-500/20 shadow-xl">
                        <p class="text-[10px] font-black uppercase opacity-70">Citas Totales</p>
                        <h2 class="text-4xl font-[1000] italic">{{ stats.totalCitas || 0 }}</h2>
                    </div>
                    <div class="admin-card bg-ps-red text-white border-none shadow-red-500/20 shadow-xl">
                        <p class="text-[10px] font-black uppercase opacity-70">Pacientes Registrados</p>
                        <h2 class="text-4xl font-[1000] italic">{{ stats.totalMascotas || 0 }}</h2>
                    </div>
                    <div class="admin-card bg-black text-white border-none shadow-xl">
                        <p class="text-[10px] font-black uppercase opacity-70">Clientes Activos</p>
                        <h2 class="text-4xl font-[1000] italic">{{ stats.totalClientes || 0 }}</h2>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="admin-card">
                        <h3 class="font-black uppercase italic mb-6 text-sm flex items-center gap-2">
                            <span class="w-2 h-2 bg-ps-blue rounded-full"></span> Próximas Citas
                        </h3>
                        <div class="space-y-3">
                            <div v-for="c in citas.slice(0, 5)" :key="c.id"
                                class="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border-l-4 border-ps-blue">
                                <div>
                                    <p class="text-xs font-black uppercase italic">{{ c.mascotaNombre }}</p>
                                    <p class="text-[9px] opacity-60 font-bold uppercase">{{ c.servicioTipo }}</p>
                                </div>
                                <p class="text-[10px] font-black bg-white dark:bg-black px-3 py-1 rounded-lg shadow-sm">
                                    {{ formatDate(c.fechaHora) }}</p>
                            </div>
                            <div v-if="!citas.length"
                                class="text-center py-10 opacity-30 text-[10px] font-black uppercase">No hay citas
                                pendientes</div>
                        </div>
                    </div>

                    <div class="admin-card border-orange-500/20">
                        <h3 class="font-black uppercase italic mb-6 text-sm text-orange-500 flex items-center gap-2">
                            <span class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span> Alertas de Salud
                        </h3>
                        <div class="space-y-3">
                            <div v-for="m in mascotasConAlerta.slice(0, 5)" :key="m.id"
                                class="flex items-center gap-4 p-4 bg-orange-500/5 rounded-2xl">
                                <div class="text-xl">💉</div>
                                <div>
                                    <p class="text-xs font-black uppercase">Vacuna pendiente: {{ m.nombre }}</p>
                                    <p class="text-[9px] text-orange-600 font-bold italic uppercase">Venció: {{
                                        m.ultimaVacuna || 'Sin registro' }}</p>
                                </div>
                            </div>
                            <div v-if="!mascotasConAlerta.length"
                                class="text-center py-10 opacity-30 text-[10px] font-black uppercase italic text-green-500">
                                Todo el plantel al día</div>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="currentTab === 'pedidos'" class="space-y-4 animate-in slide-in-from-bottom duration-300">
                <div v-for="order in itemsFiltrados" :key="order.id"
                    class="admin-card flex justify-between items-center border-l-8"
                    :class="order.estado === 'PENDIENTE' ? 'border-amber-400' : 'border-green-500'">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <h3 class="font-[1000] uppercase italic text-lg leading-none">{{ order.nombreCliente }}</h3>
                            <span class="text-[10px] font-black px-2 py-0.5 bg-slate-100 dark:bg-white/10 rounded">#{{ order.id }}</span>
                        </div>
                        <div class="flex gap-4 text-[10px] font-black uppercase opacity-60">
                            <span>📍 {{ order.zona || 'Sucursal' }}</span>
                            <span class="text-ps-red">💰 ${{ order.total }}</span>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-3">
                            <span v-for="i in order.items" :key="i.id" class="text-[9px] bg-slate-50 dark:bg-white/5 px-2 py-1 rounded border border-slate-100 dark:border-white/5">
                                {{ i.nombreProducto }} <span class="text-ps-blue font-black">x{{ i.cantidad }}</span>
                            </span>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <button @click="abrirModalPedido(order)" class="bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase italic shadow-xl hover:bg-ps-blue transition-all">Editar Orden</button>
                    </div>
                </div>
            </section>

            <section v-if="currentTab === 'mascotas'"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in zoom-in duration-300">
                <div v-for="m in itemsFiltrados" :key="m.id"
                    class="admin-card group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/10 overflow-hidden shrink-0 border-2 border-transparent group-hover:border-ps-blue transition-all">
                            <img v-if="m.fotoUrl" :src="m.fotoUrl" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center text-2xl">🐾</div>
                        </div>
                        <div class="min-w-0">
                            <h3 class="text-lg font-[1000] uppercase italic leading-none truncate">{{ m.nombre }}</h3>
                            <p class="text-[9px] font-black text-ps-blue uppercase tracking-tighter mt-1">{{ m.especie
                                }} | {{ m.raza }}</p>
                            <p class="text-[8px] opacity-50 font-bold uppercase truncate">Tutor: {{ m.tutorNombre }}</p>
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-2">
                        <div class="text-center bg-slate-50 dark:bg-black p-2 rounded-xl">
                            <p class="text-[7px] opacity-50 uppercase font-black">Últ. Vacuna</p>
                            <p class="text-[9px] font-black" :class="m.ultimaVacuna ? 'text-green-500' : 'text-ps-red'">
                                {{ m.ultimaVacuna || 'N/A' }}</p>
                        </div>
                        <div class="text-center bg-slate-50 dark:bg-black p-2 rounded-xl">
                            <p class="text-[7px] opacity-50 uppercase font-black">Nacimiento</p>
                            <p class="text-[9px] font-black">{{ m.fechaNacimiento || 'N/A' }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="currentTab === 'citas'" class="space-y-4">
                <div v-for="cita in itemsFiltrados" :key="cita.id"
                    class="admin-card flex justify-between items-center hover:border-ps-blue/30 transition-all">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-12 h-12 rounded-2xl bg-ps-red/10 text-ps-red flex items-center justify-center font-[1000] italic text-xl">
                            {{ cita.mascotaNombre?.charAt(0) }}
                        </div>
                        <div>
                            <h3 class="font-[1000] uppercase italic text-lg leading-none">{{ cita.mascotaNombre }} <span
                                    class="text-[10px] not-italic opacity-40 ml-2">ID: #{{ cita.id }}</span></h3>
                            <p class="text-[10px] font-black text-ps-blue uppercase mt-1">{{ cita.servicioTipo }} — {{
                                formatDate(cita.fechaHora) }}</p>
                            <p class="text-[9px] font-bold opacity-50">Tutor: {{ cita.tutorNombre }}</p>
                        </div>
                    </div>
                    <div class="flex gap-4 items-center">
                        <span
                            class="px-4 py-2 bg-ps-blue/10 text-ps-blue rounded-xl text-[10px] font-black uppercase italic">{{
                                cita.estado || 'Confirmada' }}</span>
                        <button
                            class="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-ps-red transition-all">Gestionar</button>
                    </div>
                </div>
            </section>

            <section v-if="currentTab === 'usuarios'" class="admin-card overflow-hidden p-0">
                <table class="w-full text-left">
                    <thead class="bg-slate-50 dark:bg-white/5 text-[10px] uppercase opacity-50 font-black">
                        <tr>
                            <th class="p-6">Tutor / Propietario</th>
                            <th class="p-6">Email de Contacto</th>
                            <th class="p-6 text-center">Pacientes Vinculados</th>
                        </tr>
                    </thead>
                    <tbody class="text-xs font-bold">
                        <tr v-for="tutor in itemsFiltrados" :key="tutor.id"
                            class="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all">
                            <td class="p-6 uppercase italic font-[1000] text-sm">{{ tutor.nombre }} {{ tutor.apellido }}
                            </td>
                            <td class="p-6 opacity-70 font-black tracking-tighter">{{ tutor.email }}</td>
                            <td class="p-6 flex flex-wrap justify-center gap-2">
                                <span v-for="p in tutor.mascotas" :key="p.id"
                                    class="px-3 py-1.5 bg-ps-blue text-white rounded-xl uppercase text-[8px] font-black italic shadow-lg shadow-ps-blue/20">🐾
                                    {{ p.nombre }}</span>
                                <span v-if="!tutor.mascotas?.length" class="text-[9px] opacity-30 italic">Sin
                                    mascotas</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section v-if="currentTab === 'inventario'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="prod in itemsFiltrados" :key="prod.id"
                    class="admin-card group hover:border-ps-blue/50 transition-all flex flex-col">
                    <div
                        class="h-48 mb-4 rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 relative border border-transparent group-hover:border-ps-blue/20 transition-all">
                        <img v-if="prod.fotosUrls?.length" :src="prod.fotosUrls[0]"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div
                            class="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase text-ps-red shadow-xl">
                            Stock: {{ prod.stock }}
                        </div>
                        <div
                            class="absolute bottom-3 left-3 bg-ps-blue text-white text-[8px] px-3 py-1.5 rounded-lg font-[1000] uppercase italic shadow-lg">
                            {{ prod.categoria }}
                        </div>
                    </div>
                    <h3 class="font-[1000] uppercase italic leading-tight text-lg">{{ prod.nombre }}</h3>
                    <div class="flex items-center gap-2 mb-4">
                        <p class="text-[10px] font-black opacity-40 uppercase tracking-widest">{{ prod.marca }}</p>
                        <span v-if="prod.presentacion"
                            class="text-[9px] font-black bg-ps-blue/10 text-ps-blue px-2 py-0.5 rounded uppercase">{{
                            prod.presentacion }}</span>
                    </div>

                    <div
                        class="flex justify-between items-center mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
                        <span class="text-xl font-[1000] text-ps-red italic">${{ prod.precio }}</span>
                        <div class="flex gap-2">
                            <button @click="abrirModalProducto(prod)"
                                class="w-10 h-10 flex items-center justify-center bg-ps-blue/10 text-ps-blue rounded-xl hover:bg-ps-blue hover:text-white transition-all">✏️</button>
                            <button @click="eliminarProducto(prod.id)"
                                class="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">🗑️</button>
                        </div>
                    </div>
                </div>
            </section>

            <div v-if="showModalPedido" class="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                <div class="bg-white dark:bg-[#0f0f0f] w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl max-h-[90vh] flex flex-col border border-white/5">
                    <div class="flex justify-between items-center mb-8 shrink-0">
                        <h2 class="text-3xl font-[1000] uppercase italic leading-none">Orden <span class="text-ps-red">#{{ formPedido.id }}</span></h2>
                        <button @click="showModalPedido = false" class="text-2xl opacity-50">✕</button>
                    </div>

                    <div class="mb-6 relative shrink-0">
                        <label class="label">Añadir Producto a la Venta</label>
                        <input v-model="searchProdPedido" placeholder="Escribe para buscar productos..." class="admin-input border-ps-blue/20" />
                        <div v-if="searchProdPedido && prodsResultados.length" class="absolute z-50 w-full bg-white dark:bg-[#1a1a1a] border border-white/10 rounded-2xl mt-2 shadow-2xl overflow-hidden">
                            <div v-for="p in prodsResultados" :key="p.id" @click="addProductoAPedido(p)" class="p-4 hover:bg-ps-blue/10 cursor-pointer flex justify-between items-center border-b border-white/5">
                                <span class="text-[10px] font-[1000] uppercase italic">{{ p.nombre }}</span>
                                <span class="text-ps-red font-black text-[10px]">${{ p.precio }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                        <div v-for="(item, idx) in formPedido.items" :key="idx" class="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-5 rounded-[2rem] border border-slate-100 dark:border-white/5">
                            <div class="flex-1">
                                <p class="text-[10px] font-[1000] uppercase italic leading-none mb-1">{{ item.nombreProducto }}</p>
                                <p class="text-[8px] font-black opacity-40 uppercase italic">Precio: ${{ item.precioUnitario }}</p>
                            </div>
                            <div class="flex items-center gap-3">
                                <button @click="item.cantidad > 1 ? item.cantidad-- : null" class="w-8 h-8 bg-white dark:bg-black rounded-xl border border-white/10 font-black">-</button>
                                <span class="text-xs font-[1000] w-4 text-center italic">{{ item.cantidad }}</span>
                                <button @click="item.cantidad++" class="w-8 h-8 bg-white dark:bg-black rounded-xl border border-white/10 font-black">+</button>
                            </div>
                            <button @click="formPedido.items.splice(idx, 1)" class="text-ps-red p-2 hover:bg-ps-red/10 rounded-xl transition-all">✕</button>
                        </div>
                    </div>

                    <div class="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 shrink-0">
                        <div class="flex justify-between items-end mb-8">
                            <div class="w-1/2">
                                <label class="label">Estado de la Venta</label>
                                <select v-model="formPedido.estado" class="admin-input">
                                    <option value="PENDIENTE">PENDIENTE</option>
                                    <option value="PAGADO">PAGADO</option>
                                    <option value="PAGADO">EN_CAMINO</option>
                                    <option value="PAGADO">ENTREGADO</option>
                                    <option value="CANCELADO">CANCELADO</option>
                                </select>
                            </div>
                            <div class="text-right">
                                <p class="label">Total a Cobrar</p>
                                <p class="text-4xl font-[1000] italic text-ps-red leading-none">${{ formPedido.total }}</p>
                            </div>
                        </div>
                        <button @click="guardarCambiosPedido" class="w-full bg-ps-red text-white py-6 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-widest italic shadow-xl shadow-ps-red/20">Actualizar Pedido</button>
                    </div>
                </div>
            </div>

            <div v-if="showModal"
                class="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                <div
                    class="bg-white dark:bg-[#0f0f0f] w-full max-w-3xl rounded-[3rem] p-10 shadow-2xl max-h-[90vh] overflow-y-auto border border-white/5">
                    <div class="flex justify-between items-center mb-10">
                        <h2 class="text-3xl font-[1000] uppercase italic leading-none">{{ editMode ? 'Editar' : 'Nuevo'
                            }} <span class="text-ps-red">Producto</span></h2>
                        <button @click="showModal = false"
                            class="text-2xl opacity-50 hover:opacity-100 transition-all">✕</button>
                    </div>

                    <form @submit.prevent="guardarProducto" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label class="label">Nombre del Producto</label>
                            <input v-model="formProd.nombre" class="admin-input" required
                                placeholder="Ej: Royal Canin Adulto 10kg" />
                        </div>

                        <div class="md:col-span-2">
                            <label class="label">Descripción Detallada</label>
                            <textarea v-model="formProd.descripcion" class="admin-input h-32 resize-none"
                                placeholder="Ingresa especificaciones y beneficios..."></textarea>
                        </div>

                        <div><label class="label">Precio ($)</label><input v-model.number="formProd.precio"
                                type="number" step="0.01" class="admin-input" required /></div>
                        <div>
                            <label class="label">Presentación / Medida</label>
                            <input v-model="formProd.presentacion" class="admin-input"
                                placeholder="Ej: 15 kg, 500 ml, 30 tab" />
                        </div>
                        <div>
                            <label class="label">SKU</label>
                            <input v-model="formProd.sku" class="admin-input" placeholder="Ej: 000000" />
                        </div>
                        <div>
                            <label class="label">Etapa de Vida</label>
                            <select v-model="formProd.etapaVida" class="admin-input">
                                <option value="TODOS">Todas las etapas</option>
                                <option value="CACHORRO">Cachorro / Kitten</option>
                                <option value="ADULTO">Adulto</option>
                                <option value="SENIOR">Senior</option>
                            </select>
                        </div>

                        <div>
                            <label class="label">Rango de Peso</label>
                            <select v-model="formProd.rangoPeso" class="admin-input">
                                <option value="TODOS">Cualquier peso</option>
                                <option value="RAZA PEQUEÑA">Raza Pequeña (0-10kg)</option>
                                <option value="RAZA MEDIANA">Raza Mediana (11-25kg)</option>
                                <option value="RAZA GRANDE">Raza Grande (25kg+)</option>
                            </select>
                        </div>

                        <div
                            class="md:col-span-2 flex items-center gap-4 bg-ps-red/5 p-4 rounded-2xl border border-ps-red/10">
                            <input type="checkbox" v-model="formProd.requiereReceta" class="w-5 h-5 accent-ps-red" />
                            <div>
                                <label class="font-black uppercase text-[10px] text-ps-red">Requiere Receta
                                    Médica</label>
                                <p class="text-[9px] opacity-60">Si se marca, aparecerá un aviso legal en la tienda.</p>
                            </div>
                        </div>
                        <div><label class="label">Stock Disponible</label><input v-model.number="formProd.stock"
                                type="number" class="admin-input" required /></div>

                        <div><label class="label">Marca</label><input v-model="formProd.marca" class="admin-input"
                                placeholder="Ej: Royal Canin" /></div>
                        <div>
                            <label class="label">Especie Destino</label>
                            <select v-model="formProd.especie" class="admin-input">
                                <option value="TODOS">Todos</option>
                                <option value="CANINO">Canino</option>
                                <option value="FELINO">Felino</option>
                            </select>
                        </div>

                        <div>
                            <label class="label">Categoría Principal</label>
                            <select v-model="formProd.categoria" class="admin-input">
                                <option value="NUTRICION">Nutrición</option>
                                <option value="FARMACIA">Farmacia</option>
                                <option value="ACCESORIOS">Accesorios</option>
                            </select>
                        </div>
                        <div><label class="label">Subcategoría</label><input v-model="formProd.subcategoria"
                                class="admin-input" placeholder="Ej: Medicado" /></div>

                        <div
                            class="md:col-span-2 bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-100 dark:border-white/10">
                            <label class="label text-ps-blue font-black mb-3">Galería de Imágenes (Una URL por
                                línea)</label>

                            <textarea v-model="fotosTextoTemporal"
                                class="admin-input h-32 text-[10px] font-mono leading-relaxed"
                                placeholder="Pega las URLs aquí y presiona Enter para cada una..."></textarea>

                            <div v-if="fotosPreview.length"
                                class="flex gap-4 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                                <div v-for="(url, idx) in fotosPreview" :key="idx" class="relative shrink-0">
                                    <img :src="url" class="w-16 h-16 object-cover rounded-xl border border-ps-blue/20"
                                        @error="handleImgError" />
                                </div>
                            </div>
                        </div>

                        <div class="md:col-span-2 flex justify-end gap-4 mt-8">
                            <button type="button" @click="showModal = false"
                                class="px-8 py-4 font-black uppercase text-[10px] tracking-widest opacity-50 hover:opacity-100 transition-all">Cancelar</button>
                            <button type="submit"
                                class="bg-ps-red text-white px-12 py-5 rounded-2xl font-[1000] uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-ps-red/20 italic active:scale-95 transition-all">
                                {{ editMode ? 'Actualizar Producto' : 'Publicar en Tienda' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const currentTab = ref('stats');
const showModal = ref(false);
const showModalPedido = ref(false); // NUEVO
const editMode = ref(false);
const searchQuery = ref('');
const searchProdPedido = ref(''); // NUEVO
const fotosTextoTemporal = ref('');

const tutores = ref([]);
const productos = ref([]);
const citas = ref([]);
const todasLasMascotas = ref([]);
const pedidos = ref([]); // NUEVO
const stats = ref({ totalCitas: 0, totalMascotas: 0, totalClientes: 0 });

const formProd = ref({
    id: null, nombre: '', presentacion: '', descripcion: '', precio: 0, stock: 0,
    marca: '', sku: '', especie: 'TODOS', categoria: 'NUTRICION', subcategoria: '',
    etapaVida: 'TODOS', rangoPeso: 'TODOS', fotosUrls: [], requiereReceta: false 
});

const formPedido = ref({ id: null, total: 0, estado: 'PENDIENTE', items: [] }); // NUEVO

const tabTitle = computed(() => {
    const t = { stats: 'Resumen', pedidos: 'Ventas PetStation', mascotas: 'Expedientes Pacientes', citas: 'Agenda Veterinaria', usuarios: 'Base de Clientes', inventario: 'Control de Inventario' };
    return t[currentTab.value];
});

const prodsResultados = computed(() => {
    if (!searchProdPedido.value) return [];
    return productos.value.filter(p => p.nombre.toLowerCase().includes(searchProdPedido.value.toLowerCase())).slice(0, 5);
});

watch(() => formPedido.value.items, (newItems) => {
    if (!newItems) return;
    const calculado = newItems.reduce((acc, i) => {
        return acc + (Number(i.precioUnitario) * Number(i.cantidad));
    }, 0);
    formPedido.value.total = calculado;
}, { deep: true });

const abrirModalPedido = (order) => {
    const clone = JSON.parse(JSON.stringify(order));
    
    clone.items = clone.items.map(item => ({
        ...item,
        precioUnitario: Number(item.precioSnapshot) || 0,
        cantidad: Number(item.cantidad) || 1
    }));
    
    formPedido.value = clone;
    formPedido.value.total = clone.items.reduce((acc, i) => acc + (i.precioUnitario * i.cantidad), 0);
    
    showModalPedido.value = true;
};

const addProductoAPedido = (p) => {
    formPedido.value.items.push({ 
        id: `new-${Date.now()}`, // Esto activa la lógica de 'isNew' arriba
        productoId: p.id, 
        nombreProducto: p.nombre, 
        precioUnitario: Number(p.precio) || 0, 
        cantidad: 1 
    });
    searchProdPedido.value = '';
};

const mascotasConAlerta = computed(() => {
    return todasLasMascotas.value.filter(m => !m.ultimaVacuna);
});

const itemsFiltrados = computed(() => {
    const q = searchQuery.value.toLowerCase();
    if (currentTab.value === 'pedidos') {
        return pedidos.value.filter(o => o.nombreCliente?.toLowerCase().includes(q) || o.id.toString().includes(q));
    }
    if (currentTab.value === 'inventario') {
        return productos.value.filter(p => p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q));
    }
    if (currentTab.value === 'mascotas') {
        return todasLasMascotas.value.filter(m => m.nombre.toLowerCase().includes(q) || m.tutorNombre.toLowerCase().includes(q));
    }
    if (currentTab.value === 'usuarios') {
        return tutores.value.filter(u => u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (currentTab.value === 'citas') {
        return citas.value.filter(c => c.mascotaNombre.toLowerCase().includes(q) || c.tutorNombre.toLowerCase().includes(q));
    }
    return [];
});

const fotosPreview = computed(() => {
    return fotosTextoTemporal.value.split('\n').map(url => url.trim()).filter(url => url !== '');
});

// --- FETCHERS ---
const fetchStats = async () => {
    try {
        const res = await fetch('https://api.petstationvet.com/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('ps_token')}` }
        });
        stats.value = await res.json();
        fetchCitas();
    } catch (e) { console.error(e); }
};

const fetchPedidosAdmin = async () => {
    try {
        const res = await fetch('https://api.petstationvet.com/api/pedidos/admin/lista', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('ps_token')}` }
        });
        pedidos.value = await res.json();
    } catch (e) { console.error(e); }
};


const guardarCambiosPedido = async () => {
    try {
        const payload = {
            id: formPedido.value.id,
            estado: formPedido.value.estado,
            total: formPedido.value.total,
            items: formPedido.value.items.map(item => {
                // Verificamos si es un item nuevo (ID generado por Date.now() en el frontend)
                const isNew = typeof item.id === 'string' && item.id.startsWith('new-');
                
                // Construimos el objeto base
                const itemParaEnviar = {
                    productoId: item.productoId,
                    nombreProducto: item.nombreProducto,
                    precioSnapshot: Number(item.precioUnitario),
                    cantidad: Number(item.cantidad)
                };

                // SOLO agregamos el ID si NO es nuevo
                if (!isNew) {
                    itemParaEnviar.id = item.id;
                }

                return itemParaEnviar;
            })
        };

        const url = `https://api.petstationvet.com/api/pedidos/admin/${formPedido.value.id}`;
        
        const res = await fetch(url, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${localStorage.getItem('ps_token')}` 
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            showModalPedido.value = false;
            fetchPedidosAdmin();
            alert("Venta actualizada exitosamente");
        } else {
            const errorData = await res.json();
            console.error("Respuesta error:", errorData);
            alert("Error al guardar cambios");
        }
    } catch (error) {
        console.error("Error en la conexión:", error);
    }
};

const fetchMascotas = async () => {
    try {
        const res = await fetch('https://api.petstationvet.com/api/admin/dashboard/completo', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('ps_token')}` }
        });
        const data = await res.json();
        todasLasMascotas.value = data.flatMap(t => (t.mascotas || []).map(m => ({ ...m, tutorNombre: `${t.nombre} ${t.apellido}` })));
    } catch (e) { console.error(e); }
};

const fetchCitas = async () => {
    try {
        const res = await fetch('https://api.petstationvet.com/api/admin/citas/todas', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('ps_token')}` }
        });
        citas.value = await res.json();
    } catch (e) { console.error(e); }
};

const fetchProductos = async () => {
    try {
        const res = await fetch('https://api.petstationvet.com/api/admin/productos', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('ps_token')}` }
        });
        productos.value = await res.json();
    } catch (e) { console.error(e); }
};

const fetchTutores = async () => {
    try {
        const res = await fetch('https://api.petstationvet.com/api/admin/dashboard/completo', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('ps_token')}` }
        });
        tutores.value = await res.json();
    } catch (e) { console.error(e); }
};

const abrirModalProducto = (prod = null) => {
    if (prod) {
        formProd.value = { ...prod };
        fotosTextoTemporal.value = prod.fotosUrls ? prod.fotosUrls.join('\n') : '';
        editMode.value = true;
    } else {
        formProd.value = { 
            id: null, nombre: '', presentacion: '', descripcion: '', precio: 0, stock: 0, marca: '', sku: '',
            especie: 'TODOS', categoria: 'NUTRICION', subcategoria: '', etapaVida: 'TODOS', rangoPeso: 'TODOS', 
            fotosUrls: [], requiereReceta: false 
        };
        fotosTextoTemporal.value = '';
        editMode.value = false;
    }
    showModal.value = true;
};

const guardarProducto = async () => {
    formProd.value.fotosUrls = fotosPreview.value;
    const url = `https://api.petstationvet.com/api/admin/productos${editMode.value ? '/' + formProd.value.id : ''}`;
    const res = await fetch(url, {
        method: editMode.value ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('ps_token')}` },
        body: JSON.stringify(formProd.value)
    });
    if (res.ok) {
        showModal.value = false;
        fetchProductos();
    }
};

const eliminarProducto = async (id) => {
    if (!confirm("¿Deseas eliminar permanentemente este producto?")) return;
    await fetch(`https://api.petstationvet.com/api/admin/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('ps_token')}` }
    });
    fetchProductos();
};

const handleImgError = (e) => {
    e.target.src = 'https://via.placeholder.com/150?text=URL+Invalida';
};

const formatDate = (ds) => ds ? new Date(ds).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '---';

const tabClass = (active) => [
    'px-4 py-4 rounded-2xl text-left text-[10px] font-black uppercase tracking-widest transition-all duration-300',
    active ? 'bg-ps-red text-white shadow-xl shadow-ps-red/20 translate-x-2 italic' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-ps-blue'
];

onMounted(() => {
    fetchStats();
    fetchProductos(); // Para el buscador del modal de pedidos
});
</script>

<style scoped>
@reference "../../../style.css";

.admin-card {
    @apply bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] transition-all duration-300;
}

.admin-input {
    @apply w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 p-5 rounded-2xl text-xs font-bold focus:border-ps-blue outline-none transition-all dark:text-white placeholder:opacity-30;
}

.label {
    @apply text-[9px] font-black uppercase opacity-40 block mb-2 ml-2 tracking-widest;
}

::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-thumb {
    @apply bg-ps-red/20 rounded-full;
}
</style>