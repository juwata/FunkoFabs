import { request } from './clientFetch.js';

export const WaitlistService = {
    entrarNaLista: async (email) => {
        return await request('/waitlist', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }
};
