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
    
   // --- Inicio: Lógica del Carrusel de Testimonios Individual ---
        // --- START Testimonial Carousel Logic ---
    const testimonialCarousel = document.getElementById('testimonial-carousel');
    const prevTestimonialButton = document.getElementById('testimonial-prev');
    const nextTestimonialButton = document.getElementById('testimonial-next');
    const testimonialIndicatorsContainer = document.getElementById('testimonial-indicators');
    let testimonialCards = []; // Será poblado después de asegurar que el DOM está listo

    let currentTestimonialIndex = 0;
    let testimonialScrollTimeout;
    let testimonialResizeTimeout;

    function setupTestimonialCarousel() {
        if (!testimonialCarousel) {
            console.warn("Testimonial carousel element not found.");
            if (prevTestimonialButton) prevTestimonialButton.style.display = 'none';
            if (nextTestimonialButton) nextTestimonialButton.style.display = 'none';
            if (testimonialIndicatorsContainer) testimonialIndicatorsContainer.style.display = 'none';
            return;
        }

        testimonialCards = Array.from(testimonialCarousel.querySelectorAll('.testimonial-card'));

        if (testimonialCards.length === 0) {
            if (prevTestimonialButton) prevTestimonialButton.style.display = 'none';
            if (nextTestimonialButton) nextTestimonialButton.style.display = 'none';
            if (testimonialIndicatorsContainer) testimonialIndicatorsContainer.style.display = 'none';
            return;
        }

        function updateTestimonialView(smooth = true, focusCard = true) {
            if (testimonialCards[currentTestimonialIndex]) {
                const cardToScroll = testimonialCards[currentTestimonialIndex];
                
                // Forzamos el scroll al centro de la card
                const carouselScrollLeft = testimonialCarousel.scrollLeft;
                const carouselWidth = testimonialCarousel.offsetWidth;
                const cardLeft = cardToScroll.offsetLeft;
                const cardWidth = cardToScroll.offsetWidth;
                
                const targetScrollLeft = cardLeft - (carouselWidth / 2) + (cardWidth / 2) - parseFloat(getComputedStyle(testimonialCarousel).paddingLeft);


                testimonialCarousel.scrollTo({
                    left: targetScrollLeft,
                    behavior: smooth ? 'smooth' : 'auto'
                });

                // Opcional: dar foco a la card para accesibilidad (puede causar saltos si no se maneja bien con el scroll)
                // if (focusCard && smooth) { // Solo si es una interacción directa
                //    setTimeout(() => cardToScroll.focus({ preventScroll: true }), 350); // Dar tiempo a la animación de scroll
                // }
            }
            updateTestimonialControls();
            updateTestimonialIndicators();
        }

        function updateTestimonialControls() {
            if (prevTestimonialButton) prevTestimonialButton.disabled = currentTestimonialIndex === 0;
            if (nextTestimonialButton) nextTestimonialButton.disabled = currentTestimonialIndex >= testimonialCards.length - 1;
        }

        function updateTestimonialIndicators() {
            if (!testimonialIndicatorsContainer) return;
            testimonialIndicatorsContainer.innerHTML = '';
            testimonialCards.forEach((_, index) => {
                const button = document.createElement('button');
                button.setAttribute('aria-label', `Ir al testimonio ${index + 1}`);
                button.classList.add('w-2.5', 'h-2.5', 'rounded-full', 'transition-all', 'duration-300', 'ease-in-out');
                if (index === currentTestimonialIndex) {
                    button.classList.add('bg-primary', 'scale-125');
                } else {
                    button.classList.add('bg-gray-300', 'hover:bg-gray-400');
                }
                button.addEventListener('click', () => {
                    currentTestimonialIndex = index;
                    updateTestimonialView(true, true);
                });
                testimonialIndicatorsContainer.appendChild(button);
            });
        }
        
        function determineActiveCardOnScroll() {
            clearTimeout(testimonialScrollTimeout);
            testimonialScrollTimeout = setTimeout(() => {
                if (!testimonialCarousel) return;
                const carouselRect = testimonialCarousel.getBoundingClientRect();
                const carouselCenterPoint = carouselRect.left + (carouselRect.width / 2);
                
                let closestIndex = 0;
                let minDistance = Infinity;

                testimonialCards.forEach((card, index) => {
                    const cardRect = card.getBoundingClientRect();
                    const cardCenterPoint = cardRect.left + (cardRect.width / 2);
                    const distance = Math.abs(carouselCenterPoint - cardCenterPoint);

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestIndex = index;
                    }
                });
                
                if (currentTestimonialIndex !== closestIndex) {
                    currentTestimonialIndex = closestIndex;
                    // No llamar a updateTestimonialView aquí para evitar bucles de scroll,
                    // solo actualizar controles e indicadores. El scroll ya sucedió.
                    updateTestimonialControls();
                    updateTestimonialIndicators();
                }
            }, 100); // Debounce para optimizar
        }

        if (nextTestimonialButton) {
            nextTestimonialButton.addEventListener('click', () => {
                if (currentTestimonialIndex < testimonialCards.length - 1) {
                    currentTestimonialIndex++;
                    updateTestimonialView(true, true);
                }
            });
        }

        if (prevTestimonialButton) {
            prevTestimonialButton.addEventListener('click', () => {
                if (currentTestimonialIndex > 0) {
                    currentTestimonialIndex--;
                    updateTestimonialView(true, true);
                }
            });
        }
        
        if (testimonialCarousel) {
            testimonialCarousel.addEventListener('scroll', determineActiveCardOnScroll, { passive: true });
        }

        window.addEventListener('resize', () => {
            clearTimeout(testimonialResizeTimeout);
            testimonialResizeTimeout = setTimeout(() => {
                updateTestimonialView(false, false); // Re-centrar sin animación y sin forzar foco
            }, 250);
        });

        // Initial setup
        updateTestimonialView(false, false); // Carga inicial sin animación ni foco
    }

    // Asegurarse que el DOM está completamente cargado, especialmente las imágenes dentro de las cards si afectan el tamaño
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupTestimonialCarousel);
    } else {
        setupTestimonialCarousel(); // DOM ya está listo
    }
    // --- END Testimonial Carousel Logic ---
    // --- Fin: Lógica del Carrusel de Testimonios Individual ---
});   
