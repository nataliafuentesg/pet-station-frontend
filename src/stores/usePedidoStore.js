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
        async crearPedido(payload) { 
            this.loading = true;
            this.error = null;

            try {
                const { data } = await api.post('/pedidos', payload, {
                    params: payload.tutorId ? { usuarioId: payload.tutorId } : {}
                });

                this.ultimoPedido = data;
                return data;
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al procesar el pedido';
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