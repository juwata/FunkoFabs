export class ApiError extends Error {
    constructor(mensagem, statusHttp) {
        // Chama o construtor da classe Error original do JavaScript
        super(mensagem); 
        
        this.name = 'ApiError';
        // Guarda o código (ex: 404, 500) para podermos tratar na interface depois
        this.statusHttp = statusHttp; 
    }
}