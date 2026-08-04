
import { request } from './clientFetch.js';

/**
 * Objeto responsável por todas as requisições referentes a "Auth".
 */
export const AuthService = {

    registrar: async (dadosConta) => {
        return await request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(dadosConta)
        });
    },
    
    login: async (dadosConta) => {
        return await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(dadosConta)
        });
    }

    
};