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

                btnSubmit.textContent = 'CADASTRADO!';
                btnSubmit.classList.remove('bg-error');
                btnSubmit.classList.add('bg-success');
                emailInput.value = '';
                
            } catch (erro) {
                 btnSubmit.textContent = 'ERRO';
                btnSubmit.classList.remove('bg-success');
                btnSubmit.classList.add('bg-error');
                console.error("Erro ao cadastrar na newsletter: ", erro);
            } finally {
                // Volta ao estado original após 3 segundos
                setTimeout(() => {
                    btnSubmit.textContent = 'RECEBER';
                    btnSubmit.classList.remove('bg-success', 'bg-error');
                    btnSubmit.disabled = false;
                }, 3000);
            }
        });
    }
});
