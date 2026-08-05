import { mostrarErro, limparFeedback } from '../components/feedbackUI.js';
import { WaitlistService } from '../service/waitlistService.js';

document.addEventListener('DOMContentLoaded', () => {
    const formCreate = document.querySelector('main form');

    if (formCreate) {
        formCreate.addEventListener('submit', (evento) => {
            evento.preventDefault();
            limparFeedback();

            const inputEmail = formCreate.querySelector('input[type="email"]');
            const email = inputEmail.value.trim();

            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!regexEmail.test(email)) {
                mostrarErro("Por favor, digite um e-mail válido.");
                return;
            }

            const btnSubmit = formCreate.querySelector('button');
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Enviando...';

            WaitlistService.entrarNaLista(email)
                .then(() => {
                    window.location.href = 'create-success.html';
                })
                .catch(erro => {
                    mostrarErro(erro.message || "Erro ao entrar na lista VIP.");
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'entrar na lista vip';
                });
        });
    }
});
