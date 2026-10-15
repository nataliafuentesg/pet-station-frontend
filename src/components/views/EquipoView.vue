<template>
  <div class="min-h-screen bg-[#050505] px-4 pb-16 pt-8 text-white" style="padding-top: max(2rem, env(safe-area-inset-top))">

    <!-- Login -->
    <div v-if="!logueado" class="flex flex-col items-center justify-center min-h-[80vh]">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <p class="text-4xl mb-3">⏱️</p>
          <h1 class="text-2xl font-[1000] uppercase italic">Mi <span class="text-[#DE1F27]">Jornada</span></h1>
          <p class="text-[10px] font-black uppercase text-white/30 tracking-widest mt-2">Pet Station · Equipo</p>
        </div>
        <form @submit.prevent="login" class="bg-white/5 rounded-[2rem] p-7 border border-white/10 space-y-4">
          <div class="space-y-1">
            <label class="text-[9px] font-black uppercase text-white/40 tracking-widest ml-2">Usuario</label>
            <input v-model="usuario" autocapitalize="none" autocomplete="username"
              class="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-base font-bold outline-none focus:border-[#DE1F27]" />
          </div>
          <div class="space-y-1">
            <label class="text-[9px] font-black uppercase text-white/40 tracking-widest ml-2">Contraseña</label>
            <input v-model="password" type="password" autocomplete="current-password"
              class="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-base font-bold outline-none focus:border-[#DE1F27]" />
          </div>
          <p v-if="error" class="text-[11px] text-[#DE1F27] font-bold text-center">{{ error }}</p>
          <button type="submit" :disabled="!usuario || !password || cargando"
            class="w-full bg-[#DE1F27] py-5 rounded-2xl font-[1000] uppercase tracking-widest text-[11px] active:scale-95 transition-all disabled:opacity-40">
            {{ cargando ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </div>
    </div>

    <div v-else class="w-full max-w-md mx-auto space-y-5">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-[1000] uppercase italic">Hola, <span class="text-[#DE1F27]">{{ estado?.nombre || '' }}</span></h1>
          <p class="text-[9px] font-black uppercase text-white/30 tracking-widest">{{ fechaHoy }}</p>
        </div>
        <button @click="logout" class="text-[9px] font-black uppercase text-white/30 hover:text-[#DE1F27]">Salir</button>
      </div>

      <p v-if="mostrarAviso && error" class="text-[11px] text-[#DE1F27] font-bold text-center">{{ error }}</p>
      <AvisoJornada v-if="mostrarAviso" :pedir-aceptacion="necesitaConsentimiento" :enviando="enviando"
        @aceptar="aceptarAviso" @cerrar="verAviso = false" />

      <template v-else>
      <!-- Avisos -->
      <div v-if="iosSinInstalar" class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-[12px] leading-relaxed text-amber-200">
        <p class="font-black uppercase text-[10px] tracking-widest mb-1">Para recibir los avisos</p>
        Toca <b>Compartir</b> <span class="inline-block">⬆️</span> en Safari → <b>Agregar a inicio</b>, y abre "Mi Jornada" desde el ícono.
      </div>
      <button v-else-if="puedePedirPermiso && permiso !== 'granted'" @click="activarAvisos"
        class="w-full bg-blue-500/15 border border-blue-500/30 rounded-2xl p-4 text-left">
        <p class="font-black uppercase text-[10px] tracking-widest text-blue-300">🔔 Activar avisos</p>
        <p class="text-[12px] text-blue-200/70 mt-1">
          {{ permiso === 'denied' ? 'Los avisos están bloqueados. Actívalos en los ajustes del navegador.' : 'Te avisaremos cada 15 minutos para preguntarte si ya terminaste.' }}
        </p>
      </button>
      <p v-else-if="permiso === 'granted'" class="text-[10px] font-black uppercase tracking-widest text-green-400/70 text-center">🔔 Avisos activados</p>
      <div v-else-if="!puedePedirPermiso" class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-[12px] leading-relaxed text-amber-200">
        <p class="font-black uppercase text-[10px] tracking-widest mb-1">Este navegador no permite avisos</p>
        Abre <b>petstationvet.com/equipo</b> directamente en <b>Chrome</b>. Si llegaste desde un enlace de WhatsApp, toca ⋮ y elige "Abrir en Chrome".
      </div>

      <div v-if="!estado" class="py-20 text-center">
        <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>

      <!-- Sin jornada -->
      <div v-else-if="!sesion" class="bg-white/5 rounded-[2rem] p-8 border border-white/10 text-center space-y-5">
        <template v-if="yaTerminoHoy">
          <p class="text-5xl">🏁</p>
          <p class="text-sm text-white/70">
            Ya terminaste tu jornada de hoy<span v-if="estado.jornadaTerminadaHoy"> a las <b class="text-white">{{ hora(estado.jornadaTerminadaHoy) }}</b></span>.
          </p>
          <p class="text-[12px] text-white/40">¡Buen trabajo! Nos vemos mañana.</p>
          <button @click="iniciarJornada" :disabled="enviando"
            class="w-full bg-white/5 border border-white/10 text-white/50 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-40">
            Iniciar otra jornada hoy
          </button>
        </template>
        <template v-else>
          <p class="text-5xl">☀️</p>
          <p class="text-sm text-white/60">Cuando llegues, inicia tu jornada.</p>
          <button @click="iniciarJornada" :disabled="enviando"
            class="w-full bg-[#DE1F27] py-5 rounded-2xl font-[1000] uppercase tracking-widest text-[12px] active:scale-95 transition-all disabled:opacity-40">
            Iniciar jornada
          </button>
        </template>
      </div>

      <template v-else>
        <!-- Resumen del día -->
        <div class="grid grid-cols-3 gap-2">
          <div class="bg-white/5 rounded-2xl p-3 text-center border border-white/10">
            <p class="text-lg font-[1000] tabular-nums">{{ dur(segJornada) }}</p>
            <p class="text-[8px] font-black uppercase text-white/30 tracking-widest mt-1">de {{ dur(sesion.segundosLimite || 28800) }}</p>
          </div>
          <div class="bg-green-500/10 rounded-2xl p-3 text-center border border-green-500/20">
            <p class="text-lg font-[1000] text-green-400 tabular-nums">{{ dur(segTareas) }}</p>
            <p class="text-[8px] font-black uppercase text-green-400/60 tracking-widest mt-1">En tareas</p>
          </div>
          <div class="bg-white/5 rounded-2xl p-3 text-center border border-white/10">
            <p class="text-lg font-[1000] tabular-nums">{{ tareasTerminadas }}</p>
            <p class="text-[8px] font-black uppercase text-white/30 tracking-widest mt-1">Terminadas</p>
          </div>
        </div>

        <!-- Horas extra -->
        <div v-if="enExtra" class="bg-purple-500/10 rounded-2xl p-4 border border-purple-500/30 space-y-3">
          <p class="text-[10px] font-black uppercase tracking-widest text-purple-300">⏰ Horas extra · {{ dur(segExtra) }}</p>
          <p v-if="sesion.motivoExtra && !editandoExtra" class="text-[12px] text-white/70">
            Motivo: <b class="text-white">{{ sesion.motivoExtra }}</b>
            <button @click="abrirMotivoExtra" class="ml-2 text-[10px] underline text-white/40">Cambiar</button>
          </p>
          <template v-else>
            <p class="text-[12px] text-white/60">Ya cumpliste tu jornada. ¿Por qué te quedas más tiempo?</p>
            <div class="flex flex-wrap gap-2">
              <button v-for="m in MOTIVOS_EXTRA" :key="m" @click="motivoExtra = m"
                class="text-[11px] font-bold rounded-full px-3 py-1.5 border"
                :class="motivoExtra === m ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-white/70'">{{ m }}</button>
            </div>
            <input v-model="motivoExtra" maxlength="500" placeholder="O escribe el motivo"
              class="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold outline-none focus:border-purple-500 placeholder:text-white/20" />
            <button @click="guardarMotivoExtra" :disabled="!motivoExtra.trim() || enviando"
              class="w-full bg-purple-500 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] disabled:opacity-40">Guardar motivo</button>
          </template>
        </div>

        <!-- Almuerzo -->
        <div v-if="sesion.estado === 'ALMUERZO'" class="bg-amber-500/10 rounded-[2rem] p-7 border border-amber-500/30 text-center space-y-4">
          <p class="text-5xl">🍽️</p>
          <p class="text-[10px] font-black uppercase tracking-widest text-amber-300">En almuerzo</p>
          <p class="text-4xl font-[1000] tabular-nums">{{ reloj(segPausa) }}</p>
          <p v-if="tareaActual" class="text-[12px] text-white/50">Pausada: <b class="text-white/80">{{ tareaActual.descripcion }}</b></p>
          <button @click="accion('/jornada/almuerzo/volver')" :disabled="enviando"
            class="w-full bg-amber-500 text-black py-5 rounded-2xl font-[1000] uppercase tracking-widest text-[12px] active:scale-95 transition-all disabled:opacity-40">
            Ya volví
          </button>
        </div>

        <!-- Tarea en curso -->
        <div v-else-if="tareaActual" ref="tarjetaTarea" class="bg-green-500/10 rounded-[2rem] p-6 border border-green-500/30 space-y-4 scroll-mt-24 transition-shadow duration-500"
          :class="resaltarTarea ? 'ring-4 ring-green-400/70 shadow-[0_0_40px_rgba(74,222,128,0.35)]' : ''">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <p class="text-[10px] font-black uppercase tracking-widest text-green-300">Haciendo ahora</p>
          </div>
          <p class="text-xl font-[1000] leading-tight break-words">{{ tareaActual.descripcion }}</p>
          <p class="text-5xl font-[1000] tabular-nums text-center py-2">{{ reloj(segTareaActual) }}</p>
          <button @click="pedirNota('terminar')" :disabled="enviando"
            class="w-full bg-green-500 text-black py-5 rounded-2xl font-[1000] uppercase tracking-widest text-[12px] active:scale-95 transition-all disabled:opacity-40">
            ✅ Ya terminé
          </button>
          <p class="text-[10px] text-white/30 text-center">Te preguntaremos de nuevo en {{ Math.ceil(segParaCheck / 60) }} min</p>
          <p v-if="tareaQueSeRetoma" class="text-[11px] text-white/50 text-center">Al terminar, retomas <b class="text-white/80">{{ tareaQueSeRetoma.descripcion }}</b></p>
        </div>

        <!-- Tareas interrumpidas (ej: por recibir un perro) -->
        <div v-for="t in tareasEnEspera" :key="t.id" class="flex items-center justify-between gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
          <div class="min-w-0">
            <p class="text-[9px] font-black uppercase tracking-widest text-white/40">⏸ En espera · {{ dur(t.segundos) }}</p>
            <p class="text-[13px] font-bold truncate">{{ t.descripcion }}</p>
          </div>
          <button @click="terminarEnEspera(t)" :disabled="enviando"
            class="shrink-0 text-[9px] font-black uppercase tracking-widest text-white/40 bg-white/5 rounded-xl px-3 py-2 disabled:opacity-40">
            Ya la terminé
          </button>
        </div>

        <!-- Nueva tarea -->
        <div class="bg-white/5 rounded-[2rem] p-6 border border-white/10 space-y-4">
          <p class="text-[10px] font-black uppercase tracking-widest text-white/40">
            {{ sesion.estado === 'ALMUERZO' ? '¿Ya volviste? Empieza tu siguiente tarea' : tareaActual ? '¿Cambias de tarea?' : '¿Qué vas a hacer ahora?' }}
          </p>
          <textarea v-model="nuevaTarea" rows="2" maxlength="300" placeholder="Ej: Bañar a Toby, limpiar caniles, paseo grupo 2..."
            class="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold outline-none focus:border-[#DE1F27] resize-none placeholder:text-white/20"></textarea>
          <div v-if="sugerenciasFiltradas.length" class="-mt-2 bg-white/5 rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
            <button v-for="s in sugerenciasFiltradas" :key="s" @click="nuevaTarea = s"
              class="w-full text-left text-[13px] font-bold px-4 py-2.5 text-white/80 active:bg-white/10">
              {{ s }}
            </button>
          </div>
          <button @click="iniciarTarea" :disabled="!nuevaTarea.trim() || enviando"
            class="w-full bg-[#DE1F27] py-5 rounded-2xl font-[1000] uppercase tracking-widest text-[12px] active:scale-95 transition-all disabled:opacity-40">
            {{ tareaActual ? 'Terminar actual e iniciar esta' : 'Iniciar tarea' }}
          </button>
        </div>

        <!-- Guardería: entrada y salida de perros -->
        <div v-if="guarderia" class="bg-white/5 rounded-[2rem] p-6 border border-white/10 space-y-4">
          <div class="flex items-center justify-between gap-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-white/40">🐾 Mascotas adentro · {{ guarderia.adentro.length }}</p>
            <button @click="abrirRecepcion" :disabled="enviando"
              class="bg-blue-500 text-white px-4 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-40">
              ➕ Recibir
            </button>
          </div>
          <p v-if="!guarderia.adentro.length" class="text-[12px] text-white/30">No hay mascotas registradas adentro.</p>
          <div v-for="p in guarderia.adentro" :key="p.id" class="flex items-center justify-between gap-3 bg-white/5 rounded-xl px-4 py-3 border"
            :class="p.comidaNoAlcanza || p.comidaPorAcabarse || p.salidaVencida ? 'border-red-500/50' : 'border-white/5'">
            <button type="button" @click="abrirFicha(p)" class="min-w-0 text-left flex-1">
              <p class="text-[14px] font-bold truncate">
                {{ p.especie === 'GATO' ? '🐈' : '🐕' }} {{ p.perro }}
                <span class="ml-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full align-middle"
                  :class="{ HOTEL: 'bg-purple-500/20 text-purple-300', BANO: 'bg-cyan-500/20 text-cyan-300', DIA: 'bg-blue-500/20 text-blue-300' }[p.tipo]">
                  {{ { HOTEL: 'Hotel', BANO: 'Baño', DIA: 'Día' }[p.tipo] }}
                </span>
              </p>
              <p class="text-[10px] text-white/30">Entró {{ desde(p.entrada) }}<span v-if="p.recibidoPor"> · {{ p.recibidoPor }}</span></p>
              <p v-if="p.salidaEsperada" class="text-[10px] font-bold" :class="p.salidaVencida ? 'text-red-300' : 'text-purple-300/80'">
                {{ p.salidaVencida ? '⚠️ Debía salir el' : 'Sale el' }} {{ fechaCorta(p.salidaEsperada) }}
              </p>
              <p v-if="p.diasComida != null" class="text-[10px] font-bold"
                :class="p.comidaNoAlcanza || p.comidaPorAcabarse ? 'text-red-300' : 'text-amber-300/70'">
                🍖 {{ textoComida(p) }}
              </p>
            </button>
            <button @click="entregar(p)" :disabled="enviando"
              class="shrink-0 bg-white/10 px-3 py-2 rounded-xl font-black uppercase tracking-widest text-[9px] active:scale-95 disabled:opacity-40">
              Entregado
            </button>
          </div>
        </div>

        <p v-if="error" class="text-[11px] text-[#DE1F27] font-bold text-center">{{ error }}</p>

        <!-- Acciones de jornada -->
        <div v-if="sesion.estado === 'ACTIVA'" class="grid grid-cols-2 gap-3">
          <button @click="salirAlmuerzo" :disabled="enviando"
            class="bg-amber-500/15 border border-amber-500/30 text-amber-300 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-40">
            🍽️ Salgo a almorzar
          </button>
          <button @click="cerrarJornada" :disabled="enviando"
            class="bg-white/5 border border-white/10 text-white/60 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-40">
            🏁 Terminar jornada
          </button>
        </div>

        <!-- Tareas de hoy -->
        <div v-if="tareasHoy.length" class="space-y-2">
          <p class="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Hoy</p>
          <div v-for="t in tareasHoy" :key="t.id" class="flex items-center justify-between gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
            <div class="min-w-0">
              <p class="text-[13px] font-bold truncate">{{ t.descripcion }}</p>
              <p class="text-[10px] text-white/30">{{ hora(t.inicio) }}<span v-if="t.fin"> – {{ hora(t.fin) }}</span></p>
              <p v-if="t.nota" class="text-[10px] text-amber-300/80 truncate">⚠️ {{ t.nota }}</p>
            </div>
            <span class="text-[12px] font-black tabular-nums shrink-0" :class="t.estado === 'TERMINADA' ? 'text-white/60' : 'text-green-400'">
              {{ dur(t.estado === 'EN_CURSO' ? segTareaActual : t.segundos) }}
            </span>
          </div>
        </div>
      </template>

      <button v-if="logueado && estado && !mostrarAviso" @click="verAviso = true"
        class="w-full text-[10px] font-bold text-white/25 underline pt-2">Aviso de uso y tratamiento de datos</button>
      </template>
    </div>

    <!-- Mensaje de cambio de tarea (qué se pausó y qué empezó) -->
    <Teleport to="body">
      <Transition enter-from-class="opacity-0 -translate-y-4" leave-to-class="opacity-0 -translate-y-4">
        <div v-if="toast" class="fixed top-4 inset-x-4 z-[9500] mx-auto max-w-sm bg-green-500 text-black rounded-2xl px-4 py-3 shadow-2xl text-[13px] font-bold leading-snug transition-all duration-300"
          style="top: max(1rem, env(safe-area-inset-top))" @click="toast = ''">
          <p v-for="(l, i) in toast.split('\n')" :key="i">{{ l }}</p>
        </div>
      </Transition>
    </Teleport>

    <!-- Motivo de horas extra al terminar la jornada -->
    <Teleport to="body">
      <div v-if="cierreJornada" class="fixed inset-0 z-[9001] flex items-end sm:items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="cierreJornada = false"></div>
        <div class="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-[2rem] p-6 space-y-4 text-white">
          <p class="text-[10px] font-black uppercase tracking-widest text-purple-300">⏰ Hoy hiciste {{ dur(segExtra) }} extra</p>
          <p class="text-lg font-[1000] leading-tight">¿Por qué te quedaste más tiempo?</p>
          <div class="flex flex-wrap gap-2">
            <button v-for="m in MOTIVOS_EXTRA" :key="m" @click="motivoExtra = m"
              class="text-[11px] font-bold rounded-full px-3 py-1.5 border"
              :class="motivoExtra === m ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-white/70'">{{ m }}</button>
          </div>
          <input v-model="motivoExtra" maxlength="500" placeholder="O escribe el motivo"
            class="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold outline-none focus:border-purple-500 placeholder:text-white/20" />
          <p v-if="error" class="text-[11px] text-red-300 font-bold">{{ error }}</p>
          <div class="grid grid-cols-2 gap-3">
            <button @click="cierreJornada = false" class="bg-white/10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Cancelar</button>
            <button @click="cerrarConMotivo" :disabled="!motivoExtra.trim() || enviando"
              class="bg-purple-500 py-4 rounded-2xl font-[1000] uppercase tracking-widest text-[10px] disabled:opacity-40">Terminar jornada</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Recibir un perro -->
    <Teleport to="body">
      <div v-if="recepcion" class="fixed inset-0 z-[9001] flex items-end sm:items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="recepcion = null"></div>
        <div class="relative w-full max-w-sm max-h-[92vh] overflow-y-auto bg-[#111] border border-white/10 rounded-[2rem] p-6 space-y-4 text-white">
          <p class="text-lg font-[1000] leading-tight">🐾 ¿Quién llegó?</p>
          <input v-model="recepcion.perro" maxlength="100" placeholder="Nombre de la mascota" autocapitalize="words"
            class="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold outline-none focus:border-blue-500 placeholder:text-white/20" />
          <div v-if="perrosSugeridos.length" class="flex flex-wrap gap-2">
            <button v-for="n in perrosSugeridos" :key="n" @click="recepcion.perro = n"
              class="text-[11px] font-bold bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-white/70 active:bg-white/20">
              {{ n }}
            </button>
          </div>
          <PerroDatosForm :model-value="recepcion" />
          <p v-if="error" class="text-[11px] text-red-300 font-bold">{{ error }}</p>
          <p v-if="tareaActual" class="text-[11px] text-white/40">"{{ tareaActual.descripcion }}" queda en espera y se retoma sola cuando termines la recepción.</p>
          <div class="grid grid-cols-2 gap-3">
            <button @click="recepcion = null" class="bg-white/10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Cancelar</button>
            <button @click="confirmarRecepcion" :disabled="!recepcion.perro.trim() || enviando"
              class="bg-blue-500 py-4 rounded-2xl font-[1000] uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-40">
              Empezar recepción
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Ficha del perro: corregir datos, agregar comida, anular -->
    <Teleport to="body">
      <div v-if="ficha" class="fixed inset-0 z-[9001] flex items-end sm:items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="ficha = null"></div>
        <div class="relative w-full max-w-sm max-h-[92vh] overflow-y-auto bg-[#111] border border-white/10 rounded-[2rem] p-6 space-y-4 text-white">
          <div class="flex items-center justify-between gap-3">
            <p class="text-lg font-[1000] leading-tight">✏️ Corregir datos</p>
            <button @click="ficha = null" class="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white/50">✕</button>
          </div>
          <input v-model="ficha.datos.perro" maxlength="100" placeholder="Nombre de la mascota"
            class="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold outline-none focus:border-blue-500" />
          <PerroDatosForm :model-value="ficha.datos" con-comida :dias-transcurridos="ficha.diasTranscurridos" :entrada="ficha.entrada" />
          <p v-if="error" class="text-[11px] text-red-300 font-bold">{{ error }}</p>
          <button @click="guardarFicha" :disabled="!ficha.datos.perro.trim() || enviando"
            class="w-full bg-blue-500 py-4 rounded-2xl font-[1000] uppercase tracking-widest text-[11px] active:scale-95 disabled:opacity-40">
            Guardar cambios
          </button>

          <div class="border-t border-white/10 pt-4 space-y-2">
            <p class="text-[10px] font-black uppercase tracking-widest text-white/40">🍖 Le trajeron más comida</p>
            <div class="flex gap-2">
              <input v-model="ficha.masComida" inputmode="decimal" :placeholder="ficha.datos.comidaUnidad === 'GRAMOS' ? 'Gramos' : 'Porciones'"
                class="flex-1 min-w-0 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold outline-none focus:border-amber-500 placeholder:text-white/20" />
              <button @click="sumarComida" :disabled="!ficha.masComida || enviando"
                class="bg-amber-500 text-black px-4 rounded-2xl font-black uppercase tracking-widest text-[10px] disabled:opacity-40">
                Sumar
              </button>
            </div>
          </div>

          <button @click="anularPerro" :disabled="enviando"
            class="w-full text-red-300/80 py-2 font-black uppercase tracking-widest text-[10px] disabled:opacity-40">
            🗑 Anular registro (fue un error)
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Nota de imprevistos al cerrar una tarea -->
    <Teleport to="body">
      <div v-if="cierre && tareaActual" class="fixed inset-0 z-[9001] flex items-end sm:items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="cierre = null"></div>
        <div class="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-[2rem] p-6 space-y-4 text-white">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-white/40">Cerrando: {{ tareaActual.descripcion }} · {{ dur(segTareaActual) }}</p>
            <p v-if="conChecklist" class="text-lg font-[1000] leading-tight mt-1">¿Qué le hiciste a {{ tareaActual.recepcion }}?</p>
          </div>
          <div v-if="conChecklist" class="space-y-2">
            <button v-for="c in CHECKLIST" :key="c.id" @click="cierre.checklist[c.id] = !cierre.checklist[c.id]"
              class="w-full flex items-center gap-3 rounded-2xl px-4 py-3 border text-left text-[13px] font-bold transition-colors"
              :class="cierre.checklist[c.id] ? 'bg-green-500/15 border-green-500/40 text-green-200' : 'bg-white/5 border-white/10 text-white/60'">
              <span class="w-5 h-5 rounded-md border flex items-center justify-center text-[12px]"
                :class="cierre.checklist[c.id] ? 'bg-green-500 border-green-500 text-black' : 'border-white/30'">{{ cierre.checklist[c.id] ? '✓' : '' }}</span>
              {{ c.label }}
            </button>
          </div>
          <p class="text-lg font-[1000] leading-tight" :class="conChecklist ? 'text-base' : ''">¿Pasó algo que te retrasó?</p>
          <div class="flex flex-wrap gap-2">
            <button v-for="imp in IMPREVISTOS" :key="imp" @click="agregarImprevisto(imp)"
              class="text-[11px] font-bold rounded-full px-3 py-1.5 border transition-colors"
              :class="cierre.nota.includes(imp) ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 border-white/10 text-white/70'">
              {{ imp }}
            </button>
          </div>
          <textarea v-model="cierre.nota" rows="2" maxlength="500" placeholder="Cuéntanos qué pasó (opcional)"
            class="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold outline-none focus:border-amber-500 resize-none placeholder:text-white/20"></textarea>
          <div class="grid grid-cols-2 gap-3">
            <button @click="confirmarCierre('')" :disabled="enviando"
              class="bg-white/10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-40">
              No, todo normal
            </button>
            <button @click="confirmarCierre(cierre.nota)" :disabled="!cierre.nota.trim() || enviando"
              class="bg-amber-500 text-black py-4 rounded-2xl font-[1000] uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-40">
              Guardar nota
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Pregunta de los 15 minutos -->
    <Teleport to="body">
      <div v-if="mostrarCheck && tareaActual" class="fixed inset-0 z-[9000] flex items-end sm:items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-[2rem] p-7 space-y-5 text-white">
          <p class="text-4xl text-center">⏰</p>
          <p class="text-center text-[11px] font-black uppercase tracking-widest text-white/40">¿Ya terminaste?</p>
          <p class="text-center text-lg font-[1000] leading-tight break-words">{{ tareaActual.descripcion }}</p>
          <p class="text-center text-[12px] text-white/40">Llevas {{ dur(segTareaActual) }}</p>
          <div class="grid grid-cols-2 gap-3">
            <button @click="responderCheck(false)" :disabled="enviando"
              class="bg-white/10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] active:scale-95 disabled:opacity-40">
              Todavía no
            </button>
            <button @click="responderCheck(true)" :disabled="enviando"
              class="bg-green-500 text-black py-4 rounded-2xl font-[1000] uppercase tracking-widest text-[11px] active:scale-95 disabled:opacity-40">
              Sí, terminé
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import api from '@/api/axios'
import { messaging, onMessage } from '@/firebase'
import { obtenerTokenPush } from '@/composables/usePushNotifications'
import PerroDatosForm from './equipo/PerroDatosForm.vue'
import AvisoJornada from './equipo/AvisoJornada.vue'

const ROLES_PERMITIDOS = ['ROLE_EMPLEADO', 'ROLE_VET', 'ROLE_ADMIN', 'ADMIN']

const usuario = ref('')
const password = ref('')
const cargando = ref(false)
const enviando = ref(false)
const error = ref('')
const logueado = ref(false)

const estado = ref(null)
const nuevaTarea = ref('')
const motivoExtra = ref('')
const editandoExtra = ref(false)
const cierreJornada = ref(false)
const MOTIVOS_EXTRA = ['Mucha carga de trabajo', 'Llegaron mascotas tarde', 'Cubrir a un compañero', 'Me pidieron quedarme', 'Terminar una tarea pendiente']
const verAviso = ref(false)
const mostrarCheck = ref(false)
const cierre = ref(null)

const recepcion = ref(null)
const toast = ref('')
const tarjetaTarea = ref(null)
const resaltarTarea = ref(false)
const ficha = ref(null)
const CHECKLIST = [
  { id: 'comidaMarcada', label: 'Recibí y marqué la comida' },
  { id: 'revisado', label: 'Lo revisé' },
  { id: 'unasCortadas', label: 'Le corté las uñas' },
]

const IMPREVISTOS = [
  'Me llamaron a ayudar en hospital',
  'Me llamaron a limpiar algo',
  'Recibí un perrito que llegaba',
  'Entregué un perrito',
  'Atendí a un cliente',
]

// Los segundos vienen del servidor; localmente solo sumamos lo que pasó desde la última respuesta
const recibidoEn = ref(0)
const ahora = ref(Date.now())
let ticker = null
let quitarOnMessage = null

const permiso = ref(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported')
const esIos = /iPad|iPhone|iPod/.test(navigator.userAgent)
const instalada = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
const iosSinInstalar = esIos && !instalada
const puedePedirPermiso = typeof Notification !== 'undefined' && 'serviceWorker' in navigator

const sesion = computed(() => estado.value?.sesion || null)
const yaTerminoHoy = computed(() => !!estado.value && !estado.value.sesion && 'jornadaTerminadaHoy' in estado.value)
const guarderia = computed(() => estado.value?.guarderia || null)
const necesitaConsentimiento = computed(() => estado.value?.consentimiento?.aceptado === false)
const mostrarAviso = computed(() => necesitaConsentimiento.value || verAviso.value)
const tareasRapidas = computed(() => estado.value?.tareasRapidas || [])
// Comida/revisión/uñas aplican a guardería y hotel, no a los perros que vienen a baño
const conChecklist = computed(() => !!tareaActual.value?.recepcion && tareaActual.value.recepcionTipo !== 'BANO')
const tareasEnEspera = computed(() => estado.value?.tareasEnEspera || [])
const tareaQueSeRetoma = computed(() => tareasEnEspera.value.find(t => t.id === tareaActual.value?.reanuda) || null)
const perrosSugeridos = computed(() => {
  const adentro = new Set((guarderia.value?.adentro || []).map(p => p.perro.toLowerCase()))
  const q = recepcion.value?.perro.trim().toLowerCase() || ''
  if (!q) return []
  return (guarderia.value?.sugerencias || [])
    .filter(n => !adentro.has(n.toLowerCase()) && n.toLowerCase().includes(q) && n.toLowerCase() !== q)
    .slice(0, 4)
})
const tareaActual = computed(() => estado.value?.tareaActual || null)
const tareasHoy = computed(() => [...(estado.value?.tareas || [])].reverse())
const tareasTerminadas = computed(() => (estado.value?.tareas || []).filter(t => t.estado === 'TERMINADA').length)
const transcurrido = computed(() => Math.max(0, Math.floor((ahora.value - recibidoEn.value) / 1000)))
const corriendo = computed(() => tareaActual.value?.estado === 'EN_CURSO')

const segJornada = computed(() => {
  if (!sesion.value) return 0
  const pausa = sesion.value.segundosEnPausa != null ? sesion.value.segundosEnPausa + transcurrido.value : 0
  return sesion.value.segundosDesdeInicio + transcurrido.value - pausa - (sesion.value.segundosPausasCerradas || 0)
})
const segExtra = computed(() => Math.max(0, segJornada.value - (sesion.value?.segundosLimite || 28800)))
const enExtra = computed(() => !!sesion.value && segExtra.value > 0)
const segTareas = computed(() => (sesion.value?.segundosEnTareas || 0) + (corriendo.value ? transcurrido.value : 0))
const segPausa = computed(() => (sesion.value?.segundosEnPausa || 0) + transcurrido.value)
const segTareaActual = computed(() => (tareaActual.value?.segundos || 0) + (corriendo.value ? transcurrido.value : 0))
const segParaCheck = computed(() => Math.max(0, (tareaActual.value?.segundosParaCheck ?? 0) - transcurrido.value))

// Solo mientras escriben: tareas del cargo primero y luego las que la persona ya ha usado
const sugerenciasFiltradas = computed(() => {
  const q = nuevaTarea.value.trim().toLowerCase()
  if (q.length < 2) return []
  const vistas = new Set()
  return [...tareasRapidas.value, ...(estado.value?.sugerencias || [])]
    .filter(s => {
      const k = s.toLowerCase()
      if (vistas.has(k) || k === q || !k.includes(q) || s === tareaActual.value?.descripcion) return false
      vistas.add(k)
      return true
    })
    .slice(0, 4)
})

const fechaHoy = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })

function dur(seg) {
  const h = Math.floor(seg / 3600)
  const m = Math.floor((seg % 3600) / 60)
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`
}
function reloj(seg) {
  const h = Math.floor(seg / 3600)
  const m = Math.floor((seg % 3600) / 60)
  const s = seg % 60
  return (h > 0 ? `${h}:` : '') + `${String(m).padStart(h > 0 ? 2 : 1, '0')}:${String(s).padStart(2, '0')}`
}
function desde(iso) {
  const d = new Date(iso)
  const dias = Math.floor((Date.now() - d) / 86400000)
  if (dias >= 1) return `hace ${dias} día${dias > 1 ? 's' : ''}`
  return 'a las ' + hora(iso)
}
function hora(iso) {
  return iso ? new Date(iso).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' }) : ''
}

function aplicarEstado(data) {
  estado.value = data
  recibidoEn.value = Date.now()
  ahora.value = Date.now()
  if (data?.tareaActual?.checkPendiente) abrirCheck()
}

async function cargar() {
  try {
    const { data } = await api.get('/jornada/estado')
    aplicarEstado(data)
  } catch (e) {
    error.value = e.response?.data?.message || 'No se pudo cargar tu jornada'
  }
}

async function accion(url, body) {
  enviando.value = true
  error.value = ''
  try {
    const { data } = await api.post(url, body)
    aplicarEstado(data)
    return true
  } catch (e) {
    error.value = e.response?.data?.message || 'Algo falló, intenta de nuevo'
    return false
  } finally {
    enviando.value = false
  }
}

function iniciarTarea() {
  if (tareaActual.value) return pedirNota('cambiar')
  crearTarea()
}

async function crearTarea(notaAnterior, checklist) {
  const anterior = tareaActual.value
  const ok = await accion('/jornada/tarea', { descripcion: nuevaTarea.value, notaAnterior, checklist })
  if (ok) {
    nuevaTarea.value = ''
    avisarCambio(anterior ? `✅ Terminaste "${anterior.descripcion}"` : null)
  }
  return ok
}

// Lleva la pantalla al cronómetro y explica el cambio: si no lo ven, creen que sigue la tarea anterior
let toastTimer = null
async function avisarCambio(antes) {
  await nextTick()
  const t = tareaActual.value
  if (!t) return
  toast.value = [antes, `▶ Empezó "${t.descripcion}"`].filter(Boolean).join('\n')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 5000)
  tarjetaTarea.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  resaltarTarea.value = true
  setTimeout(() => { resaltarTarea.value = false }, 2000)
  navigator.vibrate?.(80)
}

function pedirNota(tipo) {
  cierre.value = { tipo, nota: '', checklist: { comidaMarcada: false, revisado: false, unasCortadas: false } }
}

async function aceptarAviso() {
  enviando.value = true
  error.value = ''
  try {
    const { data } = await api.post('/jornada/consentimiento')
    aplicarEstado(data)
    if (permiso.value === 'granted') registrarPush()
  } catch (e) {
    error.value = e.response?.data?.message || 'No se pudo guardar, intenta de nuevo'
  } finally {
    enviando.value = false
  }
}

async function iniciarJornada() {
  if (yaTerminoHoy.value && !confirm('Ya terminaste una jornada hoy. ¿Seguro que quieres iniciar otra?')) return
  await accion('/jornada/iniciar')
}

function abrirRecepcion() {
  error.value = ''
  recepcion.value = { perro: '', especie: 'PERRO', tipo: 'DIA', salidaEsperada: '' }
}

function abrirFicha(p) {
  error.value = ''
  ficha.value = {
    id: p.id,
    nombre: p.perro,
    entrada: p.entrada,
    diasTranscurridos: Math.max(0, (Date.now() - new Date(p.entrada)) / 86400000),
    masComida: '',
    datos: {
      perro: p.perro,
      especie: p.especie || 'PERRO',
      tipo: p.tipo,
      salidaEsperada: p.salidaEsperada || '',
      comidaCantidad: p.comidaCantidad ?? '',
      comidaUnidad: p.comidaUnidad || 'PORCIONES',
      comidaPorDia: p.comidaPorDia ?? '',
    },
  }
}

async function guardarFicha() {
  if (await accion(`/jornada/guarderia/${ficha.value.id}/editar`, ficha.value.datos)) ficha.value = null
}

async function sumarComida() {
  if (await accion(`/jornada/guarderia/${ficha.value.id}/comida`, { cantidad: ficha.value.masComida })) ficha.value = null
}

async function anularPerro() {
  if (!confirm(`¿Anular el registro de ${ficha.value.nombre}? No contará en los reportes.`)) return
  if (await accion(`/jornada/guarderia/${ficha.value.id}/anular`)) ficha.value = null
}

function textoComida(p) {
  const u = p.comidaUnidad === 'GRAMOS' ? 'g' : 'porc.'
  const dias = p.diasComida < 1 ? 'menos de 1 día' : `${p.diasComida} días`
  const base = `Comida para ${dias} (quedan ~${p.comidaRestante} ${u})`
  if (p.comidaNoAlcanza) return `${base} · ⚠️ no alcanza hasta la salida`
  if (p.comidaPorAcabarse) return `${base} · ⚠️ se está acabando`
  return base
}

function fechaCorta(f) {
  return new Date(f + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })
}

async function confirmarRecepcion() {
  const anterior = tareaActual.value
  if (await accion('/jornada/guarderia/recibir', recepcion.value)) {
    recepcion.value = null
    avisarCambio(anterior ? `⏸ "${anterior.descripcion}" quedó en pausa` : null)
  }
}

function terminarEnEspera(t) {
  if (confirm(`¿Ya terminaste "${t.descripcion}"?`)) accion(`/jornada/tarea/${t.id}/terminar-espera`)
}

function entregar(p) {
  if (confirm(`¿Entregaste a ${p.perro}?`)) accion(`/jornada/guarderia/${p.id}/entregar`)
}

function agregarImprevisto(imp) {
  const n = cierre.value.nota.trim()
  if (n.includes(imp)) return
  cierre.value.nota = n ? `${n}. ${imp}` : imp
}

async function confirmarCierre(nota) {
  const { tipo } = cierre.value
  const checklist = conChecklist.value ? cierre.value.checklist : undefined
  let ok
  if (tipo === 'cambiar') ok = await crearTarea(nota, checklist)
  else {
    const terminada = tareaActual.value
    ok = await accion('/jornada/tarea/terminar', { nota, checklist })
    // Si al terminar se retomó una tarea en espera, mostrarlo igual que un cambio de tarea
    if (ok && tareaActual.value && tareaActual.value.id === terminada?.reanuda) {
      await avisarCambio(`✅ Terminaste "${terminada.descripcion}"`)
      toast.value = toast.value.replace('▶ Empezó', '▶ Retomaste')
    }
  }
  if (ok) cierre.value = null
}

function salirAlmuerzo() {
  if (confirm('¿Sales a almorzar? Tu tarea actual queda en pausa.')) accion('/jornada/almuerzo/salir')
}

function cerrarJornada() {
  // Si se quedó más de su horario y no ha dicho por qué, se lo pide antes de cerrar
  if (enExtra.value && !sesion.value.motivoExtra && segExtra.value >= 300) {
    cierreJornada.value = true
    return
  }
  if (confirm('¿Terminar tu jornada de hoy?')) accion('/jornada/cerrar')
}

async function cerrarConMotivo() {
  if (await accion('/jornada/cerrar', { motivoExtra: motivoExtra.value })) {
    cierreJornada.value = false
    motivoExtra.value = ''
  }
}

function abrirMotivoExtra() {
  motivoExtra.value = sesion.value.motivoExtra || ''
  editandoExtra.value = true
}

async function guardarMotivoExtra() {
  if (await accion('/jornada/extra', { motivo: motivoExtra.value })) {
    motivoExtra.value = ''
    editandoExtra.value = false
  }
}

async function responderCheck(termino) {
  if (termino) {
    cerrarCheck()
    return pedirNota('terminar')
  }
  if (await accion('/jornada/tarea/seguir')) cerrarCheck()
}

function abrirCheck() {
  if (mostrarCheck.value || cierre.value) return
  mostrarCheck.value = true
  sonarAlarma()
  alarma = setInterval(sonarAlarma, 4000)
}

function cerrarCheck() {
  mostrarCheck.value = false
  clearInterval(alarma)
  alarma = null
}

// iOS/Android solo permiten audio si el contexto se creó o reanudó tras un toque del usuario
let audioCtx = null
let alarma = null
function desbloquearAudio() {
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)()
    if (audioCtx.state === 'suspended') audioCtx.resume()
  } catch { /* sin audio */ }
}

function sonarAlarma() {
  navigator.vibrate?.([500, 200, 500, 200, 500])
  if (!audioCtx) return
  const t0 = audioCtx.currentTime
  for (let i = 0; i < 3; i++) {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'square'
    osc.frequency.value = i % 2 ? 1320 : 990
    gain.gain.value = 1
    osc.connect(gain).connect(audioCtx.destination)
    osc.start(t0 + i * 0.35)
    osc.stop(t0 + i * 0.35 + 0.25)
  }
}

function tick() {
  ahora.value = Date.now()
  if (corriendo.value && tareaActual.value.segundosParaCheck != null && segParaCheck.value === 0) {
    // El servidor marca el check al mismo tiempo; recargar trae checkPendiente=true y abre el modal
    abrirCheck()
  }
}

async function registrarPush() {
  try {
    const token = await obtenerTokenPush()
    if (!token) return 'Firebase no entregó token'
    await api.post('/jornada/push-token', { token })
    try { localStorage.setItem('ps_push_token', token) } catch { /* sin almacenamiento */ }
    return null
  } catch (e) {
    return e?.message || String(e)
  }
}

async function activarAvisos() {
  const p = await Notification.requestPermission()
  permiso.value = p
  if (p === 'granted') registrarPush()
}

async function login() {
  cargando.value = true
  error.value = ''
  try {
    const { data } = await api.post('/tutores/login', { email: usuario.value.trim(), password: password.value })
    if (!ROLES_PERMITIDOS.includes(data.tutor?.rol)) {
      error.value = 'Esta cuenta no tiene acceso al control de jornada'
      return
    }
    localStorage.setItem('ps_token', data.token)
    localStorage.setItem('ps_session', JSON.stringify({ tutor: { nombre: data.tutor.nombre, email: data.tutor.email, rol: data.tutor.rol } }))
    password.value = ''
    entrar()
  } catch (e) {
    error.value = e.response?.status === 404 || e.response?.status === 401 ? 'Usuario o contraseña incorrectos' : 'No se pudo entrar, intenta de nuevo'
  } finally {
    cargando.value = false
  }
}

function entrar() {
  logueado.value = true
  cargar()
  if (permiso.value === 'granted') registrarPush()
}

async function logout() {
  let token = null
  try { token = localStorage.getItem('ps_push_token') } catch { /* sin almacenamiento */ }
  if (token) {
    // Con timeout corto: si no hay red, igual se cierra la sesión
    await api.post('/jornada/push-token/quitar', { token }, { timeout: 4000 }).catch(() => {})
    try { localStorage.removeItem('ps_push_token') } catch { /* sin almacenamiento */ }
  }
  localStorage.removeItem('ps_token')
  localStorage.removeItem('ps_session')
  logueado.value = false
  estado.value = null
}

function alVolverAPantalla() {
  if (document.visibilityState !== 'visible') return
  revisarVersion()
  if (logueado.value) cargar()
}

// Instalada en la pantalla de inicio, la app puede quedarse días con el código viejo.
// Si el sitio publicó una versión nueva (cambia el nombre del bundle), se recarga.
async function revisarVersion() {
  try {
    const actual = document.querySelector('script[type="module"][src*="/assets/index-"]')?.getAttribute('src')
    if (!actual) return
    const html = await fetch('/equipo', { cache: 'no-store' }).then(r => r.text())
    const publicada = html.match(/\/assets\/index-[^"']+\.js/)?.[0]
    if (publicada && !actual.endsWith(publicada)) window.location.reload()
  } catch { /* sin red: se revisa la próxima vez */ }
}

function instalarManifest() {
  const agregados = []
  const add = (tag, attrs) => {
    const el = document.createElement(tag)
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
    document.head.appendChild(el)
    agregados.push(el)
  }
  add('link', { rel: 'manifest', href: '/equipo.webmanifest' })
  add('link', { rel: 'apple-touch-icon', href: '/images/logo-pet-station.png' })
  add('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' })
  add('meta', { name: 'apple-mobile-web-app-title', content: 'Mi Jornada' })
  add('meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' })
  return () => agregados.forEach(el => el.remove())
}

let quitarManifest = null

onMounted(() => {
  quitarManifest = instalarManifest()
  const session = JSON.parse(localStorage.getItem('ps_session') || 'null')
  if (localStorage.getItem('ps_token') && ROLES_PERMITIDOS.includes(session?.tutor?.rol)) entrar()
  revisarVersion()
  ticker = setInterval(tick, 1000)
  document.addEventListener('pointerdown', desbloquearAudio)
  document.addEventListener('visibilitychange', alVolverAPantalla)
  try {
    quitarOnMessage = onMessage(messaging, (payload) => {
      if (payload.data?.tag === 'jornada') cargar()
    })
  } catch { /* navegador sin soporte de push */ }
})

onUnmounted(() => {
  clearInterval(ticker)
  clearInterval(alarma)
  document.removeEventListener('pointerdown', desbloquearAudio)
  document.removeEventListener('visibilitychange', alVolverAPantalla)
  quitarOnMessage?.()
  quitarManifest?.()
})
</script>
