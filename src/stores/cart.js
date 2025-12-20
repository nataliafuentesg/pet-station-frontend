import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  getters: {
    totalItems: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    groupedItems: (state) => {
      return state.items.reduce((acc, item) => {
        const key = item.type === 'dog' ? 'Perros 🐶' : 'Gatos 🐱';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});
    }
  },
  actions: {
    addToCart(product) {
      const exists = this.items.find(i => i.id === product.id);
      if (exists) {
        exists.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(productId) {
      this.items = this.items.filter(i => i.id !== productId);
    }
  }
})