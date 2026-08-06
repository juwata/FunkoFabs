import { request } from './clientFetch.js'
/**
 * Objeto responsável por todas as requisições referentes a "Products".
 */
export const ProductsService = {

    listarProdutos: async () => {
        return await request('/products')
    },
    
    buscarPorId: async (id) => {
        return await request(`/products/${id}`);
    }

    
};