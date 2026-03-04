<template>
  <div :class="{ 'dark': darkMode }"
    class="min-h-screen transition-colors duration-500 bg-white dark:bg-[#050505] text-slate-900 dark:text-white font-sans overflow-x-hidden">

    <div class="fixed top-24 right-4 md:top-10 md:right-10 z-[5000] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <div v-for="n in notifications" :key="n.id" :class="[
          'px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-4 border backdrop-blur-md pointer-events-auto',
          n.type === 'error' ? 'bg-red-600/90 text-white border-white/20' : 'bg-[#152C77]/90 text-white border-white/20'
        ]">
          <span>{{ n.type === 'error' ? '✕' : '✓' }}</span>
          {{ n.message }}
        </div>
      </TransitionGroup>
    </div>

    <nav v-if="!isAdminRoute"
      :class="['fixed top-0 w-full z-[100] transition-all px-4 md:px-12', isScrolled ? 'bg-white/95 dark:bg-black/90 border-b border-slate-200 dark:border-white/10 py-3 shadow-xl' : 'bg-transparent py-5']">
      <div class="max-w-[1800px] mx-auto flex items-center justify-between">

        <router-link to="/" class="text-xl md:text-3xl font-[1000] italic uppercase tracking-tighter shrink-0">
          <span class="text-ps-red">PET</span><span class="dark:text-white text-ps-blue"> STATION</span>
        </router-link>

        <div
          class="hidden lg:flex items-center gap-8 bg-slate-100/50 dark:bg-white/5 px-8 py-3 rounded-2xl border border-slate-200/50 dark:border-white/10 backdrop-blur-md">
          <router-link to="/" class="nav-desktop-link">Inicio</router-link>
          <router-link to="/tienda" class="nav-desktop-link">Tienda</router-link>
          <router-link to="/servicios" class="nav-desktop-link">Servicios</router-link>
          <button @click="handleAgendarClick" class="nav-desktop-link">Agendar</button>
        </div>

        <div class="flex items-center gap-2 md:gap-5">
          <button @click="toggleTheme"
            class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 transition-all cursor-pointer">
            <span class="text-lg">{{ darkMode ? '☀️' : '🌙' }}</span>
          </button>

          <button @click="isCartOpen = true" class="relative p-2 hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-ps-blue dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span v-if="cartStore.cartCount > 0"
              class="absolute -top-1 -right-1 bg-ps-red text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-black">
              {{ cartStore.cartCount }}
            </span>
          </button>

          <template v-if="!tutorData">
            <button @click="isLoginOpen = true"
              class="p-2 bg-ps-red/10 text-ps-red rounded-xl hover:bg-ps-red hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </template>

          <template v-else>
            <div class="flex items-center gap-2 bg-slate-100 dark:bg-white/10 p-1 md:pr-4 rounded-full border border-slate-200 dark:border-white/10">
              <router-link to="/seleccionar-perfil" class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full border-2 border-ps-red overflow-hidden bg-white shrink-0">
                  <img v-if="activePet?.fotoUrl" :src="activePet.fotoUrl" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center bg-ps-blue text-white text-[10px] font-black uppercase">{{ activePet ? activePet.nombre.charAt(0) : '?' }}</div>
                </div>
                <span class="hidden sm:block text-[10px] font-black uppercase italic">{{ activePet?.nombre || 'Elegir' }}</span>
              </router-link>
              <button @click="handleLogout" class="p-1.5 text-slate-400 hover:text-ps-red transition-all cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
              </button>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <div v-if="!isAdminRoute" class="lg:hidden fixed bottom-0 w-full bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-[1000] px-2 pb-8 pt-3 flex items-end shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">

      <router-link to="/" class="flex-1 flex flex-col items-center gap-1 text-slate-400 dark:text-white/40">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3" stroke-width="2" /></svg>
        <span class="text-[8px] font-black uppercase tracking-widest">Inicio</span>
      </router-link>

      <router-link to="/tienda" class="flex-1 flex flex-col items-center gap-1 text-slate-400 dark:text-white/40">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke-width="2" /></svg>
        <span class="text-[8px] font-black uppercase tracking-widest">Tienda</span>
      </router-link>

      <div class="flex-1 flex flex-col items-center justify-end">
        <button @click="handleAgendarClick" class="relative -top-3 bg-ps-red text-white p-4 rounded-[1.2rem] shadow-xl active:scale-90 transition-transform mb-1 border-4 border-white dark:border-[#050505]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </button>
        <span class="text-[8px] font-black uppercase tracking-widest text-[#152C77] dark:text-white mt-1">Citas</span>
      </div>

      <button @click="isSupportSheetOpen = true" class="flex-1 flex flex-col items-center gap-1 text-[#25D366]">
        <svg viewBox="0 0 24 24" class="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span class="text-[8px] font-black uppercase tracking-widest">Soporte</span>
      </button>

      <div v-if="!tutorData" @click="isLoginOpen = true"
        class="flex-1 flex flex-col items-center gap-1 text-slate-400 dark:text-white/40 cursor-pointer">
        <div class="p-1 rounded-full border border-dashed border-slate-300 dark:border-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
        </div>
        <span class="text-[8px] font-black uppercase tracking-widest text-[#DE1F27]">Entrar</span>
      </div>

      <div v-else @click="router.push(activePet ? '/expediente' : '/seleccionar-perfil')"
        class="flex-1 flex flex-col items-center gap-1 text-slate-400 dark:text-white/40 cursor-pointer">
        <div class="w-6 h-6 rounded-full overflow-hidden border border-ps-blue dark:border-white">
          <img v-if="activePet?.fotoUrl" :src="activePet.fotoUrl" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full bg-ps-blue text-white flex items-center justify-center text-[8px] font-black">{{ activePet?.nombre?.charAt(0) || 'U' }}</div>
        </div>
        <span class="text-[8px] font-black uppercase tracking-widest text-ps-blue dark:text-white">Perfil</span>
      </div>

    </div>

    <Transition name="slide-up">
      <div v-if="isSupportSheetOpen" class="fixed inset-0 z-[6000] lg:hidden flex flex-col justify-end">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isSupportSheetOpen = false"></div>
        <div class="bg-slate-50 dark:bg-[#0A0A0A] rounded-t-[2.5rem] w-full relative pb-8 max-h-[85vh] overflow-hidden flex flex-col">
          <div class="w-full flex justify-center pt-4 pb-2 bg-white dark:bg-[#152C77] rounded-t-[2.5rem]" @click="isSupportSheetOpen = false">
            <div class="w-12 h-1.5 bg-slate-300 dark:bg-white/30 rounded-full"></div>
          </div>
          
          <div class="px-6 pb-6 pt-4 bg-white dark:bg-[#152C77] border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[#152C77] dark:bg-white/10 text-white rounded-full flex items-center justify-center shadow-lg">🤖</div>
              <div>
                <h3 class="font-[1000] text-[#152C77] dark:text-white uppercase italic text-sm">Asistente Virtual</h3>
                <p class="text-[9px] text-[#25D366] font-black uppercase">En línea</p>
              </div>
            </div>
            <button @click="isSupportSheetOpen = false" class="text-3xl text-slate-400">×</button>
          </div>

          <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            
            <div v-if="mobileChatStep === 'menu'" class="space-y-4">
              <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300">¡Guau! Hola 👋 ¿Para qué necesitas contactarnos hoy?</p>
              
              <button @click="handleMobileOption('agendar')" class="w-full text-left px-5 py-4 border rounded-2xl text-[11px] font-black uppercase tracking-widest italic border-[#152C77] text-[#152C77] dark:border-white/20 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 transition-all">
                📅 Agendar o Cambiar Cita
              </button>
              <button @click="mobileChatStep = 'info'" class="w-full text-left px-5 py-4 border rounded-2xl text-[11px] font-black uppercase tracking-widest italic border-[#152C77] text-[#152C77] dark:border-white/20 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 transition-all">
                📍 Ver Horarios y Sede
              </button>
              <button @click="mobileChatStep = 'viajes'" class="w-full text-left px-5 py-4 border rounded-2xl text-[11px] font-black uppercase tracking-widest italic border-[#152C77] text-[#152C77] dark:border-white/20 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 transition-all">
                ✈️ Viajar con mi mascota
              </button>
              <button @click="mobileChatStep = 'tienda'" class="w-full text-left px-5 py-4 border rounded-2xl text-[11px] font-black uppercase tracking-widest italic border-[#152C77] text-[#152C77] dark:border-white/20 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 transition-all">
                🛍️ Consultar Producto
              </button>
              <button @click="handleMobileOption('urgencia')" class="w-full text-left px-5 py-4 border rounded-2xl text-[11px] font-black uppercase tracking-widest italic border-[#DE1F27] text-white bg-[#DE1F27] active:scale-95 transition-all mt-4 animate-pulse shadow-lg shadow-red-500/30">
                🚨 Tengo una Urgencia
              </button>
            </div>

            <div v-else-if="mobileChatStep === 'info'" class="space-y-6">
              <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                Estamos en <strong class="text-[#DE1F27]">Chía, Cundinamarca</strong>.<br>
                Via Guaymaral 2km antes, Variante Chía - Cota.<br><br>
                <strong>⏰ Horarios:</strong><br>
                Lun - Sáb: 09:00 AM - 07:00 PM<br>
                Dom - Fest: 10:00 AM - 03:00 PM
              </p>
              <div class="space-y-3">
                <a href="https://maps.google.com/?q=Pet+Station+Chia" target="_blank" class="w-full text-center px-4 py-4 border rounded-2xl text-[11px] font-black uppercase tracking-widest italic border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 active:scale-95 transition-all block">
                  🗺️ Abrir en Google Maps
                </a>
                <button @click="mobileChatStep = 'menu'" class="w-full text-center px-4 py-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest italic border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 active:scale-95 transition-all">
                  ← Volver atrás
                </button>
              </div>
            </div>

            <div v-else-if="mobileChatStep === 'viajes'" class="space-y-4">
              <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300">✈️ Cuéntanos sobre el pasajero para darte la info correcta:</p>
              
              <select v-model="formViaje.destino" class="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#DE1F27] text-slate-600 dark:text-white">
                <option value="" disabled selected>🌍 Destino del Viaje</option>
                <option value="Estados Unidos">🇺🇸 Estados Unidos</option>
                <option value="Unión Europea">🇪🇺 Unión Europea</option>
                <option value="Latinoamérica">🌎 Latinoamérica</option>
                <option value="Nacional">🇨🇴 Nacional</option>
              </select>

              <div class="flex gap-3">
                <select v-model="formViaje.especie" class="w-1/2 px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#DE1F27] text-slate-600 dark:text-white">
                  <option value="" disabled selected>🐾 Especie</option>
                  <option value="Perro">🐶 Perro</option>
                  <option value="Gato">🐱 Gato</option>
                </select>
                <input v-model="formViaje.edad" type="text" placeholder="Edad" class="w-1/2 px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#DE1F27] text-slate-600 dark:text-white">
              </div>

              <input v-model="formViaje.fecha" type="text" placeholder="Fecha del viaje (Ej: Diciembre)" class="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#DE1F27] text-slate-600 dark:text-white">

              <div class="pt-4 space-y-3">
                <button @click="sendMobileViajeWA" :disabled="!isViajeFormValid" class="w-full px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest italic bg-[#25D366] text-white disabled:opacity-50 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
                  Enviar a Asesor
                </button>
                <button @click="mobileChatStep = 'menu'" class="w-full text-center px-4 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest italic border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 active:scale-95 transition-all">← Volver atrás</button>
              </div>
            </div>

            <div v-else-if="mobileChatStep === 'tienda'" class="space-y-4">
              <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300">🛍️ Escribe el medicamento o marca que buscas:</p>
              
              <input v-model="productoBuscado" type="text" placeholder="Ej: Nexgard, Royal Canin..." class="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[11px] font-bold outline-none focus:border-[#DE1F27] text-slate-600 dark:text-white">
              
              <div class="pt-4 space-y-3">
                <button @click="sendMobileProductoWA" :disabled="!productoBuscado.trim()" class="w-full px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest italic bg-[#25D366] text-white disabled:opacity-50 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
                  Consultar
                </button>
                <button @click="mobileChatStep = 'menu'" class="w-full text-center px-4 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest italic border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 active:scale-95 transition-all">← Volver atrás</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Transition>

    <main class="w-full pt-24 md:pt-0 pb-24 md:pb-0">
      <router-view 
        :key="availablePets.length" 
        v-if="!loadingSession" 
        :tutor="tutorData" 
        :pet="activePet" 
        :availablePets="availablePets" 
        @selected="handlePetSelection" 
        @notify="addNotify" 
        @create-new="isOnboardingOpen = true" 
        @login-success="handleLoginSuccess" 
        @delete-pet="handleDeletePet" 
        @update-pet="handleUpdatePet" 
        @update-tutor="handleUpdateTutor" 
      />
    </main>

    <TheFooter v-if="!isAdminRoute" :tutor="tutorData" />
    
    <WhatsappButton v-if="!isAdminRoute" class="hidden lg:flex" />
    
    <CartDrawer :is-open="isCartOpen" :tutor="tutorData" @close="isCartOpen = false" />

    <Transition name="fade">
      <div v-if="isLoginOpen || isOnboardingOpen"
        class="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <LoginModal v-if="isLoginOpen" @success="handleLoginSuccess"
          @goRegister="isLoginOpen = false; isOnboardingOpen = true" @close="isLoginOpen = false" @notify="addNotify" />
        <PetOnboarding v-if="isOnboardingOpen" :tutorExistente="tutorData" @finalizado="handleOnboardingFinish"
          @close="isOnboardingOpen = false" @notify="addNotify" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, onMounted, nextTick, onUnmounted, computed, watch } from 'vue'; 
