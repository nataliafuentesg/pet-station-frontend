import { defineStore } from 'pinia';
import api from '@/api/axios'; 

export const useProductStore = defineStore('products', {
  state: () => ({
    allProducts: [],
    filtros: { especies: [], categorias: [] },
    loading: false,
    error: null
  }),

  actions: {
    async fetchTienda() {
      this.loading = true;
      try {
        const [resProd, resFiltros] = await Promise.all([
          api.get('/tienda/productos'),
          api.get('/tienda/filtros')
        ]);

        this.allProducts = resProd.data;
        this.filtros = resFiltros.data;
        this.error = null;
      } catch (err) {
        this.error = "No se pudieron cargar los productos";
        console.error("Error en productStore:", err);
      } finally {
        this.loading = false;
      }
    }
  }
});