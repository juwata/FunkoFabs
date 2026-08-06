import { request } from '../service/clientFetch.js';

document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletter-email');
            const btnSubmit = newsletterForm.querySelector('button');
            const email = emailInput.value.trim();
            
            if (!email) return;

            try {
                btnSubmit.disabled = true;
                btnSubmit.textContent = 'ENVIANDO...';
                
                await request('/waitlist', {
                    method: 'POST',
                    body: JSON.stringify({ email: email })
                });

                // Sucesso
                btnSubmit.textContent = 'CADASTRADO!';
                btnSubmit.style.backgroundColor = 'var(--price)'; // verde
                emailInput.value = '';
                
            } catch (erro) {
                // Erro (ex: e-mail já existe)
                btnSubmit.textContent = 'ERRO';
                btnSubmit.style.backgroundColor = 'var(--pri)'; // vermelho
                console.error("Erro ao cadastrar na newsletter: ", erro);
            } finally {
                // Volta ao estado original após 3 segundos
                setTimeout(() => {
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'RECEBER';
                    btnSubmit.style.backgroundColor = ''; 
                }, 3000);
            }
        });
    }
});
