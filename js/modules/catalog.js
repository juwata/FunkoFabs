import { ProductsService } from "../service/productsService";

import { mostrarLoading, mostrarErro } from "../components/feedbackUI";

export async function inicializarCatalogo() {
    // O ID exato da div onde os produtos vão aparecer no seu index.html
    const idContainer = 'vitrine'; 
    
    // 1. Mostra estado de carregamento
    mostrarLoading(idContainer);

    try {
        const produtos = await ProductsService.listarProdutos();
        
        const container = document.getElementById(idContainer);
        container.textContent = ''; // Limpa o "Carregando..." de forma segura

        // 3. Trata estado vazio
        if (!produtos || produtos.length === 0) {
            container.textContent = 'Nenhum Action Figure disponível no momento.';
            return;
        }

        // 4. Cria um fragmento (melhor prática de performance)
        const fragmento = document.createDocumentFragment();

        // 5. Monta cada card e adiciona ao fragmento
        produtos.forEach(produto => {
            const card = criarCardProduto(produto);
            fragmento.appendChild(card);
        });

        // 6. Injeta tudo no DOM de uma única vez
        container.appendChild(fragmento);

    } catch (erro) {
        // 7. Trata o erro visivelmente para o usuário
        mostrarErro(idContainer, "Não foi possível carregar a vitrine de produtos.");
        console.error(erro);
    }
}

/**
 * Função responsável por criar a estrutura HTML de cada produto.
 * 100% segura contra XSS (não usa innerHTML).
 */
function criarCardProduto(produto) {
    const a = document.createElement('a');

    const img = document.createElement('img');
    img.src = produto.imagemUrl || 'assets/img/placeholder.png'; 
    img.alt = `Funko Pop: ${produto.nome}`;
    img.loading = 'lazy'; 

    const titulo = document.createElement('p');
    titulo.textContent = produto.nome;

    const preco = document.createElement('p');
    preco.textContent = `R$ ${produto.preco.toFixed(2)}`;

    a.dataset.id = produto.id; 

    a.append(img, titulo, preco);
    
    return a;
}