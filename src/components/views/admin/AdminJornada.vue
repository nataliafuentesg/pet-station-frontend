<template>
  <div class="space-y-6">

    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-[1000] uppercase italic dark:text-white">Productividad</h2>
        <p class="text-[10px] text-slate-500 dark:text-white/30 uppercase tracking-widest">Jornadas y tareas del equipo · portal en /equipo</p>
      </div>
      <button v-if="!soloLectura" @click="abrirForm()"
        class="flex items-center gap-2 bg-[#152C77] hover:bg-[#DE1F27] text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors">
        ➕ Nuevo empleado
      </button>
      <span v-else class="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">👁 Solo consulta</span>
    </div>

    <div class="flex gap-2 overflow-x-auto">
      <button v-for="v in vistas" :key="v.id" @click="vista = v.id"
        class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors"
        :class="vista === v.id ? 'bg-[#152C77] text-white' : 'bg-white dark:bg-white/5 text-slate-500 dark:text-white/50 border border-slate-100 dark:border-white/10'">
        {{ v.label }}
      </button>
    </div>

    <!-- AHORA -->
    <div v-if="vista === 'ahora'" class="space-y-3">
      <div class="flex justify-end">
        <button @click="cargarEmpleados" class="text-[10px] font-black uppercase text-slate-400 hover:text-[#152C77] dark:text-white/40">🔄 Actualizar</button>
      </div>
      <div v-if="loadingEmpleados" class="py-16 text-center">
        <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
      <div v-else-if="!activos.length && !guarderiaAhora?.adentro?.length" class="py-16 text-center text-slate-400 dark:text-white/30 text-[11px] uppercase tracking-widest">
        Sin empleados. Crea el primero con "Nuevo empleado".
      </div>
      <div v-if="guarderiaAhora?.adentro?.length" class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-2">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">
          🐾 Mascotas adentro · {{ guarderiaAhora.adentro.length }}
          <span class="text-purple-500">({{ guarderiaAhora.adentro.filter(p => p.tipo === 'HOTEL').length }} hotel)</span>
        </p>
        <div v-for="p in alertasPerros" :key="p.id" class="text-[12px] font-bold text-red-600 dark:text-red-300">
          ⚠️ {{ p.perro }}:
          <span v-if="p.salidaVencida">debía salir el {{ diaCorto(p.salidaEsperada) }}. </span>
          <span v-if="p.comidaNoAlcanza">la comida alcanza hasta el {{ diaCorto(p.comidaAlcanzaHasta) }} y sale el {{ diaCorto(p.salidaEsperada) }}. </span>
          <span v-else-if="p.comidaPorAcabarse">le queda comida para menos de un día. </span>
        </div>
        <p v-if="!alertasPerros.length" class="text-[11px] text-slate-400 dark:text-white/30">Sin alertas de comida ni de salidas.</p>
      </div>
      <div v-if="activos.length" class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div v-for="e in activos" :key="e.tutorId"
          class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="font-[1000] uppercase italic text-sm dark:text-white truncate">{{ e.nombre }}</p>
              <p class="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-widest">{{ e.cargo }}<span v-if="e.esPrueba" class="text-amber-500"> · 🧪 prueba</span></p>
            </div>
            <span class="text-[9px] px-2.5 py-1 rounded-full font-black uppercase shrink-0" :class="estadoVivo(e).clase">
              {{ estadoVivo(e).label }}
            </span>
          </div>
          <div v-if="e.tareaActual" class="bg-slate-50 dark:bg-white/5 rounded-xl px-4 py-3">
            <p class="text-[13px] font-bold dark:text-white break-words">{{ e.tareaActual.descripcion }}</p>
            <p class="text-[10px] text-slate-400 dark:text-white/40 mt-1">
              {{ dur(e.tareaActual.segundos) }} en esta tarea
              <span v-if="e.tareaActual.checkPendiente" class="text-amber-500 font-bold"> · no ha respondido el aviso</span>
            </p>
          </div>
          <div v-if="e.sesion" class="flex items-center justify-between gap-3">
            <p class="text-[10px] text-slate-400 dark:text-white/40">
              Entró {{ hora(e.sesion.inicio) }} · {{ dur(e.sesion.segundosEnTareas) }} en tareas hoy
            </p>
            <button v-if="!soloLectura" @click="terminarJornadaDe(e)" class="shrink-0 text-[9px] font-black uppercase text-red-400 hover:text-red-600">Terminar jornada</button>
          </div>
        </div>
      </div>
    </div>

    <!-- REPORTE -->
    <div v-if="vista === 'reporte'" class="space-y-5">
      <div class="flex flex-wrap items-end gap-3">
        <div class="flex gap-1">
          <button v-for="p in presets" :key="p.id" @click="aplicarPreset(p.id)"
            class="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
            :class="preset === p.id ? 'bg-[#DE1F27] text-white' : 'bg-white dark:bg-white/5 text-slate-500 dark:text-white/50 border border-slate-100 dark:border-white/10'">
            {{ p.label }}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <input type="date" v-model="desde" @change="preset = null; cargarResumen()" :class="inputClass" class="!py-2 !text-xs" />
          <span class="text-slate-400 text-xs">a</span>
          <input type="date" v-model="hasta" @change="preset = null; cargarResumen()" :class="inputClass" class="!py-2 !text-xs" />
        </div>
        <select v-if="cargos.length > 1" v-model="filtroCargo" @change="cargarResumen" :class="inputClass" class="!py-2 !text-xs !w-auto">
          <option value="">Todos los cargos</option>
          <option v-for="c in cargos" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div v-if="loadingResumen" class="py-16 text-center">
        <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>

      <template v-else-if="resumen">
        <!-- Totales del equipo -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div v-for="k in kpis" :key="k.label" class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-4">
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">{{ k.label }}</p>
            <p class="text-2xl font-[1000] mt-1 tabular-nums" :class="k.color || 'dark:text-white'">{{ k.valor }}</p>
          </div>
        </div>

        <!-- Por persona -->
        <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-x-auto">
          <table class="w-full text-left min-w-[760px]">
            <thead class="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
              <tr>
                <th v-for="h in ['Persona','Días','Jornada','En tareas','Tiempo muerto','Ocupación','Tareas','Avisos sin responder','Llegadas tarde','Extras','']" :key="h"
                  class="px-4 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest dark:text-white">{{ h }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
              <tr v-for="p in resumen.personas" :key="p.tutorId" class="hover:bg-slate-50 dark:hover:bg-white/3">
                <td class="px-4 py-3">
                  <p class="font-[1000] uppercase italic text-[12px] dark:text-white">{{ p.nombre }}</p>
                  <p class="text-[9px] text-slate-400 dark:text-white/30 uppercase">{{ p.cargo }}<span v-if="!p.activo"> · inactivo</span></p>
                </td>
                <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">{{ p.dias }}</td>
                <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">{{ dur(p.segJornada) }}</td>
                <td class="px-4 py-3 text-[12px] font-bold text-green-600 dark:text-green-400 tabular-nums">{{ dur(p.segTareas) }}</td>
                <td class="px-4 py-3 text-[12px] font-bold tabular-nums" :class="p.segMuerto > 3600 ? 'text-red-500' : 'dark:text-white/70'">{{ dur(p.segMuerto) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-20 h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                      <div class="h-full rounded-full" :class="barraClase(p.pctOcupado)" :style="{ width: p.pctOcupado + '%' }"></div>
                    </div>
                    <span class="text-[11px] font-black dark:text-white/70 tabular-nums">{{ p.pctOcupado }}%</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">
                  {{ p.numTareas }}
                  <span v-if="p.conImprevistos" class="block text-[9px] text-amber-500 font-black uppercase">{{ p.conImprevistos }} con imprevistos</span>
                </td>
                <td class="px-4 py-3 text-[12px] font-bold tabular-nums" :class="p.checksSinRespuesta ? 'text-amber-500' : 'dark:text-white/70'">
                  {{ p.checksSinRespuesta }}<span class="opacity-40"> / {{ p.checksEnviados }}</span>
                  <span v-if="p.avisosSinTarea" class="block text-[9px] text-red-500 font-black uppercase">🔔 {{ p.avisosSinTarea }} de "sin tarea"</span>
                  <span v-if="p.cierresAutomaticos" class="block text-[9px] text-red-400 font-black uppercase">Olvidó cerrar {{ p.cierresAutomaticos }}×</span>
                </td>
                <td class="px-4 py-3 text-[12px] font-bold tabular-nums whitespace-nowrap" :class="p.llegadasTarde ? 'text-red-500' : 'dark:text-white/30'">
                  {{ p.llegadasTarde ? `${p.llegadasTarde} vez/veces` : '—' }}
                  <span v-if="p.minutosTarde" class="block text-[9px] font-black uppercase opacity-80">{{ dur(p.minutosTarde * 60) }} en total</span>
                  <span v-if="p.salidasAntes" class="block text-[9px] font-black uppercase text-amber-500">Salió antes {{ p.salidasAntes }}× ({{ dur(p.minutosSalioAntes * 60) }})</span>
                </td>
                <td class="px-4 py-3 text-[12px] font-bold tabular-nums whitespace-nowrap" :class="p.segExtra ? 'text-purple-600 dark:text-purple-300' : 'dark:text-white/30'">
                  {{ p.segExtra ? dur(p.segExtra) : '—' }}
                  <span v-if="p.extras?.length" class="block text-[9px] font-black uppercase opacity-70">{{ p.extras.length }} día(s)</span>
                </td>
                <td class="px-4 py-3">
                  <button v-if="p.dias" @click="abrirDetalle(p)" class="text-[9px] font-black uppercase text-[#152C77] dark:text-blue-300 hover:text-[#DE1F27] whitespace-nowrap">Ver día →</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-[10px] text-slate-400 dark:text-white/30">
          Jornada = tiempo desde que inicia hasta que cierra, sin almuerzo. Tiempo muerto = parte de la jornada sin ninguna tarea registrada. Extras = lo que pasa de las horas por día de cada persona.
        </p>

        <!-- Horas extra con su motivo -->
        <div v-if="extrasPeriodo.length" class="space-y-2">
          <h3 class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50">⏰ Horas extra</h3>
          <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5">
            <div v-for="x in extrasPeriodo" :key="x.nombre + x.fecha" class="flex items-start justify-between gap-3 px-4 py-3">
              <div class="min-w-0">
                <p class="text-[12px] font-[1000] uppercase italic dark:text-white">{{ x.nombre }} · <span class="not-italic font-bold normal-case text-slate-500 dark:text-white/50">{{ diaCorto(x.fecha) }}</span></p>
                <p class="text-[11px]" :class="x.motivo ? 'text-slate-600 dark:text-white/70' : 'text-amber-500 font-bold'">{{ x.motivo || 'Sin motivo registrado' }}</p>
              </div>
              <span class="text-[12px] font-black text-purple-600 dark:text-purple-300 tabular-nums shrink-0">{{ dur(x.segundos) }}</span>
            </div>
          </div>
        </div>

        <!-- Por tarea -->
        <div class="space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50">Tareas que más tiempo consumen</h3>
            <button v-if="!soloLectura && resumen.tareas.some(t => !t.nivel || !t.area)" @click="clasificarEsfuerzo" :disabled="clasificando"
              class="text-[10px] font-black uppercase tracking-widest text-[#152C77] dark:text-blue-300 hover:text-[#DE1F27] disabled:opacity-40">
              {{ clasificando ? 'Clasificando…' : '🤖 Clasificar esfuerzo con IA' }}
            </button>
          </div>
          <div v-if="!resumen.tareas.length" class="py-10 text-center text-slate-400 dark:text-white/30 text-[11px] uppercase tracking-widest bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
            Aún no hay tareas terminadas en este periodo
          </div>
          <div v-else class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-x-auto">
            <table class="w-full text-left min-w-[600px]">
              <thead class="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                <tr>
                  <th v-for="h in ['Tarea','Esfuerzo','Área','Veces','Tiempo total','Promedio','Quién la hace']" :key="h"
                    class="px-4 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest dark:text-white">{{ h }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-white/5">
                <tr v-for="t in resumen.tareas.slice(0, 40)" :key="t.descripcion">
                  <td class="px-4 py-3 text-[12px] font-bold dark:text-white">{{ t.descripcion }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <template v-if="!soloLectura">
                      <select :value="t.nivel || ''" @change="corregirEsfuerzo(t, { nivel: $event.target.value })"
                        class="bg-transparent text-[11px] font-bold outline-none rounded-lg border border-slate-200 dark:border-white/10 px-2 py-1 dark:text-white"
                        :class="claseNivel(t.nivel)">
                        <option value="" disabled>—</option>
                        <option value="LIGERA">Ligera</option>
                        <option value="MODERADA">Moderada</option>
                        <option value="PESADA">Pesada</option>
                      </select>
                      <label v-if="t.nivel" class="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-white/50 cursor-pointer" title="La podría hacer un auxiliar">
                        <input type="checkbox" :checked="!!t.delegable" @change="corregirEsfuerzo(t, { delegable: $event.target.checked })" class="accent-[#152C77]" />
                        Auxiliar
                      </label>
                    </template>
                    <span v-else class="text-[11px] font-bold" :class="claseNivel(t.nivel)">
                      {{ { LIGERA: 'Ligera', MODERADA: 'Moderada', PESADA: 'Pesada' }[t.nivel] || '—' }}<span v-if="t.delegable"> · auxiliar</span>
                    </span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <select v-if="!soloLectura && t.nivel" :value="t.area || ''" @change="corregirEsfuerzo(t, { area: $event.target.value })"
                      class="bg-transparent text-[11px] font-bold outline-none rounded-lg border border-slate-200 dark:border-white/10 px-2 py-1 dark:text-white">
                      <option value="" disabled>—</option>
                      <option v-for="(n, a) in AREAS" :key="a" :value="a">{{ n }}</option>
                    </select>
                    <span v-else class="text-[11px] font-bold text-slate-500 dark:text-white/50">{{ AREAS[t.area] || '—' }}</span>
                  </td>
                  <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">
                    {{ t.veces }}
                    <span v-if="t.conImprevistos" class="block text-[9px] text-amber-500 font-black uppercase">{{ t.conImprevistos }} con imprevistos</span>
                  </td>
                  <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">{{ dur(t.segTotal) }}</td>
                  <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">{{ dur(t.segPromedio) }}</td>
                  <td class="px-4 py-3 text-[11px] text-slate-500 dark:text-white/50">{{ t.personas.join(', ') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>

    <!-- GUARDERÍA: ocupación vs tiempo del equipo -->
    <div v-if="vista === 'guarderia'" class="space-y-5">
      <div class="flex flex-wrap items-end gap-3">
        <div class="flex gap-1">
          <button v-for="p in presets" :key="p.id" @click="aplicarPreset(p.id)"
            class="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
            :class="preset === p.id ? 'bg-[#DE1F27] text-white' : 'bg-white dark:bg-white/5 text-slate-500 dark:text-white/50 border border-slate-100 dark:border-white/10'">
            {{ p.label }}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <input type="date" v-model="desde" @change="preset = null; recargar()" :class="inputClass" class="!py-2 !text-xs" />
          <span class="text-slate-400 text-xs">a</span>
          <input type="date" v-model="hasta" @change="preset = null; recargar()" :class="inputClass" class="!py-2 !text-xs" />
        </div>
      </div>

      <div v-if="loadingOcupacion" class="py-16 text-center">
        <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
      <template v-else-if="ocupacion">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div v-for="k in kpisGuarderia" :key="k.label" class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-4">
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">{{ k.label }}</p>
            <p class="text-2xl font-[1000] mt-1 tabular-nums dark:text-white">{{ k.valor }}</p>
            <p v-if="k.nota" class="text-[10px] text-slate-400 dark:text-white/30 mt-0.5">{{ k.nota }}</p>
          </div>
        </div>

        <!-- Comparación días con pocos perros vs días llenos -->
        <div v-if="comparacion" class="grid gap-3 lg:grid-cols-2">
          <div v-for="g in comparacion" :key="g.titulo" class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-3">
            <div>
              <p class="font-[1000] uppercase italic text-sm dark:text-white">{{ g.titulo }}</p>
              <p class="text-[10px] text-slate-400 dark:text-white/40">
                {{ g.dias }} día(s) · {{ g.perros }} perros en promedio · {{ dur(g.segTareas) }} en tareas y {{ dur(g.segMuerto) }} sin tarea por día
              </p>
            </div>
            <div v-for="t in g.tareas" :key="t.descripcion" class="space-y-1">
              <div class="flex justify-between gap-3 text-[11px] font-bold dark:text-white/80">
                <span class="truncate">{{ t.descripcion }}</span>
                <span class="tabular-nums shrink-0">{{ dur(t.seg) }}/día</span>
              </div>
              <div class="h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                <div class="h-full rounded-full bg-[#152C77] dark:bg-blue-400" :style="{ width: (t.seg * 100 / g.maxSeg) + '%' }"></div>
              </div>
            </div>
            <p v-if="!g.tareas.length" class="text-[11px] text-slate-400 dark:text-white/30">Sin tareas terminadas.</p>
          </div>
        </div>
        <p v-else class="text-[11px] text-slate-400 dark:text-white/30">Con al menos 2 días de datos aparece la comparación entre días con pocos perros y días llenos.</p>

        <!-- Por día -->
        <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-x-auto">
          <table class="w-full text-left min-w-[820px]">
            <thead class="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
              <tr>
                <th v-for="h in ['Día','Mascotas día','Hotel','Máx. a la vez','Personas','En tareas','Sin tarea','Horas por mascota','Recepciones (uñas)','Baños','']" :key="h"
                  class="px-4 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest dark:text-white">{{ h }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
              <tr v-for="d in [...ocupacion].reverse()" :key="d.fecha" class="hover:bg-slate-50 dark:hover:bg-white/3">
                <td class="px-4 py-3 text-[12px] font-[1000] uppercase italic dark:text-white whitespace-nowrap">{{ diaCorto(d.fecha) }}</td>
                <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">{{ d.perrosDia }}</td>
                <td class="px-4 py-3 text-[12px] font-bold text-purple-600 dark:text-purple-300 tabular-nums">{{ d.perrosHotel }}</td>
                <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">{{ d.maxSimultaneo }}</td>
                <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">{{ d.personas }}</td>
                <td class="px-4 py-3 text-[12px] font-bold text-green-600 dark:text-green-400 tabular-nums">{{ dur(d.segTareas) }}</td>
                <td class="px-4 py-3 text-[12px] font-bold tabular-nums" :class="d.segMuerto > 3600 ? 'text-red-500' : 'dark:text-white/70'">{{ dur(d.segMuerto) }}</td>
                <td class="px-4 py-3 text-[12px] font-bold dark:text-white/70 tabular-nums">{{ horasPorPerro(d) }}</td>
                <td class="px-4 py-3 text-[12px] font-bold tabular-nums" :class="d.recepciones && d.conUnas < d.recepciones ? 'text-amber-500' : 'dark:text-white/70'">
                  {{ d.recepciones }}<span v-if="d.recepciones" class="opacity-50"> ({{ d.conUnas }})</span>
                </td>
                <td class="px-4 py-3 text-[12px] font-bold text-cyan-600 dark:text-cyan-300 tabular-nums whitespace-nowrap">
                  {{ d.banos }}<span v-if="d.segBanoPromedio" class="opacity-60 text-[10px]"> · {{ dur(d.segBanoPromedio) }} c/u</span>
                </td>
                <td class="px-4 py-3">
                  <button @click="abrirPerfil(d)" class="text-[9px] font-black uppercase text-[#152C77] dark:text-blue-300 hover:text-[#DE1F27] whitespace-nowrap">Ver día →</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-[10px] text-slate-400 dark:text-white/30">
          Solo cuenta al equipo con cargo de guardería. Horas por perro = horas en tareas ÷ perros atendidos ese día (día + hotel). Un perro de hotel cuenta todos los días que está.
        </p>
      </template>
    </div>

    <!-- RESUMEN DEL DÍA CON IA -->
    <div v-if="vista === 'ia'" class="flex gap-2">
      <button v-for="m in [['dia', '📅 Resumen del día'], ['periodo', '🔎 Análisis de un periodo']]" :key="m[0]" @click="modoIA = m[0]"
        class="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
        :class="modoIA === m[0] ? 'bg-[#DE1F27] text-white' : 'bg-white dark:bg-white/5 text-slate-500 dark:text-white/50 border border-slate-100 dark:border-white/10'">
        {{ m[1] }}
      </button>
    </div>

    <div v-if="vista === 'ia' && modoIA === 'periodo'" class="space-y-4">
      <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <button v-for="d in [7, 14, 30]" :key="d" @click="periodoUltimos(d)"
            class="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/60">
            Últimos {{ d }} días
          </button>
          <input type="date" v-model="periodo.desde" :class="inputClass" class="!w-auto !py-2 !text-xs" />
          <span class="text-slate-400 text-xs">a</span>
          <input type="date" v-model="periodo.hasta" :class="inputClass" class="!w-auto !py-2 !text-xs" />
        </div>
        <textarea v-model="periodo.pregunta" rows="2" maxlength="500" :class="inputClass" class="!text-sm resize-none"
          placeholder="Pregunta opcional. Ej: ¿Qué pasaría si contratamos un auxiliar de veterinaria? ¿Están equilibrados los dos turnos de guardería?"></textarea>
        <button v-if="!soloLectura" @click="analizarPeriodo" :disabled="analizando || !periodo.desde || !periodo.hasta"
          class="bg-[#152C77] hover:bg-[#DE1F27] text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-40">
          {{ analizando ? 'Analizando… (puede tardar un minuto)' : '✨ Analizar periodo' }}
        </button>
        <p v-else class="text-[11px] text-slate-400 dark:text-white/30">Solo el administrador principal puede generar análisis.</p>
      </div>
      <p v-if="errorAnalisis" class="text-[12px] font-bold text-red-500">{{ errorAnalisis }}</p>
      <div v-if="analisis" class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-6 resumen-ia text-[13px] leading-relaxed text-slate-700 dark:text-white/80"
        v-html="markdownSimple(analisis)"></div>
      <p class="text-[10px] text-slate-400 dark:text-white/30">
        Usa los datos del periodo: horas por persona, esfuerzo de cada tarea, tareas que podría hacer un auxiliar, interrupciones y horas extra con su motivo.
        Las estimaciones son aproximadas; entre más días de datos, mejores.
      </p>
    </div>

    <div v-if="vista === 'ia' && modoIA === 'dia'" class="space-y-4">
      <div class="flex flex-wrap items-center gap-3">
        <input type="date" v-model="fechaIA" @change="cargarResumenIA" :class="inputClass" class="!w-auto !py-2 !text-xs" />
        <button v-if="!soloLectura" @click="generarResumenIA" :disabled="generandoIA"
          class="bg-[#152C77] hover:bg-[#DE1F27] text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-40">
          {{ generandoIA ? 'Generando… (unos segundos)' : resumenIA ? '🔄 Volver a generar' : '✨ Generar resumen' }}
        </button>
        <span v-if="resumenIA" class="text-[10px] text-slate-400 dark:text-white/30">Generado {{ fechaHora(resumenIA.generadoEn) }}</span>
      </div>
      <p v-if="errorIA" class="text-[12px] font-bold text-red-500">{{ errorIA }}</p>
      <div v-if="cargandoIA" class="py-16 text-center">
        <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
      <div v-else-if="resumenIA" class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-6 resumen-ia text-[13px] leading-relaxed text-slate-700 dark:text-white/80"
        v-html="markdownSimple(resumenIA.texto)"></div>
      <div v-else-if="!errorIA" class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 py-14 text-center text-slate-400 dark:text-white/30 text-[11px] uppercase tracking-widest">
        Aún no hay resumen para este día
      </div>
      <p class="text-[10px] text-slate-400 dark:text-white/30">
        Se genera solo cada noche a las 10:45 p.m. con ChatGPT. A OpenAI se le envían los datos sin nombres (cada persona va con un código); los nombres se ponen aquí.
        Es un análisis automático: úsalo como guía y verifica los números en Reporte antes de tomar decisiones.
      </p>
    </div>

    <!-- EQUIPO -->
    <div v-if="vista === 'equipo'" class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-x-auto">
      <div v-if="!empleados.length" class="py-16 text-center text-slate-400 dark:text-white/30 text-[11px] uppercase tracking-widest">Sin empleados</div>
      <table v-else class="w-full text-left min-w-[560px]">
        <thead class="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
          <tr>
            <th v-for="h in ['Nombre','Usuario','Cargo','Estado','Aviso de datos', ...(soloLectura ? [] : [''])]" :key="h"
              class="px-5 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest dark:text-white">{{ h }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-white/5">
          <tr v-for="e in empleados" :key="e.tutorId">
            <td class="px-5 py-3 font-[1000] uppercase italic text-[12px] dark:text-white">{{ e.nombre }}</td>
            <td class="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">{{ e.usuario }}</td>
            <td class="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {{ e.cargo }}
              <span v-if="e.turnoInicio" class="ml-1 text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/50 font-black uppercase">🕐 {{ horaCorta(e.turnoInicio) }}–{{ horaCorta(e.turnoFin) }}</span>
              <span v-if="e.minutosAviso === 0" class="ml-1 text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/50 font-black uppercase">🔕 Sin avisos</span>
              <span v-if="e.esPrueba" class="ml-1 text-[9px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 font-black uppercase">🧪 Prueba</span>
              <span v-if="e.accesoClinico" class="ml-1 text-[9px] px-2 py-0.5 rounded-full bg-[#152C77]/10 text-[#152C77] dark:text-blue-300 font-black uppercase">🩺 Clínica</span>
            </td>
            <td class="px-5 py-3">
              <span class="text-[9px] px-2.5 py-1 rounded-full font-black uppercase"
                :class="e.activo ? 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400'">
                {{ e.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-5 py-3 text-[10px] font-bold whitespace-nowrap" :class="e.consentimientoEn ? 'text-green-600 dark:text-green-400' : 'text-amber-500'">
              {{ e.consentimientoEn ? '✓ ' + new Date(e.consentimientoEn).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) : 'Pendiente' }}
            </td>
            <td v-if="!soloLectura" class="px-5 py-3 text-right whitespace-nowrap space-x-3">
              <button @click="abrirForm(e)" class="text-[9px] font-black uppercase text-[#152C77] dark:text-blue-300 hover:text-[#DE1F27]">Editar</button>
              <button @click="toggleActivo(e)" class="text-[9px] font-black uppercase"
                :class="e.activo ? 'text-red-400 hover:text-red-600' : 'text-green-500 hover:text-green-700'">
                {{ e.activo ? 'Desactivar' : 'Reactivar' }}
              </button>
              <button v-if="e.accesoClinico" @click="quitarDeProductividad(e)" class="text-[9px] font-black uppercase text-slate-400 hover:text-amber-600">Quitar de Productividad</button>
              <button @click="eliminarEmpleado(e)" class="text-[9px] font-black uppercase text-slate-400 hover:text-red-600">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Turnos de la empresa (para los rotativos) -->
    <div v-if="vista === 'equipo' && !soloLectura" class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-3">
      <div>
        <p class="font-[1000] uppercase italic text-sm dark:text-white">🕐 Turnos de la empresa</p>
        <p class="text-[10px] text-slate-400 dark:text-white/40">
          Para quien tiene horario rotativo, el turno se deduce por la hora de llegada (más cerca del inicio de cuál turno llegó).
          Sin tolerancia: cualquier minuto después de la hora de entrada cuenta como tarde.
        </p>
      </div>
      <div v-for="(t, i) in turnosEdit" :key="i" class="flex flex-wrap items-center gap-2">
        <input v-model="t.nombre" placeholder="Nombre" :class="inputClass" class="!w-40 !py-2 !text-xs" />
        <input type="time" v-model="t.inicio" :class="inputClass" class="!w-32 !py-2 !text-xs" />
        <span class="text-slate-400 text-xs">a</span>
        <input type="time" v-model="t.fin" :class="inputClass" class="!w-32 !py-2 !text-xs" />
        <button @click="turnosEdit.splice(i, 1)" class="text-[10px] font-black uppercase text-slate-400 hover:text-red-600">Quitar</button>
      </div>
      <div class="flex items-center gap-3">
        <button @click="turnosEdit.push({ nombre: '', inicio: '', fin: '' })" class="text-[10px] font-black uppercase text-[#152C77] dark:text-blue-300">➕ Agregar turno</button>
        <button @click="guardarTurnos" :disabled="guardandoTurnos"
          class="bg-[#152C77] hover:bg-[#DE1F27] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-40">
          {{ guardandoTurnos ? 'Guardando...' : 'Guardar turnos' }}
        </button>
        <span v-if="turnosMsg" class="text-[10px] font-bold" :class="turnosOk ? 'text-green-600' : 'text-red-500'">{{ turnosMsg }}</span>
      </div>
    </div>

    <!-- Botones de tarea rápida por cargo -->
    <div v-if="vista === 'equipo' && !soloLectura" class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-4">
      <div>
        <p class="font-[1000] uppercase italic text-sm dark:text-white">⚡ Tareas sugeridas por cargo</p>
        <p class="text-[10px] text-slate-400 dark:text-white/40">Aparecen como sugerencia mientras escriben la tarea en Mi Jornada. Una por línea. Así todos usan el mismo nombre y el reporte las agrupa mejor.</p>
      </div>
      <p v-if="!Object.keys(rapidas).length" class="text-[11px] text-slate-400 dark:text-white/30">Crea empleados para configurar sus cargos.</p>
      <div v-for="(lista, cargo) in rapidas" :key="cargo" class="space-y-2">
        <p :class="labelClass">{{ cargo }}</p>
        <textarea v-model="rapidasTexto[cargo]" rows="5" :class="inputClass" class="!text-xs !font-semibold"></textarea>
        <div class="flex items-center gap-3">
          <button @click="guardarRapidas(cargo)" :disabled="guardandoRapidas === cargo"
            class="bg-[#152C77] hover:bg-[#DE1F27] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-40">
            {{ guardandoRapidas === cargo ? 'Guardando...' : 'Guardar' }}
          </button>
          <span v-if="rapidasOk === cargo" class="text-[10px] font-bold text-green-600 dark:text-green-400">✓ Guardado</span>
        </div>
      </div>
    </div>

    <!-- Modal perfil del día de guardería -->
    <Teleport to="body">
      <div v-if="perfil" class="fixed inset-0 z-[9000] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="perfil = null"></div>
        <div class="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 dark:border-white/5">
            <h3 class="font-[1000] uppercase italic text-sm dark:text-white">Guardería · {{ diaCorto(perfil.dia.fecha) }}</h3>
            <button @click="perfil = null" class="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-lg text-slate-400 dark:text-white/50">✕</button>
          </div>
          <div class="p-6 overflow-y-auto space-y-6">
            <div v-if="perfil.cargando" class="py-10 text-center">
              <div class="w-6 h-6 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <template v-else>
              <div>
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 mb-2">Por hora: perros adentro vs. personas con tarea</p>
                <div class="flex gap-3 text-[10px] font-bold text-slate-500 dark:text-white/50 mb-2">
                  <span><span class="inline-block w-2.5 h-2.5 rounded-sm bg-blue-400 align-middle"></span> Mascotas día</span>
                  <span><span class="inline-block w-2.5 h-2.5 rounded-sm bg-purple-400 align-middle"></span> Hotel</span>
                  <span><span class="inline-block w-2.5 h-2.5 rounded-sm bg-green-500 align-middle"></span> Personas con tarea</span>
                  <span><span class="inline-block w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-white/20 align-middle"></span> En jornada</span>
                </div>
                <div class="space-y-1">
                  <div v-for="h in horasVisibles" :key="h.hora" class="flex items-center gap-2">
                    <span class="w-10 text-[10px] font-bold tabular-nums text-slate-400 dark:text-white/40 shrink-0">{{ h.hora }}:00</span>
                    <div class="flex-1 space-y-0.5">
                      <div class="flex h-2.5">
                        <div class="bg-blue-400 rounded-l-sm" :style="{ width: (h.perrosDia * 100 / maxPerrosHora) + '%' }"></div>
                        <div class="bg-purple-400 rounded-r-sm" :style="{ width: (h.perrosHotel * 100 / maxPerrosHora) + '%' }"></div>
                      </div>
                      <div class="relative h-2.5">
                        <div class="absolute inset-y-0 left-0 bg-slate-200 dark:bg-white/15 rounded-sm" :style="{ width: (h.enJornada * 100 / maxPersonasHora) + '%' }"></div>
                        <div class="absolute inset-y-0 left-0 bg-green-500 rounded-sm" :style="{ width: (h.conTarea * 100 / maxPersonasHora) + '%' }"></div>
                      </div>
                    </div>
                    <span class="w-20 text-[10px] font-bold tabular-nums text-slate-500 dark:text-white/50 text-right shrink-0">{{ h.perrosDia + h.perrosHotel }} 🐕 · {{ h.conTarea }}/{{ h.enJornada }} 👤</span>
                  </div>
                </div>
                <p v-if="!horasVisibles.length" class="text-[11px] text-slate-400 dark:text-white/30">Sin actividad registrada.</p>
              </div>

              <div v-if="perfil.dia.tareas?.length">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 mb-2">En qué se fue el tiempo del equipo</p>
                <div v-for="t in perfil.dia.tareas.slice(0, 12)" :key="t.descripcion" class="flex justify-between gap-3 text-[12px] font-bold py-1 dark:text-white/80">
                  <span class="truncate">{{ t.descripcion }} <span class="opacity-40">×{{ t.veces }}</span></span>
                  <span class="tabular-nums shrink-0">{{ dur(t.segTotal) }}</span>
                </div>
              </div>

              <div>
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 mb-2">Mascotas</p>
                <p v-if="!perfil.perros.length" class="text-[11px] text-slate-400 dark:text-white/30">No se registraron perros.</p>
                <div v-for="p in perfil.perros" :key="p.perro + p.entrada" class="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100 dark:border-white/5 last:border-0">
                  <div class="min-w-0">
                    <p class="text-[12px] font-bold dark:text-white truncate">{{ p.especie === 'GATO' ? '🐈' : '🐕' }} {{ p.perro }} <span class="text-[9px] uppercase" :class="{ HOTEL: 'text-purple-500', BANO: 'text-cyan-500', DIA: 'text-blue-500' }[p.tipo]">{{ { HOTEL: 'Hotel', BANO: 'Baño', DIA: 'Día' }[p.tipo] }}</span></p>
                    <p class="text-[10px] text-slate-400 dark:text-white/40">{{ fechaHora(p.entrada) }} – {{ p.salida ? fechaHora(p.salida) : 'sigue adentro' }}<span v-if="p.salidaEsperada"> · sale {{ diaCorto(p.salidaEsperada) }}</span></p>
                    <p v-if="p.comidaCantidad" class="text-[10px]" :class="p.comidaNoAlcanza || p.comidaPorAcabarse ? 'text-red-500' : 'text-slate-400 dark:text-white/40'">
                      🍖 Trajo {{ p.comidaCantidad }} {{ p.comidaUnidad === 'GRAMOS' ? 'g' : 'porciones' }}<span v-if="p.comidaPorDia">, come {{ p.comidaPorDia }}/día</span><span v-if="p.diasComida != null && !p.salida"> · alcanza {{ p.diasComida }} días más</span>
                    </p>
                  </div>
                  <div class="flex gap-1 text-[10px] shrink-0" title="Comida marcada · Revisado · Uñas">
                    <span v-for="c in ['comidaMarcada','revisado','unasCortadas']" :key="c"
                      :class="p[c] ? 'text-green-500' : p[c] === false ? 'text-red-400' : 'text-slate-300 dark:text-white/20'">
                      {{ { comidaMarcada: '🍖', revisado: '🩺', unasCortadas: '✂️' }[c] }}{{ p[c] ? '✓' : p[c] === false ? '✗' : '' }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal crear / editar -->
    <Teleport to="body">
      <div v-if="form" class="fixed inset-0 z-[9000] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="form = null"></div>
        <div class="relative w-full max-w-md max-h-[90vh] flex flex-col bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5 shrink-0">
            <h3 class="font-[1000] uppercase italic text-sm dark:text-white">{{ form.tutorId ? 'Editar empleado' : 'Nuevo empleado' }}</h3>
            <button @click="form = null" class="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-lg text-slate-400 dark:text-white/50">✕</button>
          </div>
          <div class="p-6 space-y-4 overflow-y-auto">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label :class="labelClass">Nombre *</label>
                <input v-model="form.nombre" :class="inputClass" />
              </div>
              <div class="space-y-1">
                <label :class="labelClass">Apellido</label>
                <input v-model="form.apellido" :class="inputClass" />
              </div>
            </div>
            <div class="space-y-1">
              <label :class="labelClass">Usuario *</label>
              <input v-model="form.usuario" :disabled="!!form.tutorId" autocapitalize="none" placeholder="ej: maria.guarderia"
                :class="inputClass" class="disabled:opacity-50" />
            </div>
            <div class="space-y-1">
              <label :class="labelClass">Cargo *</label>
              <input v-model="form.cargo" list="jornada-cargos" :class="inputClass" />
              <datalist id="jornada-cargos">
                <option v-for="c in cargosSugeridos" :key="c" :value="c" />
              </datalist>
            </div>
            <div class="space-y-1">
              <label :class="labelClass">Pregunta "¿Ya terminaste?"</label>
              <select v-model.number="form.minutosAviso" :class="inputClass">
                <option :value="15">Cada 15 minutos</option>
                <option :value="30">Cada 30 minutos</option>
                <option :value="60">Cada hora</option>
                <option :value="0">Sin avisos</option>
              </select>
            </div>
            <div class="space-y-1">
              <label :class="labelClass">Horario</label>
              <select v-model="form.horarioFijo" :class="inputClass">
                <option :value="false">Rotativo (usa los turnos de la empresa)</option>
                <option :value="true">Fijo</option>
              </select>
              <div v-if="form.horarioFijo" class="grid grid-cols-2 gap-2 pt-1">
                <label class="space-y-1"><span class="text-[9px] font-bold text-slate-400">Entra</span>
                  <input type="time" v-model="form.turnoInicio" :class="inputClass" /></label>
                <label class="space-y-1"><span class="text-[9px] font-bold text-slate-400">Sale</span>
                  <input type="time" v-model="form.turnoFin" :class="inputClass" /></label>
              </div>
            </div>
            <div class="space-y-1">
              <label :class="labelClass">Horas de trabajo por día</label>
              <input v-model="form.horasJornada" type="number" min="1" max="16" step="0.5" :class="inputClass" />
              <p class="text-[10px] text-slate-400 dark:text-white/30">Lo que pase de aquí se cuenta como horas extra.</p>
            </div>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" v-model="form.esPrueba" class="w-4 h-4 accent-[#152C77]" />
              <span class="text-[12px] font-bold text-slate-600 dark:text-white/70">🧪 Cuenta de prueba <span class="font-normal opacity-60">(no cuenta en reportes, ocupación ni resumen IA)</span></span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" v-model="form.accesoClinico" class="w-4 h-4 accent-[#152C77]" />
              <span class="text-[12px] font-bold text-slate-600 dark:text-white/70">Acceso al panel clínico <span class="font-normal opacity-60">(veterinarios: entran con este mismo usuario)</span></span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" v-model="form.recibePerros" class="w-4 h-4 accent-[#152C77]" />
              <span class="text-[12px] font-bold text-slate-600 dark:text-white/70">Puede recibir y entregar mascotas <span class="font-normal opacity-60">(guardería ya lo tiene siempre)</span></span>
            </label>
            <div class="space-y-1">
              <label :class="labelClass">{{ form.tutorId ? 'Nueva contraseña (opcional)' : 'Contraseña *' }}</label>
              <input v-model="form.password" type="text" placeholder="Mínimo 4 caracteres" :class="inputClass" />
            </div>

            <div v-if="errorForm" class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3 text-[11px] text-red-600 dark:text-red-400">{{ errorForm }}</div>

            <div class="flex gap-3 pt-2">
              <button @click="form = null" class="flex-1 bg-slate-100 dark:bg-white/5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest dark:text-white">Cancelar</button>
              <button @click="guardar" :disabled="!formValido || guardando"
                class="flex-1 bg-[#152C77] hover:bg-[#DE1F27] text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-colors disabled:opacity-30">
                {{ guardando ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
            <p v-if="!form.tutorId" class="text-[10px] text-slate-400 dark:text-white/30 leading-relaxed">
              Entrégale el usuario y la contraseña. Entra desde el celular a <b>petstationvet.com/equipo</b> y lo agrega a la pantalla de inicio.
            </p>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal detalle del día -->
    <Teleport to="body">
      <div v-if="detalle" class="fixed inset-0 z-[9000] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="detalle = null"></div>
        <div class="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 dark:border-white/5">
            <div class="min-w-0">
              <h3 class="font-[1000] uppercase italic text-sm dark:text-white truncate">{{ detalle.persona.nombre }}</h3>
              <input type="date" v-model="detalle.fecha" @change="cargarDetalle" class="mt-1 bg-transparent text-[11px] font-bold text-slate-500 dark:text-white/50 outline-none" />
            </div>
            <button @click="detalle = null" class="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-lg text-slate-400 dark:text-white/50 shrink-0">✕</button>
          </div>
          <div class="p-6 overflow-y-auto space-y-5">
            <div v-if="detalle.cargando" class="py-10 text-center">
              <div class="w-6 h-6 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <p v-else-if="!detalle.sesiones.length" class="py-10 text-center text-slate-400 dark:text-white/30 text-[11px] uppercase tracking-widest">No trabajó este día</p>
            <div v-for="(s, i) in detalle.sesiones" :key="i" class="space-y-2">
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">
                Jornada {{ hora(s.inicio) }} – {{ s.fin ? hora(s.fin) : 'en curso' }}
                <span v-if="s.cierreAutomatico" class="text-red-400"> · no la cerró</span>
                <span v-if="s.cerradaPorAdmin" class="text-amber-500"> · terminada por el admin</span>
              </p>
              <p v-if="s.turno" class="text-[11px] font-bold" :class="s.turno.minutosTarde ? 'text-red-500' : 'text-green-600 dark:text-green-400'">
                🕐 {{ s.turno.turno }} ({{ horaCorta(s.turno.turnoInicio) }}–{{ horaCorta(s.turno.turnoFin) }}) ·
                {{ s.turno.minutosTarde ? `llegó ${s.turno.minutosTarde} min tarde` : 'llegó a tiempo' }}
                <span v-if="s.turno.minutosSalioAntes" class="text-amber-500"> · salió {{ s.turno.minutosSalioAntes }} min antes</span>
              </p>
              <p v-if="s.motivoExtra" class="text-[11px] font-bold text-purple-600 dark:text-purple-300">⏰ Motivo de horas extra: {{ s.motivoExtra }}</p>
              <div v-for="(it, j) in s.linea" :key="j" class="flex items-center gap-3 rounded-xl px-4 py-2.5" :class="itemClase(it.tipo)">
                <span class="text-[10px] font-bold tabular-nums w-24 shrink-0 opacity-70">{{ hora(it.inicio) }} – {{ hora(it.fin) }}</span>
                <span class="flex-1 min-w-0 text-[12px] font-bold break-words">
                  {{ it.tipo === 'TAREA' ? it.descripcion : it.tipo === 'ALMUERZO' ? '🍽️ Almuerzo' : '⏸ Sin tarea registrada' }}
                  <span v-if="it.tipo === 'ALMUERZO' && it.automatico" class="block text-[9px] font-black uppercase text-red-500">No marcó el regreso: se terminó solo a la hora</span>
                  <span v-if="it.tipo === 'SIN_TAREA' && it.avisos" class="block text-[9px] font-black uppercase text-red-500">🔔 Recibió {{ it.avisos }} aviso(s) de "regístralo" en este rato</span>
                  <span v-if="it.explicacion" class="block text-[11px] font-semibold text-slate-700 dark:text-white/80 mt-0.5">💬 Explicó: "{{ it.explicacion }}"</span>
                  <span v-if="it.nota" class="block text-[11px] font-semibold text-amber-700 dark:text-amber-300 mt-0.5">⚠️ {{ it.nota }}</span>
                  <span v-if="it.checksSinRespuesta" class="block text-[9px] font-black uppercase text-amber-500">{{ it.checksSinRespuesta }} aviso(s) sin responder</span>
                </span>
                <span class="text-[11px] font-black tabular-nums shrink-0">{{ dur(it.segundos) }}</span>
              </div>
            </div>

            <!-- Avisos enviados: para responder "no me llegó ningún aviso" -->
            <div v-if="detalle.avisos" class="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">🔔 Avisos enviados · {{ detalle.avisos.avisos.length }}</p>
              <p class="text-[11px] font-bold" :class="detalle.avisos.celulares ? 'text-green-600 dark:text-green-400' : 'text-red-500'">
                {{ detalle.avisos.celulares ? `📱 ${detalle.avisos.celulares} celular(es) registrado(s) para recibir avisos` : '📱 No tiene ningún celular registrado: nunca activó los avisos o los desactivó' }}
              </p>
              <p v-if="!detalle.avisos.avisos.length" class="text-[11px] text-slate-400 dark:text-white/30">No se le enviaron avisos este día.</p>
              <div v-for="(a, k) in detalle.avisos.avisos" :key="k" class="flex items-start gap-3 text-[11px] py-1.5 border-b border-slate-100 dark:border-white/5 last:border-0">
                <span class="w-14 shrink-0 font-bold tabular-nums text-slate-500 dark:text-white/50">{{ hora(a.enviadoEn) }}</span>
                <div class="flex-1 min-w-0">
                  <p class="font-bold dark:text-white/80">{{ a.titulo }} <span class="font-normal text-slate-400 dark:text-white/30">· {{ TIPOS_AVISO[a.tipo] || a.tipo }}</span></p>
                  <p :class="estadoEnvio(a).clase">{{ estadoEnvio(a).texto }}</p>
                </div>
                <span class="shrink-0 text-right font-bold" :class="a.respondidoEn ? 'text-slate-500 dark:text-white/50' : 'text-amber-500'">
                  {{ a.respondidoEn ? `Reaccionó ${hora(a.respondidoEn)} (${minutosEntre(a.enviadoEn, a.respondidoEn)})` : 'Sin reacción' }}
                </span>
              </div>
              <p class="text-[10px] text-slate-400 dark:text-white/30">
                "Enviado" quiere decir que el servicio de notificaciones lo recibió para su celular. Si aun así no lo vio, puede ser el modo "No molestar", el ahorro de batería o las notificaciones bloqueadas en el teléfono.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import api from '@/api/axios'

const props = defineProps({
  // Administrador limitado: puede consultar todo pero no cambia el equipo ni genera resúmenes
  soloLectura: { type: Boolean, default: false },
})

const vistas = [
  { id: 'ahora', label: '🟢 Ahora' },
  { id: 'reporte', label: '📊 Reporte' },
  { id: 'guarderia', label: '🐕 Guardería' },
  { id: 'ia', label: '🤖 Resumen IA' },
  { id: 'equipo', label: '👥 Equipo' },
]
const presets = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'semana', label: '7 días' },
  { id: 'mes', label: '30 días' },
]
const inputClass = 'w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#152C77]'
const labelClass = 'text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40'

const vista = ref('ahora')
const empleados = ref([])
const loadingEmpleados = ref(false)

const preset = ref('semana')
const desde = ref('')
const hasta = ref('')
const filtroCargo = ref('')
const resumen = ref(null)
const loadingResumen = ref(false)

const form = ref(null)
const errorForm = ref('')
const guardando = ref(false)
const detalle = ref(null)
const ocupacion = ref(null)
const turnosEdit = ref([])
const guardandoTurnos = ref(false)
const turnosMsg = ref('')
const turnosOk = ref(false)
const clasificando = ref(false)
const modoIA = ref('dia')
const periodo = ref({ desde: '', hasta: '', pregunta: '' })
const analisis = ref('')
const analizando = ref(false)
const errorAnalisis = ref('')
const fechaIA = ref(fechaLocal(new Date()))
const resumenIA = ref(null)
const cargandoIA = ref(false)
const generandoIA = ref(false)
const errorIA = ref('')
const extrasPeriodo = computed(() => (resumen.value?.personas || [])
  .flatMap(p => (p.extras || []).map(x => ({ ...x, nombre: p.nombre })))
  .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha))))
const rapidas = ref({})
const rapidasTexto = ref({})
const guardandoRapidas = ref(null)
const rapidasOk = ref(null)
const guarderiaAhora = ref(null)
const alertasPerros = computed(() => (guarderiaAhora.value?.adentro || [])
  .filter(p => p.salidaVencida || p.comidaNoAlcanza || p.comidaPorAcabarse))
const loadingOcupacion = ref(false)
const perfil = ref(null)

const activos = computed(() => empleados.value.filter(e => e.activo))
const cargos = computed(() => [...new Set(empleados.value.map(e => e.cargo).filter(Boolean))])
const cargosSugeridos = computed(() => [...new Set(['Guardería', ...cargos.value])])
const formValido = computed(() => form.value?.nombre?.trim() && form.value?.cargo?.trim() &&
  (form.value.tutorId || (form.value.usuario?.trim() && form.value.password?.length >= 4)))

const kpis = computed(() => {
  const ps = resumen.value?.personas || []
  const sum = k => ps.reduce((a, p) => a + p[k], 0)
  const jornada = sum('segJornada')
  return [
    { label: 'Horas de jornada', valor: dur(jornada) },
    { label: 'En tareas', valor: dur(sum('segTareas')), color: 'text-green-600 dark:text-green-400' },
    { label: 'Tiempo muerto', valor: dur(sum('segMuerto')), color: 'text-red-500' },
    { label: 'Ocupación del equipo', valor: (jornada ? Math.round(sum('segTareas') * 100 / jornada) : 0) + '%' },
  ]
})

function fechaLocal(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function dur(seg) {
  seg = seg || 0
  const h = Math.floor(seg / 3600)
  const m = Math.floor((seg % 3600) / 60)
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`
}
function hora(iso) {
  return iso ? new Date(iso).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' }) : ''
}
function barraClase(pct) {
  return pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-500'
}
function itemClase(tipo) {
  if (tipo === 'TAREA') return 'bg-green-50 dark:bg-green-500/10 text-green-900 dark:text-green-200'
  if (tipo === 'ALMUERZO') return 'bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-200'
  return 'bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-300'
}
function estadoVivo(e) {
  if (!e.sesion) return { label: 'Sin jornada', clase: 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/40' }
  if (e.sesion.estado === 'ALMUERZO') return { label: 'Almuerzo', clase: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300' }
  if (e.tareaActual) return { label: 'Trabajando', clase: 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400' }
  return { label: 'Sin tarea', clase: 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400' }
}

async function cargarEmpleados() {
  loadingEmpleados.value = true
  try {
    const [{ data }, g] = await Promise.all([
      api.get('/admin/jornada/empleados'),
      api.get('/admin/jornada/guarderia').catch(() => ({ data: null })),
    ])
    empleados.value = data
    guarderiaAhora.value = g.data
  } finally {
    loadingEmpleados.value = false
  }
}

function aplicarPreset(id) {
  preset.value = id
  const hoy = new Date()
  const ini = new Date()
  if (id === 'semana') ini.setDate(hoy.getDate() - 6)
  if (id === 'mes') ini.setDate(hoy.getDate() - 29)
  desde.value = fechaLocal(ini)
  hasta.value = fechaLocal(hoy)
  recargar()
}

// Las dos vistas comparten el rango de fechas: la que no está visible se recarga al volver a ella
function recargar() {
  if (vista.value === 'guarderia') {
    resumen.value = null
    cargarOcupacion()
  } else {
    ocupacion.value = null
    cargarResumen()
  }
}

async function cargarRapidas() {
  const { data } = await api.get('/admin/jornada/tareas-rapidas')
  rapidas.value = data
  rapidasTexto.value = Object.fromEntries(Object.entries(data).map(([c, l]) => [c, l.join('\n')]))
}

async function guardarRapidas(cargo) {
  guardandoRapidas.value = cargo
  try {
    const tareas = (rapidasTexto.value[cargo] || '').split('\n')
    const { data } = await api.put('/admin/jornada/tareas-rapidas', { cargo, tareas })
    rapidasTexto.value[cargo] = data.join('\n')
    rapidasOk.value = cargo
    setTimeout(() => { if (rapidasOk.value === cargo) rapidasOk.value = null }, 2500)
  } finally {
    guardandoRapidas.value = null
  }
}

// Al crear, el cargo de veterinaria marca solo el acceso al panel clínico
watch(() => form.value?.cargo, cargo => {
  if (form.value && !form.value.tutorId && /veterin|m[eé]dic/i.test(cargo || '')) form.value.accesoClinico = true
})

const AREAS = { GUARDERIA: 'Guardería', VETERINARIA: 'Veterinaria', CAJA: 'Caja', DOMICILIOS: 'Domicilios', CONTABILIDAD: 'Contabilidad', GENERAL: 'General' }

function claseNivel(n) {
  return { LIGERA: 'text-green-600 dark:text-green-400', MODERADA: 'text-amber-600 dark:text-amber-300', PESADA: 'text-red-600 dark:text-red-400' }[n] || 'text-slate-400'
}

async function corregirEsfuerzo(t, cambio) {
  const nivel = cambio.nivel || t.nivel
  if (!nivel) return
  try {
    const area = cambio.area || t.area || undefined
    await api.patch('/admin/jornada/esfuerzo', { clave: t.clave, nombre: t.descripcion, nivel, delegable: cambio.delegable ?? t.delegable ?? false, area })
    Object.assign(t, { nivel, delegable: cambio.delegable ?? t.delegable ?? false, area })
  } catch (e) {
    alert(e.response?.data?.message || 'No se pudo guardar')
  }
}

async function clasificarEsfuerzo() {
  clasificando.value = true
  try {
    await api.post('/admin/jornada/esfuerzo/clasificar', null, { params: { desde: desde.value, hasta: hasta.value }, timeout: 90000 })
    await cargarResumen()
  } catch (e) {
    alert(e.response?.data?.message || 'No se pudo clasificar')
  } finally {
    clasificando.value = false
  }
}

function periodoUltimos(d) {
  const fin = new Date()
  const ini = new Date()
  ini.setDate(fin.getDate() - (d - 1))
  periodo.value.desde = fechaLocal(ini)
  periodo.value.hasta = fechaLocal(fin)
}

async function analizarPeriodo() {
  analizando.value = true
  errorAnalisis.value = ''
  analisis.value = ''
  try {
    const { data } = await api.post('/admin/jornada/analisis-ia', periodo.value, { timeout: 120000 })
    analisis.value = data.texto
  } catch (e) {
    errorAnalisis.value = e.response?.status === 404 ? 'El servidor todavía no tiene esta función (falta desplegar el backend).' : (e.response?.data?.message || 'No se pudo generar el análisis')
  } finally {
    analizando.value = false
  }
}

async function cargarResumenIA() {
  cargandoIA.value = true
  errorIA.value = ''
  resumenIA.value = null
  try {
    const { data, status } = await api.get('/admin/jornada/resumen-ia', { params: { fecha: fechaIA.value } })
    resumenIA.value = status === 204 ? null : data
  } catch (e) {
    errorIA.value = e.response?.status === 404 ? 'El servidor todavía no tiene esta función (falta desplegar el backend).' : 'No se pudo cargar el resumen'
  } finally {
    cargandoIA.value = false
  }
}

async function generarResumenIA() {
  generandoIA.value = true
  errorIA.value = ''
  try {
    const { data } = await api.post('/admin/jornada/resumen-ia', null, { params: { fecha: fechaIA.value }, timeout: 90000 })
    resumenIA.value = data
  } catch (e) {
    errorIA.value = e.response?.data?.message || 'No se pudo generar el resumen'
  } finally {
    generandoIA.value = false
  }
}

// Markdown mínimo (títulos, viñetas, negritas) sobre texto ya escapado: no se inserta HTML del modelo
function markdownSimple(md) {
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const inline = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  let html = ''
  let enLista = false
  for (const linea of (md || '').split('\n')) {
    const l = linea.trim()
    const vineta = /^[-*•]\s+/.test(l)
    if (!vineta && enLista) { html += '</ul>'; enLista = false }
    if (!l) continue
    if (/^#{1,4}\s+/.test(l)) html += `<h3>${inline(l.replace(/^#{1,4}\s+/, ''))}</h3>`
    else if (vineta) {
      if (!enLista) { html += '<ul>'; enLista = true }
      html += `<li>${inline(l.replace(/^[-*•]\s+/, ''))}</li>`
    } else html += `<p>${inline(l)}</p>`
  }
  return html + (enLista ? '</ul>' : '')
}

watch(vista, v => {
  if (v === 'ia' && !resumenIA.value) cargarResumenIA()
  if (v === 'equipo' && !props.soloLectura) {
    cargarRapidas()
    cargarTurnos()
  }
  if (v === 'guarderia' && !ocupacion.value) cargarOcupacion()
  if (v === 'reporte' && !resumen.value) cargarResumen()
})

async function cargarOcupacion() {
  if (!desde.value || !hasta.value) return
  loadingOcupacion.value = true
  try {
    const { data } = await api.get('/admin/jornada/ocupacion', { params: { desde: desde.value, hasta: hasta.value } })
    ocupacion.value = data
  } finally {
    loadingOcupacion.value = false
  }
}

async function abrirPerfil(dia) {
  perfil.value = { dia, cargando: true, horas: [], perros: [] }
  try {
    const { data } = await api.get('/admin/jornada/ocupacion/dia', { params: { fecha: dia.fecha } })
    Object.assign(perfil.value, data)
  } finally {
    perfil.value.cargando = false
  }
}

const totalPerros = d => d.perrosDia + d.perrosHotel
function horasPorPerro(d) {
  const n = totalPerros(d)
  return n ? (d.segTareas / 3600 / n).toFixed(1) + ' h' : '—'
}
function diaCorto(f) {
  return new Date(f + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })
}
function fechaHora(iso) {
  return new Date(iso).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
}

const diasConDatos = computed(() => (ocupacion.value || []).filter(d => d.personas > 0 || totalPerros(d) > 0))

const kpisGuarderia = computed(() => {
  const ds = diasConDatos.value
  if (!ds.length) return [{ label: 'Días con datos', valor: 0, nota: 'Aún no hay registros en este periodo' }]
  const prom = k => ds.reduce((a, d) => a + k(d), 0) / ds.length
  const recepciones = ds.reduce((a, d) => a + d.recepciones, 0)
  const pct = k => recepciones ? Math.round(ds.reduce((a, d) => a + d[k], 0) * 100 / recepciones) + '%' : '—'
  const perrosTot = ds.reduce((a, d) => a + totalPerros(d), 0)
  return [
    { label: 'Mascotas por día', valor: prom(totalPerros).toFixed(1), nota: `Hotel: ${prom(d => d.perrosHotel).toFixed(1)} · Máx. a la vez: ${Math.max(...ds.map(d => d.maxSimultaneo))}` },
    { label: 'Horas en tareas por mascota', valor: perrosTot ? (ds.reduce((a, d) => a + d.segTareas, 0) / 3600 / perrosTot).toFixed(1) + ' h' : '—' },
    { label: 'Sin tarea por día', valor: dur(prom(d => d.segMuerto)), nota: 'Suma de todo el equipo de guardería' },
    { label: 'Recepciones completas', valor: pct('completas'), nota: `Comida ${pct('conComidaMarcada')} · Revisión ${pct('conRevision')} · Uñas ${pct('conUnas')}` },
  ]
})

// Parte los días en dos según la mediana de perros para ver en qué se va el tiempo cuando hay poca carga
const comparacion = computed(() => {
  const ds = diasConDatos.value.filter(d => d.personas > 0)
  if (ds.length < 2) return null
  const orden = [...ds].sort((a, b) => totalPerros(a) - totalPerros(b))
  const mitad = Math.floor(orden.length / 2)
  const grupo = (titulo, dias) => {
    const acum = {}
    dias.forEach(d => (d.tareas || []).forEach(t => { acum[t.descripcion] = (acum[t.descripcion] || 0) + t.segTotal }))
    const tareas = Object.entries(acum).map(([descripcion, seg]) => ({ descripcion, seg: seg / dias.length }))
      .sort((a, b) => b.seg - a.seg).slice(0, 8)
    return {
      titulo, dias: dias.length,
      perros: (dias.reduce((a, d) => a + totalPerros(d), 0) / dias.length).toFixed(1),
      segTareas: dias.reduce((a, d) => a + d.segTareas, 0) / dias.length,
      segMuerto: dias.reduce((a, d) => a + d.segMuerto, 0) / dias.length,
      tareas, maxSeg: Math.max(1, ...tareas.map(t => t.seg)),
    }
  }
  return [grupo('🟡 Días con menos perros', orden.slice(0, mitad)), grupo('🟢 Días con más perros', orden.slice(mitad))]
})

const horasVisibles = computed(() => {
  const hs = perfil.value?.horas || []
  // Los perros de hotel están las 24 h; el rango útil es el de los perros de día y el equipo
  const activas = hs.filter(h => h.perrosDia + h.enJornada > 0).map(h => h.hora)
  if (!activas.length) return []
  return hs.filter(h => h.hora >= Math.min(...activas) && h.hora <= Math.max(...activas))
})
const maxPerrosHora = computed(() => Math.max(1, ...horasVisibles.value.map(h => h.perrosDia + h.perrosHotel)))
const maxPersonasHora = computed(() => Math.max(1, ...horasVisibles.value.map(h => h.enJornada)))

async function cargarResumen() {
  if (!desde.value || !hasta.value) return
  loadingResumen.value = true
  try {
    const { data } = await api.get('/admin/jornada/resumen', {
      params: { desde: desde.value, hasta: hasta.value, cargo: filtroCargo.value || undefined }
    })
    resumen.value = data
  } finally {
    loadingResumen.value = false
  }
}

function abrirDetalle(p) {
  detalle.value = { persona: p, fecha: hasta.value, sesiones: [], cargando: true }
  cargarDetalle()
}

const TIPOS_AVISO = { TAREA: '¿ya terminaste?', SIN_TAREA: 'sin tarea', HORAS_CUMPLIDAS: 'horas cumplidas', ALMUERZO: 'almuerzo', REGRESO_ALMUERZO: 'regreso del almuerzo' }

function estadoEnvio(a) {
  if (a.dispositivos == null) return { texto: 'Enviado (antes de guardar el resultado)', clase: 'text-slate-400' }
  if (a.dispositivos === 0) return { texto: '✗ No le llegó: no tenía celular registrado', clase: 'text-red-500 font-bold' }
  if (a.entregados > 0) return { texto: `✓ Enviado a ${a.entregados} celular(es)`, clase: 'text-green-600 dark:text-green-400' }
  return { texto: `✗ Falló el envío${a.error ? ': ' + a.error : ''}`, clase: 'text-red-500 font-bold break-words' }
}

function minutosEntre(a, b) {
  const min = Math.round((new Date(b) - new Date(a)) / 60000)
  return min < 1 ? 'al momento' : min < 60 ? `${min} min después` : `${Math.floor(min / 60)} h ${min % 60} min después`
}

async function cargarDetalle() {
  detalle.value.cargando = true
  try {
    const params = { tutorId: detalle.value.persona.tutorId, fecha: detalle.value.fecha }
    const [{ data }, avisos] = await Promise.all([
      api.get('/admin/jornada/detalle', { params }),
      api.get('/admin/jornada/avisos', { params }).catch(() => ({ data: null })),
    ])
    detalle.value.sesiones = data
    detalle.value.avisos = avisos.data
  } finally {
    detalle.value.cargando = false
  }
}

function abrirForm(e) {
  errorForm.value = ''
  form.value = e
    ? { tutorId: e.tutorId, nombre: e.nombreCorto, apellido: e.apellido, usuario: e.usuario, cargo: e.cargo, recibePerros: e.recibePerros, accesoClinico: e.accesoClinico, esPrueba: e.esPrueba, minutosAviso: e.minutosAviso ?? 15,
        horarioFijo: !!e.turnoInicio, turnoInicio: (e.turnoInicio || '').slice(0, 5), turnoFin: (e.turnoFin || '').slice(0, 5), horasJornada: e.horasJornada ?? 8, password: '' }
    : { nombre: '', apellido: '', usuario: '', cargo: 'Guardería', recibePerros: false, accesoClinico: false, esPrueba: false, minutosAviso: 15, horarioFijo: false, turnoInicio: '', turnoFin: '', horasJornada: 8, password: '' }
}

async function guardar() {
  guardando.value = true
  errorForm.value = ''
  try {
    const f = form.value
    if (f.tutorId) {
      const body = { nombre: f.nombre, apellido: f.apellido, cargo: f.cargo, recibePerros: String(!!f.recibePerros), accesoClinico: String(!!f.accesoClinico), esPrueba: String(!!f.esPrueba), minutosAviso: String(f.minutosAviso ?? 15), horasJornada: String(f.horasJornada ?? 8),
        turnoInicio: f.horarioFijo ? f.turnoInicio : '', turnoFin: f.horarioFijo ? f.turnoFin : '' }
      if (f.password) body.password = f.password
      await api.patch(`/admin/jornada/empleados/${f.tutorId}`, body)
    } else {
      await api.post('/admin/jornada/empleados', { ...f, recibePerros: String(!!f.recibePerros), accesoClinico: String(!!f.accesoClinico), esPrueba: String(!!f.esPrueba), minutosAviso: String(f.minutosAviso ?? 15), horasJornada: String(f.horasJornada ?? 8),
        turnoInicio: f.horarioFijo ? f.turnoInicio : '', turnoFin: f.horarioFijo ? f.turnoFin : '' })
    }
    form.value = null
    cargarEmpleados()
  } catch (e) {
    errorForm.value = e.response?.data?.message || 'No se pudo guardar'
  } finally {
    guardando.value = false
  }
}

async function terminarJornadaDe(e) {
  if (!confirm(`¿Terminar la jornada de ${e.nombre} ahora? Su tarea en curso se cierra a esta hora.`)) return
  try {
    await api.post(`/admin/jornada/empleados/${e.tutorId}/terminar-jornada`)
  } catch (err) {
    alert(err.response?.data?.message || 'No se pudo terminar la jornada')
  }
  cargarEmpleados()
}

// "07:00:00" → "7:00 a. m."
function horaCorta(t) {
  if (!t) return ''
  const [h, m] = String(t).split(':').map(Number)
  const d = new Date(); d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })
}

async function cargarTurnos() {
  try {
    const { data } = await api.get('/admin/jornada/turnos')
    turnosEdit.value = data.map(t => ({ nombre: t.nombre, inicio: String(t.inicio).slice(0, 5), fin: String(t.fin).slice(0, 5) }))
  } catch { /* backend sin turnos todavía */ }
}

async function guardarTurnos() {
  guardandoTurnos.value = true
  turnosMsg.value = ''
  try {
    await api.put('/admin/jornada/turnos', turnosEdit.value)
    turnosOk.value = true
    turnosMsg.value = '✓ Guardado'
    cargarTurnos()
  } catch (e) {
    turnosOk.value = false
    turnosMsg.value = e.response?.data?.message || 'No se pudo guardar'
  } finally {
    guardandoTurnos.value = false
  }
}

async function quitarDeProductividad(e) {
  if (!confirm(`¿Quitar a ${e.nombre} de Productividad? Ya no se le medirá la jornada, pero conserva su cuenta y su acceso a la clínica.`)) return
  try {
    await api.delete(`/admin/jornada/empleados/${e.tutorId}/quitar`)
    cargarEmpleados()
  } catch (err) {
    alert(err.response?.data?.message || 'No se pudo quitar')
  }
}

async function eliminarEmpleado(e) {
  const escrito = prompt(`Esto borra la cuenta de ${e.nombre} y TODO su historial. Para cuentas de prueba.\n\nEscribe ELIMINAR para confirmar:`)
  if (escrito !== 'ELIMINAR') return
  await api.delete(`/admin/jornada/empleados/${e.tutorId}`)
  cargarEmpleados()
}

async function toggleActivo(e) {
  if (e.activo && !confirm(`¿Desactivar a ${e.nombre}? No podrá entrar, pero su historial se conserva.`)) return
  await api.patch(`/admin/jornada/empleados/${e.tutorId}`, { activo: String(!e.activo) })
  cargarEmpleados()
}

onMounted(() => {
  periodoUltimos(30)
  cargarEmpleados()
  aplicarPreset('semana')
})
</script>

<style scoped>
.resumen-ia :deep(h3) { font-weight: 1000; text-transform: uppercase; font-style: italic; font-size: 12px; letter-spacing: .05em; margin: 1.25rem 0 .5rem; }
.resumen-ia :deep(h3:first-child) { margin-top: 0; }
.resumen-ia :deep(ul) { list-style: disc; padding-left: 1.25rem; display: grid; gap: .35rem; }
.resumen-ia :deep(p) { margin: .35rem 0; }
</style>
