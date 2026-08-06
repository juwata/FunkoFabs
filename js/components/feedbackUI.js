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
        
        divErro.style.position = 'fixed';
        divErro.style.bottom = '20px';
        divErro.style.right = '20px';
        divErro.style.zIndex = '9999';
        divErro.style.display = 'none';
        divErro.style.minWidth = '300px';
        divErro.style.maxWidth = '400px';
        divErro.style.width = 'auto';
        divErro.style.margin = '0';
        divErro.style.padding = '15px';
        divErro.style.borderRadius = '8px';
        divErro.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        
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
        div.textContent = ''; // Limpa o conteúdo anterior
        
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'center';
        wrapper.style.alignItems = 'center';
        wrapper.style.width = '100%';
        wrapper.style.gridColumn = '1 / -1';
        wrapper.style.padding = '40px 0';

        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        
        if (!containerId || div.classList.contains('feedback-msg') || containerId === 'mensagem-erro-global') {
            div.className = 'feedback-msg'; 
            div.style.display = 'block';
        }
        
        wrapper.appendChild(spinner);
        div.appendChild(wrapper);
    }
}