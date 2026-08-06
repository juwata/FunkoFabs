// Header
// ficar claro no fundo escuro
const header = document.querySelector("header");
const logo = document.getElementById("header-logo");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const isLight = entry.target.dataset.header === "light";

        header.classList.toggle("light", isLight);
        logo.src = isLight
            ? "assets/logo-white.svg"
            : "assets/logo-black.svg";
    });
}, {
    threshold: 0.6
});

document.querySelectorAll(".slides").forEach(slide => {
    observer.observe(slide);
});



// Header
// desaparecer quando scrollar para baixo
if (window.matchMedia("(max-width: 767px)").matches) {
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;

        if (currentScroll <= 50) {
            header.classList.remove("hide");
            lastScroll = currentScroll;
            return;
        }

        if (currentScroll > lastScroll) {
            header.classList.add("hide");
        } else {
            header.classList.remove("hide");
        }

        lastScroll = currentScroll;
    });
}