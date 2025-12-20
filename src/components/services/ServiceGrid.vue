<template>
  <div class="service-app py-5">
    <div class="container">
      <div class="row g-4">
        <div v-for="s in services" :key="s.slug" class="col-md-4">
          <div class="ps-card" @click="selected = s">
            <div class="ps-card-icon"><i :class="s.icon"></i></div>
            <h3 class="fw-bold h4">{{ s.title }}</h3>
            <p class="text-secondary small">{{ s.desc }}</p>
            <div class="ps-card-footer text-primary fw-bold">
              VER FICHA COMPLETA <i class="bi bi-arrow-right-short"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="modal-zoom">
      <div v-if="selected" class="ps-modal-overlay" @click.self="selected = null">
        <div class="ps-modal-container">
          <button class="ps-close-btn" @click="selected = null"><i class="bi bi-x-lg"></i></button>
          
          <div class="ps-modal-header p-4 p-md-5 pb-0">
            <div class="d-flex align-items-center gap-3">
              <div class="ps-modal-icon-bg"><i :class="selected.icon"></i></div>
              <h2 class="fw-bold mb-0 display-6">{{ selected.title }}</h2>
            </div>
            <p class="lead text-secondary mt-4">{{ selected.longDesc }}</p>
          </div>

          <div class="ps-modal-body p-4 p-md-5 pt-3">
            <div class="row g-4">
              <div class="col-lg-7">
                <h5 class="fw-bold mb-3">¿Qué incluye el servicio?</h5>
                <div class="row g-2 mb-4">
                  <div v-for="item in selected.details.include" :key="item" class="col-md-6">
                    <div class="ps-feature-tag">
                      <i class="bi bi-check-circle-fill text-primary"></i> {{ item }}
                    </div>
                  </div>
                </div>

                <div v-if="selected.details.tables" class="mt-4">
                  <h5 class="fw-bold mb-3">Lista de Precios</h5>
                  <div class="table-responsive border rounded-4 overflow-hidden">
                    <table class="table table-hover mb-0 align-middle">
                      <thead class="bg-light">
                        <tr class="small text-uppercase ls-1">
                          <th class="ps-4">Tamaño / Razas</th>
                          <th>Solo Baño</th>
                          <th class="pe-4 text-primary">Baño + Corte</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in selected.details.tables[0].rows" :key="row.size">
                          <td class="ps-4 py-3">
                            <div class="fw-bold text-dark">{{ row.size }}</div>
                            <div class="small text-muted">{{ row.breeds }}</div>
                          </td>
                          <td class="fw-bold text-secondary">{{ formatPrice(row.bath) }}</td>
                          <td class="fw-bold text-primary pe-4">{{ formatPrice(row.full) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p class="small text-muted mt-2 italic">{{ selected.details.notes }}</p>
                </div>
              </div>

              <div class="col-lg-5">
                <div class="ps-action-card p-4 rounded-4 shadow-sm border h-100">
                  <h5 class="fw-bold mb-4">Agenda tu cita</h5>
                  
                  <div v-if="selected.details.chips" class="mb-4">
                    <p class="small fw-bold text-muted">SÍNTOMAS COMUNES:</p>
                    <div class="d-flex flex-wrap gap-2">
                      <span v-for="chip in selected.details.chips" :key="chip" class="badge rounded-pill bg-light text-dark border p-2 px-3">
                        {{ chip }}
                      </span>
                    </div>
                  </div>

                  <div class="d-grid gap-3">
                    <a :href="'https://wa.me/573053462413?text=' + encodeURIComponent(selected.waMsg)" 
                       target="_blank" class="btn btn-success btn-lg rounded-pill fw-bold py-3 shadow">
                      <i class="bi bi-whatsapp me-2"></i> Agendar WhatsApp
                    </a>
                    <button class="btn btn-outline-secondary btn-lg rounded-pill fw-bold py-3" @click="selected = null">
                      Cerrar ventana
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { services } from '../../data/services';

const selected = ref(null);
const formatPrice = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);
</script>

<style scoped>
/* ESTILOS DE PET STATION */
.ps-card {
  background: white; padding: 40px; border-radius: 30px; border: 1px solid #eee;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1); cursor: pointer; height: 100%;
}
.ps-card:hover { transform: translateY(-10px); border-color: #0d6efd; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
.ps-card-icon { font-size: 3rem; color: #0d6efd; margin-bottom: 20px; }

/* MODAL OVERLAY */
.ps-modal-overlay {
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px); z-index: 10000; display: flex;
  align-items: center; justify-content: center; padding: 20px;
}
.ps-modal-container {
  background: white; width: 100%; max-width: 1000px; max-height: 90vh;
  border-radius: 40px; position: relative; overflow-y: auto;
  box-shadow: 0 40px 100px rgba(0,0,0,0.3);
}
.ps-modal-icon-bg {
  width: 80px; height: 80px; background: #f0f7ff; color: #0d6efd;
  border-radius: 24px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem;
}
.ps-feature-tag {
  background: #f8fafc; padding: 12px 15px; border-radius: 15px;
  font-size: 0.95rem; border: 1px solid #f1f5f9; display: flex; align-items: center; gap: 10px;
}
.ps-action-card { background: #fafbfc; }
.ps-close-btn {
  position: absolute; top: 30px; right: 30px; border: none; background: #f1f5f9;
  width: 44px; height: 44px; border-radius: 50%; color: #64748b; z-index: 10;
}

/* ANIMACIONES */
.modal-zoom-enter-active, .modal-zoom-leave-active { transition: all 0.4s ease; }
.modal-zoom-enter-from, .modal-zoom-leave-to { opacity: 0; transform: scale(0.9) translateY(20px); }
</style>