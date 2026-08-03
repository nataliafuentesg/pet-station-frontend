import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api/axios';

export const useConfigStore = defineStore('config', () => {
  const pedidoMinimo      = ref(70000);
  const envioGratisDesde  = ref(200000);
  const costoEnvioChia    = ref(8500);
  const costoEnvioFuera   = ref(15000);
  const cargado = ref(false);

  async function cargarConfig() {
    if (cargado.value) return;
    try {
      const { data } = await api.get('/pedidos/info-entrega');
      if (data.pedidoMinimo)     pedidoMinimo.value     = data.pedidoMinimo;
      if (data.envioGratisDesde) envioGratisDesde.value = data.envioGratisDesde;
      if (data.costoEnvioChia)   costoEnvioChia.value   = data.costoEnvioChia;
      if (data.costoEnvioFuera)  costoEnvioFuera.value  = data.costoEnvioFuera;
      cargado.value = true;
    } catch (e) {
      console.warn('No se pudo cargar la config del servidor, usando valores por defecto.');
    }
  }

  return { pedidoMinimo, envioGratisDesde, costoEnvioChia, costoEnvioFuera, cargado, cargarConfig };
});
