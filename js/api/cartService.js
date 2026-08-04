import { request } from "./clientFetch.js";

/**
 * Objeto responsável por todas as requisições referentes a "Cart".
 */
export const CartService = {

    listarCarrinho: async () => {
        return await request('/cart')
    },
    
    adicionarItem: async (dadosCart) => {
        return await request('/cart/items', {
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
        return await request(`/cart/items/${id}`, {
            method: 'DELETE'
        })
    }
};