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
        
        // Adiciona um estilo flutuante (Toast)
        divErro.style.position = 'fixed';
        divErro.style.top = '20px';
        divErro.style.right = '20px';
        divErro.style.zIndex = '9999';
        divErro.style.display = 'none';
        divErro.style.minWidth = '300px';
        
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
            div.className = 'feedback-msg error';
            div.style.display = 'block';
        }
        div.textContent = mensagem;
    }
}

export function mostrarSucesso(mensagem, containerId = null) {
    const div = containerId ? document.getElementById(containerId) : garantirDivGlobal();
    
    if (div) {
        // Aplica a classe verde
        if (!containerId || div.classList.contains('feedback-msg') || containerId === 'mensagem-erro-global') {
            div.className = 'feedback-msg success';
            div.style.display = 'block';
        }
        div.textContent = mensagem;
    }
}

export function limparFeedback(containerId = null) {
    const div = containerId ? document.getElementById(containerId) : document.getElementById('mensagem-erro-global');
    
    if (div) {
        if (!containerId || containerId === 'mensagem-erro-global') {
            div.style.display = 'none';
        }
        div.textContent = '';
    }
}

export function mostrarLoading(containerId = null) {
    const div = containerId ? document.getElementById(containerId) : garantirDivGlobal();
    
    if (div) {
        if (!containerId || div.classList.contains('feedback-msg') || containerId === 'mensagem-erro-global') {
            div.className = 'feedback-msg'; // Classe padrão (sem cor de erro ou sucesso)
            div.style.display = 'block';
            div.textContent = 'Carregando...';
        } else {
            // Caso seja um container normal (ex: vitrine), só limpa e escreve
            div.textContent = 'Carregando...';
        }
    }
}