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

          <div class="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/10">
            <p class="text-[#152C77] dark:text-white font-black mb-2">Zonas de cobertura</p>
            <p>Realizamos domicilios en <strong>Chía, Cajicá</strong> y <strong>Bogotá norte</strong> (desde calle 53 hacia el norte). Si tienes dudas sobre si tu dirección está dentro de la cobertura, escríbenos antes de hacer el pedido.</p>
          </div>

          <div class="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/10">
            <p class="text-[#152C77] dark:text-white font-black mb-2">Franjas horarias</p>
            <p>Al hacer el pedido eliges la franja de entrega:</p>
            <ul class="mt-3 space-y-1 list-none">
              <li>🌅 <strong>Mañana</strong> — entrega entre 8am y 12pm</li>
              <li>🌇 <strong>Tarde</strong> — entrega entre 1pm y 5pm</li>
            </ul>
            <p class="mt-3 opacity-70">Si el pedido llega tarde (después de las 10am para franja mañana, o después de la 1pm para franja tarde), la entrega queda programada para el día siguiente en la misma franja.</p>
          </div>

          <div class="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/10">
            <p class="text-[#152C77] dark:text-white font-black mb-2">Costos de envío</p>
            <ul class="space-y-1">
              <li>📦 Chía: <strong>$5.000</strong></li>
              <li>📦 Cajicá / Bogotá norte: <strong>$10.000</strong></li>
              <li>🎁 <strong>Envío gratis</strong> en pedidos desde <strong>$200.000</strong></li>
            </ul>
          </div>

          <div class="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/10">
            <p class="text-[#152C77] dark:text-white font-black mb-2">Confirmación antes de salir</p>
            <p>Antes de despachar tu pedido te escribimos al WhatsApp registrado para confirmar que estás en la dirección. Si no hay respuesta, el pedido se deja en portería o se reprograma según acuerdo. Te pedimos tener el número actualizado al momento del pedido.</p>
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
              <li><strong>Accesorios</strong> — si el talla no es la correcta o llega con defecto de fábrica. Debe estar sin uso y con su empaque original.</li>
              <li><strong>Alimentos sellados</strong> — si el producto recibido no corresponde a lo que pediste (referencia, sabor, tamaño diferente) y llega con el sello intacto.</li>
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
            <p class="mt-4 text-[9px] opacity-60">📍 Vía Guaymaral, 2km antes Variante Chía - Cota · Lunes a viernes 8am–6pm · Sábados 8am–2pm</p>
          </div>

        </div>
      </section>

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
