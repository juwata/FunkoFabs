import { request } from './clientFetch.js';

export const OrderService = {
    checkout: async () => {
        return await request('/orders/checkout', {
            method: 'POST'
        });
    },

    getHistory: async () => {
        return await request('/orders', {
            method: 'GET'
        });
    }
};
