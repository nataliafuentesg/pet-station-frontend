<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] flex flex-col items-center justify-center px-6 text-center">
    <p class="text-[10px] font-black uppercase tracking-widest text-[#DE1F27] mb-4">Error 404</p>
    <h1 class="text-[120px] md:text-[200px] font-[1000] italic leading-none text-[#152C77] dark:text-white select-none">
      404
    </h1>
    <p class="text-xl md:text-2xl font-black uppercase italic text-slate-600 dark:text-slate-300 mt-2 mb-2">
      Página no encontrada
    </p>
    <p class="text-slate-400 font-medium max-w-sm mt-2 mb-10">
      La página que buscas no existe o fue movida. No te preocupes, igual encontramos a tu peludo.
    </p>
    <div class="flex flex-wrap gap-4 justify-center">
      <router-link to="/"
        class="px-8 py-4 bg-[#DE1F27] text-white font-black uppercase italic tracking-widest text-xs rounded-2xl hover:bg-[#b71c22] transition-colors shadow-lg">
        ← Volver al inicio
      </router-link>
      <router-link to="/tienda"
        class="px-8 py-4 border-2 border-[#152C77] dark:border-white/20 text-[#152C77] dark:text-white font-black uppercase italic tracking-widest text-xs rounded-2xl hover:bg-[#152C77] hover:text-white dark:hover:bg-white/10 transition-colors">
        Ver tienda
      </router-link>
    </div>
  </div>
</template>
