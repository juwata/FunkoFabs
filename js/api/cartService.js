import { request } from "./clientFetch";

/**
 * Objeto responsável por todas as requisições referentes a "Cart".
 */
export const CartService = {

    listarCarrinho: async () => {
        return await request('/cart')
    },
    
    buscarPorId: async (dadosCart) => {
        return await request('/produtos/cart/items', {
            method: 'POST',
            body: JSON.stringify(dadosCart)
        });
    },

    atualizarQuantidade: async (id, quantidade) => {
        return await request(`/cart/items/${id}?quantity=${quantidade}`, {
            method: 'PUT'
        });
    },

    removerItemCart: async(id) => {
        return await request(`/cart/items/{id}`, {
            method: 'DELETE'
        })
    }

    
};