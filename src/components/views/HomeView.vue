<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500 font-sans">

    <!-- HERO -->
    <section class="pt-2 md:pt-28 pb-4 px-3 md:px-6">
      <div class="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6">

        <div class="lg:col-span-8 bg-[#152C77] rounded-[1.8rem] md:rounded-[3.5rem] p-7 md:p-20 text-white relative overflow-hidden flex flex-col justify-center min-h-[300px] md:min-h-[550px]">
          <div class="relative z-10 space-y-4 md:space-y-8">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-[#DE1F27] rounded-full animate-pulse"></span>
              <span class="text-[8px] md:text-[11px] font-[1000] uppercase tracking-widest opacity-80">
                Respaldo Médico Ético • Chía
              </span>
            </div>

            <h1 class="text-4xl md:text-[100px] font-[1000] uppercase italic leading-[0.8] tracking-tighter">
              CIENCIA <br /> <span class="text-[#DE1F27]">QUE CUIDA.</span>
            </h1>

            <p class="text-white/60 font-bold uppercase italic text-[11px] md:text-xl max-w-md leading-tight">
              Brindamos la confianza médica que tu familia necesita. Salud real, sin rodeos.
            </p>

            <div class="flex gap-3 md:gap-6 pt-2 md:pt-6">
              <button @click="router.push('/agendar')" class="flex-1 md:flex-none bg-[#DE1F27] text-white px-6 py-4 md:px-12 md:py-6 rounded-xl md:rounded-2xl font-[1000] uppercase text-[10px] md:text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl whitespace-nowrap">
                Agendar Cita
              </button>
              <button @click="router.push('/tienda')" class="flex-1 md:flex-none bg-white/10 backdrop-blur-md text-white px-6 py-4 md:px-12 md:py-6 rounded-xl md:rounded-2xl font-[1000] uppercase text-[10px] md:text-sm tracking-widest border border-white/20 hover:bg-white hover:text-[#152C77] transition-all whitespace-nowrap">
                Tienda
              </button>
            </div>
          </div>
          <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-[#DE1F27]/20 blur-[120px] rounded-full"></div>
        </div>

        <div class="lg:col-span-4 grid grid-cols-1 gap-3 md:gap-6">
          <div class="h-52 md:h-full bg-slate-100 dark:bg-white/5 rounded-[1.8rem] md:rounded-[3.5rem] overflow-hidden border border-slate-100 dark:border-white/10 relative group">
            <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80"
                 class="w-full h-full object-cover object-top grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#152C77]/80 via-transparent flex items-end p-6 md:p-10">
               <p class="text-white font-[1000] italic uppercase text-lg md:text-2xl leading-none">
                 Compromiso <br/><span class="text-[#DE1F27]">Garantizado.</span>
               </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="bg-slate-50 dark:bg-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-10 flex flex-col justify-center border border-slate-100 dark:border-white/10">
              <span class="text-2xl md:text-4xl font-[1000] text-[#152C77] dark:text-white italic leading-none">100%</span>
              <span class="text-[7px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">Ética Profesional</span>
            </div>
            <div class="bg-[#DE1F27] rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-10 flex flex-col justify-center shadow-xl shadow-[#DE1F27]/10">
              <span class="text-2xl md:text-4xl font-[1000] text-white italic leading-none">CHÍA</span>
              <span class="text-[7px] md:text-[10px] font-black uppercase text-white/80 tracking-widest mt-2">Variante Chía-Cota</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- AGENDAR CITA -->
    <section class="py-6 px-3 md:px-6">
      <div class="max-w-[1400px] mx-auto">
        <div class="bg-[#152C77] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden">
          <div class="grid md:grid-cols-2">
            <!-- Texto -->
            <div class="p-8 md:p-16 flex flex-col justify-center">
              <p class="text-[#DE1F27] font-black uppercase text-[9px] md:text-xs tracking-[0.4em] mb-4">Agenda en minutos</p>
              <h2 class="text-3xl md:text-5xl font-[1000] uppercase italic text-white leading-[0.9] mb-6">
                TU MASCOTA <br/><span class="text-[#DE1F27]">TE NECESITA HOY.</span>
              </h2>
              <p class="text-white/60 font-bold uppercase text-[10px] md:text-sm leading-relaxed mb-8">
                Sin llamadas, sin esperas. Selecciona el servicio, elige tu horario y listo. Confirmación inmediata.
              </p>
              <div class="grid grid-cols-2 gap-3 mb-8">
                <div v-for="s in serviciosCita" :key="s.nombre" class="bg-white/10 rounded-2xl p-4 border border-white/10 hover:border-[#DE1F27] transition-all cursor-pointer" @click="router.push('/agendar')">
                  <span class="text-2xl block mb-2">{{ s.icono }}</span>
                  <p class="text-white font-[1000] uppercase text-[10px] md:text-xs leading-tight">{{ s.nombre }}</p>
                  <p class="text-[#DE1F27] font-black text-[8px] uppercase mt-1">{{ s.detalle }}</p>
                </div>
              </div>
              <button @click="router.push('/agendar')" class="bg-[#DE1F27] text-white py-4 md:py-5 rounded-2xl font-[1000] uppercase text-[10px] md:text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#DE1F27]/30 text-center">
                Reservar mi cita ahora →
              </button>
            </div>
            <!-- Visual -->
            <div class="relative hidden md:block">
              <img src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&q=80&w=800" class="w-full h-full object-cover opacity-60" />
              <div class="absolute inset-0 bg-gradient-to-r from-[#152C77] via-[#152C77]/30 to-transparent"></div>
              <div class="absolute bottom-10 right-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <p class="text-white font-[1000] uppercase text-xs mb-1">Próxima disponibilidad</p>
                <p class="text-[#DE1F27] font-[1000] uppercase text-2xl italic">HOY</p>
                <p class="text-white/60 font-bold text-[10px] uppercase mt-1">Consulta general y grooming</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TIENDA: CARRUSEL CONVEYOR BELT -->
    <section class="py-6">
      <div class="max-w-[1400px] mx-auto px-3 md:px-6 mb-6 md:mb-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p class="text-[#DE1F27] font-black uppercase text-[9px] md:text-xs tracking-[0.4em] mb-2">Pet Shop</p>
            <h2 class="text-3xl md:text-5xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-[0.9]">
              LO MEJOR <br/><span class="text-[#DE1F27]">PARA ELLOS.</span>
            </h2>
          </div>
          <div class="flex gap-2 bg-slate-100 dark:bg-white/5 rounded-2xl p-1.5 self-start md:self-auto border border-slate-200 dark:border-white/10">
            <button v-for="esp in especies" :key="esp.key"
              @click="especieActiva = esp.key"
              :class="especieActiva === esp.key ? 'bg-[#152C77] text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-[#152C77] dark:hover:text-white'"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-[1000] uppercase text-[10px] tracking-wider transition-all">
              <span>{{ esp.emoji }}</span> {{ esp.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loadingProductos" class="flex gap-4 px-6 overflow-hidden">
        <div v-for="i in 6" :key="i" class="flex-shrink-0 w-48 md:w-64 bg-slate-100 dark:bg-white/5 rounded-[1.5rem] h-72 animate-pulse"></div>
      </div>

      <!-- Conveyor belt -->
      <div v-else-if="productosFiltrados.length" class="relative overflow-hidden">
        <!-- Fade izquierda -->
        <div class="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white dark:from-[#050505] to-transparent z-10 pointer-events-none"></div>
        <!-- Fade derecha -->
        <div class="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white dark:from-[#050505] to-transparent z-10 pointer-events-none"></div>

        <div class="conveyor-track flex gap-4 py-4">
          <!-- Duplicamos para loop infinito -->
          <div v-for="p in [...productosFiltrados, ...productosFiltrados]" :key="p.id + Math.random()"
            @click="router.push('/tienda/producto/' + p.id)"
            class="conveyor-card flex-shrink-0 w-48 md:w-64 group bg-white dark:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 dark:border-white/10 hover:border-[#DE1F27] transition-all cursor-pointer overflow-hidden flex flex-col">
            <div class="w-full aspect-square bg-white dark:bg-white/5 overflow-hidden flex items-center justify-center p-3">
              <img v-if="p.fotosUrls && p.fotosUrls[0]" :src="p.fotosUrls[0]" :alt="p.nombre"
                class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
              <div v-else class="w-full h-full flex items-center justify-center text-5xl">
                {{ especieActiva === 'CANINO' ? '🐕' : '🐈' }}
              </div>
            </div>
            <div class="p-4 flex flex-col flex-1 justify-between gap-2">
              <p class="text-[#152C77] dark:text-white font-[1000] uppercase italic text-[9px] md:text-[10px] leading-tight line-clamp-2">{{ p.nombre }}</p>
              <span class="text-[#DE1F27] font-[1000] text-sm">${{ Number(p.precio).toLocaleString('es-CO') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-16 px-6">
        <p class="text-4xl mb-4">{{ especieActiva === 'CANINO' ? '🐕' : '🐈' }}</p>
        <p class="text-slate-400 font-bold uppercase text-sm">Estamos cargando los mejores productos</p>
      </div>

      <div class="text-center mt-6 px-3">
        <button @click="router.push('/tienda')" class="bg-[#152C77] text-white px-10 py-4 rounded-2xl font-[1000] uppercase text-[10px] md:text-sm tracking-widest hover:bg-[#DE1F27] transition-all">
          Ver toda la tienda →
        </button>
      </div>
    </section>

    <!-- VIAJES INTERNACIONALES -->
    <section class="py-6 px-3 md:px-6">
      <div class="max-w-[1400px] mx-auto">
        <div class="bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden">
          <div class="grid md:grid-cols-5">
            <!-- Visual izquierda -->
            <div class="md:col-span-2 relative min-h-[200px] md:min-h-0">
              <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"
                class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-r from-transparent to-slate-50 dark:to-[#0A0A0A] hidden md:block"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0A0A0A] to-transparent md:hidden"></div>
            </div>
            <!-- Contenido -->
            <div class="md:col-span-3 p-8 md:p-14 flex flex-col justify-center">
              <div class="flex items-center gap-2 mb-4">
                <span class="bg-[#DE1F27] text-white text-[8px] font-black uppercase px-3 py-1.5 rounded-full tracking-widest">⚠️ Requiere hasta 4 meses de anticipación</span>
              </div>
              <p class="text-[#DE1F27] font-black uppercase text-[9px] md:text-xs tracking-[0.4em] mb-3">Documentación Internacional</p>
              <h2 class="text-3xl md:text-5xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-[0.9] mb-4">
                ¿VIAJAS CON <br/><span class="text-[#DE1F27]">TU MASCOTA?</span>
              </h2>
              <p class="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] md:text-sm leading-relaxed mb-6">
                Cada país tiene requisitos distintos. Nosotros gestionamos <strong class="text-[#152C77] dark:text-white">microchip, vacunas, serología, certificados INVIMA y más</strong>. No te arriesgues a que rechacen a tu mascota en el aeropuerto.
              </p>
              <!-- Destinos -->
              <div class="flex flex-wrap gap-2 mb-8">
                <span v-for="d in destinosViaje" :key="d.pais"
                  class="flex items-center gap-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">
                  {{ d.bandera }} {{ d.pais }}
                  <span class="text-[#DE1F27] font-black text-[8px]">{{ d.tiempo }}</span>
                </span>
              </div>
              <button @click="router.push('/servicios/viajes')" class="bg-[#152C77] text-white py-4 px-8 rounded-2xl font-[1000] uppercase text-[10px] md:text-sm tracking-widest hover:bg-[#DE1F27] transition-all self-start">
                Consultar requisitos →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- APP FEATURES -->
    <section class="py-6 px-3 md:px-6">
      <div class="max-w-[1400px] mx-auto bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 text-center relative overflow-hidden">

        <div class="relative z-10 mb-12">
          <p class="text-[#DE1F27] font-black uppercase text-[9px] md:text-xs tracking-[0.4em] mb-4">Innovación Veterinaria</p>
          <h2 class="text-3xl md:text-6xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-[0.9]">
            DESCUBRE <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#152C77] to-[#DE1F27]">PET STATION APP</span>
          </h2>
          <p class="text-slate-500 dark:text-slate-400 font-bold text-[10px] md:text-sm mt-6 max-w-2xl mx-auto leading-relaxed uppercase">
            Más que una clínica, somos una plataforma integral. Conecta tu cuenta Google para acceder al
            <span class="text-[#152C77] dark:text-white">Perfil Digital de tu Mascota</span>, gestionar tus <span class="text-[#152C77] dark:text-white">Citas</span> y recibir recomendaciones personalizadas.
          </p>
        </div>

        <div class="relative z-10 grid md:grid-cols-3 gap-6 text-left">
          <div class="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-[#DE1F27] transition-all group">
            <div class="w-12 h-12 mb-5 text-[#152C77] dark:text-white group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 class="text-lg font-[1000] uppercase italic text-[#152C77] dark:text-white mb-2">Perfil Digital</h3>
            <p class="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">Centraliza la información básica, fotos y preferencias de tu mascota en un solo lugar seguro.</p>
          </div>
          <div class="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-[#DE1F27] transition-all group">
            <div class="w-12 h-12 mb-5 text-[#152C77] dark:text-white group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
              </svg>
            </div>
            <h3 class="text-lg font-[1000] uppercase italic text-[#152C77] dark:text-white mb-2">Smart Booking</h3>
            <p class="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">Agenda citas médicas y grooming en tiempo real sin llamadas.</p>
          </div>
          <div class="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-[#DE1F27] transition-all group">
            <div class="w-12 h-12 mb-5 text-[#152C77] dark:text-white group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/>
                <line x1="17" y1="16" x2="23" y2="16"/>
              </svg>
            </div>
            <h3 class="text-lg font-[1000] uppercase italic text-[#152C77] dark:text-white mb-2">Filtro Genético</h3>
            <p class="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">Nuestra tienda filtra productos automáticamente según la raza y edad de tu mascota.</p>
          </div>
        </div>

      </div>
    </section>

    <!-- TESTIMONIOS -->
    <section class="py-6 px-3 md:px-6">
      <div class="max-w-[1400px] mx-auto">

        <!-- Header compacto -->
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="flex gap-0.5">
              <span v-for="i in 5" :key="i" class="text-yellow-400 text-base">★</span>
            </div>
            <span class="text-[#152C77] dark:text-white font-[1000] text-lg italic">4.6</span>
            <span class="text-slate-400 font-bold text-[10px] uppercase tracking-widest">· 234 reseñas</span>
          </div>
          <a href="https://g.co/kgs/petstation" target="_blank" rel="noopener"
            class="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-400 hover:text-[#DE1F27] transition-colors tracking-widest">
            <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Ver en Google →
          </a>
        </div>

        <!-- Grid compacto 2x2 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div v-for="t in testimonios" :key="t.nombre"
            class="flex gap-3 bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 transition-all">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-[1000] text-[11px] shrink-0 text-white mt-0.5"
              :style="{ background: t.color }">
              {{ t.nombre[0] }}
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <span class="text-[#152C77] dark:text-white font-[1000] text-xs">{{ t.nombre }}</span>
                <div class="flex gap-0.5">
                  <span v-for="i in 5" :key="i" class="text-yellow-400 text-[9px]">★</span>
                </div>
              </div>
              <p class="text-slate-500 dark:text-slate-400 text-[10px] font-bold leading-relaxed line-clamp-3">"{{ t.texto }}"</p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- SERVICIOS -->
    <section class="pb-12 px-3 md:px-6">
      <div class="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div v-for="s in serviciosHome" :key="s.name"
             @click="router.push(s.link)"
             class="group bg-white dark:bg-white/5 p-6 md:p-12 rounded-[1.8rem] md:rounded-[3rem] border border-slate-100 dark:border-white/10 hover:border-[#DE1F27] transition-all cursor-pointer flex flex-col items-center text-center">
          <span class="text-3xl md:text-6xl mb-3 md:mb-6 group-hover:rotate-12 transition-transform">{{ s.icon }}</span>
          <h3 class="text-[10px] md:text-sm font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight">{{ s.name }}</h3>
          <p class="text-[7px] md:text-[10px] font-black text-[#DE1F27] uppercase mt-2 opacity-0 group-hover:opacity-100 transition-all">Ver Más</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/productStore';

const router = useRouter();
const productStore = useProductStore();

const especieActiva = ref('CANINO');
const loadingProductos = ref(true);

const especies = [
  { key: 'CANINO', label: 'Perros', emoji: '🐕' },
  { key: 'FELINO', label: 'Gatos', emoji: '🐈' },
];

const serviciosCita = [
  { nombre: 'Consulta Veterinaria', icono: '🩺', detalle: 'Medicina general y especializada' },
  { nombre: 'Peluquería', icono: '✂️', detalle: 'Baño, corte y estética' },
];

const destinosViaje = [
  { pais: 'USA', bandera: '🇺🇸', tiempo: '3 meses' },
  { pais: 'Unión Europea', bandera: '🇪🇺', tiempo: '4 meses' },
  { pais: 'Suramérica', bandera: '🇧🇷', tiempo: '10-15 días' },
  { pais: 'Nacional', bandera: '🇨🇴', tiempo: '1-3 días' },
];

const testimonios = [
  {
    nombre: 'Daniela Landi',
    tiempo: 'hace 27 semanas',
    color: '#DE1F27',
    texto: 'Para nosotros este es nuestro veterinario de confianza desde hace más de cinco años. Han cuidado y operado a nuestro Bernes con dedicación y calidad y muchooo cariño. ¡Super recomendado!'
  },
  {
    nombre: 'Mario Botero',
    tiempo: 'hace 30 semanas',
    color: '#152C77',
    texto: 'El equipo Pet Station siempre ha estado acompañándonos en la salud de nuestra mascota; demuestran día a día un sentido de respeto por la calidad de vida de todas y cada una de las mascotas. Mil gracias.'
  },
  {
    nombre: 'Alejandro Guerrero',
    tiempo: 'hace 32 semanas',
    color: '#2d7a2d',
    texto: 'Me parece muy buena la labor de cada integrante en la parte médica y de guardería. La peluquería es limpia y el manejo con las mascotas es siempre a favor de la mascota, evitando estrés y miedo. Excelente sitio.'
  },
  {
    nombre: 'Libni Castillo',
    tiempo: 'hace 32 semanas',
    color: '#7a2d7a',
    texto: 'Quiero expresar mi más sincero agradecimiento por el excelente servicio a mi perrita Westie (Bibi) durante 6 años. Su dedicación, profesionalismo y amor por los animales son verdaderamente admirables. No dudaré en recomendarlos.'
  }
];

const serviciosHome = [
  { name: 'Medicina Especializada', icon: '🩺', link: '/servicios/medicina' },
  { name: 'Grooming', icon: '✂️', link: '/servicios/peluqueria' },
  { name: 'Documentos Viajes', icon: '✈️', link: '/servicios/viajes' },
  { name: 'Guardería', icon: '🏡', link: '/servicios/guarderia' }
];

const productosFiltrados = computed(() => {
  const todos = productStore.allProducts;
  return todos
    .filter(p => {
      const esp = (p.especie || '').toUpperCase();
      if (especieActiva.value === 'CANINO') return esp === 'CANINO' || esp.includes('PERRO') || esp === 'TODOS';
      if (especieActiva.value === 'FELINO') return esp === 'FELINO' || esp.includes('GATO') || esp === 'TODOS';
      return true;
    })
    .filter(p => p.fotosUrls && p.fotosUrls.length > 0)
    .slice(0, 8);
});

onMounted(async () => {
  if (productStore.allProducts.length === 0) {
    await productStore.fetchTienda();
  }
  loadingProductos.value = false;
});
</script>

<style scoped>
@reference "../../style.css";

.conveyor-track {
  animation: conveyor 30s linear infinite;
  width: max-content;
}

.conveyor-track:hover {
  animation-play-state: paused;
}

@keyframes conveyor {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