import { useRouter } from 'vue-router';
import { useCartStore } from './stores/cartStore';
import api from '@/api/axios';
import LoginModal from './components/auth/LoginModal.vue';
import PetOnboarding from './components/auth/PetOnboarding.vue';
import CartDrawer from './components/cart/CartDrawer.vue';
import TheFooter from './components/TheFooter.vue';
import WhatsappButton from './components/shared/WhatsappButton.vue';
import { useRoute } from 'vue-router';

const route = useRoute(); // 2. Declara esto
const isAdminRoute = computed(() => route.path.startsWith('/admin'));

const router = useRouter();
const cartStore = useCartStore();
const darkMode = ref(false);
const isScrolled = ref(false);
const isCartOpen = ref(false);
const tutorData = ref(null);
const activePet = ref(null);
const availablePets = ref([]);
const loadingSession = ref(true);
const isLoginOpen = ref(false);
const isOnboardingOpen = ref(false);
const notifications = ref([]);

// --- ESTADOS DEL CHATBOT MÓVIL ---
const isSupportSheetOpen = ref(false);
const mobileChatStep = ref('menu');
const productoBuscado = ref('');
const formViaje = ref({ destino: '', especie: '', edad: '', fecha: '' });

const isViajeFormValid = computed(() => {
  return formViaje.value.destino && formViaje.value.especie && formViaje.value.edad.trim() !== '' && formViaje.value.fecha.trim() !== '';
});

