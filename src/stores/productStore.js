import { defineStore } from 'pinia'; // <--- ¡Esta es la línea que falta!

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
        // Pedimos productos y filtros en paralelo para mayor velocidad
        const [resProd, resFiltros] = await Promise.all([
          fetch('http://localhost:8080/api/tienda/productos'),
          fetch('http://localhost:8080/api/tienda/filtros')
        ]);

        if (!resProd.ok || !resFiltros.ok) throw new Error('Error al conectar con el servidor');

        this.allProducts = await resProd.json();
        this.filtros = await resFiltros.json();
      } catch (err) {
        this.error = err.message;
        console.error("Error en productStore:", err);
      } finally {
        this.loading = false;
      }
    }
  }
});