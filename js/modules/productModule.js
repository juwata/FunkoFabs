import { ProductsService } from '../service/productsService.js'; // Ajustado path
import { CartService } from '../service/cartService.js';
import { mostrarErro, mostrarLoading, mostrarSucesso } from '../components/feedbackUI.js';

export async function carregarDetalhesProduto(idProduto) {
    const containerId = 'detalhes-produto';

    try {
        const produto = await ProductsService.buscarPorId(idProduto);

        const img = document.getElementById('prod-img');
        const nome = document.getElementById('prod-nome');
        const desc = document.getElementById('prod-desc');
        const preco = document.getElementById('prod-preco');

        if (img) img.src = produto.imageUrl || '../assets/images/placeholder.png';
        if (nome) nome.textContent = produto.name;
        if (desc) desc.textContent = produto.description;
        if (preco) preco.textContent = `R$ ${produto.price.toFixed(2)}`;

        const formCarrinho = document.getElementById('form-carrinho');
        if (formCarrinho) formCarrinho.dataset.produtoId = produto.id;

    } catch (erro) {
        const container = document.getElementById(containerId);
        if (container) {
            container.textContent = 'Produto indisponível no momento.'; 
            mostrarErro("Erro na comunicação com o servidor.");
        }
    }
}

export async function adicionarAoCarrinho(productId, quantity, btnSubmit) {
    try {
        btnSubmit.disabled = true;
        btnSubmit.textContent = '';
        const spinner = document.createElement('div');
        spinner.className = 'spinner spinner-btn';
        btnSubmit.appendChild(spinner);

        // Chama a API com o Token
        await CartService.adicionarItem({ productId, quantity });

        mostrarSucesso("Produto adicionado ao carrinho!");

    } catch (erro) {
        mostrarErro(erro.message || "Erro ao adicionar ao carrinho.");
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = '';
        const img = document.createElement('img');
        img.src = '../assets/icons/addcart.svg';
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        btnSubmit.appendChild(img);
        btnSubmit.appendChild(document.createTextNode('Adicionar ao carrinho'));
    }
}
