export function mostrarLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.textContent = 'Carregando produtos...';
    }
}

export function mostrarErro(containerId, mensagem) {
    const container = document.getElementById(containerId);
    if (container) {
        container.textContent = ''; 
        const divErro = document.createElement('div');
        divErro.className = 'alerta-erro';
        divErro.setAttribute('role', 'alert');
        divErro.textContent = `Ops! ${mensagem}`;
        container.appendChild(divErro);
    }
}