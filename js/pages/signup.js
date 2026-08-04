import { processarCadastro } from '../modules/authModule.js';
import { mostrarErro, limparFeedback } from '../components/feedbackUI.js';

document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.querySelector('.signup form');

    if (formCadastro) {
        formCadastro.addEventListener('submit', (evento) => {
            evento.preventDefault();
            limparFeedback(); 

            const dadosRegistro = {
                name: formCadastro.querySelectorAll('input')[0].value.trim(),
                email: formCadastro.querySelectorAll('input')[1].value.trim(),
                password: formCadastro.querySelectorAll('input')[2].value,
                phone: formCadastro.querySelectorAll('input')[3].value.trim()
            };

            // ---- INÍCIO DAS VALIDAÇÕES CUSTOMIZADAS ---- //
            
            // 1. Validação de Nome (precisa ter sobrenome)
            if (dadosRegistro.name.split(' ').length < 2) {
                mostrarErro("Por favor, digite seu nome e sobrenome.");
                return;
            }

            // 2. Validação de E-mail (formato xxx@yyy.com)
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(dadosRegistro.email)) {
                mostrarErro("Por favor, digite um e-mail válido.");
                return;
            }

            // 3. Validação de Senha (Mín 6 caracteres + Pelo menos 1 número)
            const temNumero = /\d/.test(dadosRegistro.password);
            if (dadosRegistro.password.length < 6 || !temNumero) {
                mostrarErro("A senha deve ter no mínimo 6 caracteres e conter pelo menos um número.");
                return;
            }

            // 4. Validação de Telefone (Mín 10 dígitos)
            const apenasNumeros = dadosRegistro.phone.replace(/\D/g, '');
            if (apenasNumeros.length < 10) {
                mostrarErro("Digite um telefone válido com DDD (mínimo 10 números).");
                return; 
            }

            // ---- FIM DAS VALIDAÇÕES ---- //

            // Passou em todos os testes! Pode mandar para a API:
            const btnSubmit = formCadastro.querySelector('button[type="submit"]');
            processarCadastro(dadosRegistro, btnSubmit);
        });
    }
});