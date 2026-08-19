<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 px-4 transition-colors">
    <div class="max-w-[1400px] mx-auto">

      <h1 class="text-3xl md:text-5xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white leading-none mb-8">
        FINALIZAR <span class="text-[#DE1F27]">COMPRA.</span>
      </h1>

      <!-- Banner pedido mínimo -->
      <div v-if="cartStore.totalPrice < MINIMO_DOMICILIO" class="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-400/20 rounded-2xl p-4 mb-8 flex items-start gap-3">
        <span class="text-xl shrink-0">⚠️</span>
        <div>
          <p class="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400">Pedido mínimo: ${{ MINIMO_DOMICILIO.toLocaleString() }}</p>
          <p class="text-[10px] font-bold text-amber-600 dark:text-amber-300 mt-0.5">
            Te faltan ${{ (MINIMO_DOMICILIO - cartStore.totalPrice).toLocaleString() }} · <router-link to="/tienda" class="underline">Seguir comprando</router-link>
          </p>
        </div>
      </div>

      <!-- Selector tipo de entrega -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <button type="button" @click="tipoEntrega = 'DOMICILIO'"
          :class="['rounded-2xl border-2 p-4 flex items-center gap-3 transition-all', tipoEntrega === 'DOMICILIO' ? 'border-[#152C77] bg-[#152C77] text-white' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-white hover:border-[#152C77]/40']">
          <span class="text-2xl">🏍️</span>
          <div class="text-left">
            <p class="text-[10px] font-black uppercase leading-none">Domicilio</p>
            <p class="text-[8px] font-bold mt-0.5 opacity-70">Solo Chía</p>
          </div>
        </button>
        <button type="button" @click="tipoEntrega = 'ENVIO'"
          :class="['rounded-2xl border-2 p-4 flex items-center gap-3 transition-all', tipoEntrega === 'ENVIO' ? 'border-[#152C77] bg-[#152C77] text-white' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-white hover:border-[#152C77]/40']">
          <span class="text-2xl">📦</span>
          <div class="text-left">
            <p class="text-[10px] font-black uppercase leading-none">Envío nacional</p>
            <p class="text-[8px] font-bold mt-0.5 opacity-70">Todo el país</p>
          </div>
        </button>
        <button type="button" @click="tipoEntrega = 'PICKUP'"
          :class="['rounded-2xl border-2 p-4 flex items-center gap-3 transition-all', tipoEntrega === 'PICKUP' ? 'border-[#DE1F27] bg-[#DE1F27] text-white' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-white hover:border-[#DE1F27]/40']">
          <span class="text-2xl">🏪</span>
          <div class="text-left">
            <p class="text-[10px] font-black uppercase leading-none">Recoger en tienda</p>
            <p class="text-[8px] font-bold mt-0.5 opacity-70">Sin costo</p>
          </div>
        </button>
      </div>

      <!-- Banner logística: DOMICILIO -->
      <div v-if="tipoEntrega === 'DOMICILIO'" class="bg-[#152C77]/5 dark:bg-white/5 border border-[#152C77]/10 dark:border-white/10 rounded-2xl p-4 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
        <div>
          <p class="text-lg">🏍️</p>
          <p class="text-[9px] font-black uppercase text-[#152C77] dark:text-white">
            Domicilio en Chía · ${{ configStore.costoEnvioChia.toLocaleString() }}
          </p>
          <p class="text-[8px] font-bold text-slate-400">Gratis en compras desde ${{ configStore.envioGratisDesde.toLocaleString() }}</p>
        </div>
        <div>
          <p class="text-lg">📅</p>
          <p class="text-[9px] font-black uppercase text-[#152C77] dark:text-white">{{ mensajeEntrega }}</p>
          <p class="text-[8px] font-bold text-slate-400">sin domicilios domingos ni festivos</p>
        </div>
      </div>

      <!-- Banner logística: ENVÍO NACIONAL -->
      <div v-else-if="tipoEntrega === 'ENVIO'" class="bg-[#152C77]/5 dark:bg-white/5 border border-[#152C77]/10 dark:border-white/10 rounded-2xl p-4 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div>
          <p class="text-lg">📦</p>
          <p class="text-[9px] font-black uppercase text-[#152C77] dark:text-white">Envío a todo el país</p>
          <p class="text-[8px] font-bold text-slate-400">Via transportadora</p>
        </div>
        <div>
          <p class="text-lg">💵</p>
          <p class="text-[9px] font-black uppercase text-[#152C77] dark:text-white">Flete cobrado a la entrega</p>
          <p class="text-[8px] font-bold text-slate-400">Lo cobra la transportadora</p>
        </div>
        <div>
          <p class="text-lg">⏱️</p>
          <p class="text-[9px] font-black uppercase text-[#152C77] dark:text-white">Tiempos según destino</p>
          <p class="text-[8px] font-bold text-slate-400">Depende de la transportadora</p>
        </div>
      </div>

      <!-- Banner logística: PICKUP -->
      <div v-else class="bg-[#DE1F27]/5 dark:bg-[#DE1F27]/10 border border-[#DE1F27]/20 rounded-2xl p-4 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div>
          <p class="text-lg">🏪</p>
          <p class="text-[9px] font-black uppercase text-[#DE1F27]">Sin costo de envío</p>
          <p class="text-[8px] font-bold text-slate-400">Pagas en línea, recoges en tienda</p>
        </div>
        <div>
          <p class="text-lg">⏰</p>
          <p class="text-[9px] font-black uppercase text-[#DE1F27]">Lun–Sáb · 8am a 6pm</p>
          <p class="text-[8px] font-bold text-slate-400">Vía Guaymaral 2km, Chía</p>
        </div>
        <div>
          <p class="text-lg">🎫</p>
          <p class="text-[9px] font-black uppercase text-[#DE1F27]">Trae tu código de pedido</p>
          <p class="text-[8px] font-bold text-slate-400">Te lo enviamos por correo al pagar</p>
        </div>
      </div>

      <!-- Panel de pago: aparece tras confirmar el pedido (independiente del carrito) -->
      <div v-if="boldListo" class="max-w-md mx-auto bg-[#152C77] rounded-[3rem] p-10 text-white text-center shadow-2xl">
        <span class="text-4xl">✅</span>
        <h2 class="text-2xl font-[1000] uppercase italic mt-3 mb-1">Pedido Confirmado</h2>
        <p class="text-[10px] font-black uppercase tracking-widest text-green-400 mb-8">Paga para finalizar</p>
        <div ref="boldContainer" class="flex justify-center mb-4"></div>
        <p class="text-[8px] font-bold text-white/40 uppercase leading-relaxed">
          Pago seguro con Bold · Tarjeta · PSE · Nequi · Daviplata
        </p>
      </div>

      <div v-else-if="cartStore.items.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-12">

        <div class="lg:col-span-7 space-y-8">

          <div class="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5">
            <h2 class="text-2xl font-[1000] uppercase italic text-[#152C77] dark:text-white mb-8">{{ tipoEntrega === 'PICKUP' ? '1. Tus Datos' : '1. Datos de Envío' }}</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nombre Completo *</label>
                <input v-model="form.nombre" type="text" placeholder="Ej: Juan Pérez"
                  :class="['w-full bg-white dark:bg-black border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all', errores.nombre ? 'border-[#DE1F27]' : 'border-slate-200 dark:border-white/10 focus:border-[#DE1F27]']" />
                <p v-if="errores.nombre" class="text-[10px] text-[#DE1F27] font-bold ml-2">{{ errores.nombre }}</p>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Teléfono WhatsApp *</label>
                <input v-model="form.telefono" type="tel" placeholder="Ej: 310 000 0000"
                  :class="['w-full bg-white dark:bg-black border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all', errores.telefono ? 'border-[#DE1F27]' : 'border-slate-200 dark:border-white/10 focus:border-[#DE1F27]']" />
                <p v-if="errores.telefono" class="text-[10px] text-[#DE1F27] font-bold ml-2">{{ errores.telefono }}</p>
              </div>

              <div v-if="tipoEntrega === 'DOMICILIO' || tipoEntrega === 'ENVIO'" class="md:col-span-2 space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  {{ tipoEntrega === 'ENVIO' ? 'Dirección completa *' : 'Dirección de Entrega *' }}
                </label>
                <input v-model="form.direccion" type="text"
                  :placeholder="tipoEntrega === 'ENVIO' ? 'Calle, Número, Barrio' : 'Calle, Número, Barrio'"
                  :class="['w-full bg-white dark:bg-black border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all', errores.direccion ? 'border-[#DE1F27]' : 'border-slate-200 dark:border-white/10 focus:border-[#DE1F27]']" />
                <p v-if="errores.direccion" class="text-[10px] text-[#DE1F27] font-bold ml-2">{{ errores.direccion }}</p>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Correo *</label>
                <input v-model="form.email" type="email" placeholder="tu@correo.com"
                  :class="['w-full bg-white dark:bg-black border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all', errores.email ? 'border-[#DE1F27]' : 'border-slate-200 dark:border-white/10 focus:border-[#DE1F27]']" />
                <p v-if="errores.email" class="text-[10px] text-[#DE1F27] font-bold ml-2">{{ errores.email }}</p>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Confirmar correo *</label>
                <input v-model="form.emailConfirm" type="email" placeholder="repite tu correo" @paste.prevent
                  :class="['w-full bg-white dark:bg-black border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all', errores.emailConfirm ? 'border-[#DE1F27]' : 'border-slate-200 dark:border-white/10 focus:border-[#DE1F27]']" />
                <p v-if="errores.emailConfirm" class="text-[10px] text-[#DE1F27] font-bold ml-2">{{ errores.emailConfirm }}</p>
              </div>

              <!-- DOMICILIO Chía: barrio libre -->
              <div v-if="tipoEntrega === 'DOMICILIO'" class="md:col-span-2 space-y-3">
                <div class="bg-[#152C77]/5 dark:bg-white/5 rounded-xl p-3 flex items-start gap-2 border border-[#152C77]/10 dark:border-white/5">
                  <span class="text-sm shrink-0">🏍️</span>
                  <p class="text-[9px] font-bold text-slate-500 dark:text-white/40 uppercase leading-relaxed">
                    Domicilio disponible únicamente en <strong class="text-[#152C77] dark:text-white">Chía</strong>.
                    Si estás en otra ciudad usa <strong class="text-[#152C77] dark:text-white">Envío nacional</strong>.
                  </p>
                </div>
                <div class="space-y-1">
                  <label class="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">¿En qué barrio o sector de Chía?</label>
                  <input v-model="barrioLibre" type="text" placeholder="Ej: La Balsa, Fonquetá, Centro..."
                    @input="form.zona = 'Chía' + (barrioLibre ? ' · ' + barrioLibre : '')"
                    class="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold dark:text-white focus:border-[#152C77] outline-none transition-all" />
                </div>
                <p v-if="errores.zona" class="text-[10px] text-[#DE1F27] font-bold ml-2">{{ errores.zona }}</p>
              </div>

              <!-- ENVÍO NACIONAL: ciudad + departamento -->
              <div v-if="tipoEntrega === 'ENVIO'" class="md:col-span-2 space-y-3">
                <div class="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3 flex items-start gap-2 border border-amber-200 dark:border-amber-400/20">
                  <span class="text-sm shrink-0">💵</span>
                  <p class="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase leading-relaxed">
                    El costo del flete lo cobra la transportadora directamente a la entrega.
                    Los tiempos dependen del destino.
                  </p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">Ciudad *</label>
                    <input v-model="ciudadEnvio" type="text" placeholder="Ej: Medellín, Cali, Barranquilla..."
                      @input="form.zona = ciudadEnvio + (deptoEnvio ? ', ' + deptoEnvio : '')"
                      :class="['w-full bg-white dark:bg-black border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all', errores.zona ? 'border-[#DE1F27]' : 'border-slate-200 dark:border-white/10 focus:border-[#152C77]']" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">Departamento *</label>
                    <input v-model="deptoEnvio" type="text" placeholder="Ej: Antioquia, Valle, Atlántico..."
                      @input="form.zona = ciudadEnvio + (deptoEnvio ? ', ' + deptoEnvio : '')"
                      :class="['w-full bg-white dark:bg-black border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all', errores.zona ? 'border-[#DE1F27]' : 'border-slate-200 dark:border-white/10 focus:border-[#152C77]']" />
                  </div>
                </div>
                <p v-if="errores.zona" class="text-[10px] text-[#DE1F27] font-bold ml-2">{{ errores.zona }}</p>
              </div>

              <!-- Info pick-up -->
              <div v-if="tipoEntrega === 'PICKUP'" class="md:col-span-2 bg-[#DE1F27]/5 dark:bg-[#DE1F27]/10 border border-[#DE1F27]/20 rounded-2xl p-5 space-y-3">
                <p class="text-[10px] font-black uppercase text-[#DE1F27] tracking-widest">📍 Punto de recogida</p>
                <p class="text-sm font-bold text-slate-700 dark:text-white">Vía Guaymaral 2km — Variante Chía-Cota, Vereda La Balsa</p>
                <div class="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  <span>⏰ Lun–Vie: 8am – 6pm</span>
                  <span>⏰ Sábado: 9am – 4pm</span>
                </div>
                <p class="text-[9px] font-bold text-slate-400 uppercase">Presenta tu código de pedido al llegar · Sin domicilio en este modo</p>
              </div>

              <!-- Franja de entrega con cupos -->
              <div v-if="tipoEntrega === 'DOMICILIO'" class="space-y-3 pt-2">
                <div class="flex items-center justify-between">
                  <label class="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">
                    Franja de entrega
                  </label>
                  <span v-if="cargandoCupos" class="text-[8px] font-bold opacity-40 uppercase">Consultando disponibilidad...</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <button v-for="franja in franjasDisponibles" :key="franja.key" type="button"
                    @click="!franja.lleno && (form.franja = franja.key)"
                    :disabled="franja.lleno"
                    :class="[
                      'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 transition-all text-left w-full',
                      form.franja === franja.key
                        ? 'border-[#152C77] bg-[#152C77] text-white'
                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-[#152C77]',
                      franja.lleno ? 'opacity-40 cursor-not-allowed' : ''
                    ]">
                    <span class="text-base shrink-0">{{ franja.emoji }}</span>
                    <div class="flex-1 min-w-0">
                      <p class="text-[9px] font-black uppercase leading-tight tracking-wide">{{ franja.label }}</p>
                      <p class="text-[8px] font-bold opacity-60 leading-tight">{{ franja.hora }}</p>
                    </div>
                    <div class="text-right shrink-0">
                      <p class="text-[8px] font-black leading-tight"
                        :class="franja.fecha === hoyStr
                          ? (form.franja === franja.key ? 'text-green-300' : 'text-green-500')
                          : (form.franja === franja.key ? 'text-amber-200' : 'text-amber-500')">
                        {{ franja.fechaLabel }}
                      </p>
                      <p v-if="franja.lleno" class="text-[7px] font-black text-red-400 uppercase leading-tight">Lleno</p>
                      <p v-else class="text-[7px] font-bold opacity-50 leading-tight">{{ franja.disponibles }} cupos</p>
                    </div>
                  </button>
                </div>
                <p v-if="errores.franja" class="text-[10px] text-[#DE1F27] font-bold ml-2">{{ errores.franja }}</p>
              </div>
            </div>
          </div>

          <!-- Factura electrónica -->
          <div class="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 space-y-5">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-[1000] uppercase italic text-[#152C77] dark:text-white">2. Factura</h2>
              <button type="button" @click="form.quiereFactura = !form.quiereFactura"
                class="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-colors"
                :class="form.quiereFactura ? 'text-[#152C77] dark:text-white' : 'text-slate-400'">
                <div class="w-10 h-5 rounded-full transition-colors relative"
                  :class="form.quiereFactura ? 'bg-[#152C77]' : 'bg-slate-200 dark:bg-white/10'">
                  <div class="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow"
                    :class="form.quiereFactura ? 'left-5' : 'left-0.5'"></div>
                </div>
                {{ form.quiereFactura ? 'Sí, quiero factura' : 'No, consumidor final' }}
              </button>
            </div>

            <p class="text-[9px] font-bold text-slate-400 uppercase">
              Si no solicitas factura, tu compra se registra a <strong>Consumidor Final</strong>. Guarda tu factura — la necesitarás para cambios o devoluciones.
            </p>

            <div v-if="form.quiereFactura" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-1">Cédula o NIT *</label>
                  <input v-model="form.factCedula" type="text" placeholder="Ej: 1234567890 o 900123456-1"
                    class="w-full bg-white dark:bg-black border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all"
                    :class="errores.factCedula ? 'border-[#DE1F27]' : 'border-slate-200 dark:border-white/10 focus:border-[#152C77]'" />
                  <p v-if="errores.factCedula" class="text-[10px] text-[#DE1F27] font-bold mt-1">{{ errores.factCedula }}</p>
                </div>
                <div>
                  <label class="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-1">Nombre o Razón Social *</label>
                  <input v-model="form.factNombre" type="text" placeholder="Ej: Juan Pérez o Mi Empresa S.A.S"
                    class="w-full bg-white dark:bg-black border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all"
                    :class="errores.factNombre ? 'border-[#DE1F27]' : 'border-slate-200 dark:border-white/10 focus:border-[#152C77]'" />
                  <p v-if="errores.factNombre" class="text-[10px] text-[#DE1F27] font-bold mt-1">{{ errores.factNombre }}</p>
                </div>
              </div>
              <div>
                <label class="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-1">Correo para recibir la factura *</label>
                <input v-model="form.factEmail" type="email" placeholder="facturacion@correo.com"
                  class="w-full bg-white dark:bg-black border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all"
                  :class="errores.factEmail ? 'border-[#DE1F27]' : 'border-slate-200 dark:border-white/10 focus:border-[#152C77]'" />
                <p v-if="errores.factEmail" class="text-[10px] text-[#DE1F27] font-bold mt-1">{{ errores.factEmail }}</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 space-y-4">
            <h2 class="text-2xl font-[1000] uppercase italic text-[#152C77] dark:text-white">3. Pago</h2>

            <!-- Bold — único método en la web -->
            <div class="bg-white dark:bg-white/5 rounded-2xl p-5 border-2 border-[#152C77] flex items-center gap-4">
              <div class="w-12 h-12 bg-[#152C77] rounded-xl flex items-center justify-center text-white text-xl shrink-0">💳</div>
              <div class="flex-1">
                <p class="text-[11px] font-black uppercase text-[#152C77] dark:text-white">Pago en línea seguro</p>
                <p class="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Tarjeta débito / crédito · PSE · Nequi · Daviplata</p>
              </div>
              <span class="text-[8px] font-black uppercase bg-[#152C77] text-white px-2 py-1 rounded-lg">Bold</span>
            </div>

            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wide text-center">
              ¿Prefieres pagar en efectivo o por transferencia?
              <a href="https://wa.me/573053462413?text=Hola%20Pet%20Station!%20Quiero%20hacer%20un%20pedido%20y%20pagar%20en%20efectivo%20o%20transferencia."
                target="_blank" class="text-[#25D366] underline ml-1">Escríbenos por WhatsApp →</a>
            </p>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="bg-[#152C77] rounded-[3rem] p-10 text-white sticky top-32 shadow-2xl">
            <h2 class="text-3xl font-[1000] uppercase italic mb-8">Tu Pedido</h2>

            <div class="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-4 no-scrollbar">
              <div v-for="item in cartStore.items" :key="item.id" class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-xl bg-white/10 overflow-hidden shrink-0">
                  <img :src="item.fotosUrls?.[0]" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                  <p class="text-[11px] font-black uppercase leading-tight">{{ item.nombre }}</p>
                  <p class="text-[10px] opacity-60 font-bold">{{ item.quantity }} x ${{ item.precio.toLocaleString() }}</p>
                </div>
                <p class="text-sm font-black italic">${{ (item.precio * item.quantity).toLocaleString() }}</p>
              </div>
            </div>

            <div class="space-y-4 border-t border-white/10 pt-8">
              <div class="flex justify-between text-sm font-bold opacity-60">
                <span>Subtotal</span>
                <span>${{ cartStore.totalPrice.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm font-bold opacity-60">
                <span>{{ tipoEntrega === 'PICKUP' ? 'Recogida' : tipoEntrega === 'ENVIO' ? 'Envío' : 'Domicilio' }}</span>
                <span v-if="tipoEntrega === 'PICKUP'" class="text-green-400 uppercase">Sin costo</span>
                <span v-else-if="tipoEntrega === 'ENVIO'" class="text-amber-400 uppercase text-[10px]">Contraentrega transportadora</span>
                <span v-else-if="costoEnvio === 0" class="text-green-400 uppercase">Gratis</span>
                <span v-else>${{ costoEnvio.toLocaleString() }}</span>
              </div>
              <div v-if="tipoEntrega === 'DOMICILIO' && costoEnvio > 0" class="text-[9px] font-bold text-white/40 -mt-2">
                Gratis desde ${{ configStore.envioGratisDesde.toLocaleString() }}
              </div>
              <div class="flex justify-between items-end pt-4">
                <span class="text-xl font-[1000] uppercase italic">Total</span>
                <span class="text-4xl font-[1000] italic text-[#DE1F27]">${{ totalConEnvio.toLocaleString() }}</span>
              </div>
            </div>

            <button
              @click="procesarCompra"
              :disabled="loading"
              class="w-full bg-[#DE1F27] hover:bg-white hover:text-[#DE1F27] text-white mt-10 py-6 rounded-2xl font-[1000] uppercase italic tracking-tighter transition-all active:scale-95 disabled:opacity-50 disabled:animate-pulse">
              {{ loading ? 'Procesando...' : 'Confirmar Pedido' }}
            </button>
          </div>
        </div>

      </div>

      <div v-else-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center py-20">
        <span class="text-9xl mb-8">🛒</span>
        <h2 class="text-4xl font-[1000] uppercase italic text-[#152C77] dark:text-white mb-8">Tu carrito está vacío</h2>
        <router-link to="/tienda" class="bg-[#DE1F27] text-white px-10 py-5 rounded-2xl font-black uppercase italic tracking-tighter hover:scale-105 transition-transform">
          Volver a la Tienda
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, Transition } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCartStore } from '../../stores/cartStore';
import api from '../../api/axios';
import Swal from 'sweetalert2';
import { useConfigStore } from '../../stores/configStore';
import { useTracking } from '@/composables/useTracking';

const { trackInicioCheckout, trackCompraCompletada } = useTracking();

const cartStore = useCartStore();
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const emit = defineEmits(['notify']);
const tipoEntrega = ref('DOMICILIO');

// Estado del botón de pago Bold embebido
const boldListo = ref(false);
const boldContainer = ref(null);

const configStore = useConfigStore();
const MINIMO_DOMICILIO = computed(() => configStore.pedidoMinimo);

const costoEnvio = computed(() => {
  if (tipoEntrega.value === 'PICKUP') return 0;
  if (tipoEntrega.value === 'ENVIO') return 0; // lo cobra la transportadora
  // DOMICILIO Chía
  if (cartStore.totalPrice >= configStore.envioGratisDesde) return 0;
  return configStore.costoEnvioChia;
});
const totalConEnvio = computed(() => cartStore.totalPrice + costoEnvio.value);

// Barrio para domicilio Chía
const barrioLibre = ref('');

// Ciudad y departamento para envío nacional
const ciudadEnvio = ref('');
const deptoEnvio  = ref('');

// Festivos Colombia 2025-2026 (Ley Emiliani) — respaldo si el back no responde
const FESTIVOS_LOCAL = new Set([
  '2025-08-07','2025-08-18','2025-10-13','2025-11-03','2025-11-17',
  '2025-12-08','2025-12-25','2026-01-01','2026-01-12','2026-03-23',
  '2026-04-02','2026-04-03','2026-05-01','2026-05-18','2026-06-08',
  '2026-06-29','2026-07-20','2026-08-07','2026-08-17','2026-10-12',
  '2026-11-02','2026-11-16','2026-12-08','2026-12-25',
]);

const esDiaHabilLocal = (d) => {
  const iso = d.toISOString().split('T')[0];
  return d.getDay() !== 0 && !FESTIVOS_LOCAL.has(iso);
};

const calcularFechaEntrega = () => {
  const ahora = new Date();
  const corte = new Date(ahora); corte.setHours(14, 0, 0, 0);
  const d = new Date(ahora);
  if (ahora >= corte) { d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); }
  while (!esDiaHabilLocal(d)) d.setDate(d.getDate() + 1);
  return d;
};

