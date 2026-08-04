// Input de CEP
// formatar para: xxxxx-xxx
const iCEP = document.querySelector("#iCEP");

iCEP.addEventListener("input", () => {
    let cep = iCEP.value.replace(/\D/g, "").slice(0, 8);

    cep = cep.replace(/^(\d{5})(\d)/, "$1-$2");

    iCEP.value = cep;
});