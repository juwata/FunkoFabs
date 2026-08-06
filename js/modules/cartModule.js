import { CartService } from '../service/cartService.js';
import { mostrarErro, mostrarLoading, limparFeedback } from '../components/feedbackUI.js';

export async function carregarCarrinho(silencioso = false) {
    const containerId = 'carrinho-lista';

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
            divEmpty.className = 'cart-empty-container';

            const imgEmpty = document.createElement('img');
            imgEmpty.src = '../assets/icons/cart.svg';
            imgEmpty.alt = 'Carrinho vazio';
            imgEmpty.className = 'cart-empty-img';

            const h2Empty = document.createElement('h2');
            h2Empty.textContent = 'Seu carrinho está vazio!';
            h2Empty.className = 'cart-empty-title';

            const pEmpty = document.createElement('p');
            pEmpty.textContent = 'Que tal adicionar alguns FunkoFabs incríveis?';
            pEmpty.className = 'cart-empty-desc';

            const btnEmpty = document.createElement('button');
            btnEmpty.className = 'bt-blue cart-empty-btn';
            btnEmpty.textContent = 'Ir para o Catálogo';
            btnEmpty.addEventListener('click', () => {
                window.location.href = 'catalog.html';
            });

            divEmpty.append(imgEmpty, h2Empty, pEmpty, btnEmpty);
            container.appendChild(divEmpty);

            const divBuy = document.querySelector('.buy');
            if (divBuy) divBuy.classList.add('hidden');
            return;
        }

        const divBuy = document.querySelector('.buy');
        if (divBuy) divBuy.classList.remove('hidden');


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
        document.getElementById('btn-finalizar').classList.remove('hidden');

    } catch (erro) {
        const container = document.getElementById(containerId);
        if (container) {
            container.textContent = '';
            const p = document.createElement('p');
            p.textContent = 'Não foi possível acessar o carrinho no momento.';
            p.className = 'cart-error-msg';
            container.appendChild(p);
        }
        mostrarErro("Falha de comunicação com o servidor.");
    }
}

export async function removerItem(itemId, articleElement) {
    try {
        articleElement.classList.add('cart-item-loading'); 
        await CartService.removerItemCart(itemId);
        
        carregarCarrinho(true); 
    } catch (erro) {
        articleElement.classList.remove('cart-item-loading');
        mostrarErro(erro.message || "Erro ao remover item.");
    }
}

export async function alterarQuantidade(itemId, novaQtd, pQtdElement = null) {
    try {
        limparFeedback();
        if (pQtdElement) {
            pQtdElement.textContent = '';
            const spinner = document.createElement('div');
            spinner.className = 'spinner spinner-sm';
            pQtdElement.appendChild(spinner);
        }
        await CartService.atualizarQuantidade(itemId, novaQtd);
        carregarCarrinho(true); 
    } catch (erro) {
        mostrarErro(erro.message || "Erro ao atualizar quantidade.");
        carregarCarrinho(true); 
    }
}


function criarElementoItem(item, subtotal) {
    const article = document.createElement('article');
    article.dataset.itemId = item.id; 

    const a = document.createElement('a');
    a.href = `product.html?id=${item.product.id}`;
    
    const img = document.createElement('img');
    img.src = item.product.imageUrl || '../assets/images/placeholder.png';
    img.alt = `Imagem de ${item.product.name}`;
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
    btnMenos.className = 'btn-menos cart-qty-btn';

    const pQtd = document.createElement('p');
    pQtd.textContent = item.quantity;
    
    const btnMais = document.createElement('button');
    btnMais.type = 'button';
    btnMais.textContent = '+';
    btnMais.className = 'btn-mais cart-qty-btn';

    divInp.append(btnMenos, pQtd, btnMais);

    const btnTrash = document.createElement('button');
    btnTrash.type = 'button';
    btnTrash.className = 'btn-excluir cart-qty-btn';

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
