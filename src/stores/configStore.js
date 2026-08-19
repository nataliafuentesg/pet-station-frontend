import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api/axios';

export const useConfigStore = defineStore('config', () => {
  const pedidoMinimo      = ref(70000);
  const envioGratisDesde  = ref(400000); // domicilio Chía gratis desde
  const costoEnvioChia    = ref(8500);
  const cargado = ref(false);

  async function cargarConfig() {
    if (cargado.value) return;
    try {
      const { data } = await api.get('/pedidos/info-entrega');
      if (data.pedidoMinimo)     pedidoMinimo.value     = data.pedidoMinimo;
      if (data.envioGratisDesde) envioGratisDesde.value = data.envioGratisDesde;
      if (data.costoEnvioChia)   costoEnvioChia.value   = data.costoEnvioChia;
      cargado.value = true;
    } catch (e) {
      console.warn('No se pudo cargar la config del servidor, usando valores por defecto.');
    }
  }

  return { pedidoMinimo, envioGratisDesde, costoEnvioChia, cargado, cargarConfig };
});