// El mensaje de entrega lo dicta el BACK (incluye festivos colombianos).
// Si la llamada falla, usamos el cálculo local como respaldo (salta domingos y festivos).
const mensajeEntrega = ref('Calculando entrega...');

const mensajeEntregaLocal = () => {
  const entrega = calcularFechaEntrega();
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const manana = new Date(hoy); manana.setDate(hoy.getDate() + 1);
  entrega.setHours(0,0,0,0);
  if (entrega.getTime() === hoy.getTime()) return 'Entrega HOY en la tarde';
  if (entrega.getTime() === manana.getTime()) return 'Entrega MAÑANA';
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `Entrega el ${dias[entrega.getDay()]} ${entrega.getDate()} ${meses[entrega.getMonth()]}`;
};


// Cupos de domicilio
const cargandoCupos = ref(false);
const cuposData = ref([]);
const _hoyBogota = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }));
const hoyStr = `${_hoyBogota.getFullYear()}-${String(_hoyBogota.getMonth()+1).padStart(2,'0')}-${String(_hoyBogota.getDate()).padStart(2,'0')}`;

// Fecha del próximo día hábil para entregas (respeta corte 2pm y festivos)
const fechaFallback = () => {
  const ahora = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }));
  const d = new Date(ahora);
  if (ahora.getHours() >= 14) { d.setDate(d.getDate() + 1); }
  while (!esDiaHabilLocal(d)) d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const franjasDisponibles = computed(() => {
  const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

  if (!cuposData.value.length) return [];

  return cuposData.value
    .map(c => {
      const d = new Date(c.fecha + 'T12:00:00');
      const fechaLabel = c.fecha === hoyStr ? 'Hoy' : `${dias[d.getDay()]} ${d.getDate()} ${meses[d.getMonth()]}`;
      return {
        key: `${c.fecha}|${c.franja}`,
        fecha: c.fecha,
        fechaLabel,
        emoji: c.franja === 'MANANA' ? '🌅' : '🌇',
        label: c.franja === 'MANANA' ? 'Mañana' : 'Tarde',
        hora: c.franja === 'MANANA' ? '8am – 12pm' : '12pm – 6pm',
        disponibles: c.disponibles,
        lleno: c.lleno,
      };
    });
});

