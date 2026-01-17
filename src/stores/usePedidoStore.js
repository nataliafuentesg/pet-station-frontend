import { defineStore } from 'pinia';
import api from '@/api/axios'; // Importa tu cliente configurado

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
                // Mapeo de items para que coincidan con el PedidoDTO del backend
                const itemsProcesados = itemsCarrito.map(item => ({
                    productoId: item.id,
                    cantidad: item.quantity,
                    nombreProducto: item.nombre,      
                    precioSnapshot: item.precio, // El backend usa precioSnapshot para auditoría
                    fotoUrl: item.fotosUrls?.[0] || '' 
                }));

                const payload = {
                    nombreCliente: datosFormulario.nombre,
                    emailCliente: datosFormulario.email,
                    telefonoCliente: datosFormulario.telefono,
                    direccionEnvio: datosFormulario.direccion,
                    zona: datosFormulario.zona,
                    items: itemsProcesados,
                    total: itemsCarrito.reduce((acc, i) => acc + (i.precio * i.quantity), 0)
                };

                // Petición usando Axios con parámetros opcionales
                const { data } = await api.post('/pedidos', payload, {
                    params: usuarioId ? { usuarioId } : {}
                });

                this.ultimoPedido = data;
                return data;

            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al procesar el pedido';
                console.error("Error en pedidoStore:", err);
                throw new Error(this.error);
            } finally {
                this.loading = false;
            }
        },

        async fetchMisPedidos() {
            try {
                const { data } = await api.get('/pedidos/mis-pedidos');
                this.misPedidos = data;
            } catch (err) {
                console.error("Error al cargar pedidos:", err);
            }
        }
    }
});