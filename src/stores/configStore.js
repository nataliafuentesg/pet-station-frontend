import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api/axios';

export const useConfigStore = defineStore('config', () => {
  const pedidoMinimo = ref(70000); // valor fallback mientras carga
  const cargado = ref(false);

  async function cargarConfig() {
    if (cargado.value) return;
    try {
      const { data } = await api.get('/pedidos/info-entrega');
      pedidoMinimo.value = data.pedidoMinimo;
      cargado.value = true;
    } catch (e) {
      console.warn('No se pudo cargar la config del servidor, usando valor por defecto.');
    }
  }

  return { pedidoMinimo, cargado, cargarConfig };
});