const cargarCupos = async () => {
  cargandoCupos.value = true;
  try {
    // El backend ya filtra: domingos, festivos y corte 2pm hora Bogotá.
    // El frontend solo pinta lo que recibe.
    const { data } = await api.get('/domicilios/cupos/disponibilidad');
    cuposData.value = data;
  } catch {
    // Fallback: calcular el próximo día hábil correctamente (respeta corte 2pm)
    const fecha = fechaFallback();
    cuposData.value = [
      { franja: 'MANANA', fecha, disponibles: 10, lleno: false },
      { franja: 'TARDE',  fecha, disponibles: 10, lleno: false },
    ];
  } finally {
    cargandoCupos.value = false;
  }
};

const form = reactive({
  nombre: '',
  telefono: '',
  direccion: '',
  email: '',
  emailConfirm: '',
  zona: '',
  franja: '',
  quiereFactura: false,
  factCedula: '',
  factNombre: '',
  factEmail: '',
});

const errores = reactive({ nombre: '', telefono: '', direccion: '', email: '', emailConfirm: '', zona: '', franja: '', factCedula: '', factNombre: '', factEmail: '' });

// Pre-llena el formulario con los datos del usuario logueado (editable)
const prellenarDatos = () => {
  try {
    const sessionStr = localStorage.getItem('ps_session');
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    const tutor = session?.tutor || session;
    if (!tutor) return;
    form.nombre = [tutor.nombre, tutor.apellido].filter(Boolean).join(' ').trim();
    form.telefono = tutor.telefono || '';
    form.direccion = tutor.direccion || '';
    form.email = tutor.email || '';
    form.emailConfirm = tutor.email || ''; // si viene de su cuenta, ya está confirmado
  } catch (e) { /* invitado: queda vacío */ }
};

