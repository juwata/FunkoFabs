import { CartService } from '../service/cartService.js';
import { OrderService } from '../service/orderService.js';
import { AuthService } from '../service/authService.js';
import { mostrarErro } from '../components/feedbackUI.js';

function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const elSubtotal = document.getElementById('resumo-subtotal');
    const elDesconto = document.getElementById('resumo-desconto');
    const elFrete = document.getElementById('resumo-frete');
    const elTotal = document.getElementById('resumo-total');
    const btnConfirmar = document.getElementById('btn-confirmar');

    const iCep = document.getElementById('iCEP');
    if (iCep) {
        iCep.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, ''); 
            if (valor.length > 8) {
                valor = valor.slice(0, 8); 
            }
            valor = valor.replace(/^(\d{5})(\d)/, '$1-$2'); 
            e.target.value = valor; 
        });
    }

    const iRua = document.getElementById('iRua');
    const iNum = document.getElementById('iNum');
    const iCidade = document.getElementById('iCidade');
    const iEstado = document.getElementById('iEstado');

    let carrinho = null;

    try {
        const perfil = await AuthService.buscarMeuPerfil();
        if (perfil && perfil.address) {
            try {
                const endObj = JSON.parse(perfil.address);
                iCep.value = endObj.cep || '';
                iRua.value = endObj.rua || '';
                iNum.value = endObj.numero || '';
                iCidade.value = endObj.cidade || '';
                iEstado.value = endObj.estado || '';
            } catch (e) {
                iRua.value = perfil.address;
            }
        }
    } catch (e) {
        console.error("Não foi possível carregar o perfil", e);
    }

    try {
        carrinho = await CartService.listarCarrinho();
        if (!carrinho || !carrinho.items || carrinho.items.length === 0) {
            mostrarErro("Seu carrinho está vazio!");
            setTimeout(() => { window.location.href = 'cart.html'; }, 2000);
            return;
        }

        let subtotal = 0;
        carrinho.items.forEach(item => {
            subtotal += item.product.price * item.quantity;
        });

        const desconto = 0; 
        let valorFrete = 15.00;
        
        if (subtotal >= 500) {
            valorFrete = 0;
            elFrete.textContent = "Grátis";
            elFrete.classList.add('frete-gratis');
        } else {
            elFrete.textContent = formatarMoeda(valorFrete);
            elFrete.classList.remove('frete-gratis');
        }

        const total = subtotal - desconto + valorFrete;

        elSubtotal.textContent = formatarMoeda(subtotal);
        elDesconto.textContent = formatarMoeda(desconto);
        elTotal.textContent = formatarMoeda(total);

    } catch (erro) {
        mostrarErro(erro.message || "Não foi possível carregar o carrinho.");
    }

    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', async () => {
            const pix = document.getElementById('iPix');

            if (!iCep.value || !iRua.value || !iNum.value || !iCidade.value || !iEstado.value) {
                mostrarErro("Por favor, preencha o endereço completo!");
                return;
            }

            if (!pix.checked) {
                mostrarErro("Por favor, selecione a forma de pagamento!");
                return;
            }

            try {
                btnConfirmar.disabled = true;
                btnConfirmar.textContent = '';
                const spinner = document.createElement('div');
                spinner.className = 'spinner spinner-btn';
                btnConfirmar.appendChild(spinner);

                const addressObj = {
                    cep: iCep.value.trim(),
                    rua: iRua.value.trim(),
                    numero: iNum.value.trim(),
                    cidade: iCidade.value.trim(),
                    estado: iEstado.value.trim()
                };
                await AuthService.atualizarMeuPerfil({ address: JSON.stringify(addressObj) });

                const order = await OrderService.checkout();
                
                sessionStorage.setItem('lastOrder', JSON.stringify({
                    id: order.id,
                    total: order.total
                }));

                window.location.href = 'finalize-pay.html';
                
            } catch (erro) {
                mostrarErro(erro.message || "Erro ao processar a compra.");
                btnConfirmar.disabled = false;
                btnConfirmar.textContent = "Confirmar";
            }
        });
    }
});
