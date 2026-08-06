// js/components/feedbackUI.js

/**
 * Cria dinamicamente a div global de feedback se ela não existir.
 * Isso evita a necessidade de repetir o HTML em todas as páginas.
 */
function garantirDivGlobal() {
    let divErro = document.getElementById('mensagem-erro-global');
    
    if (!divErro) {
        divErro = document.createElement('div');
        divErro.id = 'mensagem-erro-global';
        divErro.role = 'alert'; // Acessibilidade obrigatória (leitor de tela)
        divErro.classList.add('feedback-global', 'hidden');
        
        // Insere a div direto no <body>
        document.body.appendChild(divErro);
    }
    
    return divErro;
}

export function mostrarErro(mensagem, containerId = null) {
    const div = containerId ? document.getElementById(containerId) : garantirDivGlobal();
    
    if (div) {
        // Se for a global ou tiver classe de feedback, aplica a cor vermelha
        if (!containerId || div.classList.contains('feedback-msg') || containerId === 'mensagem-erro-global') {
            div.classList.remove('success', 'hidden');
            div.classList.add('feedback-msg', 'error');
        }
        div.textContent = mensagem;
    }
}

export function mostrarSucesso(mensagem, containerId = null) {
    const div = containerId ? document.getElementById(containerId) : garantirDivGlobal();
    
    if (div) {
        // Aplica a classe verde
        if (!containerId || div.classList.contains('feedback-msg') || containerId === 'mensagem-erro-global') {
            div.classList.remove('error', 'hidden');
            div.classList.add('feedback-msg', 'success');
        }
        div.textContent = mensagem;
    }
}

export function limparFeedback(containerId = null) {
    const div = containerId ? document.getElementById(containerId) : document.getElementById('mensagem-erro-global');
    
    if (div) {
        if (!containerId || containerId === 'mensagem-erro-global') {
            div.classList.add('hidden');
        }
        div.textContent = '';
    }
}

export function mostrarLoading(containerId = null) {
    const div = containerId ? document.getElementById(containerId) : garantirDivGlobal();
    
    if (div) {
        div.textContent = ''; // Limpa o conteúdo anterior
        
        const wrapper = document.createElement('div');
        wrapper.className = 'feedback-wrapper';

        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        
        if (!containerId || div.classList.contains('feedback-msg') || containerId === 'mensagem-erro-global') {
            div.classList.remove('success', 'error', 'hidden');
            div.classList.add('feedback-msg');
        }
        
        wrapper.appendChild(spinner);
        div.appendChild(wrapper);
    }
}