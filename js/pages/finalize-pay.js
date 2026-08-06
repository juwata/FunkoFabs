function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const payTitle = document.getElementById('pay-title');
    const payDesc = document.getElementById('pay-desc');

    const lastOrderJson = sessionStorage.getItem('lastOrder');
    
    if (lastOrderJson) {
        const order = JSON.parse(lastOrderJson);
        if (payTitle && payDesc) {
            payTitle.innerHTML = `Pagamento do Pedido`;
            payDesc.innerHTML = `Escaneie o QR Code abaixo para pagar o seu pedido no valor de <b>${formatarMoeda(order.total)}</b>`;
        }
    } else {
        window.location.href = 'cart.html';
    }

    
    const btnConfirmar = document.querySelector('.bt-blue');
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', () => {
            sessionStorage.removeItem('lastOrder');
        });
    }

    const btnCopiarPix = document.getElementById('btn-copiar-pix');
    if (btnCopiarPix) {
        btnCopiarPix.addEventListener('click', async () => {
            const pixCode = "00020126490014br.gov.bcb.pix0114+55119992518120209FunkoFabs5204000053039865802BR5922JULIA FONSECA WATANABE6009Sao Paulo62120508Fabsters63048210";
            try {
                await navigator.clipboard.writeText(pixCode);
                btnCopiarPix.textContent = "Código PIX copiado!";
                btnCopiarPix.classList.add('pix-copiado');
                
                // Opcional: Voltar ao texto original depois de 3 segundos
                setTimeout(() => {
                    btnCopiarPix.textContent = "ou copiar código do PIX";
                    btnCopiarPix.classList.remove('pix-copiado');
                }, 3000);
            } catch (err) {
                console.error("Erro ao copiar PIX: ", err);
            }
        });
    }
});
