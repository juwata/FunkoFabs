import { ProductsService } from "../service/productsService.js";
import { mostrarLoading, mostrarErro } from "../components/feedbackUI.js";

let todosProdutos = [];

export async function inicializarCatalogo() {
    const idContainer = 'vitrine'; 
    
    mostrarLoading(idContainer);

    try {
        todosProdutos = await ProductsService.listarProdutos();
        if (!todosProdutos) todosProdutos = [];
        
        configurarFiltros();
        renderizarCatalogo(todosProdutos);

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

function configurarFiltros() {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');

    if (searchInput && sortSelect) {
        let debounceTimer;

        const aplicarFiltros = () => {
            const texto = searchInput.value.toLowerCase();
            const ordem = sortSelect.value;

            let filtrados = todosProdutos.filter(p => p.name.toLowerCase().includes(texto));

            if (ordem === 'preco-asc') {
                filtrados.sort((a, b) => a.price - b.price);
            } else if (ordem === 'preco-desc') {
                filtrados.sort((a, b) => b.price - a.price);
            } else if (ordem === 'nome-asc') {
                filtrados.sort((a, b) => a.name.localeCompare(b.name));
            } else if (ordem === 'nome-desc') {
                filtrados.sort((a, b) => b.name.localeCompare(a.name));
            }

            renderizarCatalogo(filtrados);
        };

        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(aplicarFiltros, 300);
        });
        
        sortSelect.addEventListener('change', aplicarFiltros);
    }
}

function renderizarCatalogo(produtosParaMostrar) {
    const container = document.getElementById('vitrine');
    if (!container) return;
    
    container.textContent = '';

    if (!produtosParaMostrar || produtosParaMostrar.length === 0) {
        container.textContent = 'Nenhum Action Figure encontrado.';
        return;
    }

    const fragmento = document.createDocumentFragment();
    produtosParaMostrar.forEach(produto => {
        fragmento.appendChild(criarCardProduto(produto));
    });
    container.appendChild(fragmento);
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
