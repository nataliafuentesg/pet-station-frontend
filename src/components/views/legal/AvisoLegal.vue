<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 px-6 font-sans">
    <div class="max-w-4xl mx-auto">
      <p class="text-[10px] font-black uppercase tracking-widest text-[#DE1F27] mb-3">Legal</p>
      <h1 class="text-4xl md:text-6xl font-[1000] uppercase italic text-[#152C77] dark:text-white mb-8">
        AVISO <span class="text-[#DE1F27]">LEGAL</span>
      </h1>

      <div class="space-y-8 text-slate-600 dark:text-slate-300 font-medium text-[15px] leading-relaxed">

        <p class="text-[12px] text-slate-400 uppercase tracking-widest">Última actualización: octubre de 2026</p>

        <section>
          <h3 class="section-title">1. Identificación del titular</h3>
          <div class="legal-box">
            <p><strong>Razón social:</strong> Pet Station S.A.S.</p>
            <p><strong>NIT:</strong> Por confirmar ante la DIAN</p>
            <p><strong>Domicilio:</strong> Vía Guaymaral, 2km antes Variante Chía-Cota, Vereda La Balsa, Chía, Cundinamarca, Colombia</p>
            <p><strong>Correo electrónico:</strong> community.manager@petstationvet.com</p>
            <p><strong>WhatsApp:</strong> +57 305 346 2413</p>
            <p><strong>Sitio web:</strong> petstationvet.com</p>
          </div>
        </section>

        <section>
          <h3 class="section-title">2. Objeto del sitio</h3>
          <p>El presente sitio web tiene como finalidad ofrecer información sobre los servicios veterinarios de Pet Station, permitir el agendamiento de citas, y facilitar la compra de productos para mascotas a través de la tienda online.</p>
        </section>

        <section>
          <h3 class="section-title">3. Condiciones de uso</h3>
          <ul class="legal-list">
            <li>El acceso y uso de este sitio implica la aceptación de los presentes términos.</li>
            <li>El usuario se compromete a hacer un uso lícito del sitio y a no llevar a cabo acciones que puedan dañar, inutilizar o deteriorar el portal o impedir el normal uso por otros usuarios.</li>
            <li>Está prohibido el uso del sitio con fines ilegales, fraudulentos o que lesionen derechos de terceros.</li>
          </ul>
        </section>

        <section>
          <h3 class="section-title">4. Propiedad intelectual</h3>
          <p>Los contenidos del sitio web (textos, imágenes, logotipos, código fuente, diseño gráfico y demás elementos) son propiedad exclusiva de Pet Station S.A.S. o de sus licenciantes, y están protegidos por la legislación colombiana sobre propiedad intelectual (Ley 23 de 1982 y sus modificaciones).</p>
          <p class="mt-3">Queda prohibida su reproducción, distribución, comunicación pública o transformación sin la autorización expresa y escrita de Pet Station.</p>
        </section>

        <section>
          <h3 class="section-title">5. Exclusión de responsabilidad</h3>
          <ul class="legal-list">
            <li>Pet Station no garantiza la disponibilidad continua e ininterrumpida del sitio web.</li>
            <li>El contenido del sitio tiene carácter meramente informativo. Las decisiones médicas veterinarias deben tomarse con la asesoría directa de un profesional.</li>
            <li>Pet Station no se responsabiliza por daños derivados de virus u otros elementos informáticos introducidos por terceros en el sistema.</li>
          </ul>
        </section>

        <section>
          <h3 class="section-title">6. Protección de datos personales</h3>
          <p>El tratamiento de datos personales recabados a través de este sitio se realiza de conformidad con la <strong>Ley 1581 de 2012</strong> y el Decreto 1377 de 2013. Consulta nuestra
            <router-link to="/privacy" class="text-[#152C77] dark:text-blue-400 underline">Política de Tratamiento de Datos Personales</router-link>
            para más información.
          </p>
        </section>

        <section>
          <h3 class="section-title">7. Ley aplicable y jurisdicción</h3>
          <p>Este aviso legal se rige por las leyes de la República de Colombia. Para cualquier controversia derivada del acceso o uso del sitio, las partes se someten a la jurisdicción de los jueces y tribunales de Chía, Cundinamarca, sin perjuicio de los derechos que asisten a los consumidores conforme a la Ley 1480 de 2011.</p>
        </section>

        <section>
          <h3 class="section-title">8. Contacto</h3>
          <p>Para cualquier consulta sobre este aviso legal escríbenos a <strong>community.manager@petstationvet.com</strong>.</p>
        </section>

      </div>

      <div class="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-6">
        <router-link to="/" class="text-[#DE1F27] font-black uppercase tracking-widest text-xs hover:underline">← Volver al inicio</router-link>
        <router-link to="/privacy" class="text-slate-400 font-black uppercase tracking-widest text-xs hover:text-[#152C77] dark:hover:text-white">Política de datos →</router-link>
        <router-link to="/terms" class="text-slate-400 font-black uppercase tracking-widest text-xs hover:text-[#152C77] dark:hover:text-white">Términos y condiciones →</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-title {
  @apply text-lg font-black uppercase text-[#152C77] dark:text-white mt-8 mb-3 tracking-wide;
}
.legal-box {
  @apply bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 space-y-1;
}
.legal-list {
  @apply list-disc pl-5 space-y-2 mt-2;
}
</style>
