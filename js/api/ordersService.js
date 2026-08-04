import { request } from './clientFetch.js'
/**
 * Objeto responsável por todas as requisições referentes a "Orders".
 */
export const ProductsService = {

    listarHistorica: async () => {
        return await request('/orders')
    },
};