<template>
  <div class="min-h-screen bg-white">
    <div class="relative h-[40vh] bg-ps-blue overflow-hidden">
      <img :src="serviceData.heroImage" class="w-full h-full object-cover opacity-60" />
      <div class="absolute inset-0 flex items-center justify-center">
        <h1 class="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
          {{ serviceData.title }}
        </h1>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div class="lg:col-span-2 space-y-8">
        <section>
          <h2 class="text-3xl font-black text-ps-blue mb-4 tracking-tight uppercase">
            ¿En qué consiste para {{ activePet === 'dog' ? 'Perros' : 'Gatos' }}?
          </h2>
          <p class="text-lg text-slate-600 leading-relaxed italic">
            "{{ serviceData.philosophy }}"
          </p>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="feature in serviceData.features" :key="feature" 
               class="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span class="text-ps-red text-xl">✔</span>
            <span class="font-bold text-ps-blue text-sm">{{ feature }}</span>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="bg-ps-blue p-8 rounded-[2.5rem] text-white sticky top-28 shadow-2xl">
          <h3 class="text-2xl font-black mb-6 uppercase">Reserva tu cita</h3>
          
          <div class="space-y-4 mb-8">
            <div class="flex justify-between border-b border-white/10 pb-2">
              <span class="text-white/60">Precio desde:</span>
              <span class="font-bold text-xl">${{ serviceData.basePrice.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between border-b border-white/10 pb-2">
              <span class="text-white/60">Duración aprox:</span>
              <span class="font-bold">{{ serviceData.duration }}</span>
            </div>
          </div>

          <button class="w-full bg-ps-red hover:bg-red-700 text-white font-black py-4 rounded-xl transition-all shadow-lg uppercase tracking-widest">
            Seleccionar Horario
          </button>
          <p class="text-[10px] text-center mt-4 text-white/40 uppercase">Sujeto a valoración de temperamento</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['serviceData', 'activePet']);
</script>