<template>
  <section class="bg-gradient-to-br from-white to-slate-100 p-8 rounded-[2.5rem] border-2 border-dashed border-ps-blue/20 my-12 flex flex-col md:flex-row items-center gap-8 shadow-inner">
    <div class="flex-1 text-center md:text-left">
      <div class="inline-flex items-center gap-2 bg-ps-red/10 text-ps-red px-4 py-1 rounded-full text-xs font-black uppercase mb-4">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-ps-red opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-ps-red"></span>
        </span>
        Servicio Express
      </div>
      <h3 class="text-3xl font-black text-ps-blue leading-tight mb-4">
        ¿Tienes una fórmula médica? <br>
        <span class="text-ps-red">Nosotros la buscamos por ti.</span>
      </h3>
      <p class="text-slate-500 font-medium">Sube la foto de la receta y un asesor experto te enviará el carrito listo para pagar en menos de 10 minutos.</p>
    </div>

    <div class="w-full md:w-auto">
      <label class="group cursor-pointer flex flex-col items-center bg-ps-blue text-white px-10 py-8 rounded-3xl hover:bg-ps-dark transition-all shadow-xl shadow-ps-blue/30 active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-4 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="font-black uppercase tracking-widest text-sm">Subir Foto Receta</span>
        <input type="file" class="hidden" accept="image/*" @change="handleUpload" />
      </label>
    </div>
  </section>
</template>

<script setup>
const handleUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    alert('¡Fórmula recibida! Un veterinario de Pet Station la revisará pronto.');
    // Aquí luego conectaremos con tu backend de Spring Boot
  }
};
</script>