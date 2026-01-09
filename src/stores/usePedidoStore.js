import { defineStore } from 'pinia';

export const usePedidoStore = defineStore('pedidos', {
    state: () => ({
        ultimoPedido: null,
        loading: false,
        error: null,
        misPedidos: []
    }),

    actions: {
        async crearPedido(datosFormulario, itemsCarrito, usuarioId = null) {
            this.loading = true;
            this.error = null;

            try {
                const itemsProcesados = itemsCarrito.map(item => ({
                    productoId: item.id,
                    cantidad: item.quantity,
                    nombreProducto: item.nombre,      
                    precioUnitario: item.precio,      
                    fotoUrl: item.fotosUrls?.[0] || '' 
                }));

                const payload = {
                    ...datosFormulario,
                    items: itemsProcesados
                };
                const url = new URL('https://api.petstationvet.com/api/pedidos');
                if (usuarioId) url.searchParams.append('usuarioId', usuarioId);

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al procesar el pedido');
                }

                this.ultimoPedido = await response.json();
                return this.ultimoPedido;

            } catch (err) {
                this.error = err.message;
                console.error("Error en pedidoStore:", err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async fetchMisPedidos() {

        }
    }
});