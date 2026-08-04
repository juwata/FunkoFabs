import { ProductsService } from "../api/productsService.js";
import { mostrarLoading, mostrarErro } from "../components/feedbackUI.js";

export async function inicializarCatalogo() {
    const idContainer = 'vitrine'; 
    
    mostrarLoading(idContainer);

    try {
        const produtos = await ProductsService.listarProdutos();
        
        const container = document.getElementById(idContainer);
        container.textContent = ''; 

        if (!produtos || produtos.length === 0) {
            container.textContent = 'Nenhum Action Figure disponível no momento.';
            return;
        }

        const fragmento = document.createDocumentFragment();

        produtos.forEach(produto => {
            const card = criarCardProduto(produto);
            fragmento.appendChild(card);
        });

        container.appendChild(fragmento);

    } catch (erro) {
        const container = document.getElementById(idContainer);
        if (container) {
            container.textContent = '';
            const p = document.createElement('p');
            p.textContent = 'Indisponível no momento.';
            p.style.textAlign = 'center';
            p.style.width = '100%';
            p.style.gridColumn = '1 / -1';
            container.appendChild(p);
        }

        mostrarErro("Não foi possível carregar a vitrine de produtos.");
    }
}

/**
 * Função responsável por criar a estrutura HTML de cada produto.
 * 100% segura contra XSS (não usa innerHTML).
 */
function criarCardProduto(produto) {
    const a = document.createElement('a');

    const img = document.createElement('img');
    img.src = produto.imageUrl || 'assets/img/placeholder.png'; 
    img.alt = `Funko Pop: ${produto.name}`;
    img.loading = 'lazy'; 

    const titulo = document.createElement('p');
    titulo.textContent = produto.name;

    const preco = document.createElement('p');
    preco.textContent = `R$ ${produto.price.toFixed(2)}`;

    a.dataset.id = produto.id; 
    a.href = `product.html?id=${produto.id}`;

    a.append(img, titulo, preco);
    
    return a;
}