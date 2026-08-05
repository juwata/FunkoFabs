import { CartService } from '../service/cartService.js';
import { mostrarErro, mostrarLoading, limparFeedback } from '../components/feedbackUI.js';

export async function carregarCarrinho(silencioso = false) {
    const containerId = 'carrinho-lista';

    // Se nem tiver token salvo, já expulsa para o login instantaneamente
    if (!localStorage.getItem('funkofabs_token')) {
        window.location.href = 'login.html';
        return;
    }

    if (!silencioso) {
        mostrarLoading(containerId);
    }

    try {
        const carrinho = await CartService.listarCarrinho();
        const container = document.getElementById(containerId);
        container.textContent = ''; 

        if (!carrinho || !carrinho.items || carrinho.items.length === 0) {
            container.textContent = ''; 
            
            const divEmpty = document.createElement('div');
            divEmpty.style.textAlign = 'center';
            divEmpty.style.padding = '50px 20px';
            divEmpty.style.width = '100%';
            divEmpty.style.gridColumn = '1 / -1'; 

            const imgEmpty = document.createElement('img');
            imgEmpty.src = '../assets/icons/cart.svg';
            imgEmpty.alt = 'Carrinho vazio';
            imgEmpty.style.width = '80px';
            imgEmpty.style.opacity = '0.5';
            imgEmpty.style.marginBottom = '20px';

            const h2Empty = document.createElement('h2');
            h2Empty.textContent = 'Seu carrinho está vazio!';
            h2Empty.style.marginBottom = '15px';
            h2Empty.style.color = 'var(--black)';
            h2Empty.style.border = 'none';
            h2Empty.style.width = '100%';
            h2Empty.style.textAlign = 'center';

            const pEmpty = document.createElement('p');
            pEmpty.textContent = 'Que tal adicionar alguns FunkoFabs incríveis?';
            pEmpty.style.marginBottom = '30px';
            pEmpty.style.color = '#666';

            const btnEmpty = document.createElement('button');
            btnEmpty.className = 'bt-blue';
            btnEmpty.textContent = 'Ir para o Catálogo';
            btnEmpty.style.padding = '10px 30px';
            btnEmpty.style.borderRadius = '20px';
            btnEmpty.style.cursor = 'pointer';
            btnEmpty.addEventListener('click', () => {
                window.location.href = 'catalog.html';
            });

            divEmpty.append(imgEmpty, h2Empty, pEmpty, btnEmpty);
            container.appendChild(divEmpty);

            const divBuy = document.querySelector('.buy');
            if (divBuy) divBuy.style.display = 'none';
            return;
        }

        const divBuy = document.querySelector('.buy');
        if (divBuy) divBuy.style.display = 'flex';


        const fragmento = document.createDocumentFragment();
        let valorTotal = 0;

        carrinho.items.forEach(item => {
            const subtotal = item.quantity * item.product.price;
            valorTotal += subtotal;

            const article = criarElementoItem(item, subtotal);
            fragmento.appendChild(article);
        });

        container.appendChild(fragmento);
        document.getElementById('carrinho-total').textContent = `Total: R$ ${valorTotal.toFixed(2)}`;
        document.getElementById('btn-finalizar').style.display = 'inline-flex';

    } catch (erro) {
        const container = document.getElementById(containerId);
        if (container) {
            container.textContent = '';
            const p = document.createElement('p');
            p.textContent = 'Não foi possível acessar o carrinho no momento.';
            p.style.textAlign = 'center';
            p.style.width = '100%';
            p.style.gridColumn = '1 / -1';
            container.appendChild(p);
        }
        mostrarErro("Falha de comunicação com o servidor.");
    }
}

export async function removerItem(itemId, articleElement) {
    try {
        articleElement.style.opacity = '0.5'; 
        await CartService.removerItemCart(itemId);
        
        carregarCarrinho(true); // Recarrega silenciosamente
    } catch (erro) {
        articleElement.style.opacity = '1';
        mostrarErro(erro.message || "Erro ao remover item.");
    }
}

export async function alterarQuantidade(itemId, novaQtd, pQtdElement = null) {
    try {
        limparFeedback();
        if (pQtdElement) {
            // Coloca um spinner pequenininho diretamente no número
            pQtdElement.innerHTML = '<div class="spinner" style="width: 15px; height: 15px; border-width: 2px; margin: 0;"></div>';
        }
        await CartService.atualizarQuantidade(itemId, novaQtd);
        carregarCarrinho(true); // Recarrega silenciosamente
    } catch (erro) {
        mostrarErro(erro.message || "Erro ao atualizar quantidade.");
        carregarCarrinho(true); // Recarrega para voltar o numero original caso falhe
    }
}

/**
 * Cria a estrutura HTML de cada item de forma segura (sem innerHTML)
 */
function criarElementoItem(item, subtotal) {
    const article = document.createElement('article');
    article.dataset.itemId = item.id; // ID do Item do carrinho (diferente do id do produto)

    const a = document.createElement('a');
    a.href = `product.html?id=${item.product.id}`;
    
    const img = document.createElement('img');
    img.src = item.product.imageUrl || '../assets/images/placeholder.png';
    a.appendChild(img);

    const divContainer = document.createElement('div');
    divContainer.className = 'container';

    // Textos
    const divTextos = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = item.product.name;
    const pPrice = document.createElement('p');
    pPrice.className = 'price';
    pPrice.textContent = `Preço unitário: R$ ${item.product.price.toFixed(2)}`;
    const pTotal = document.createElement('p');
    pTotal.className = 'total';
    pTotal.textContent = `Total: R$ ${subtotal.toFixed(2)}`;
    divTextos.append(h3, pPrice, pTotal);

    // Controles (+, -, excluir)
    const form = document.createElement('form');
    
    const divInp = document.createElement('div');
    divInp.className = 'inp-box';
    
    const btnMenos = document.createElement('button');
    btnMenos.type = 'button';
    btnMenos.textContent = '-';
    btnMenos.className = 'btn-menos';
    btnMenos.style.cursor = 'pointer';
    btnMenos.style.background = 'none';
    btnMenos.style.color = 'inherit';
    btnMenos.style.font = 'inherit';

    const pQtd = document.createElement('p');
    pQtd.textContent = item.quantity;
    
    const btnMais = document.createElement('button');
    btnMais.type = 'button';
    btnMais.textContent = '+';
    btnMais.className = 'btn-mais';
    btnMais.style.cursor = 'pointer';
    btnMais.style.background = 'none';
    btnMais.style.color = 'inherit';
    btnMais.style.font = 'inherit';

    divInp.append(btnMenos, pQtd, btnMais);

    const btnTrash = document.createElement('button');
    btnTrash.type = 'button';
    btnTrash.className = 'btn-excluir';
    btnTrash.style.cursor = 'pointer';
    btnTrash.style.background = 'none';

    const imgTrash = document.createElement('img');
    imgTrash.src = '../assets/icons/trash.svg';
    imgTrash.alt = 'Remover do carrinho';
    imgTrash.style.pointerEvents = 'none'; // Garante que o clique registre no botão pai

    btnTrash.appendChild(imgTrash);

    form.append(divInp, btnTrash);
    divContainer.append(divTextos, form);

    article.append(a, divContainer);
    return article;
}
