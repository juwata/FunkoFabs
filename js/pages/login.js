import { processarLogin } from '../modules/authModule.js';
import { mostrarErro, limparFeedback } from '../components/feedbackUI.js';

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.querySelector('main form');

    if (formLogin) {
        formLogin.addEventListener('submit', (evento) => {
            evento.preventDefault();
            limparFeedback();

            const dadosLogin = {
                email: formLogin.querySelectorAll('input')[0].value.trim(),
                password: formLogin.querySelectorAll('input')[1].value
            };

            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(dadosLogin.email)) {
                mostrarErro("Por favor, digite um e-mail válido.");
                return;
            }

            if (dadosLogin.password.length < 6) {
                mostrarErro("A senha possui no mínimo 6 caracteres.");
                return;
            }

            const btnSubmit = formLogin.querySelector('button[type="submit"]');
            processarLogin(dadosLogin, btnSubmit);
        });
    }
});
