<template>
  <footer class="bg-slate-50 dark:bg-[#030303] border-t border-slate-200 dark:border-white/5 pt-20 pb-44 md:pb-12 px-6 transition-colors duration-500 font-sans">
    <div class="max-w-[1400px] mx-auto">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
        
        <div class="space-y-8">
          <div>
            <h2 class="text-3xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white leading-none">
              PET <span class="text-[#DE1F27]">STATION.</span>
            </h2>
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Clinic & Grooming</p>
          </div>
          
          <div class="grid grid-cols-4 gap-3 w-fit">
            <a v-for="social in socials" :key="social.name" :href="social.link" target="_blank"
               class="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-lg hover:bg-[#DE1F27] hover:text-white transition-all shadow-sm group">
              <i :class="social.icon" class="group-hover:scale-110 transition-transform"></i>
            </a>
          </div>
        </div>

        <div class="space-y-6">
          <h4 class="text-[#DE1F27] font-black uppercase text-xs tracking-widest italic">WhatsApp Business</h4>
          <div class="space-y-5">
            <a href="https://wa.me/573053462413" target="_blank" class="group block">
              <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Citas y Urgencias</p>
              <p class="text-xl font-[1000] text-[#152C77] dark:text-white group-hover:text-[#DE1F27] transition-colors tracking-tighter italic leading-none">
                305 346 2413
              </p>
            </a>
            <a href="https://wa.me/573187076798" target="_blank" class="group block border-t border-slate-200 dark:border-white/5 pt-4">
              <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Seguimiento Médico</p>
              <p class="text-xl font-[1000] text-[#152C77] dark:text-white group-hover:text-[#DE1F27] transition-colors tracking-tighter italic leading-none">
                318 707 6798
              </p>
            </a>
          </div>
        </div>

        <div class="space-y-6">
          <h4 class="text-[#DE1F27] font-black uppercase text-xs tracking-widest italic">Sede Chía</h4>
          <p class="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 leading-relaxed italic">
            Via Guaymaral 2km antes<br/>
            Variante Chía - Cota<br/>
            Chía, Cundinamarca.
          </p>
          <div class="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 aspect-video shadow-xl">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.332306306541!2d-74.0620986!3d4.8839061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f8796ded22bfa%3A0x800b06946b4e7f69!2sPet%20Station!5e0!3m2!1ses!2sco!4v1707080000000!5m2!1ses!2sco" 
              width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>

        <div class="space-y-6">
          <h4 class="text-[#DE1F27] font-black uppercase text-xs tracking-widest italic">Horarios</h4>
          <ul class="text-[10px] font-black uppercase space-y-3 text-slate-500 dark:text-slate-400">
            <li class="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
              <span>Lun - Sáb:</span> 
              <span class="text-[#152C77] dark:text-white">09:00 AM - 07:00 PM</span>
            </li>
            <li class="flex justify-between text-[#DE1F27] italic">
              <span>Dom - Fest:</span> 
              <span class="font-black">10:00 AM - 03:00 PM*</span>
            </li>
          </ul>
          <div class="bg-[#DE1F27]/10 p-3 rounded-xl border border-[#DE1F27]/20">
            <p class="text-[9px] font-[1000] text-[#DE1F27] italic uppercase leading-tight text-center">
              ⚠️ ATENCIÓN A PUERTA CERRADA<br/>(DOMINGOS Y FESTIVOS)
            </p>
          </div>
        </div>

      </div>

      <div class="pt-10 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 text-center">
          © {{ new Date().getFullYear() }} PET STATION. ALL RIGHTS RESERVED.
        </p>
        <a href="https://marcapro.agency" target="_blank" class="flex items-center gap-2 group">
          <span class="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Designed by</span>
          <span class="text-[11px] font-[1000] uppercase italic text-[#152C77] dark:text-white group-hover:text-[#DE1F27] transition-colors underline decoration-[#DE1F27]/30">
            marcapro.agency
          </span>
        </a>
      </div>

    </div>
  </footer>
</template>

<script setup>
const socials = [
  { name: 'Instagram', icon: 'fab fa-instagram', link: 'https://instagram.com/petstation.vet' },
  { name: 'TikTok', icon: 'fab fa-tiktok', link: '#' },
  { name: 'Facebook', icon: 'fab fa-facebook-f', link: '#' },
  { name: 'YouTube', icon: 'fab fa-youtube', link: '#' }
];
</script>

<style scoped>
@reference "../style.css";
</style>