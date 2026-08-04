import { carregarCarrinho, removerItem, alterarQuantidade } from '../modules/cartModule.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ao carregar a página, lista o carrinho
    carregarCarrinho();

    // 2. Usando Event Delegation para escutar os cliques em botões gerados dinamicamente
    const containerLista = document.getElementById('carrinho-lista');
    
    if (containerLista) {
        containerLista.addEventListener('click', (evento) => {
            // Evita que o formulário submeta
            evento.preventDefault();

            // Pega o artigo pai que contém o ID do item
            const article = evento.target.closest('article');
            if (!article) return;

            const itemId = article.dataset.itemId;
            if (!itemId) return;

            // Se clicou na lixeira
            if (evento.target.classList.contains('btn-excluir')) {
                if (confirm("Deseja realmente remover este item do carrinho?")) {
                    removerItem(itemId, article);
                }
            }

            // Se clicou no mais (+)
            if (evento.target.classList.contains('btn-mais')) {
                const qtdAtual = parseInt(article.querySelector('.inp-box p:nth-child(2)').textContent);
                alterarQuantidade(itemId, qtdAtual + 1);
            }

            // Se clicou no menos (-)
            if (evento.target.classList.contains('btn-menos')) {
                const qtdAtual = parseInt(article.querySelector('.inp-box p:nth-child(2)').textContent);
                if (qtdAtual > 1) {
                    alterarQuantidade(itemId, qtdAtual - 1);
                }
            }
        });
    }
});
