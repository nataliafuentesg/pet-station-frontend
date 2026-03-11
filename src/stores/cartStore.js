import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    // 1. EL TRUCO DE LA MEMORIA: Al iniciar, busca si hay algo guardado en el navegador. 
    // Si no hay nada, arranca con un carrito vacío [].
    items: JSON.parse(localStorage.getItem('ps_cart')) || []
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

      // 2. GUARDAR: Actualizamos la memoria del navegador cada vez que agregan algo
      localStorage.setItem('ps_cart', JSON.stringify(this.items));

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
      // 3. LA CORRECCIÓN: Buscamos qué producto es antes de hacer cualquier otra cosa
      const itemToRemove = this.items.find(i => i.id === id);

      // Enviamos el evento a Analytics de forma segura
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
      
      localStorage.setItem('ps_cart', JSON.stringify(this.items));
    },
    
    updateQty(id, newQty) {
      const item = this.items.find(i => i.id === id);
      if (item) {
        item.quantity = Math.max(1, newQty);
        if (item.quantity > item.stock) item.quantity = item.stock; 
        
        localStorage.setItem('ps_cart', JSON.stringify(this.items));
      }
    },
    
    clearCart() {
      this.items = [];
      localStorage.removeItem('ps_cart');
      console.log("Carrito vaciado con éxito");
    }
  }
});