// Input de Telefone
// formatar para: (XX) XXXXX-XXXX
const inputTelefone = document.getElementById('iTel');

inputTelefone.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, ''); // remover o que não é número

    if (valor.length > 11) {
        valor = valor.slice(0, 11); // limita a 11 dígitos
    }

    valor = valor.replace(/^(\d{2})(\d)/, '($1) $2'); // coloca os parênteses
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2'); // coloca os hífen

    e.target.value = valor; // quando o usuário focar, vai só no número
});