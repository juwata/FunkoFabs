import { ApiError } from '../exceptions/ApiError.js';

// URL base do seu back-end Spring Boot. Ajuste a porta se necessário.
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Função central para realizar requisições à API.
 * @param {string} endpoint - A rota desejada (ex: '/produtos')
 * @param {object} options - Configurações extras do fetch (method, body, headers)
 * @returns {Promise<any>} - Retorna o JSON da resposta ou lança um ApiError
 */
export async function request(endpoint, options = {}) {
    // 1. Recupera o Token salvo no momento do Login (como exigido no Handoff)
    const token = localStorage.getItem('funkofabs_token');

    // 2. Padronização de Headers (garante comunicação em JSON com o Spring Boot)
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    // 3. Injeta o cabeçalho Authorization se o usuário estiver logado
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    // 4. Mescla os headers padrões com possíveis cabeçalhos específicos
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        // Disparo da requisição usando Fetch API nativa
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // 5. Tratamento de JWT: Erro 401 (Não Autorizado) ou 403 (Proibido)
        if (response.status === 401 || response.status === 403) {
            // Limpa os rastros da sessão expirada/inválida
            localStorage.removeItem('funkofabs_token');
            localStorage.removeItem('funkofabs_user'); 
            
            window.location.href = '/login.html'; 
            
            throw new ApiError('Sessão expirada. Faça login novamente.', response.status);
        }

        if (!response.ok) {
            let mensagemErro = `Erro inesperado no servidor (Status: ${response.status})`;
            
            try {
                const erroServidor = await response.json();
                if (erroServidor.message) {
                    mensagemErro = erroServidor.message;
                }
            } catch (e) {

            }
            
            throw new ApiError(mensagemErro, response.status);
        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();
        
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError('Falha de conexão com o servidor. Verifique sua internet ou tente mais tarde.', 0);
    }
}