watch(isSupportSheetOpen, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      mobileChatStep.value = 'menu';
      productoBuscado.value = '';
      formViaje.value = { destino: '', especie: '', edad: '', fecha: '' };
    }, 300);
  }
});

const handleMobileOption = (opcion) => {
  if (opcion === 'agendar') {
    isSupportSheetOpen.value = false;
    router.push('/agendar');
    return;
  }
  
  let textoWA = "Hola Pet Station, me gustaría hablar con un asesor.";
  if (opcion === 'urgencia') textoWA = "🚨 URGENCIA VETERINARIA: Necesito atención inmediata por favor.";
  
  isSupportSheetOpen.value = false;
  window.open(`https://wa.me/573053462413?text=${encodeURIComponent(textoWA)}`, '_blank');
};

const sendMobileViajeWA = () => {
  if (!isViajeFormValid.value) return;
  const textoWA = `Hola Pet Station! ✈️ Necesito asesoría de viaje:\n\n🌍 *Destino:* ${formViaje.value.destino}\n🐾 *Especie:* ${formViaje.value.especie}\n🎂 *Edad:* ${formViaje.value.edad}\n📅 *Fecha:* ${formViaje.value.fecha}`;
  isSupportSheetOpen.value = false;
  window.open(`https://wa.me/573208221778?text=${encodeURIComponent(textoWA)}`, '_blank');
};

