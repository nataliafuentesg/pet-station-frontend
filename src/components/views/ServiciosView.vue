<template>
  <div class="min-h-screen bg-[#0a163d] pt-32 pb-20 px-4 md:px-12">
    
    <div class="max-w-7xl mx-auto mb-16">
      <h2 class="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-white">
        Nuestros <br/><span class="text-cyan-400">Servicios</span>
      </h2>
    </div>

    <div class="max-w-7xl mx-auto space-y-16 pb-40 text-left bg-white rounded-[3rem] md:rounded-[5rem] p-6 md:p-16 shadow-2xl animate-in fade-in duration-700">

        <section class="rounded-[3.5rem] bg-[#0a163d] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
            <div class="relative z-10">
                <div class="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
                    <div class="max-w-2xl">
                        <span class="bg-ps-red text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Global Travel Expert</span>
                        <h3 class="text-4xl md:text-6xl font-black italic uppercase leading-tight mt-4 text-white">¿Qué <span class="text-ps-red">Gestionamos</span>?</h3>
                        <p class="text-white font-bold mt-4 text-sm leading-relaxed uppercase italic">Acompañamiento legal para que tu mejor amigo cruce fronteras.</p>
                    </div>
                    <div class="bg-white/10 p-6 rounded-[2rem] border border-white/40">
                        <p class="text-ps-red font-black text-xs uppercase italic mb-1">Tiempos</p>
                        <p class="text-xs font-black text-white leading-tight uppercase">Iniciar 4–8 semanas antes. Destinos especiales: 3 meses.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    <div v-for="v in gestionesViaje" :key="v.t" class="bg-white/10 p-6 rounded-3xl border border-white/20">
                        <h4 class="text-cyan-400 font-black uppercase text-xs mb-3 italic tracking-wider">{{ v.t }}</h4>
                        <p class="text-[11px] text-white font-bold leading-relaxed uppercase italic">{{ v.d }}</p>
                    </div>
                </div>

                <div class="mb-16">
                    <h4 class="text-white font-black uppercase text-sm mb-8 italic border-b border-white/20 pb-4 text-center">Protocolo de Viaje</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div v-for="(p, i) in pasosViaje" :key="i" class="bg-white p-6 rounded-[2rem] shadow-xl">
                            <span class="text-ps-red font-black italic text-3xl leading-none">0{{ i + 1 }}</span>
                            <p class="text-[10px] font-black uppercase text-[#0a163d] mt-2 mb-1">{{ p.t }}</p>
                            <p class="text-[9px] text-slate-600 font-bold italic leading-tight uppercase">{{ p.d }}</p>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col lg:flex-row gap-8 items-center bg-white/10 p-8 rounded-[3rem] border border-white/20">
                    <div class="flex-1 space-y-2">
                        <p class="text-xs font-black uppercase italic text-ps-red">Destinos frecuentes:</p>
                        <p class="text-sm font-black text-white uppercase italic tracking-tighter">🇺🇸 EE. UU. • 🇪🇺 EUROPA • 🇧🇷 BRASIL • 🇨🇦 CANADÁ • 🇨🇴 NACIONAL</p>
                    </div>
                    <button @click="$emit('open-login')" class="w-full lg:w-auto bg-ps-red text-white px-12 py-6 rounded-2xl font-black uppercase text-xs hover:bg-white hover:text-ps-red transition-all text-center">
                        Solicitar Checklist
                    </button>
                </div>
            </div>
        </section>

        <section class="bg-white rounded-[4rem] p-8 md:p-16 shadow-2xl border-2 border-slate-100">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div class="space-y-8">
                    <div>
                        <span class="text-[#152C77] font-black uppercase text-[10px] mb-4 block italic">Estética Premium</span>
                        <h3 class="text-5xl font-black italic uppercase text-[#0a163d] leading-none mb-6">Peluquería</h3>
                        <p class="text-slate-600 text-sm font-bold uppercase italic leading-relaxed">Higiene y dermocosmética de alta gama.</p>
                    </div>
                    <div class="bg-ps-red/5 p-8 rounded-[2.5rem] border-2 border-ps-red/20">
                        <h4 class="text-ps-red font-black uppercase text-xs mb-3 italic">Bienestar > Estética</h4>
                        <p class="text-[11px] font-bold text-[#0a163d] leading-relaxed uppercase italic">
                            "Si el proceso genera estrés, suspenderemos el servicio. <span class="text-ps-red font-black underline">La salud jamás estará por debajo de la estética.</span>"
                        </p>
                    </div>
                    <button @click="$emit('open-login')" class="block w-full text-center py-5 bg-[#0a163d] text-white rounded-2xl font-black uppercase text-xs">Reservar Turno</button>
                </div>

                <div class="lg:col-span-2 bg-slate-50 p-8 rounded-[3rem] border border-slate-200">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="text-[10px] font-black text-slate-400 uppercase italic border-b-2 border-slate-200">
                                <th class="pb-4">Talla</th>
                                <th class="pb-4">Baño</th>
                                <th class="pb-4 text-right">Corte</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200">
                            <tr v-for="p in preciosPeluqueria" :key="p.talla">
                                <td class="py-5">
                                    <p class="text-sm font-black text-[#152C77] uppercase italic">{{ p.talla }}</p>
                                    <p class="text-[9px] font-bold text-slate-400 uppercase italic">{{ p.ejemplo }}</p>
                                </td>
                                <td class="py-5 text-base font-black text-[#0a163d]">${{ p.bano }}</td>
                                <td class="py-5 text-right text-base font-black text-ps-red">${{ p.corte }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section class="bg-slate-50 p-10 rounded-[3.5rem] border border-slate-200 shadow-sm text-[#0a163d]">
                <h3 class="text-4xl font-black italic uppercase mb-8 border-b-8 border-[#152C77] inline-block">Consulta</h3>
                <div class="space-y-4">
                    <div v-for="item in consultaDetalle" :key="item.t" class="flex gap-4 p-5 bg-white rounded-3xl shadow-sm">
                        <div class="w-8 h-8 bg-[#152C77] text-white rounded-full flex-shrink-0 flex items-center justify-center font-black">✓</div>
                        <div>
                            <h4 class="text-[11px] font-black uppercase leading-none mb-1">{{ item.t }}</h4>
                            <p class="text-[10px] text-slate-500 font-bold uppercase italic">{{ item.d }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="bg-[#152C77] p-10 rounded-[3.5rem] text-white flex flex-col justify-between shadow-xl">
                <h3 class="text-3xl font-black italic uppercase mb-8 text-white">¿Cómo Atendemos?</h3>
                <div class="space-y-8">
                    <div v-for="(p, i) in pasosAtencion" :key="i" class="flex gap-6 items-start">
                        <span class="text-5xl font-black text-white/30 italic leading-none">0{{ i + 1 }}</span>
                        <div>
                            <p class="text-[11px] font-black uppercase text-ps-red italic tracking-widest mb-1">{{ p.t }}</p>
                            <p class="text-xs font-black text-white leading-relaxed uppercase">{{ p.d }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-12 bg-white/10 p-6 rounded-[2.5rem] border border-white/20 text-white">
                    <p class="text-[10px] font-black uppercase italic mb-2">Preparación:</p>
                    <p class="text-[9px] font-bold uppercase italic tracking-tight">Traer historial clínico • Fórmulas previas • Medicamentos actuales.</p>
                </div>
            </section>
        </div>

        <section class="bg-green-50 rounded-[4rem] p-8 md:p-16 border-4 border-green-100 shadow-sm">
            <div class="text-center mb-16">
                <h3 class="text-4xl md:text-6xl font-black italic uppercase text-green-800">Guardería</h3>
                <p class="text-green-600 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 italic">Diversión y socialización segura</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                <div v-for="g in infoGuarderia" :key="g.t" class="bg-white p-8 rounded-[3rem] shadow-sm border border-green-200">
                    <h4 class="text-[11px] font-black uppercase text-green-600 mb-4 italic underline decoration-2">{{ g.t }}</h4>
                    <p class="text-[11px] text-[#0a163d] font-bold leading-relaxed italic uppercase">{{ g.d }}</p>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-[#0a163d] p-10 rounded-[3rem] text-white">
                    <h4 class="text-lg font-black uppercase italic text-ps-red mb-6">Modalidades</h4>
                    <div v-for="m in modalidadesGuarderia" :key="m.t" class="border-b border-white/10 pb-4 mb-4">
                        <p class="text-xs font-black uppercase italic text-cyan-400">{{ m.t }}</p>
                        <p class="text-[10px] font-bold text-white mt-1 uppercase italic">{{ m.d }}</p>
                    </div>
                </div>
                <div class="bg-white p-10 rounded-[3rem] border-2 border-green-200">
                    <h4 class="text-lg font-black uppercase italic text-green-800 mb-6">Requisitos</h4>
                    <ul class="space-y-4">
                        <li v-for="r in requisitosGuarderia" :key="r" class="flex items-center gap-3 text-[10px] font-black text-[#0a163d] uppercase italic">
                            <span class="w-2 h-2 bg-ps-red rounded-full"></span> {{ r }}
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <section class="lg:col-span-3 bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm text-[#0a163d]">
                <h3 class="text-3xl font-black italic uppercase mb-10 border-b-4 border-ps-red inline-block">Laboratorio</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                    <div v-for="l in labs" :key="l" class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                        <p class="text-[10px] font-black uppercase text-[#152C77] italic">{{ l }}</p>
                    </div>
                </div>
                <div class="bg-[#0a163d] p-8 rounded-[3rem] text-white shadow-xl">
                    <h4 class="text-xs font-black uppercase text-ps-red mb-6 italic underline">Preparación de Muestras</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div v-for="prep in prepLab" :key="prep.t">
                            <p class="text-[11px] font-black uppercase text-cyan-400 mb-2 italic tracking-widest">{{ prep.t }}</p>
                            <p class="text-[10px] font-bold text-white uppercase leading-tight italic">{{ prep.d }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="lg:col-span-2 bg-[#0a163d] text-white p-10 rounded-[4rem] flex flex-col justify-between border-b-8 border-[#152C77] shadow-2xl">
                <div>
                    <h3 class="text-5xl font-black italic uppercase text-white mb-2">Rayos X</h3>
                    <p class="text-ps-red font-black uppercase text-[11px] italic mb-10 tracking-[0.2em]">Diagnóstico Digital Inmediato</p>
                    <div class="space-y-6">
                        <div v-for="rx in rxInfo" :key="rx" class="flex gap-4 items-center border-l-4 border-cyan-400 pl-4">
                            <p class="text-[11px] font-black uppercase text-white tracking-widest italic">{{ rx }}</p>
                        </div>
                    </div>
                </div>
                <button @click="$emit('open-login')" class="mt-12 block w-full text-center py-6 bg-ps-red text-white rounded-[2rem] font-black uppercase text-xs hover:bg-white transition-all shadow-lg">
                    Agendar Placa
                </button>
            </section>
        </div>

        <section class="bg-white p-10 md:p-16 rounded-[4rem] border border-slate-200 shadow-sm">
            <h3 class="text-4xl md:text-5xl font-black italic uppercase text-[#0a163d] mb-10 decoration-ps-red decoration-8 underline underline-offset-8">Cirugías</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                    <h4 class="text-xs font-black uppercase text-ps-red mb-6 italic tracking-widest">Procedimientos</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div v-for="c in cirugiasList" :key="c" class="p-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase text-[#0a163d] italic">
                            {{ c }}
                        </div>
                    </div>
                </div>
                <div class="space-y-12">
                    <div class="space-y-6">
                        <div v-for="step in pasosCirugia" :key="step.t" class="flex gap-4">
                            <span class="text-ps-red font-black italic underline text-xs leading-none">{{ step.t }}</span>
                            <p class="text-[10px] font-black text-[#0a163d] uppercase leading-tight italic">{{ step.d }}</p>
                        </div>
                    </div>
                    <div class="bg-[#0a163d] p-8 rounded-[3rem] text-white">
                        <p class="text-[11px] font-black uppercase text-ps-red mb-4 italic">Urgencias:</p>
                        <p class="text-[10px] font-black text-white mb-6 uppercase">Ante una emergencia, llámanos para atención inmediata.</p>
                        <a :href="whatsappLink('EMERGENCIA')" class="block w-full text-center py-4 bg-ps-red text-white rounded-2xl font-black uppercase text-[10px]">Llamar Ahora</a>
                    </div>
                </div>
            </div>
        </section>

    </div>
  </div>
</template>

<script setup>
const gestionesViaje = [
    { t: "Certificado Nacional", d: "Examen clínico para viajes dentro de Colombia." },
    { t: "Certificado Internacional", d: "Soporte documental según país destino." },
    { t: "Serologías", d: "Gestión de pruebas internacionales (USA/UE)." },
    { t: "Certificado ICA", d: "Gestión oficial SISPAP / CIS." },
    { t: "Microchip ISO", d: "Implantación homologada internacional." },
    { t: "Logística IATA", d: "Asesoría en guacal homologado." }
];

const pasosViaje = [
    { t: "Asesoría Día 0", d: "Definimos ruta y requisitos vigentes." },
    { t: "Salud y Chip", d: "Vacunas, desparasitación y microchip ISO." },
    { t: "Serología e ICA", d: "Gestión de pruebas y registro legal." },
    { t: "Vuelo Seguro", d: "Revisión final de documentos y guacal." }
];

const consultaDetalle = [
    { t: "Chequeo Completo", d: "Historia clínica de nariz a cola." },
    { t: "Vacunación", d: "Esquemas según edad y especie." },
    { t: "Antiparasitarios", d: "Prevención de pulgas y garrapatas." },
    { t: "Piel y Oídos", d: "Evaluación dermatológica y otoscopia." },
    { t: "Interconsultas", d: "Valoración quirúrgica avanzada." }
];

const pasosAtencion = [
    { t: "Contacto", d: "Escríbenos para disponibilidad inmediata." },
    { t: "Diagnóstico", d: "Evaluación física profunda." },
    { t: "Tratamiento", d: "Seguimiento activo de recuperación." }
];

const infoGuarderia = [
    { t: "Grupos por Talla", d: "Zonas separadas para juego sin estrés." },
    { t: "Supervisión Pro", d: "Monitoreo permanente de seguridad." },
    { t: "Enriquecimiento", d: "Actividades para estimular mente y cuerpo." },
    { t: "Reportes WhatsApp", d: "Fotos y actualizaciones constantes." },
    { t: "Higiene Total", d: "Desinfección profunda diaria." }
];

const modalidadesGuarderia = [
    { t: "Hotel", d: "Cuidado continuo con descanso individual." },
    { t: "Pasadía", d: "Rutina diaria de socialización y juego." },
    { t: "Internado", d: "Estancias prolongadas con atención médica." }
];

const requisitosGuarderia = [
    "Vacunas al día (Rabia incluida)",
    "Desparasitación < 30 días",
    "Evaluación de temperamento",
    "No hembras en celo",
    "Alimento habitual rotulado"
];

const labs = ["Hemogramas", "Bioquímica", "Electrolitos", "Hormonales", "Urianálisis", "Coprológicos", "Citologías"];

const prepLab = [
    { t: "Sangre", d: "Ayuno 8-12h. Informar medicamentos previos." },
    { t: "Orina/Fecal", d: "Muestra fresca en frasco estéril < 2h." }
];

const rxInfo = ["Placas Digitales", "Informe Radiológico", "Tórax y Abdomen", "Sistema Óseo"];

const cirugiasList = ["Esterilizaciones", "Tejidos Blandos", "Masas", "Gastrointestinales", "Piometras", "Cesáreas"];

const pasosCirugia = [
    { t: "PRE", d: "Ayuno 8-12h y consentimiento firmado." },
    { t: "POST", d: "Medicamentos y collar isabelino." },
    { t: "ALTA", d: "Monitoreo de signos de alarma." }
];

const preciosPeluqueria = [
    { talla: 'Mini / Pequeño', ejemplo: 'Yorkie, Maltés, Pomerania', bano: '50.000', corte: '75.000' },
    { talla: 'Mediano', ejemplo: 'Schnauzer, Cocker, Beagle', bano: '65.000', corte: '95.000' },
    { talla: 'Grande', ejemplo: 'Golden, Samoyedo, Husky', bano: '85.000', corte: '125.000' },
    { talla: 'Gigante', ejemplo: 'Boyero, San Bernardo', bano: '110.000', corte: '160.000' },
];

const whatsappLink = (msg) => `https://wa.me/573000000000?text=${encodeURIComponent(msg)}`;
</script>

<style scoped>
.font-black { font-weight: 900; }
.italic { font-style: italic; }
</style>