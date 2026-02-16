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
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'add_to_cart',
          ecommerce: {
            currency: 'COP',
            value: product.precio * quantity,
            items: [{
              item_id: product.id,
              item_name: product.nombre,
              item_brand: product.marca,
              item_category: product.categoria,
              price: product.precio,
              quantity: quantity
            }]
          }
        });
      }
    },
    removeItem(id) {
      if (window.dataLayer && itemToRemove) {
        window.dataLayer.push({
          event: 'remove_from_cart',
          ecommerce: {
            currency: 'COP',
            value: itemToRemove.precio * itemToRemove.quantity,
            items: [{
              item_id: itemToRemove.id,
              item_name: itemToRemove.nombre,
              price: itemToRemove.precio,
              quantity: itemToRemove.quantity
            }]
          }
        });
      }
      this.items = this.items.filter(i => i.id !== id);
    },
    updateQty(id, newQty) {
      const item = this.items.find(i => i.id === id);
      if (item) {
        item.quantity = Math.max(1, newQty);
        if (item.quantity > item.stock) item.quantity = item.stock; 
      }
    },
    clearCart() {
    this.items = [];
    localStorage.removeItem('ps_cart');
    console.log("Carrito vaciado con éxito");
  }
  }
});