const sendMobileProductoWA = () => {
  if (!productoBuscado.value.trim()) return;
  const textoWA = `Hola Pet Station! 🛍️ Busco disponibilidad/precio de: *${productoBuscado.value}*`;
  isSupportSheetOpen.value = false;
  window.open(`https://wa.me/573053462413?text=${encodeURIComponent(textoWA)}`, '_blank');
};
// ---------------------------------

const toggleTheme = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle('dark', darkMode.value);
  localStorage.setItem('ps_theme', darkMode.value ? 'dark' : 'light');
};

const addNotify = (n) => {
  const message = n.msg || n.message || n;
  const type = n.type || 'success';
  const id = Date.now();
  notifications.value.push({ id, message, type });
  setTimeout(() => notifications.value = notifications.value.filter(x => x.id !== id), 4000);
};

const handleLoginSuccess = async (data) => {
  const tutor = data.id ? data : data.tutor;
  const token = data.token || localStorage.getItem('ps_token');
  const esNuevo = data.esNuevoDeGoogle || false;
  
  localStorage.setItem('ps_token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  tutorData.value = tutor;
  availablePets.value = tutor.mascotas || [];
  
  if (availablePets.value.length > 0 && !activePet.value) {
    activePet.value = availablePets.value[availablePets.value.length - 1];
    localStorage.setItem('ps_active_pet', JSON.stringify(activePet.value));
  }

  saveSession();
  isLoginOpen.value = false;
  
  await nextTick();
  
  if (tutor.rol === 'ROLE_ADMIN' || tutor.rol === 'ADMIN') {
    router.push('/admin/dashboard');
  } else if (esNuevo || availablePets.value.length === 0) {
    isOnboardingOpen.value = true;
  } else {
    router.push('/expediente');
  }
};

const handlePetSelection = (pet) => {
  activePet.value = pet;
  localStorage.setItem('ps_active_pet', JSON.stringify(pet));
  saveSession();
  router.push('/expediente');
};

const saveSession = () => {
  localStorage.setItem('ps_session', JSON.stringify({
    tutor: tutorData.value, pet: activePet.value, pets: availablePets.value
  }));
};

const handleLogout = () => {
  localStorage.removeItem('ps_session');
  localStorage.removeItem('ps_token');
  localStorage.removeItem('ps_active_pet');
  tutorData.value = null; activePet.value = null; availablePets.value = [];
  delete api.defaults.headers.common['Authorization'];
  router.push('/');
};

const handleAgendarClick = () => {
  router.push('/agendar');
};

onMounted(async () => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 30;
  });

  darkMode.value = localStorage.getItem('ps_theme') === 'dark';
  document.documentElement.classList.toggle('dark', darkMode.value);

  const params = new URLSearchParams(window.location.search);
  if (params.get('sesion_expirada')) {
    addNotify({ msg: "Tu sesión ha expirado por seguridad. Ingresa nuevamente.", type: "warning" });
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const saved = localStorage.getItem('ps_session');
  const token = localStorage.getItem('ps_token');
  
  if (saved && token) {
    try {
      const session = JSON.parse(saved);
      tutorData.value = session.tutor;
      availablePets.value = session.pets || [];
      activePet.value = session.pet;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (err) {
      console.warn("Error parseando la sesión guardada:", err);
    }
  }

  if (token) {
    const rol = tutorData.value?.rol || '';
    if (['ROLE_ADMIN', 'ADMIN'].includes(rol)) {
      loadingSession.value = false;
      return; 
    }

    try {
      const { data } = await api.get('/tutores/me'); 
      tutorData.value = data;
      availablePets.value = data.mascotas || [];
      
      if (activePet.value) {
        const sigueExistiendo = availablePets.value.find(p => p.id === activePet.value.id);
        if (!sigueExistiendo) {
          activePet.value = null; 
          localStorage.removeItem('ps_active_pet');
        } else {
          activePet.value = sigueExistiendo;
        }
      }
      saveSession(); 
    } catch (e) {
      if (e.response && (e.response.status === 401 || e.response.status === 403)) handleLogout();
    }
  }
  loadingSession.value = false;
});

