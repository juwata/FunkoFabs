import { ProductsService } from '../api/productsService.js'; // Ajustado path
import { CartService } from '../api/cartService.js';
import { mostrarErro, mostrarLoading, mostrarSucesso } from '../components/feedbackUI.js';

export async function carregarDetalhesProduto(idProduto) {
    const containerId = 'detalhes-produto';
    mostrarLoading(containerId);

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
        btnSubmit.innerHTML = 'Adicionando...';

        // Chama a API com o Token
        await CartService.adicionarItem({ productId, quantity });

        mostrarSucesso("Produto adicionado ao carrinho!");
        
        // UX extra: Pergunta se quer ir para o carrinho
        setTimeout(() => {
            if(confirm("Produto adicionado! Deseja ir para o carrinho?")) {
                window.location.href = 'cart.html';
            }
        }, 500);

    } catch (erro) {
        mostrarErro(erro.message || "Erro ao adicionar ao carrinho.");
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<img src="../assets/icons/addcart.svg" alt="">Adicionar ao carrinho';
    }
}
