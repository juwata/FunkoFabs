// Copiar código PIX
// ao clicar no <p>, você copia a chave
const downlink = document.querySelector(".downlink");

downlink.addEventListener("click", async () => {
    const codigoPix = "00020126490014br.gov.bcb.pix0114+55119992518120209FunkoFabs5204000053039865802BR5922JULIA FONSECA WATANABE6009Sao Paulo62120508Fabsters63048210";

    await navigator.clipboard.writeText(codigoPix);

    downlink.textContent = "Código PIX copiado!";

    setTimeout(() => {
        downlink.textContent = "ou copiar código do PIX";
    }, 2000);
});