const handleOnboardingFinish = (dataRecibida) => {
  isOnboardingOpen.value = false;
  let nuevaMascotaReal = null;
  if (dataRecibida.mascotas && Array.isArray(dataRecibida.mascotas)) {
    if (dataRecibida.mascotas.length > 0) nuevaMascotaReal = dataRecibida.mascotas[dataRecibida.mascotas.length - 1];
  } else if (dataRecibida.especie && dataRecibida.nombre) {
    nuevaMascotaReal = dataRecibida;
  } else if (dataRecibida.data && dataRecibida.data.especie) {
    nuevaMascotaReal = dataRecibida.data;
  }

  if (nuevaMascotaReal && nuevaMascotaReal.id) {
    availablePets.value.push(nuevaMascotaReal);
    if (tutorData.value) {
      if (!tutorData.value.mascotas) tutorData.value.mascotas = [];
      if (!tutorData.value.mascotas.find(p => p.id === nuevaMascotaReal.id)) tutorData.value.mascotas.push(nuevaMascotaReal);
    }
    saveSession();
    addNotify({ type: 'success', message: '¡Mascota agregada correctamente!' });
    handlePetSelection(nuevaMascotaReal);
  } else {
    refreshUserData();
  }
};

const refreshUserData = async () => {
  try {
    const { data } = await api.get('/tutores/me'); 
    tutorData.value = data;
    availablePets.value = data.mascotas || [];
    saveSession();
    if (availablePets.value.length > 0) handlePetSelection(availablePets.value[availablePets.value.length - 1]);
  } catch (e) { console.error("Error", e); }
};

