import { AuthService } from '../service/authService.js';
import { mostrarErro, mostrarSucesso, mostrarLoading, limparFeedback } from '../components/feedbackUI.js';

export async function processarCadastro(dados, botaoSubmit) {
    try {
        limparFeedback();

        botaoSubmit.disabled = true;
        botaoSubmit.textContent = 'Carregando...';

        const resposta = await AuthService.registrar(dados);
        localStorage.setItem('funkofabs_token', resposta.token);

        mostrarSucesso('Cadastro realizado! Entrando no FabVerso...');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
        
    } catch (erro) {
        mostrarErro(erro.message || 'Erro ao realizar cadastro.');
    } finally {
        botaoSubmit.disabled = false;
        botaoSubmit.textContent = 'Confirmar';
    }
}

export async function processarLogin(dados, botaoSubmit) {
    try {
        limparFeedback();

        botaoSubmit.disabled = true;
        botaoSubmit.textContent = 'Entrando...';

        const resposta = await AuthService.login(dados);
        
        // Salva o token JWT
        localStorage.setItem('funkofabs_token', resposta.token);
        
        // É uma boa prática salvar também qual é a 'role' (ADMIN ou CUSTOMER)
        // para podermos esconder ou mostrar o painel administrativo depois!
        if (resposta.role) {
            localStorage.setItem('funkofabs_role', resposta.role);
        }

        mostrarSucesso('Login aprovado! Bem-vindo de volta.');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
        
    } catch (erro) {
        mostrarErro(erro.message || 'E-mail ou senha incorretos.');
    } finally {
        botaoSubmit.disabled = false;
        botaoSubmit.textContent = 'Confirmar';
    }
}