onMounted(async () => {
  // Modo "retomar pedido existente" — viene del email de fórmula aprobada
  const codigoRetomar = route.query.retomar;
  if (codigoRetomar) {
    loading.value = true;
    try {
      // Buscar el pedido por código
      const sessionStr = localStorage.getItem('ps_session');
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      const tutorId = session?.tutor?.id || session?.id || null;

      let pedidoId = null;
      if (tutorId) {
        const { data: pedidos } = await api.get(`/pedidos/tutor/${tutorId}`);
        const pedido = pedidos.find(p => p.codigoPedido === codigoRetomar && p.estado === 'PENDIENTE');
        if (pedido) pedidoId = pedido.id;
      }

      if (!pedidoId) {
        Swal.fire({ icon: 'warning', title: 'Pedido no encontrado', text: 'No encontramos un pedido pendiente con ese código. Puede que ya haya sido pagado o cancelado.', customClass: { popup: 'rounded-[2rem] font-sans' } });
        loading.value = false;
        return;
      }

      // Ir directo al botón Bold sin crear nuevo pedido
      const { data: bold } = await api.post('/pagos/bold/datos-boton', { pedidoId });
      boldListo.value = true;
      await nextTick();
      const script = document.createElement('script');
      script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
      script.setAttribute('data-bold-button', '');
      script.setAttribute('data-order-id', bold.orderId);
      script.setAttribute('data-currency', bold.currency);
      script.setAttribute('data-amount', bold.amount);
      script.setAttribute('data-api-key', bold.apiKey);
      script.setAttribute('data-integrity-signature', bold.integritySignature);
      script.setAttribute('data-redirection-url', bold.redirectUrl);
      script.setAttribute('data-description', `Pedido Pet Station ${codigoRetomar}`);
      boldContainer.value.appendChild(script);
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar el pago. Intenta de nuevo.' });
    } finally {
      loading.value = false;
    }
    return; // no continuar con el flujo normal
  }

  trackInicioCheckout(cartStore.totalPrice, cartStore.items.length);
  prellenarDatos();
  cargarCupos();
  try {
    const { data } = await api.get('/pedidos/info-entrega');
    mensajeEntrega.value = data.mensajeEntrega || mensajeEntregaLocal();
  } catch (e) {
    mensajeEntrega.value = mensajeEntregaLocal();
  }
});

