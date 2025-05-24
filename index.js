document.addEventListener('DOMContentLoaded', () => {
    // Menú móvil
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        // Cerrar menú móvil al hacer clic en un enlace
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
    
    // Año actual en el footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Animaciones al hacer scroll
    const sections = document.querySelectorAll('.fade-in-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Lógica de Modales para Proyectos
    const openModalButtons = document.querySelectorAll('.open-modal-button');
    const closeModalButtons = document.querySelectorAll('.close-modal-button');

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modalTarget;
            const modal = document.getElementById(modalId);
            if (modal) {
                document.body.style.overflow = 'hidden'; // Evitar scroll del body
                modal.classList.remove('hidden');
                setTimeout(() => { // para la animación
                    modal.classList.remove('opacity-0');
                    modal.querySelector('.modal-content').classList.remove('scale-95');
                }, 10); 
            }
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                document.body.style.overflow = ''; // Restaurar scroll del body
                modal.classList.add('opacity-0');
                modal.querySelector('.modal-content').classList.add('scale-95');
                setTimeout(() => { // para la animación
                     modal.classList.add('hidden');
                }, 250); // Debe coincidir con la duración de la transición CSS
            }
        });
    });

    // Cerrar modal al hacer clic fuera del contenido (en el overlay)
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) { // Si el clic es en el overlay mismo
                 document.body.style.overflow = ''; // Restaurar scroll del body
                modal.classList.add('opacity-0');
                modal.querySelector('.modal-content').classList.add('scale-95');
                 setTimeout(() => {
                     modal.classList.add('hidden');
                }, 250);
            }
        });
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const visibleModal = document.querySelector('.modal:not(.hidden)');
            if (visibleModal) {
                document.body.style.overflow = ''; // Restaurar scroll del body
                visibleModal.classList.add('opacity-0');
                visibleModal.querySelector('.modal-content').classList.add('scale-95');
                setTimeout(() => {
                     visibleModal.classList.add('hidden');
                }, 250);
            }
        }
    });

    // Smooth scroll para enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                 const offsetTop = targetElement.offsetTop - 70; // Ajustar por el alto del nav fijo
                 window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
   // ---- NUEVA LÓGICA PARA TESTIMONIOS ----
    const testimonialCarousel = document.getElementById('testimonial-carousel');
    const testimonialCards = document.querySelectorAll('.testimonial-card[data-testimonial-index]');
    const testimonialPrevButton = document.getElementById('testimonial-prev');
    const testimonialNextButton = document.getElementById('testimonial-next');
    const testimonialIndicatorsContainer = document.getElementById('testimonial-indicators');

    // Testimonial Modal Elements
    const testimonialDetailModal = document.getElementById('testimonial-detail-modal');
    const closeTestimonialModalButton = document.getElementById('close-testimonial-modal-button');
    const modalTestimonialText = document.getElementById('modal-testimonial-text');
    const modalAuthorName = document.getElementById('modal-author-name');
    const modalAuthorTitle = document.getElementById('modal-author-title');
    const modalPrevTestimonialButton = document.getElementById('modal-prev-testimonial');
    const modalNextTestimonialButton = document.getElementById('modal-next-testimonial');
    
    let currentOpenTestimonialIndex = 0; // Para el carrusel principal
    let currentModalTestimonialIndex = -1; // Para el modal
    const MAX_LINES_EXCERPT = 4;
    const AVG_CHARS_PER_LINE_ESTIMATE = 70; // Ajustar según sea necesario

    function truncateTextForCard(textElement, fullText, maxLines, avgCharsPerLine) {
        if (!textElement || !fullText) return;

        const linesArray = fullText.split('\n');
        let excerpt;

        if (linesArray.length >= maxLines) {
            excerpt = linesArray.slice(0, maxLines).join('\n');
            if (fullText.length > excerpt.length || linesArray.length > maxLines) {
                 // Solo añade "..." si realmente se truncó o hay más líneas
                excerpt = linesArray.slice(0, maxLines).join('\n').substring(0, maxLines * avgCharsPerLine -3) + "...";
            }
        } else { // Menos saltos de línea que maxLines, o un solo párrafo largo
            const maxLength = maxLines * avgCharsPerLine;
            if (fullText.length > maxLength) {
                let tempExcerpt = fullText.substring(0, maxLength -3); // Dejar espacio para "..."
                const lastSpace = tempExcerpt.lastIndexOf(' ');
                // Cortar en el último espacio si es razonable
                if (lastSpace > (maxLength - 25) && lastSpace > 0) { 
                    excerpt = tempExcerpt.substring(0, lastSpace) + "...";
                } else {
                    excerpt = tempExcerpt + "...";
                }
            } else {
                excerpt = fullText;
            }
        }
        textElement.innerHTML = excerpt.replace(/\n/g, '<br>');
    }
    
    function setupTestimonialCarousel() {
        if (!testimonialCarousel || testimonialCards.length === 0) return;

        testimonialCards.forEach((card, index) => {
            const excerptElement = card.querySelector('.testimonial-excerpt');
            const fullText = card.dataset.fullText;
            truncateTextForCard(excerptElement, fullText, MAX_LINES_EXCERPT, AVG_CHARS_PER_LINE_ESTIMATE);

            // Event listener para "Leer más..."
            const readMoreButton = card.querySelector('.open-testimonial-modal-button');
            if (readMoreButton) {
                readMoreButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    openTestimonialDetailModal(index);
                });
            }
        });

        // Inicializar indicadores
        if (testimonialIndicatorsContainer) {
            testimonialIndicatorsContainer.innerHTML = ''; // Limpiar existentes
            for (let i = 0; i < testimonialCards.length; i++) {
                const button = document.createElement('button');
                button.classList.add('w-2.5', 'h-2.5', 'rounded-full', 'transition-colors', 'duration-300');
                button.classList.add(i === 0 ? 'bg-primary' : 'bg-gray-300', 'hover:bg-primary/70');
                button.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
                button.addEventListener('click', () => scrollToTestimonial(i));
                testimonialIndicatorsContainer.appendChild(button);
            }
        }
        updateCarouselControls();
    }

    function updateCarouselControls() {
        if (!testimonialCarousel) return;
        const scrollLeft = testimonialCarousel.scrollLeft;
        const scrollWidth = testimonialCarousel.scrollWidth;
        const clientWidth = testimonialCarousel.clientWidth;

        if (testimonialPrevButton) testimonialPrevButton.disabled = scrollLeft < 10; // Pequeño umbral
        if (testimonialNextButton) testimonialNextButton.disabled = (scrollLeft + clientWidth + 10) >= scrollWidth;

        // Actualizar indicadores activos
        if (testimonialIndicatorsContainer) {
            const cardWidth = testimonialCards[0]?.offsetWidth || clientWidth;
            let activeIndex = Math.round(scrollLeft / cardWidth);
            // Ajuste si el carrusel no tiene snapping perfecto o hay márgenes
            if (testimonialCards[activeIndex]) {
                const cardRect = testimonialCards[activeIndex].getBoundingClientRect();
                const carouselRect = testimonialCarousel.getBoundingClientRect();
                if (Math.abs(cardRect.left - carouselRect.left) > cardWidth / 2 && scrollLeft > 0) {
                     // Si el centro de la tarjeta está más allá de la mitad del carrusel y no es la primera
                    if (scrollLeft > (activeIndex * cardWidth + cardWidth/2) && activeIndex < testimonialCards.length -1) {
                        // activeIndex++;
                    }
                }
            }
             activeIndex = Math.min(Math.max(activeIndex, 0), testimonialCards.length - 1);


            const indicators = testimonialIndicatorsContainer.children;
            for (let i = 0; i < indicators.length; i++) {
                indicators[i].classList.toggle('bg-primary', i === activeIndex);
                indicators[i].classList.toggle('bg-gray-300', i !== activeIndex);
            }
             currentOpenTestimonialIndex = activeIndex; // Sincronizar índice del carrusel
        }
    }
    
    function scrollToTestimonial(index) {
        if (!testimonialCarousel || !testimonialCards[index]) return;
        const card = testimonialCards[index];
        // Considerar el margen/padding del carrusel si se usa -mx-
        const carouselPadding = parseInt(getComputedStyle(testimonialCarousel).paddingLeft) || 0;
        
        // Calcula el offset de la tarjeta relativo al contenedor del carrusel
        // card.offsetLeft ya considera la posición de la tarjeta dentro de su contenedor scrolleable
        let scrollPosition = card.offsetLeft - carouselPadding;

        // Ajuste para centrar si es posible (especialmente útil si no hay snap)
        // const cardWidth = card.offsetWidth;
        // const carouselWidth = testimonialCarousel.clientWidth;
        // scrollPosition = scrollPosition - (carouselWidth / 2) + (cardWidth / 2);
        // scrollPosition = Math.max(0, scrollPosition); // No ir antes del inicio
        // scrollPosition = Math.min(scrollPosition, testimonialCarousel.scrollWidth - carouselWidth); // No ir más allá del final

        testimonialCarousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        currentOpenTestimonialIndex = index;
        // updateCarouselControls() se llamará con el evento 'scroll'
    }

    if (testimonialCarousel) {
        testimonialCarousel.addEventListener('scroll', updateCarouselControls);
    }
    if (testimonialPrevButton) {
        testimonialPrevButton.addEventListener('click', () => {
            const cardWidth = testimonialCards[0]?.offsetWidth || testimonialCarousel.clientWidth;
            let targetScroll = testimonialCarousel.scrollLeft - cardWidth;
            testimonialCarousel.scrollTo({ left: targetScroll, behavior: 'smooth' });
        });
    }
    if (testimonialNextButton) {
        testimonialNextButton.addEventListener('click', () => {
            const cardWidth = testimonialCards[0]?.offsetWidth || testimonialCarousel.clientWidth;
            let targetScroll = testimonialCarousel.scrollLeft + cardWidth;
            testimonialCarousel.scrollTo({ left: targetScroll, behavior: 'smooth' });
        });
    }
    
    // Lógica para MODAL DE DETALLE DE TESTIMONIO
    function openTestimonialDetailModal(index) {
        if (index < 0 || index >= testimonialCards.length || !testimonialDetailModal) return;
        
        currentModalTestimonialIndex = index;
        const card = testimonialCards[index];
        const fullText = card.dataset.fullText;
        const authorName = card.dataset.authorName;
        const authorTitle = card.dataset.authorTitle;

        modalTestimonialText.innerHTML = fullText.replace(/\n/g, '<br>');
        modalAuthorName.textContent = authorName;
        modalAuthorTitle.textContent = authorTitle;

        modalPrevTestimonialButton.disabled = (index === 0);
        modalNextTestimonialButton.disabled = (index === testimonialCards.length - 1);
        
        testimonialDetailModal.classList.remove('hidden');
        setTimeout(() => {
            testimonialDetailModal.classList.remove('opacity-0');
            testimonialDetailModal.querySelector('.modal-content').classList.remove('scale-95');
            testimonialDetailModal.querySelector('.modal-content').classList.remove('opacity-0');
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    function closeTestimonialDetailModal() {
        if (!testimonialDetailModal) return;
        testimonialDetailModal.classList.add('opacity-0');
        testimonialDetailModal.querySelector('.modal-content').classList.add('scale-95');
        testimonialDetailModal.querySelector('.modal-content').classList.add('opacity-0');
        setTimeout(() => {
            testimonialDetailModal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 250);
        currentModalTestimonialIndex = -1;
    }

    if (closeTestimonialModalButton) {
        closeTestimonialModalButton.addEventListener('click', closeTestimonialDetailModal);
    }

    if (testimonialDetailModal) { // Cerrar al hacer clic fuera
        testimonialDetailModal.addEventListener('click', (event) => {
            if (event.target === testimonialDetailModal) {
                closeTestimonialDetailModal();
            }
        });
    }
    
    if (modalPrevTestimonialButton) {
        modalPrevTestimonialButton.addEventListener('click', () => {
            if (currentModalTestimonialIndex > 0) {
                openTestimonialDetailModal(currentModalTestimonialIndex - 1);
                 // Sincronizar carrusel principal si se desea
                 scrollToTestimonial(currentModalTestimonialIndex - 1); 
            }
        });
    }
    if (modalNextTestimonialButton) {
        modalNextTestimonialButton.addEventListener('click', () => {
            if (currentModalTestimonialIndex < testimonialCards.length - 1) {
                openTestimonialDetailModal(currentModalTestimonialIndex + 1);
                // Sincronizar carrusel principal si se desea
                scrollToTestimonial(currentModalTestimonialIndex + 1);
            }
        });
    }
    
    // Llamada inicial para configurar testimonios
    setupTestimonialCarousel();
    // ---- FIN LÓGICA TESTIMONIOS ----

    // Cierre de TODOS los modales con tecla Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const openProjectModal = document.querySelector('.modal:not(#testimonial-detail-modal):not(.hidden)');
            if (testimonialDetailModal && !testimonialDetailModal.classList.contains('hidden')) {
                closeTestimonialDetailModal();
            } else if (openProjectModal) {
                closeModal(openProjectModal);
            }
        }
    });

}); // Fin del DOMContentLoaded
