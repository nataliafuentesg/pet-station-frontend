<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-24 pb-44 transition-colors duration-500 font-sans overflow-x-hidden text-slate-900 dark:text-white">
    <div class="max-w-[1700px] mx-auto px-4 md:px-8">

      <header class="mb-12 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div @click="resetTienda" class="cursor-pointer group text-center lg:text-left">
          <h1 class="text-6xl md:text-8xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white leading-none">
            PET <span class="text-[#DE1F27]">SHOP.</span>
          </h1>
          <p class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2 italic">
            Premium Veterinary Inventory
          </p>
        </div>

        <div class="w-full lg:w-[500px] relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-[#152C77] to-[#DE1F27] rounded-3xl blur opacity-10 transition duration-500"></div>
          <!-- Móvil: botón que abre el overlay -->
          <div class="lg:hidden relative flex items-center bg-slate-50 dark:bg-white/5 rounded-3xl border-2 border-slate-200 dark:border-white/10 px-6 py-4 shadow-sm cursor-pointer"
               @click="openMobileSearch">
            <span class="flex-1 text-[11px] font-[1000] uppercase tracking-widest text-slate-300 dark:text-white/20 select-none">BUSCAR PRODUCTO O MARCA...</span>
            <span class="text-xl ml-4">🔍</span>
          </div>
          <!-- Desktop: input real -->
          <div class="hidden lg:flex relative items-center bg-slate-50 dark:bg-white/5 rounded-3xl border-2 border-slate-200 dark:border-white/10 px-8 py-4 shadow-sm">
            <input v-model="searchQuery" @input="onSearch" type="text" placeholder="BUSCAR PRODUCTO O MARCA..."
              class="w-full bg-transparent text-[11px] font-[1000] uppercase tracking-widest outline-none dark:text-white" />
            <span class="text-xl ml-4">🔍</span>
          </div>
        </div>
      </header>

      <Transition name="fade-scale" mode="out-in">
        <section v-if="!pasilloSeleccionado && !searchQuery" class="py-10">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 md:gap-8">
            <div v-for="p in pasillosCards" :key="p.id" @click="setPasillo(p.name)"
              class="group cursor-pointer relative aspect-square bg-slate-50 dark:bg-white/5 rounded-[3.5rem] flex flex-col items-center justify-center p-10 border-2 border-transparent hover:border-[#DE1F27] transition-all duration-500 hover:-translate-y-4 shadow-sm hover:shadow-2xl">
              <div class="text-[100px] mb-6 transform group-hover:scale-110 transition-transform duration-700">{{ p.icon }}</div>
              <h3 class="text-2xl font-[1000] uppercase italic text-[#152C77] dark:text-white">{{ p.name }}</h3>
              <div v-if="p.isPersonalized && mascotaActiva"
                class="absolute -top-4 bg-[#DE1F27] text-white px-6 py-2 rounded-xl font-black italic text-[9px] shadow-2xl animate-bounce">
                ✨ MODO: {{ mascotaActiva.nombre }}
              </div>
            </div>
            <div @click="setPasillo('TODOS')"
              class="group cursor-pointer aspect-square bg-[#152C77] rounded-[3.5rem] flex flex-col items-center justify-center p-10 hover:bg-[#DE1F27] transition-all duration-500 shadow-xl">
              <div class="text-5xl mb-6">📦</div>
              <h3 class="text-xl font-[1000] uppercase italic text-white text-center leading-none">CATÁLOGO<br />COMPLETO</h3>
            </div>
          </div>
        </section>

        <div v-else class="flex flex-col lg:flex-row gap-16 pt-10">

          <aside class="hidden lg:block w-72 shrink-0 sticky top-40 h-fit space-y-12">
            <div v-if="filterByMascota && mascotaActiva" class="p-8 bg-[#152C77] text-white rounded-[3rem] shadow-2xl space-y-4 border-b-8 border-black/20">
              <p class="text-[9px] font-black uppercase opacity-60">Filtro Inteligente:</p>
              <h4 class="text-3xl font-[1000] uppercase italic">{{ mascotaActiva.nombre }}</h4>
              <div class="text-[10px] font-bold uppercase tracking-widest space-y-1 opacity-80 italic">
                <p>🧬 {{ mascotaActiva.especie }}</p>
                <p>⚖️ {{ mascotaActiva.pesoActual }}KG | 🕒 {{ autoEtapa }}</p>
              </div>
              <button @click="resetTienda" class="w-full py-3 bg-[#DE1F27] text-white rounded-xl font-black uppercase text-[9px] hover:scale-105 transition-transform">Desactivar</button>
            </div>
            <button v-else @click="resetTienda"
              class="w-full flex items-center justify-center gap-3 px-6 py-5 bg-[#DE1F27] text-white rounded-2xl font-[1000] uppercase italic text-[10px] shadow-xl hover:bg-[#152C77] transition-all">← REGRESAR</button>

            <div class="space-y-10">
              <div v-for="(label, key) in filterGroups" :key="key" class="space-y-4">
                <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-[#DE1F27] italic">{{ label }}</h4>
                <div class="flex flex-col gap-2.5">
                  <button v-for="opt in getOptions(key)" :key="opt" @click="setFilter(key, opt)"
                    :class="isFilterActive(key, opt) ? 'bg-[#152C77] text-white shadow-xl translate-x-2' : 'bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-[#152C77]'"
                    class="w-full text-left px-5 py-3.5 rounded-xl text-[10px] font-[1000] uppercase italic transition-all">{{ opt }}</button>
                </div>
              </div>

              <div v-if="uniqueSubcategories.length > 0" class="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
                <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-[#DE1F27] italic">Sección Específica</h4>
                <div class="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                  <button @click="activeSubcategory = 'TODOS'"
                    :class="activeSubcategory === 'TODOS' ? 'bg-[#152C77] text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'"
                    class="px-4 py-2 rounded-xl text-[9px] font-black uppercase italic transition-all">Todas</button>
                  <button v-for="sub in uniqueSubcategories" :key="sub" @click="activeSubcategory = sub"
                    :class="activeSubcategory === sub ? 'bg-[#DE1F27] text-white' : 'bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-[#152C77]'"
                    class="px-4 py-2 rounded-xl text-[9px] font-black uppercase italic transition-all border border-slate-200 dark:border-white/10">{{ sub }}</button>
                </div>
              </div>

              <div class="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
                <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-[#DE1F27] italic">Marca</h4>
                <select v-model="activeMarca" class="clean-select">
                  <option value="TODOS">Todas las marcas</option>
                  <option v-for="m in uniqueMarcas" :key="m" :value="m">{{ m }}</option>
                </select>
              </div>
            </div>
          </aside>

          <main class="flex-1">
            <nav class="flex gap-2 overflow-x-auto no-scrollbar pb-6 mb-10 border-b dark:border-white/5">
              <button v-for="p in pasillosCards" :key="p.id" @click="setPasillo(p.name)"
                :class="activeCategory === p.name || (p.isPersonalized && filterByMascota) ? 'bg-[#152C77] text-white shadow-xl scale-105 border-[#152C77]' : 'bg-slate-50 dark:bg-white/5 text-slate-400 border-transparent hover:text-[#DE1F27] hover:border-[#DE1F27]/20'"
                class="px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase italic whitespace-nowrap transition-all border-2 flex items-center gap-2">
                <span>{{ p.icon }}</span> {{ p.name }}
              </button>
              <button @click="setPasillo('TODOS')"
                :class="activeCategory === 'TODOS' && !filterByMascota ? 'bg-[#DE1F27] text-white border-[#DE1F27]' : 'bg-slate-100 dark:bg-white/10 border-transparent text-slate-400'"
                class="px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase italic whitespace-nowrap transition-all border-2">📦 TODOS</button>
            </nav>

            <!-- Chips de búsqueda activa (desktop) -->
            <div v-if="searchQuery" class="hidden lg:flex flex-wrap gap-2 mb-6">
              <span class="flex items-center gap-2 bg-[#152C77] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase italic">
                🔍 {{ searchQuery }}
                <button @click="searchQuery = ''; onSearch()" class="ml-1 text-white/60 hover:text-white">✕</button>
              </span>
              <span class="text-[10px] font-black uppercase text-slate-400 self-center">
                {{ filteredProducts.length }} resultado{{ filteredProducts.length !== 1 ? 's' : '' }}
              </span>
            </div>

            <div class="mb-12">
              <h2 class="text-4xl md:text-7xl font-[1000] uppercase italic dark:text-white tracking-tighter leading-none mb-4">{{ dynamicTitle }}</h2>
              <!-- Botones móvil -->
              <div class="flex gap-2 lg:hidden">
                <button v-if="filterByMascota || pasilloSeleccionado" @click="resetTienda"
                  class="bg-[#DE1F27] text-white px-4 py-3 rounded-xl text-[9px] font-black uppercase italic">✕ Salir</button>
                <button @click="showMobileFilters = true"
                  class="relative bg-[#152C77] text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase italic flex items-center gap-2 shadow-lg">
                  <span>⚙️</span> Filtrar
                  <span v-if="activeFiltersCount > 0"
                    class="absolute -top-2 -right-2 bg-[#DE1F27] text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {{ activeFiltersCount }}
                  </span>
                </button>
              </div>
            </div>

            <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
              <div v-for="i in 6" :key="i" class="bg-slate-100 dark:bg-white/5 rounded-[3rem] p-6 h-[400px] animate-pulse"></div>
            </div>

            <div v-else-if="paginatedProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
              <div v-for="p in paginatedProducts" :key="p.id"
                :class="['group relative flex flex-col bg-slate-50 dark:bg-[#0A0A0A] p-6 rounded-[3rem] transition-all border-2 shadow-sm', p.stock <= 0 ? 'opacity-60 grayscale border-slate-200 pointer-events-none' : 'border-transparent hover:border-[#DE1F27]/20 hover:shadow-2xl']">
                <router-link :to="{ name: 'ProductoDetalle', params: { id: crearSlug(p.id, p.nombre) } }" class="block relative w-full mb-4">
                  <div v-if="p.presentacion" class="absolute top-4 left-4 bg-[#DE1F27] px-3 py-1.5 rounded-xl shadow-lg z-20">
                    <span class="text-[8px] font-black text-white uppercase tracking-widest">{{ p.presentacion }}</span>
                  </div>
                  <div class="relative w-full aspect-square overflow-hidden rounded-[2rem] bg-white dark:bg-white/5 p-4 flex items-center justify-center">
                    <img v-if="p.fotosUrls?.length" :src="p.fotosUrls[0]" class="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110 z-10">
                  </div>
                  <div v-if="p.stock <= 0" class="absolute inset-0 z-30 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] rounded-[2rem] flex items-center justify-center">
                    <span class="bg-slate-800 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Agotado</span>
                  </div>
                </router-link>

                <div class="flex-1 px-2 space-y-4">
                  <router-link :to="{ name: 'ProductoDetalle', params: { id: crearSlug(p.id, p.nombre) } }" class="pointer-events-auto">
                    <div class="flex items-center justify-between mb-2">
                      <p class="text-[9px] font-black text-[#DE1F27] uppercase tracking-widest italic opacity-70 truncate pr-2">{{ p.marca }}</p>
                      <span v-if="p.requiereReceta" class="shrink-0 bg-red-50 dark:bg-[#DE1F27]/10 text-[#DE1F27] border border-[#DE1F27]/30 px-2 py-0.5 rounded-md text-[7px] font-[1000] uppercase tracking-widest animate-pulse">📋 Fórmula</span>
                    </div>
                    <h3 class="text-xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight mb-4 h-12 line-clamp-2">{{ p.nombre }}</h3>
                  </router-link>
                  <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
                    <span class="text-3xl font-[1000] dark:text-white italic text-[#152C77] tracking-tighter">${{ p.precio.toLocaleString() }}</span>
                    <button v-if="p.stock > 0 && TIENDA_ACTIVA" @click="onAddToCart(p)" class="pointer-events-auto w-12 h-12 bg-[#152C77] hover:bg-[#DE1F27] text-white rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all font-bold">🛒</button>
                    <span v-else-if="!TIENDA_ACTIVA" class="text-2xl opacity-30">🚧</span>
                    <span v-else class="text-2xl opacity-30">🚫</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-20 opacity-50">
              <p class="text-xl font-black uppercase text-slate-400">No encontramos productos así 🥺</p>
            </div>

            <div v-if="hasMore" class="mt-20 flex justify-center pb-20">
              <button @click="loadMore" class="px-12 py-5 bg-slate-100 dark:bg-white/5 rounded-full font-[1000] uppercase italic text-[9px] tracking-[0.4em] hover:bg-[#DE1F27] hover:text-white transition-all">Cargar más ↓</button>
            </div>
          </main>
        </div>
      </Transition>
    </div>

    <!-- ═══════════════════════════════════════════════
         FILTROS — BOTTOM SHEET MÓVIL
    ════════════════════════════════════════════════ -->
    <Transition name="slide-up">
      <div v-if="showMobileFilters" class="fixed inset-0 z-[5000] lg:hidden">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showMobileFilters = false"></div>
        <div class="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#0D0D0D] rounded-t-[2rem] max-h-[88vh] flex flex-col shadow-2xl">

          <!-- Handle -->
          <div class="flex justify-center pt-3 pb-1 shrink-0">
            <div class="w-10 h-1 rounded-full bg-slate-200 dark:bg-white/20"></div>
          </div>

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-3 border-b border-slate-100 dark:border-white/10 shrink-0">
            <div class="flex items-center gap-3">
              <h3 class="text-lg font-[1000] uppercase italic dark:text-white">Filtrar</h3>
              <span v-if="activeFiltersCount > 0" class="bg-[#DE1F27] text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase">
                {{ activeFiltersCount }} activo{{ activeFiltersCount !== 1 ? 's' : '' }}
              </span>
            </div>
            <div class="flex items-center gap-4">
              <button v-if="activeFiltersCount > 0" @click="clearFilters"
                class="text-[10px] font-black uppercase italic text-[#DE1F27]">Limpiar todo</button>
              <button @click="showMobileFilters = false"
                class="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-white/10 rounded-full text-slate-500 dark:text-white font-bold text-base">✕</button>
            </div>
          </div>

          <!-- Scroll content -->
          <div class="flex-1 overflow-y-auto px-6 py-5 space-y-7 no-scrollbar">

            <div v-for="(label, key) in filterGroups" :key="key" class="space-y-3">
              <p class="text-[10px] font-black uppercase text-[#DE1F27] tracking-widest italic">{{ label }}</p>
              <div class="flex flex-wrap gap-2">
                <button v-for="opt in getOptions(key)" :key="opt" @click="setFilter(key, opt)"
                  :class="isFilterActive(key, opt)
                    ? 'bg-[#152C77] text-white shadow-md'
                    : 'bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-white/60'"
                  class="px-5 py-3 rounded-2xl text-[10px] font-black uppercase italic transition-all active:scale-95 min-w-[72px] text-center">
                  {{ opt }}
                </button>
              </div>
            </div>

            <div v-if="uniqueSubcategories.length > 0" class="space-y-3">
              <p class="text-[10px] font-black uppercase text-[#DE1F27] tracking-widest italic">Sección</p>
              <div class="flex flex-wrap gap-2">
                <button @click="activeSubcategory = 'TODOS'; currentPage = 1"
                  :class="activeSubcategory === 'TODOS' ? 'bg-[#152C77] text-white' : 'bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-white/60'"
                  class="px-5 py-3 rounded-2xl text-[10px] font-black uppercase italic transition-all active:scale-95">Todas</button>
                <button v-for="sub in uniqueSubcategories" :key="sub"
                  @click="activeSubcategory = sub; currentPage = 1; closeMobileFiltersDelayed()"
                  :class="activeSubcategory === sub ? 'bg-[#DE1F27] text-white' : 'bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-white/60'"
                  class="px-5 py-3 rounded-2xl text-[10px] font-black uppercase italic transition-all active:scale-95">{{ sub }}</button>
              </div>
            </div>

            <div class="space-y-3">
              <p class="text-[10px] font-black uppercase text-[#DE1F27] tracking-widest italic">Marca</p>
              <div class="flex flex-wrap gap-2">
                <button @click="activeMarca = 'TODOS'; currentPage = 1"
                  :class="activeMarca === 'TODOS' ? 'bg-[#152C77] text-white' : 'bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-white/60'"
                  class="px-4 py-2.5 rounded-2xl text-[9px] font-black uppercase italic transition-all active:scale-95">Todas</button>
                <button v-for="m in uniqueMarcas" :key="m"
                  @click="activeMarca = m; currentPage = 1; closeMobileFiltersDelayed()"
                  :class="activeMarca === m ? 'bg-[#DE1F27] text-white' : 'bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-white/60'"
                  class="px-4 py-2.5 rounded-2xl text-[9px] font-black uppercase italic transition-all active:scale-95">{{ m }}</button>
              </div>
            </div>

          </div>

          <!-- Bottom CTA -->
          <div class="px-5 py-4 border-t border-slate-100 dark:border-white/10 shrink-0" style="padding-bottom: max(16px, env(safe-area-inset-bottom))">
            <button @click="showMobileFilters = false"
              class="w-full bg-[#152C77] text-white py-4 rounded-2xl font-black uppercase text-[11px] italic shadow-xl active:scale-[0.98] transition-transform">
              Ver {{ filteredProducts.length }} resultado{{ filteredProducts.length !== 1 ? 's' : '' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════════════
         BÚSQUEDA — OVERLAY FULLSCREEN MÓVIL
    ════════════════════════════════════════════════ -->
    <Transition name="fade-overlay">
      <div v-if="mobileSearchOpen" class="fixed inset-0 z-[6000] lg:hidden flex flex-col bg-white dark:bg-[#050505]">

        <!-- Barra superior -->
        <div class="flex items-center gap-3 px-4 py-3 shrink-0 border-b border-slate-100 dark:border-white/10"
             style="padding-top: max(12px, env(safe-area-inset-top))">
          <button @click="closeMobileSearch"
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white text-lg font-bold shrink-0 active:scale-90 transition-transform">
            ←
          </button>
          <div class="flex-1 flex items-center bg-slate-100 dark:bg-white/10 rounded-2xl px-4 py-3 gap-2">
            <span class="text-base shrink-0">🔍</span>
            <input ref="mobileSearchInputRef"
                   v-model="mobileSearchQuery"
                   type="search"
                   autocomplete="off"
                   autocorrect="off"
                   spellcheck="false"
                   placeholder="Buscar producto o marca..."
                   class="flex-1 bg-transparent text-[13px] font-bold outline-none dark:text-white placeholder:text-slate-400 placeholder:font-normal min-w-0" />
            <button v-if="mobileSearchQuery" @click="mobileSearchQuery = ''"
              class="text-slate-400 dark:text-white/40 text-lg leading-none shrink-0 w-6 h-6 flex items-center justify-center active:scale-90 transition-transform">✕</button>
          </div>
        </div>

        <!-- Contenido scrollable -->
        <div class="flex-1 overflow-y-auto" style="padding-bottom: max(80px, env(safe-area-inset-bottom))">

          <!-- Sin query: categorías -->
          <div v-if="!mobileSearchQuery" class="px-4 pt-6 space-y-6">
            <div>
              <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mb-4">Explorar categoría</p>
              <div class="grid grid-cols-2 gap-3">
                <button v-for="p in pasillosCards" :key="p.id"
                        @click="selectMobileCategory(p.name)"
                        class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-left active:scale-95 transition-transform border border-slate-100 dark:border-white/5">
                  <span class="text-2xl shrink-0">{{ p.icon }}</span>
                  <span class="text-[11px] font-black uppercase italic text-[#152C77] dark:text-white leading-tight">{{ p.name }}</span>
                </button>
              </div>
              <button @click="selectMobileCategory('TODOS')"
                class="mt-3 w-full flex items-center gap-3 p-4 bg-[#152C77] rounded-2xl text-left active:scale-[0.98] transition-transform">
                <span class="text-2xl shrink-0">📦</span>
                <span class="text-[11px] font-black uppercase italic text-white">Ver todo el catálogo</span>
              </button>
            </div>
          </div>

          <!-- Con query: sugerencias + resultados -->
          <div v-else class="px-4 pt-4 space-y-5">

            <!-- Sugerencias de marcas y categorías -->
            <div v-if="mobileSuggestions.length" class="space-y-2">
              <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">Sugerencias</p>
              <div class="flex flex-wrap gap-2">
                <button v-for="s in mobileSuggestions" :key="s.type + s.value"
                        @click="applyMobileSuggestion(s)"
                        class="flex items-center gap-1.5 px-4 py-2.5 bg-[#152C77]/8 dark:bg-white/8 text-[#152C77] dark:text-white/80 rounded-full text-[10px] font-black uppercase italic active:scale-95 transition-transform border border-[#152C77]/10 dark:border-white/10">
                  <span>{{ s.icon }}</span> {{ s.label }}
                </button>
              </div>
            </div>

            <!-- Contador + Ver todos -->
            <div v-if="mobileFilteredProducts.length" class="flex items-center justify-between">
              <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">
                {{ mobileFilteredProducts.length }} resultado{{ mobileFilteredProducts.length !== 1 ? 's' : '' }}
              </p>
              <button @click="applyMobileSearch"
                class="px-5 py-2 bg-[#DE1F27] text-white rounded-xl text-[9px] font-black uppercase italic active:scale-95 transition-transform">
                Ver todos →
              </button>
            </div>

            <!-- Lista de productos -->
            <div v-if="mobileFilteredProducts.length" class="space-y-2 pb-4">
              <router-link v-for="p in mobileFilteredProducts.slice(0, 12)" :key="p.id"
                           :to="{ name: 'ProductoDetalle', params: { id: crearSlug(p.id, p.nombre) } }"
                           @click="closeMobileSearch"
                           class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 active:bg-slate-100 dark:active:bg-white/10 transition-colors">
                <div class="w-14 h-14 rounded-xl bg-white dark:bg-white/5 shrink-0 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-white/5">
                  <img v-if="p.fotosUrls?.length" :src="p.fotosUrls[0]" class="w-full h-full object-contain p-1" loading="lazy">
                  <span v-else class="text-2xl">🐾</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[11px] font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight line-clamp-2">{{ p.nombre }}</p>
                  <p class="text-[9px] text-[#DE1F27] font-bold mt-0.5 uppercase italic">{{ p.marca }}</p>
                </div>
                <p class="text-[13px] font-[1000] italic text-[#152C77] dark:text-white shrink-0">${{ p.precio?.toLocaleString() }}</p>
              </router-link>
            </div>

            <!-- Sin resultados -->
            <div v-else class="py-16 text-center space-y-3">
              <p class="text-5xl">🔍</p>
              <p class="text-[12px] font-black uppercase text-slate-400 dark:text-white/30">Sin resultados</p>
              <p class="text-[10px] text-slate-300 dark:text-white/20">Prueba con otro término</p>
            </div>

          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useProductStore } from '../../stores/productStore';
import { useCartStore } from '../../stores/cartStore';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useTracking } from '@/composables/useTracking';
import { TIENDA_ACTIVA } from '@/config';

const productStore = useProductStore();
const cartStore = useCartStore();
const router = useRouter();
const emit = defineEmits(['notify']);
const { trackAddToCart } = useTracking();

const pasilloSeleccionado = ref(false);
const showMobileFilters = ref(false);
const searchQuery = ref('');
const activeCategory = ref('TODOS');
const activeSubcategory = ref('TODOS');
const mascotaActiva = ref(null);
const filterByMascota = ref(false);
const isLoading = ref(true);

const activeSpecies = ref('TODOS');
const activeEtapa = ref('TODOS');
const activePeso = ref('TODOS');
const activeMarca = ref('TODOS');
const currentPage = ref(1);
const itemsPerPage = 12;

// Búsqueda móvil overlay
const mobileSearchOpen = ref(false);
const mobileSearchQuery = ref('');
const mobileSearchInputRef = ref(null);

const openMobileSearch = () => {
  mobileSearchOpen.value = true;
  nextTick(() => {
    setTimeout(() => mobileSearchInputRef.value?.focus(), 100);
  });
};

const closeMobileSearch = () => {
  mobileSearchOpen.value = false;
  mobileSearchQuery.value = '';
};

const applyMobileSearch = () => {
  searchQuery.value = mobileSearchQuery.value;
  onSearch();
  closeMobileSearch();
};

const selectMobileCategory = (cat) => {
  setPasillo(cat);
  closeMobileSearch();
};

const applyMobileSuggestion = (s) => {
  if (s.type === 'brand') {
    if (!pasilloSeleccionado.value) {
      activeCategory.value = 'TODOS';
      pasilloSeleccionado.value = true;
    }
    activeMarca.value = s.value;
    currentPage.value = 1;
  } else if (s.type === 'category') {
    setPasillo(s.value);
  }
  closeMobileSearch();
};

const mobileFilteredProducts = computed(() => {
  const q = mobileSearchQuery.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (!q) return [];
  return productStore.allProducts.filter(p => {
    const text = `${p.nombre} ${p.marca} ${p.categoria} ${p.subcategoria || ''}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    return q.split(' ').every(t => text.includes(t));
  });
});

const mobileSuggestions = computed(() => {
  const q = mobileSearchQuery.value.toLowerCase();
  if (!q || q.length < 2) return [];
  const results = [];
  uniqueMarcas.value
    .filter(m => m.toLowerCase().includes(q))
    .slice(0, 3)
    .forEach(m => results.push({ type: 'brand', label: m, value: m, icon: '🏷️' }));
  pasillosCards.value
    .filter(p => p.name.toLowerCase().includes(q))
    .forEach(p => results.push({ type: 'category', label: p.name, value: p.name, icon: p.icon }));
  return results.slice(0, 5);
});

// GTM
const trackCategoryView = (cat) => {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'view_item_list',
      item_list_name: cat,
      ecommerce: { items: filteredProducts.value.slice(0, 5).map(p => ({ item_id: p.id, item_name: p.nombre, item_category: p.categoria })) }
    });
  }
};
const trackSearch = (term) => {
  if (window.dataLayer && term.length > 3) window.dataLayer.push({ event: 'view_search_results', search_term: term });
};

const crearSlug = (id, nombre) => {
  const cleanName = (nombre || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  return `${cleanName}-${id}`;
};

const isLoggedIn = computed(() => !!localStorage.getItem('ps_token'));

const pasillosCards = computed(() => {
  const cards = [
    { id: 1, name: 'NUTRICIÓN', icon: '🥩' },
    { id: 2, name: 'FARMACIA', icon: '💊' },
    { id: 3, name: 'HIGIENE', icon: '🧼' },
    { id: 4, name: 'ACCESORIOS', icon: '🎾' }
  ];
  if (isLoggedIn.value) cards.push({ id: 5, name: 'PERSONALIZADO', icon: '✨', isPersonalized: true });
  return cards;
});

const filterGroups = { species: 'Especie', etapa: 'Etapa Vida', peso: 'Tamaño / Peso' };
const getOptions = (key) => {
  if (key === 'species') return ['TODOS', 'CANINO', 'FELINO'];
  if (key === 'etapa') return ['TODOS', 'CACHORRO', 'ADULTO', 'SENIOR'];
  if (key === 'peso') return ['TODOS', 'RAZA PEQUEÑA', 'RAZA MEDIANA', 'RAZA GRANDE'];
  return [];
};

const autoEtapa = computed(() => {
  if (!mascotaActiva.value?.fechaNacimiento) return 'ADULTO';
  const naci = new Date(mascotaActiva.value.fechaNacimiento);
  const hoy = new Date();
  const meses = (hoy.getFullYear() - naci.getFullYear()) * 12 + (hoy.getMonth() - naci.getMonth());
  return meses < 12 ? 'CACHORRO' : (meses > 84 ? 'SENIOR' : 'ADULTO');
});

const loadMascota = () => {
  if (!localStorage.getItem('ps_token')) { mascotaActiva.value = null; filterByMascota.value = false; return; }
  const data = localStorage.getItem('ps_active_pet');
  if (data) {
    try {
      const pet = JSON.parse(data);
      if (pet) {
        const esp = (pet.especie || '').toUpperCase();
        pet.especie = (esp.includes('PERRO') || esp.includes('CANIN')) ? 'CANINO' : 'FELINO';
        mascotaActiva.value = pet;
      }
    } catch (e) { localStorage.removeItem('ps_active_pet'); }
  }
};

const normalizeCat = (s) => (s || '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const uniqueSubcategories = computed(() => {
  const prods = productStore.allProducts.filter(p => {
    const cProd = normalizeCat(p.categoria);
    const cAct = normalizeCat(activeCategory.value);
    return cAct === 'TODOS' || cProd.includes(cAct) || (cAct === 'NUTRICION' && cProd.includes('ALIMEN'));
  });
  return [...new Set(prods.map(p => p.subcategoria).filter(Boolean))].sort();
});

const uniqueMarcas = computed(() => {
  const prods = productStore.allProducts.filter(p => {
    const cProd = normalizeCat(p.categoria);
    const cAct = normalizeCat(activeCategory.value);
    return cAct === 'TODOS' || cProd.includes(cAct) || (cAct === 'NUTRICION' && cProd.includes('ALIMEN'));
  });
  return [...new Set(prods.map(p => p.marca).filter(Boolean))].sort();
});

const filteredProducts = computed(() => {
  let result = productStore.allProducts.filter(p => {
    const searchTerms = searchQuery.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(' ');
    const targetText = `${p.nombre} ${p.marca} ${p.categoria} ${p.subcategoria || ''}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const matchesSearch = searchTerms.every(term => targetText.includes(term));

    const cProd = normalizeCat(p.categoria);
    const cAct = normalizeCat(activeCategory.value);
    const matchesCat = cAct === 'TODOS' || cProd.includes(cAct) || (cAct === 'NUTRICION' && cProd.includes('ALIMEN'));

    const mEspS = activeSpecies.value === 'TODOS' || p.especie === activeSpecies.value || p.especie === 'TODOS';
    const mEtaS = activeEtapa.value === 'TODOS' || p.etapaVida === activeEtapa.value || p.etapaVida === 'TODOS';
    const mPesS = activePeso.value === 'TODOS' || p.rangoPeso === activePeso.value || p.rangoPeso === 'TODOS';
    const mMarS = activeMarca.value === 'TODOS' || p.marca === activeMarca.value;
    const mSubS = activeSubcategory.value === 'TODOS' || p.subcategoria === activeSubcategory.value;

    let matchesMascota = true;
    if (filterByMascota.value && mascotaActiva.value && isLoggedIn.value) {
      const pet = mascotaActiva.value;
      const sameSpecies = p.especie === 'TODOS' || p.especie === pet.especie;
      let weightSafety = true;
      if (p.rangoPeso && p.rangoPeso !== 'TODOS' && p.rangoPeso !== '') {
        weightSafety = (pet.pesoActual > 20) ? (p.rangoPeso !== 'RAZA PEQUEÑA') : (p.rangoPeso !== 'RAZA GRANDE');
      }
      const stageSafety = p.etapaVida === 'TODOS' || p.etapaVida === autoEtapa.value || !p.etapaVida;
      const isNotPrescription = p.requiereReceta !== true;
      let isSafePharmacy = true;
      if (cProd.includes('FARMACIA')) {
        const subNorm = normalizeCat(p.subcategoria);
        const safeTerms = ['ANTIPULGA', 'DESPARASITAN', 'ANTIPARASITARI', 'VITAMINA', 'SUPLEMENTO'];
        isSafePharmacy = safeTerms.some(safe => subNorm.includes(safe));
      }
      matchesMascota = sameSpecies && weightSafety && stageSafety && isNotPrescription && isSafePharmacy;
    }

    return matchesSearch && matchesCat && mEspS && mEtaS && mPesS && mMarS && mSubS && matchesMascota;
  });

  if (filterByMascota.value) {
    result.sort((a, b) => {
      const catA = normalizeCat(a.categoria);
      const catB = normalizeCat(b.categoria);
      const isFoodA = catA.includes('ALIMEN') || catA.includes('NUTRICION') ? 1 : 0;
      const isFoodB = catB.includes('ALIMEN') || catB.includes('NUTRICION') ? 1 : 0;
      return isFoodB - isFoodA;
    });
  }
  return result;
});

const paginatedProducts = computed(() => filteredProducts.value.slice(0, currentPage.value * itemsPerPage));
const hasMore = computed(() => paginatedProducts.value.length < filteredProducts.value.length);
const loadMore = () => { currentPage.value++; };

const activeFiltersCount = computed(() => {
  let c = 0;
  if (activeSpecies.value !== 'TODOS') c++;
  if (activeEtapa.value !== 'TODOS') c++;
  if (activePeso.value !== 'TODOS') c++;
  if (activeMarca.value !== 'TODOS') c++;
  if (activeSubcategory.value !== 'TODOS') c++;
  return c;
});

onBeforeRouteLeave((to, from, next) => {
  if (to.name === 'ProductoDetalle') {
    sessionStorage.setItem('ps_tienda_scroll', window.scrollY);
    sessionStorage.setItem('ps_tienda_page', currentPage.value);
  } else {
    sessionStorage.removeItem('ps_tienda_scroll');
    sessionStorage.removeItem('ps_tienda_page');
  }
  next();
});

const setPasillo = async (cat) => {
  activeSpecies.value = activeEtapa.value = activePeso.value = activeMarca.value = activeSubcategory.value = 'TODOS';
  currentPage.value = 1;
  if (cat === 'PERSONALIZADO') {
    if (!isLoggedIn.value) return;
    filterByMascota.value = true;
    activeCategory.value = 'TODOS';
    loadMascota();
    if (mascotaActiva.value) {
      activeSpecies.value = mascotaActiva.value.especie;
      activePeso.value = mascotaActiva.value.pesoActual > 20 ? 'RAZA GRANDE' : 'RAZA PEQUEÑA';
      activeEtapa.value = autoEtapa.value;
    }
  } else {
    activeCategory.value = cat;
    filterByMascota.value = false;
  }
  pasilloSeleccionado.value = true;
  localStorage.setItem('ps_last_aisle', cat);
  sessionStorage.removeItem('ps_tienda_scroll');
  sessionStorage.removeItem('ps_tienda_page');
  trackCategoryView(cat);
  await nextTick();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const resetTienda = () => {
  pasilloSeleccionado.value = false;
  activeCategory.value = activeSpecies.value = activeEtapa.value = activePeso.value = activeMarca.value = activeSubcategory.value = 'TODOS';
  searchQuery.value = '';
  filterByMascota.value = false;
  localStorage.removeItem('ps_last_aisle');
  sessionStorage.removeItem('ps_tienda_scroll');
  sessionStorage.removeItem('ps_tienda_page');
};

const isFilterActive = (k, o) => (k === 'species' ? activeSpecies.value : k === 'etapa' ? activeEtapa.value : activePeso.value) === o;

const setFilter = (k, v) => {
  if (k === 'species') activeSpecies.value = v;
  if (k === 'etapa') activeEtapa.value = v;
  if (k === 'peso') activePeso.value = v;
  currentPage.value = 1;
  setTimeout(() => { showMobileFilters.value = false; }, 220);
};

const clearFilters = () => {
  activeSpecies.value = activeEtapa.value = activePeso.value = activeMarca.value = activeSubcategory.value = 'TODOS';
  currentPage.value = 1;
};

const closeMobileFiltersDelayed = () => {
  setTimeout(() => { showMobileFilters.value = false; }, 220);
};

const dynamicTitle = computed(() => filterByMascota.value
  ? `PARA ${mascotaActiva.value?.nombre || 'TU MASCOTA'}`
  : (activeCategory.value === 'TODOS' ? 'TODO EL CATÁLOGO' : activeCategory.value));

const onAddToCart = (p) => {
  cartStore.addToCart(p, 1);
  if (window.dataLayer) {
    window.dataLayer.push({ event: 'add_to_cart', ecommerce: { currency: 'COP', value: p.precio, items: [{ item_id: p.id, item_name: p.nombre, price: p.precio, quantity: 1, item_category: p.categoria }] } });
  }
  trackAddToCart({ id: p.id, nombre: p.nombre, precio: p.precio });
  emit('notify', { msg: `${p.nombre} añadido`, type: 'success' });
};

const onSearch = () => {
  if (searchQuery.value) {
    pasilloSeleccionado.value = true;
    trackSearch(searchQuery.value);
  } else if (!localStorage.getItem('ps_last_aisle')) {
    pasilloSeleccionado.value = false;
  }
  currentPage.value = 1;
};

onMounted(async () => {
  isLoading.value = true;
  try {
    if (productStore.allProducts.length === 0) await productStore.fetchTienda();
    if (isLoggedIn.value) loadMascota();

    const last = localStorage.getItem('ps_last_aisle');
    if (last && (last !== 'PERSONALIZADO' || isLoggedIn.value)) {
      if (last === 'PERSONALIZADO') { filterByMascota.value = true; activeCategory.value = 'TODOS'; }
      else { activeCategory.value = last; }
      pasilloSeleccionado.value = true;
      trackCategoryView(last);
    }

    const savedPage = sessionStorage.getItem('ps_tienda_page');
    if (savedPage) currentPage.value = parseInt(savedPage, 10);

    await nextTick();

    const savedScroll = sessionStorage.getItem('ps_tienda_scroll');
    if (savedScroll) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' });
            sessionStorage.removeItem('ps_tienda_scroll');
            sessionStorage.removeItem('ps_tienda_page');
          }, 200);
        });
      });
    }
  } finally {
    isLoading.value = false;
  }
});

watch(filterByMascota, (newVal) => { if (newVal) loadMascota(); });
</script>

<style scoped>
@reference "../../style.css";
.no-scrollbar::-webkit-scrollbar { display: none; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; }
.clean-select {
  @apply bg-transparent border-b-2 border-slate-200 dark:border-white/10 w-full py-4 text-[10px] font-black uppercase outline-none focus:border-[#DE1F27] transition-all dark:text-white appearance-none italic cursor-pointer;
}

/* Bottom sheet — sube desde abajo */
.slide-up-enter-active { transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1); }
.slide-up-leave-active { transition: transform 0.22s cubic-bezier(0.32, 0.72, 0, 1); }
.slide-up-enter-from,
.slide-up-leave-to { transform: translateY(100%); }

/* Overlay búsqueda — fade rápido */
.fade-overlay-enter-active { transition: opacity 0.15s ease; }
.fade-overlay-leave-active { transition: opacity 0.15s ease; }
.fade-overlay-enter-from,
.fade-overlay-leave-to { opacity: 0; }
</style>
