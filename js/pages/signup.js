import { processarCadastro } from '../modules/authModule.js';
import { mostrarErro, limparFeedback } from '../components/feedbackUI.js';

document.addEventListener('DOMContentLoaded', () => {

    let fotoBase64 = null;
    let fotoArquivo = null; // Armazena o arquivo real para envio ao Cloudinary

    // Lógica para Upload e Preview da Foto de Perfil
    const containerFoto = document.getElementById('container-foto');
    const inputFoto = document.getElementById('input-foto');
    const previewFoto = document.getElementById('preview-foto');
    const textoFoto = document.getElementById('texto-foto');
    const btnRemoverFoto = document.getElementById('btn-remover-foto');

    if (containerFoto && inputFoto) {
        inputFoto.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const leitor = new FileReader();
                fotoArquivo = file; 
                leitor.onload = function(evento) {
                    fotoBase64 = evento.target.result;
                    previewFoto.src = fotoBase64;      
                    previewFoto.style.width = '100%';
                    previewFoto.style.height = '100%';
                    previewFoto.style.borderRadius = '10px';
                    previewFoto.style.objectFit = 'cover';
                    textoFoto.style.display = 'none';
                    
                    if (btnRemoverFoto) btnRemoverFoto.style.display = 'block';
                };
                leitor.readAsDataURL(file);
            }
        });

        if (btnRemoverFoto) {
            btnRemoverFoto.addEventListener('click', () => {
                fotoArquivo = null;
                fotoBase64 = null;
                inputFoto.value = ''; // Limpa o input nativo
                previewFoto.src = '../assets/icons/cam.svg';
                previewFoto.style.width = '';
                previewFoto.style.height = '';
                previewFoto.style.borderRadius = '';
                previewFoto.style.objectFit = '';
                textoFoto.style.display = 'block';
                textoFoto.innerHTML = 'Escolha sua melhor foto! <br> (ou não também)';
                btnRemoverFoto.style.display = 'none';
            });
        }
    }

    const formCadastro = document.getElementById('form-cadastro');
    const btnSubmit = document.getElementById('btn-submit-form');

    if (btnSubmit && formCadastro) {
        btnSubmit.addEventListener('click', async () => {
            console.log("CLIQUE DETECTADO! Iniciando validações...");
            limparFeedback(); 

            // Como tiramos o form nativo, forçamos a validação do HTML5
            if (!formCadastro.checkValidity()) {
                formCadastro.reportValidity();
                return;
            }

            const dadosRegistro = {
                name: formCadastro.querySelectorAll('input:not([type="file"])')[0].value.trim(),
                email: formCadastro.querySelectorAll('input:not([type="file"])')[1].value.trim(),
                password: formCadastro.querySelectorAll('input:not([type="file"])')[2].value,
                phone: formCadastro.querySelectorAll('input:not([type="file"])')[3].value.trim(),
                photoUrl: null 
            };

            
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

            const temNumero = /\d/.test(dadosRegistro.password);
            if (dadosRegistro.password.length < 6 || !temNumero) {
                mostrarErro("A senha deve ter no mínimo 6 caracteres e conter pelo menos um número.");
                return;
            }

            const apenasNumeros = dadosRegistro.phone.replace(/\D/g, '');
            if (apenasNumeros.length < 10) {
                mostrarErro("Digite um telefone válido com DDD (mínimo 10 números).");
                return; 
            }


            if (fotoArquivo) {
                try {
                    btnSubmit.disabled = true;
                    btnSubmit.textContent = 'Enviando foto...';

                    const formData = new FormData();
                    formData.append('file', fotoArquivo);
                    formData.append('upload_preset', 'funko_preset');

                    const respostaCloudinary = await fetch('https://api.cloudinary.com/v1_1/dbzjr0aqn/image/upload', {
                        method: 'POST',
                        body: formData
                    });

                    if (respostaCloudinary.ok) {
                        const dadosCloudinary = await respostaCloudinary.json();
                        dadosRegistro.photoUrl = dadosCloudinary.secure_url; // Pega o link seguro da nuvem
                    } else {
                        mostrarErro("Aviso: Falha ao fazer upload da foto. Cadastro seguirá sem foto.");
                    }
                } catch (e) {
                    mostrarErro("Aviso: Falha de conexão com o Cloudinary.");
                } finally {
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'Confirmar';
                }
            }

            processarCadastro(dadosRegistro, btnSubmit);
        });
    }
});