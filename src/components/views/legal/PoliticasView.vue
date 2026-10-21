<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-5 md:pt-32 pb-20 transition-colors duration-500 font-sans">
    <div class="max-w-3xl mx-auto px-4 md:px-6 space-y-16">

      <div>
        <router-link to="/tienda" class="text-[#DE1F27] font-black uppercase text-[10px] tracking-widest block hover:translate-x-1 transition-transform mb-6">
          ← Volver a la Tienda
        </router-link>
        <h1 class="text-3xl md:text-5xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-[0.95] tracking-tighter mb-4">
          ENVÍOS &<br/><span class="text-[#DE1F27]">DEVOLUCIONES.</span>
        </h1>
        <p class="text-[10px] font-bold uppercase italic text-slate-400 dark:text-slate-500">
          Última actualización: junio 2026
        </p>
      </div>

      <!-- ENTREGAS -->
      <section class="space-y-6">
        <h2 class="text-xl font-[1000] uppercase italic text-[#152C77] dark:text-white border-b border-slate-100 dark:border-white/10 pb-4">
          🚚 Política de Entregas
        </h2>

        <div class="space-y-5 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase leading-relaxed">

          <div class="bg-[#152C77] rounded-2xl p-5 border border-[#152C77]">
            <p class="text-white font-black mb-2 text-[12px]">📍 Zona de cobertura de domicilios</p>
            <p class="text-white/90">Realizamos domicilios <strong class="text-[#DE1F27] text-[13px]">únicamente en Chía</strong>. Para el resto del país (Bogotá, Cajicá, Medellín, Cali y cualquier otra ciudad) despachamos por transportadora — <strong class="text-white">el flete tiene costo y se cobra a la entrega</strong>.</p>
          </div>

          <div class="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/10">
            <p class="text-[#152C77] dark:text-white font-black mb-2">Costos de envío</p>
            <ul class="space-y-2">
              <li>🏍️ Domicilio <strong>en Chía</strong>: <strong>$8.500</strong> · pedido mínimo $70.000 · <span class="opacity-70">solo en Chía</span></li>
              <li>📦 Resto del país: <strong>envío por transportadora con costo</strong> · el flete lo cobra la transportadora contra entrega</li>
            </ul>
          </div>

          <div class="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/10">
            <p class="text-[#152C77] dark:text-white font-black mb-2">Coordinación de entrega</p>
            <p>Al hacer tu pedido te contactamos por WhatsApp para coordinar el horario de entrega. El pedido debe estar pagado antes de ser despachado.</p>
          </div>

        </div>
      </section>

      <!-- DEVOLUCIONES -->
      <section class="space-y-6">
        <h2 class="text-xl font-[1000] uppercase italic text-[#152C77] dark:text-white border-b border-slate-100 dark:border-white/10 pb-4">
          🔄 Política de Devoluciones
        </h2>

        <div class="space-y-5 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase leading-relaxed">

          <!-- No se aceptan -->
          <div class="bg-[#DE1F27]/5 rounded-2xl p-5 border border-[#DE1F27]/20">
            <p class="text-[#DE1F27] font-black mb-3">❌ No se aceptan devoluciones en:</p>
            <ul class="space-y-2">
              <li><strong>Alimentos abiertos o con embalaje manipulado</strong> — una vez abierto el producto no podemos verificar su integridad ni condición.</li>
              <li><strong>Medicamentos y productos farmacéuticos</strong> — por razones de seguridad sanitaria, no aceptamos devolución de ningún medicamento independientemente del motivo.</li>
            </ul>
          </div>

          <!-- Sí se aceptan -->
          <div class="bg-green-50 dark:bg-green-900/10 rounded-2xl p-5 border border-green-100 dark:border-green-900/30">
            <p class="text-green-700 dark:text-green-400 font-black mb-3">✅ Se aceptan devoluciones en:</p>
            <ul class="space-y-2">
              <li><strong>Accesorios</strong> — si la talla no es la correcta o llega con defecto de fábrica. Debe estar sin uso y con su empaque original.</li>
            </ul>
          </div>

          <!-- Proceso -->
          <div class="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/10">
            <p class="text-[#152C77] dark:text-white font-black mb-3">📋 ¿Cómo gestionar una devolución?</p>
            <ol class="space-y-3 list-none">
              <li><span class="text-[#DE1F27] font-black">01.</span> Contáctanos dentro de las <strong>48 horas</strong> siguientes a la recepción del pedido por WhatsApp o correo, indicando tu número de pedido (ej: PS-2026-0012) y el motivo.</li>
              <li><span class="text-[#DE1F27] font-black">02.</span> Envíanos una foto del producto y del empaque para verificar el estado antes de la visita.</li>
              <li><span class="text-[#DE1F27] font-black">03.</span> <strong>Las devoluciones se hacen de forma presencial en nuestra tienda</strong> — el cliente lleva el producto, se revisa en el momento y se gestiona el cambio o reembolso ahí mismo.</li>
            </ol>
            <p class="mt-4 text-[9px] opacity-60">📍 Vía Guaymaral, 2km antes Variante Chía - Cota · Lunes a sábado 9am–7pm · Domingos y festivos 10am–3pm (atención a puerta cerrada)</p>
          </div>

        </div>
      </section>

      <!-- Nota legal -->
      <p class="text-[9px] font-bold uppercase text-slate-400 dark:text-slate-600 text-center leading-relaxed tracking-widest">
        Pet Station se reserva el derecho de modificar estas políticas en cualquier momento sin previo aviso.<br/>
        La versión vigente es la publicada en esta página. Fecha de última actualización indicada al inicio.
      </p>

      <!-- CONTACTO -->
      <section class="bg-[#152C77] rounded-[2.5rem] p-8 text-white text-center space-y-4">
        <h2 class="text-2xl font-[1000] uppercase italic">¿Tienes algún inconveniente?</h2>
        <p class="text-[10px] font-bold uppercase opacity-70 max-w-md mx-auto">
          Escríbenos directamente — respondemos por WhatsApp o correo lo antes posible.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center mt-2">
          <a href="https://wa.me/573053462413?text=Hola%20Pet%20Station!%20Tengo%20un%20inconveniente%20con%20mi%20pedido."
             target="_blank"
             class="bg-[#25D366] text-white px-6 py-3 rounded-xl font-[1000] uppercase text-[9px] tracking-widest hover:scale-105 transition-transform">
            💬 WhatsApp
          </a>
          <a href="mailto:petstation.chia@gmail.com"
             class="bg-white/10 text-white px-6 py-3 rounded-xl font-[1000] uppercase text-[9px] tracking-widest hover:bg-white/20 transition-colors">
            ✉️ petstation.chia@gmail.com
          </a>
        </div>
      </section>

    </div>
  </div>
</template>
