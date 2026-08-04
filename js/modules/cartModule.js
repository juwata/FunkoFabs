import { CartService } from '../api/cartService.js';
import { mostrarErro, mostrarLoading, limparFeedback } from '../components/feedbackUI.js';

export async function carregarCarrinho() {
    const containerId = 'carrinho-lista';
    mostrarLoading(containerId);

    try {
        const carrinho = await CartService.listarCarrinho();
        const container = document.getElementById(containerId);
        container.textContent = ''; 

        if (!carrinho || !carrinho.items || carrinho.items.length === 0) {
            container.textContent = 'Seu carrinho está vazio. Vá para o catálogo!';
            document.getElementById('carrinho-total').textContent = 'R$ 0,00';
            document.getElementById('btn-finalizar').style.display = 'none';
            return;
        }

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
        
        carregarCarrinho();
    } catch (erro) {
        articleElement.style.opacity = '1';
        mostrarErro(erro.message || "Erro ao remover item.");
    }
}

export async function alterarQuantidade(itemId, novaQtd) {
    try {
        limparFeedback();
        await CartService.atualizarQuantidade(itemId, novaQtd);
        carregarCarrinho();
    } catch (erro) {
        mostrarErro(erro.message || "Erro ao atualizar quantidade.");
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
    
    const btnMenos = document.createElement('p');
    btnMenos.textContent = '-';
    btnMenos.className = 'btn-menos';
    btnMenos.style.cursor = 'pointer';

    const pQtd = document.createElement('p');
    pQtd.textContent = item.quantity;
    
    const btnMais = document.createElement('p');
    btnMais.textContent = '+';
    btnMais.className = 'btn-mais';
    btnMais.style.cursor = 'pointer';

    divInp.append(btnMenos, pQtd, btnMais);

    const imgTrash = document.createElement('img');
    imgTrash.src = '../assets/icons/trash.svg';
    imgTrash.alt = 'Remover do carrinho';
    imgTrash.className = 'btn-excluir';
    imgTrash.style.cursor = 'pointer';

    form.append(divInp, imgTrash);
    divContainer.append(divTextos, form);

    article.append(a, divContainer);
    return article;
}
