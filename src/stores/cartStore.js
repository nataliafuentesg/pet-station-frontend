import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  getters: {
    totalPrice: (state) => state.items.reduce((acc, item) => acc + (item.precio * item.quantity), 0),
    cartCount: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0)
  },
  actions: {
    addToCart(product, quantity) {
      const existingItem = this.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({ ...product, quantity });
      }
    },
    removeItem(id) {
      this.items = this.items.filter(i => i.id !== id);
    },
    updateQty(id, newQty) {
      const item = this.items.find(i => i.id === id);
      if (item) {
        item.quantity = Math.max(1, newQty);
        if (item.quantity > item.stock) item.quantity = item.stock; // Opcional: Validar contra stock
      }
    },
    clearCart() {
      this.items = [];
    }
  }
});