const handleDeletePet = async (petId) => {
  const result = await Swal.fire({
    title: '¿ELIMINAR MASCOTA?',
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DE1F27', cancelButtonColor: '#152C77', confirmButtonText: 'SÍ, BORRAR', cancelButtonText: 'CANCELAR',
    reverseButtons: true, customClass: { popup: 'rounded-[2rem] font-sans' }
  });

  if (!result.isConfirmed) return;

  try {
    Swal.showLoading();
    await api.delete(`/mascotas/${petId}`);
    availablePets.value = availablePets.value.filter(p => p.id !== petId);
    if (tutorData.value && tutorData.value.mascotas) tutorData.value.mascotas = tutorData.value.mascotas.filter(p => p.id !== petId);
    if (activePet.value && activePet.value.id === petId) { activePet.value = null; localStorage.removeItem('ps_active_pet'); }
    saveSession();
    Swal.fire({ icon: 'success', title: '¡ELIMINADA!', timer: 2000, showConfirmButton: false });
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'ERROR', text: 'Error al eliminar mascota' });
  }
};

const handleUpdatePet = (petActualizada) => {
  if (activePet.value && activePet.value.id === petActualizada.id) activePet.value = petActualizada;
  const index = availablePets.value.findIndex(p => p.id === petActualizada.id);
  if (index !== -1) availablePets.value[index] = petActualizada;
  if (tutorData.value && tutorData.value.mascotas) {
    const tIndex = tutorData.value.mascotas.findIndex(p => p.id === petActualizada.id);
    if (tIndex !== -1) tutorData.value.mascotas[tIndex] = petActualizada;
  }
  saveSession();
};

const handleUpdateTutor = (tutorActualizado) => {
  const mascotasBackup = tutorData.value.mascotas;
  tutorData.value = { ...tutorActualizado, mascotas: mascotasBackup };
  saveSession();
};

onUnmounted(() => { window.removeEventListener('scroll', () => isScrolled.value = window.scrollY > 30); });
</script>

<style scoped>
@reference "./style.css";

.nav-desktop-link { @apply text-[11px] font-[1000] uppercase italic tracking-widest text-ps-blue dark:text-white/60 hover:text-ps-red dark:hover:text-white transition-all cursor-pointer; }
.router-link-active.nav-desktop-link { @apply text-ps-red dark:text-white; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.router-link-active svg { @apply text-ps-red; }
.router-link-active span { @apply text-ps-red; }

/* Animación del Bottom Sheet (Sube desde abajo) */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; }
</style>