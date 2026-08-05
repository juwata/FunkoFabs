import { AuthService } from '../service/authService.js';
import { mostrarErro, mostrarSucesso } from '../components/feedbackUI.js';

document.addEventListener('DOMContentLoaded', async () => {
    const inputTelefone = document.getElementById('iTel');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, ''); 
            if (valor.length > 11) {
                valor = valor.slice(0, 11); 
            }
            valor = valor.replace(/^(\d{2})(\d)/, '($1) $2'); 
            valor = valor.replace(/(\d{5})(\d)/, '$1-$2'); 
            e.target.value = valor; 
        });
    }

    let fotoArquivo = null;
    const inputFoto = document.getElementById('input-foto');
    const fotoPerfil = document.getElementById('foto-perfil');

    if (inputFoto && fotoPerfil) {
        fotoPerfil.addEventListener('click', () => {
            inputFoto.click();
        });

        inputFoto.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                fotoArquivo = file;
                const leitor = new FileReader();
                leitor.onload = function(evento) {
                    fotoPerfil.src = evento.target.result;
                };
                leitor.readAsDataURL(file);
            }
        });
    }

    // Prevenir o formulário de recarregar a página ao clicar em Confirmar
    const formPerfil = document.querySelector('form');
    if (formPerfil) {
        const btnSubmit = formPerfil.querySelector('button[type="submit"]');
        
        formPerfil.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const inputs = formPerfil.querySelectorAll('input');
            const dadosUpdate = {
                name: inputs[0].value.trim(),
                email: inputs[1].value.trim(),
                password: null,
                phone: inputs[2].value.trim(),
                photoUrl: null
            };

            try {
                btnSubmit.disabled = true;
                btnSubmit.textContent = 'Salvando...';

                if (fotoArquivo) {
                    const formData = new FormData();
                    formData.append('file', fotoArquivo);
                    formData.append('upload_preset', 'funko_preset');

                    const respostaCloud = await fetch('https://api.cloudinary.com/v1_1/dbzjr0aqn/image/upload', {
                        method: 'POST',
                        body: formData
                    });

                    if (respostaCloud.ok) {
                        const dadosCloud = await respostaCloud.json();
                        dadosUpdate.photoUrl = dadosCloud.secure_url;
                    } else {
                        const erroCloud = await respostaCloud.json();
                        mostrarErro(`Falha na foto: ${erroCloud.error.message}`);
                        btnSubmit.disabled = false;
                        btnSubmit.textContent = 'Confirmar';
                        return;
                    }
                }

                const resposta = await AuthService.atualizarMeuPerfil(dadosUpdate);
                
                localStorage.setItem('funkofabs_token', resposta.token);
                fotoArquivo = null; 
                
                mostrarSucesso('Perfil atualizado com sucesso!');

            } catch (erro) {
                mostrarErro(erro.message || 'Erro ao atualizar perfil.');
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Confirmar';
            }
        });
    }

    // Botão de Sair da Conta
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('funkofabs_token');
            localStorage.removeItem('funkofabs_role');
            window.location.href = '../index.html';
        });
    }

    try {
        const perfil = await AuthService.buscarMeuPerfil();
        
        const imgMain = document.getElementById('foto-perfil');
        if (imgMain && perfil.photoUrl) {
            imgMain.src = perfil.photoUrl;
        }

        const inputs = document.querySelectorAll('form input');
        if (inputs.length >= 3) {
            inputs[0].value = perfil.name || '';
            inputs[1].value = perfil.email || '';
            inputs[2].value = perfil.phone || '';
        }

    } catch (erro) {
        mostrarErro(erro.message || "Não foi possível carregar o seu perfil.");
        if (erro.message && erro.message.toLowerCase().includes('token')) {
            window.location.href = 'login.html';
        }
    }
});