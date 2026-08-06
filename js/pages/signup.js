import { processarCadastro } from '../modules/authModule.js';
import { mostrarErro, limparFeedback } from '../components/feedbackUI.js';

document.addEventListener('DOMContentLoaded', () => {

    let fotoBase64 = null;
    let fotoArquivo = null; // Armazena o arquivo real para envio ao Cloudinary

    // Configurar formatador de telefone
    const inputTelefone = document.getElementById('iTel');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, ''); 
            if (valor.length > 11) valor = valor.slice(0, 11); 
            valor = valor.replace(/^(\d{2})(\d)/, '($1) $2'); 
            valor = valor.replace(/(\d{5})(\d)/, '$1-$2'); 
            e.target.value = valor; 
        });
    }

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
                    previewFoto.src = evento.target.result;
                    previewFoto.classList.add('preview-foto-active');
                    textoFoto.classList.add('hidden');
                    
                    if (btnRemoverFoto) btnRemoverFoto.classList.remove('hidden');
                };
                leitor.readAsDataURL(file);
            }
        });

        if (btnRemoverFoto) {
            btnRemoverFoto.addEventListener('click', () => {
                fotoArquivo = null;
                fotoBase64 = null;
                inputFoto.value = ''; // Limpa o input nativo
                previewFoto.src = '../assets/icons/upload.svg';
                previewFoto.classList.remove('preview-foto-active');
                textoFoto.classList.remove('hidden');
                
                if (btnRemoverFoto) {
                    btnRemoverFoto.classList.add('hidden');
                }
            });
        }
    }

    const formCadastro = document.getElementById('form-cadastro');
    const btnSubmit = document.getElementById('btn-submit-form');

    if (btnSubmit && formCadastro) {
        btnSubmit.addEventListener('click', async () => {
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
            const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(dadosRegistro.password);
            
            if (dadosRegistro.password.length < 6 || !temNumero || !temEspecial) {
                mostrarErro("A senha deve ter no mínimo 6 caracteres, 1 número e 1 especial.");
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
                        dadosRegistro.photoUrl = dadosCloudinary.secure_url; 
                    } else {
                        const erroCloud = await respostaCloudinary.json();
                        console.error("Erro Cloudinary:", erroCloud);
                        mostrarErro(`Falha Cloudinary: ${erroCloud.error.message}`);
                        btnSubmit.disabled = false;
                        btnSubmit.textContent = 'Confirmar';
                        return; // Trava o cadastro se a foto falhar
                    }
                } catch (e) {
                    mostrarErro("Aviso: Falha de conexão com o Cloudinary.");
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'Confirmar';
                    return;
                } finally {
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'Confirmar';
                }
            }

            processarCadastro(dadosRegistro, btnSubmit);
        });
    }}
);