import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('ps_cart')) || [],
  }),

  actions: {
    addToCart(product, cantidad = 1) {
      const existingItem = this.items.find(i => i.id === product.id);
      
      if (existingItem) {
        existingItem.cantidad += cantidad;
      } else {
        this.items.push({
          ...product,
          cantidad: cantidad
        });
      }
      this.saveLocal();
    },

    updateQty(productId, amount) {
      const item = this.items.find(i => i.id === productId);
      if (item) {
        item.cantidad += amount;
        if (item.cantidad < 1) this.removeItem(productId);
      }
      this.saveLocal();
    },

    removeItem(productId) {
      this.items = this.items.filter(i => i.id !== productId);
      this.saveLocal();
    },

    saveLocal() {
      localStorage.setItem('ps_cart', JSON.stringify(this.items));
    }
  },

  getters: {
    total: (state) => state.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0),
    count: (state) => state.items.reduce((acc, item) => acc + item.cantidad, 0)
  }
});