const validar = () => {
  errores.nombre = '';
  errores.telefono = '';
  errores.direccion = '';
  errores.email = '';
  errores.emailConfirm = '';
  errores.zona = '';
  errores.franja = '';
  errores.factCedula = '';
  errores.factNombre = '';
  errores.factEmail = '';
  let ok = true;

  if (cartStore.totalPrice < MINIMO_DOMICILIO.value) {
    emit('notify', { msg: `El pedido mínimo para domicilio es $${MINIMO_DOMICILIO.value.toLocaleString()}`, type: 'warning' });
    return false;
  }

  if (!form.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio';
    ok = false;
  }

  // Correo obligatorio + formato + confirmación
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) {
    errores.email = 'El correo es obligatorio';
    ok = false;
  } else if (!emailRegex.test(form.email.trim())) {
    errores.email = 'Correo inválido. Revisa el formato';
    ok = false;
  }
  if (form.email.trim().toLowerCase() !== form.emailConfirm.trim().toLowerCase()) {
    errores.emailConfirm = 'Los correos no coinciden';
    ok = false;
  }

  const tel = form.telefono.replace(/\s/g, '');
  if (!tel) {
    errores.telefono = 'El teléfono es obligatorio';
    ok = false;
  } else if (!/^\d{10}$/.test(tel)) {
    errores.telefono = 'Ingresa un número de 10 dígitos';
    ok = false;
  }

  if (tipoEntrega.value === 'DOMICILIO') {
    if (!form.direccion.trim()) {
      errores.direccion = 'La dirección de entrega es obligatoria';
      ok = false;
    }
    if (!form.zona) {
      errores.zona = 'Ingresa tu barrio o sector en Chía';
      ok = false;
    }
    if (!form.franja) {
      errores.franja = 'Selecciona la franja de entrega';
      ok = false;
    }
  }

  if (tipoEntrega.value === 'ENVIO') {
    if (!form.direccion.trim()) {
      errores.direccion = 'La dirección de entrega es obligatoria';
      ok = false;
    }
    if (!ciudadEnvio.value.trim() || !deptoEnvio.value.trim()) {
      errores.zona = 'Ingresa la ciudad y el departamento de destino';
      ok = false;
    }
  }

  if (form.quiereFactura) {
    if (!form.factCedula.trim()) { errores.factCedula = 'Ingresa tu cédula o NIT'; ok = false; }
    if (!form.factNombre.trim()) { errores.factNombre = 'Ingresa el nombre o razón social'; ok = false; }
    if (!form.factEmail.trim()) { errores.factEmail = 'Ingresa el correo para la factura'; ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.factEmail.trim())) { errores.factEmail = 'Correo inválido'; ok = false; }
  }

  return ok;
};

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

