// Função para gerenciar o comportamento do header
function initHeader() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    const scrollThreshold = 500;
    
    // Verifica se está na página inicial
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > scrollThreshold) {
                header.classList.add('visible');
            } else {
                header.classList.remove('visible');
            }
            
            lastScroll = currentScroll;
        });
    } else {
        // Nas outras páginas, o header fica sempre visível
        header.classList.add('visible');
    }
}

// Função para inicializar o Swiper
function initSwiper() {
    if (document.querySelector('.servicosSwiper')) {
        const swiper = new Swiper(".servicosSwiper", {
            slidesPerView: 1,
            spaceBetween: 0,
            centeredSlides: true,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    }
}

// Inicializa todas as funcionalidades quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initSwiper();
}); 