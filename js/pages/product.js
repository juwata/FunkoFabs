import { carregarDetalhesProduto, adicionarAoCarrinho } from '../modules/productModule.js';
import { limparFeedback } from '../components/feedbackUI.js';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const idProduto = params.get('id');

    if (!idProduto) {
        const main = document.getElementById('detalhes-produto');
        if (main) main.textContent = "Nenhum produto selecionado. Volte ao catálogo.";
        return;
    }

    carregarDetalhesProduto(idProduto);

    const btnMais = document.getElementById('btn-mais');
    const btnMenos = document.getElementById('btn-menos');
    const displayQtd = document.getElementById('prod-qtd');

    if (btnMais && btnMenos && displayQtd) {
        let qtd = parseInt(displayQtd.textContent) || 1;
        
        btnMais.addEventListener('click', () => {
            qtd++;
            displayQtd.textContent = qtd;
        });
        
        btnMenos.addEventListener('click', () => {
            if (qtd > 1) { 
                qtd--;
                displayQtd.textContent = qtd;
            }
        });
    }

    const formCarrinho = document.getElementById('form-carrinho');
    if (formCarrinho) {
        formCarrinho.addEventListener('submit', (e) => {
            e.preventDefault();
            limparFeedback();
            
            const id = formCarrinho.dataset.produtoId;
            const qtd = parseInt(displayQtd.textContent);
            const btnSubmit = document.getElementById('btn-add-cart');
            
            if(id && qtd > 0) {
                adicionarAoCarrinho(parseInt(id), qtd, btnSubmit);
            }
        });
    }
});