const procesarCompra = async () => {
  if (!validar()) {
    emit('notify', { msg: 'Por favor completa los campos obligatorios', type: 'warning' });
    return;
  }

  loading.value = true;

  try {
    const sessionStr = localStorage.getItem('ps_session');
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    const tutorId = session?.tutor?.id || session?.id || null;

    const payload = {
      nombre: form.nombre.trim(),
      telefono: form.telefono.replace(/\s/g, ''),
      direccion: tipoEntrega.value === 'PICKUP' ? 'RECOGE EN TIENDA' : form.direccion.trim(),
      email: form.email.trim() || null,
      zona: tipoEntrega.value === 'PICKUP' ? 'PICKUP' : (form.zona.trim() || null),
      franjaEntrega: tipoEntrega.value === 'DOMICILIO' ? (form.franja ? form.franja.split('|')[1] : null) : null,
      tipoEntrega: tipoEntrega.value,
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc'),
      quiereFactura: form.quiereFactura,
      factCedula: form.quiereFactura ? form.factCedula.trim() : null,
      factNombre: form.quiereFactura ? form.factNombre.trim() : null,
      factEmail: form.quiereFactura ? form.factEmail.trim() : null,
      tutorId,
      items: cartStore.items.map(item => ({
        productoId: item.id,
        cantidad: item.quantity,
        nombreProducto: item.nombre,
        precioUnitario: item.precio,
        fotoUrl: item.fotosUrls?.[0] || null
      }))
    };

    // 1. Crear pedido en PENDIENTE (o PENDIENTE_FORMULA si requiere receta)
    const { data: pedidoCreado } = await api.post('/pedidos', payload);

    // Si el pedido quedó en PENDIENTE_FORMULA, redirigir al expediente
    if (pedidoCreado.estado === 'PENDIENTE_FORMULA') {
      cartStore.clearCart();
      await Swal.fire({
        icon: 'info',
        title: '🧾 Fórmula médica requerida',
        html: `Tu pedido <strong>${pedidoCreado.codigoPedido}</strong> fue creado.<br><br>
               Uno o más productos requieren fórmula médica. <br>
               Adjunta la foto de la fórmula para que nuestro equipo la revise y apruebe tu pedido.`,
        confirmButtonText: 'Subir fórmula ahora',
        confirmButtonColor: '#152C77',
        customClass: { popup: 'rounded-[2rem] font-sans' }
      });
      router.push(`/rastrear?codigo=${pedidoCreado.codigoPedido}`);
      return;
    }

    const totalPedido = pedidoCreado.total;
    sessionStorage.setItem('ps_last_order_total', totalPedido);

    // 2. Pedir los datos del botón de Bold
    const { data: bold } = await api.post('/pagos/bold/datos-boton', {
      pedidoId: pedidoCreado.id,
      total: totalPedido
    });

    // 3. Mostrar el botón de Bold en la misma página
    boldListo.value = true;
    await nextTick();

    const script = document.createElement('script');
    script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
    script.setAttribute('data-bold-button', '');
    script.setAttribute('data-order-id', bold.orderId);
    script.setAttribute('data-currency', bold.currency);
    script.setAttribute('data-amount', bold.amount);
    script.setAttribute('data-api-key', bold.apiKey);
    script.setAttribute('data-integrity-signature', bold.integritySignature);
    script.setAttribute('data-redirection-url', bold.redirectUrl);
    script.setAttribute('data-description', `Pedido Pet Station ${pedidoCreado.codigoPedido || '#' + pedidoCreado.id}`);
    boldContainer.value.appendChild(script);

    // Limpiar carrito (el pedido ya quedó creado en el back)
    cartStore.clearCart();

  } catch (error) {
    const msg = error.response?.data?.message || 'Hubo un error al procesar tu pedido. Intenta de nuevo.';
    emit('notify', { msg, type: 'error' });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.fade-up-enter-active { transition: all 0.4s ease; }
.fade-up-enter-from  { opacity: 0; transform: translateY(8px); }
.fade-up-leave-active { transition: all 0.2s ease; }
.fade-up-leave-to   { opacity: 0; }
</style>
