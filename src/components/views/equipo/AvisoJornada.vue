<template>
  <div class="bg-white/5 rounded-[2rem] p-6 border border-white/10 space-y-5 text-[13px] leading-relaxed text-white/75">
    <div class="text-center space-y-2">
      <p class="text-4xl">🤝</p>
      <h2 class="text-xl font-[1000] uppercase italic text-white">Antes de <span class="text-[#DE1F27]">empezar</span></h2>
    </div>

    <p>
      <b class="text-white">Mi Jornada</b> es una herramienta de Pet Station para entender cómo se reparte el trabajo del equipo:
      cuánto toma cada tarea, si hay demasiada carga y cómo organizarnos mejor.
      <b class="text-white">No es para vigilarte ni para castigarte.</b>
    </p>

    <section class="space-y-1.5">
      <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40">✅ Qué se registra</h3>
      <ul class="list-disc pl-5 space-y-1">
        <li>Tu nombre y tu usuario.</li>
        <li>Las tareas que tú escribes, con su hora de inicio y fin, y las notas que agregues.</li>
        <li>La hora en que empiezas y terminas la jornada y el almuerzo.</li>
        <li>Si respondes o no la pregunta de cada 15 minutos.</li>
        <li>Los perros que recibes y entregas: nombre, horas, comida y checklist.</li>
        <li>Si activas los avisos, un código técnico del navegador para poder enviártelos.</li>
      </ul>
    </section>

    <section class="space-y-1.5">
      <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40">🚫 Qué NO se registra</h3>
      <ul class="list-disc pl-5 space-y-1">
        <li>No usamos tu ubicación, tu cámara ni tu micrófono.</li>
        <li>No vemos tus fotos, mensajes, contactos ni nada más de tu celular.</li>
        <li>Solo se guarda lo que tú registras dentro de esta app.</li>
      </ul>
    </section>

    <section class="space-y-1.5">
      <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40">🎯 Para qué se usa y quién lo ve</h3>
      <p>
        Para medir la carga de trabajo, ver cómo se reparten las tareas y tomar decisiones de organización y de personal.
        Lo ve únicamente la administración de Pet Station.
        Se conserva mientras dure este proceso de medición y tu relación laboral con la empresa.
      </p>
    </section>

    <section class="space-y-1.5">
      <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40">🤖 Resúmenes con inteligencia artificial</h3>
      <p>
        Para hacer un resumen diario del trabajo del equipo usamos un servicio de inteligencia artificial (ChatGPT, de OpenAI).
        Le enviamos las tareas, horarios y notas del día <b class="text-white">sin tu nombre</b>: apareces como "Persona A", "Persona B", etc.
        Fuera de esto, tus datos no se comparten con nadie más.
      </p>
    </section>

    <section class="space-y-1.5">
      <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40">🔔 Los avisos son opcionales</h3>
      <p>
        Tú decides si activas las notificaciones. Si no las activas, te toca entrar a la app y mantener tus tareas al día por tu cuenta.
        Lo que no quede registrado aparece como tiempo sin tarea.
      </p>
    </section>

    <section class="space-y-1.5">
      <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40">⚖️ Tus derechos</h3>
      <p>
        Según la Ley 1581 de 2012 puedes consultar, actualizar y corregir tus datos, y presentar reclamos sobre su uso,
        escribiendo a la administración al <b class="text-white">305 346 2413</b>.
        Más detalles en la <a href="/privacy" target="_blank" class="underline text-white">política de privacidad</a>.
      </p>
    </section>

    <template v-if="pedirAceptacion">
      <label class="flex items-start gap-3 bg-white/5 rounded-2xl p-4 border border-white/10 cursor-pointer">
        <input type="checkbox" v-model="acepto" class="mt-1 w-5 h-5 accent-[#DE1F27] shrink-0" />
        <span class="text-white/90 font-bold">Leí y entiendo para qué se usa Mi Jornada, y autorizo a Pet Station a tratar estos datos para los fines descritos.</span>
      </label>
      <button @click="$emit('aceptar')" :disabled="!acepto || enviando"
        class="w-full bg-[#DE1F27] py-5 rounded-2xl font-[1000] uppercase tracking-widest text-[12px] text-white active:scale-95 transition-all disabled:opacity-40">
        Acepto, empezar
      </button>
    </template>
    <button v-else @click="$emit('cerrar')"
      class="w-full bg-white/10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] text-white">
      Cerrar
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  pedirAceptacion: { type: Boolean, default: false },
  enviando: { type: Boolean, default: false },
})
defineEmits(['aceptar', 'cerrar'])

const acepto = ref(false)
</script>
