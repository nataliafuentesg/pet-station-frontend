<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const telefonoBase = '573187076798'; // WhatsApp de la clínica

// Función simple para el link de WhatsApp
const getWspLink = (servicio) => {
  const msj = `Hola Pet Station! 🐾\nQuisiera información o agendar una cita para: *${servicio}*.`;
  return `https://wa.me/${telefonoBase}?text=${encodeURIComponent(msj)}`;
};

const servicios = [
  { 
    titulo: "Consulta Veterinaria", 
    desc: "Valoración clínica completa, medicina preventiva, desparasitación y control de peso. El primer paso para la salud de tu mascota.", 
    icon: "🩺",
    action: "Agendar Consulta"
  },
  { 
    titulo: "Cirugía Programada", 
    desc: "Realizamos procedimientos de tejidos blandos y esterilizaciones en un quirófano equipado con anestesia segura y monitoreo.", 
    icon: "⚔️", // O el ícono del bisturí
    action: "Cotizar Cirugía"
  },
  { 
    titulo: "Vacunación", 
    desc: "Esquemas completos para cachorros y refuerzos anuales (Rabia, Triple, Tos de Perreras) con biológicos certificados.", 
    icon: "💉",
    action: "Ver Esquemas"
  },
  { 
    titulo: "Laboratorio Clínico", 
    desc: "Apoyo diagnóstico fundamental. Realizamos cuadros hemáticos y químicas sanguíneas para evaluar la salud interna.", 
    icon: "🔬",
    action: "Consultar Exámenes"
  },
  { 
    titulo: "Rayos X y Ecografía", 
    desc: "Ayudas diagnósticas esenciales para evaluar huesos, órganos internos o gestación. (Servicio sujeto a agenda).", 
    icon: "🦴",
    action: "Preguntar Disponibilidad"
  },
  { 
    titulo: "Odontología", 
    desc: "Profilaxis dental con ultrasonido para retirar el cálculo (sarro), mejorar el aliento y prevenir la pérdida de dientes.", 
    icon: "🦷",
    action: "Agendar Limpieza"
  }
];
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-5 md:pt-32 pb-20 transition-colors duration-500 font-sans">
    <div class="max-w-7xl mx-auto px-4 md:px-6">
      
      <div class="max-w-4xl mb-16 space-y-6 text-center md:text-left">
        <router-link to="/servicios" class="text-[#DE1F27] font-black uppercase text-[10px] tracking-widest block hover:translate-x-1 transition-transform">
            ← Volver a Servicios
        </router-link>
        
        <h1 class="text-4xl md:text-7xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-[0.9] tracking-tighter">
          SALUD & <br/> <span class="text-[#DE1F27]">BIENESTAR ANIMAL.</span>
        </h1>
        
        <p class="text-slate-600 dark:text-slate-400 font-bold uppercase italic text-[10px] md:text-sm max-w-xl leading-relaxed">
          Contamos con instalaciones dotadas y un equipo profesional comprometido con el cuidado responsable de tu mascota. Diagnóstico, prevención y tratamiento en un solo lugar.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        <div v-for="s in servicios" :key="s.titulo" 
          class="bg-slate-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/10 hover:border-[#152C77] dark:hover:border-[#DE1F27] transition-all group flex flex-col hover:shadow-xl">
          
          <div class="mb-6 w-14 h-14 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
            {{ s.icon }}
          </div>

          <h3 class="text-xl font-[1000] uppercase italic text-[#152C77] dark:text-white mb-3">
            {{ s.titulo }}
          </h3>
          
          <p class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase italic leading-relaxed mb-8 flex-1">
            {{ s.desc }}
          </p>
          
          <a :href="getWspLink(s.titulo)" target="_blank"
            class="w-full py-3 flex items-center justify-center gap-2 bg-[#152C77] text-white rounded-xl font-[1000] uppercase text-[9px] tracking-widest hover:bg-[#DE1F27] transition-colors">
            <span>💬</span> {{ s.action }}
          </a>
        </div>
      </div>

      <div class="bg-[#152C77] rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div class="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span class="text-[#DE1F27] font-black uppercase text-[9px] tracking-widest italic mb-2 block">Nuestras Instalaciones</span>
            <h2 class="text-3xl md:text-5xl font-[1000] uppercase italic leading-none mb-6">
              Equipados para <br/> Cuidarlos.
            </h2>
            <p class="text-[10px] font-bold opacity-70 uppercase leading-relaxed max-w-md mb-8">
              Disponemos de equipos de monitoreo anestésico, ecografía y laboratorio clínico para brindar el soporte necesario en cada procedimiento.
            </p>
            <a :href="getWspLink('INSTALACIONES')" target="_blank"
               class="inline-block bg-white text-[#152C77] px-8 py-3 rounded-xl font-[1000] uppercase text-[9px] tracking-widest hover:scale-105 transition-transform">
              Contactar a la Clínica
            </a>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/10 p-5 rounded-2xl border border-white/5">
              <span class="text-2xl mb-2 block">🧬</span>
              <h4 class="font-black uppercase text-[10px] italic">Bioseguridad</h4>
              <p class="text-[8px] opacity-60 uppercase mt-1">Protocolos de higiene estrictos.</p>
            </div>
            <div class="bg-white/10 p-5 rounded-2xl border border-white/5">
              <span class="text-2xl mb-2 block">💤</span>
              <h4 class="font-black uppercase text-[10px] italic">Anestesia Segura</h4>
              <p class="text-[8px] opacity-60 uppercase mt-1">Monitoreo de signos vitales.</p>
            </div>
            <div class="bg-white/10 p-5 rounded-2xl border border-white/5">
              <span class="text-2xl mb-2 block">📂</span>
              <h4 class="font-black uppercase text-[10px] italic">Historia Digital</h4>
              <p class="text-[8px] opacity-60 uppercase mt-1">Registro de cada visita.</p>
            </div>
            <div class="bg-white/10 p-5 rounded-2xl border border-white/5">
              <span class="text-2xl mb-2 block">👩‍⚕️</span>
              <h4 class="font-black uppercase text-[10px] italic">Profesionales</h4>
              <p class="text-[8px] opacity-60 uppercase mt-1">Equipo médico calificado.</p>
            </div>
          </div>
        </div>

        <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-[#DE1F27] blur-[100px] opacity-40 rounded-full"></div>
      </div>

    </div>
  </div>
</template>