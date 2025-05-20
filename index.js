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
    
    // Botón de Volver Arriba (Scroll to Top)
    const scrollTopButton = document.getElementById('scrollTopButton');
    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) { // Mostrar botón después de 300px de scroll
                scrollTopButton.classList.remove('hidden');
                scrollTopButton.classList.add('opacity-100');
            } else {
                scrollTopButton.classList.add('hidden');
                scrollTopButton.classList.remove('opacity-100');
            }
        });

        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
    }
   // --- Inicio: Lógica del Carrusel de Testimonios Individual ---
    const testimonialCarousel = document.getElementById('testimonial-carousel-individual');
    const prevButton = document.getElementById('testimonial-prev');
    const nextButton = document.getElementById('testimonial-next');
    const indicatorsContainer = document.getElementById('testimonial-indicators');

    if (testimonialCarousel && prevButton && nextButton && indicatorsContainer) {
        const testimonials = Array.from(testimonialCarousel.children);
        let currentIndex = 0;
        const totalTestimonials = testimonials.length;

        // Crear indicadores
        testimonials.forEach((_, index) => {
            const button = document.createElement('button');
            button.setAttribute('aria-label', `Ir al testimonio ${index + 1}`);
            button.classList.add('w-3', 'h-3', 'rounded-full', 'bg-gray-300', 'hover:bg-gray-400', 'transition-colors');
            if (index === 0) {
                button.classList.remove('bg-gray-300');
                button.classList.add('bg-primary');
            }
            button.addEventListener('click', () => {
                goToTestimonial(index);
            });
            indicatorsContainer.appendChild(button);
        });
        const indicatorButtons = Array.from(indicatorsContainer.children);

        function updateIndicators() {
            indicatorButtons.forEach((button, index) => {
                button.classList.toggle('bg-primary', index === currentIndex);
                button.classList.toggle('bg-gray-300', index !== currentIndex);
            });
        }

        function goToTestimonial(index) {
            if (index < 0 || index >= totalTestimonials) return;
            
            const scrollAmount = testimonials[index].offsetLeft - testimonialCarousel.offsetLeft;
            testimonialCarousel.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
            currentIndex = index;
            updateButtonStates();
            updateIndicators();
        }

        function updateButtonStates() {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === totalTestimonials - 1;
            prevButton.classList.toggle('opacity-50', prevButton.disabled);
            prevButton.classList.toggle('cursor-not-allowed', prevButton.disabled);
            nextButton.classList.toggle('opacity-50', nextButton.disabled);
            nextButton.classList.toggle('cursor-not-allowed', nextButton.disabled);
        }
        
        prevButton.addEventListener('click', () => {
            goToTestimonial(currentIndex - 1);
        });

        nextButton.addEventListener('click', () => {
            goToTestimonial(currentIndex + 1);
        });

        // Actualizar en scroll manual (si el usuario usa el scroll)
        let scrollTimeout;
        testimonialCarousel.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollLeft = testimonialCarousel.scrollLeft;
                const carouselWidth = testimonialCarousel.offsetWidth;
                
                let newIndex = 0;
                // Encuentra el índice del testimonio más visible
                for(let i = 0; i < testimonials.length; i++) {
                    const testimonial = testimonials[i];
                    const testimonialMidPoint = testimonial.offsetLeft + testimonial.offsetWidth / 2;
                    const carouselMidPoint = scrollLeft + carouselWidth / 2;
                    if (Math.abs(testimonialMidPoint - carouselMidPoint) < testimonial.offsetWidth / 2) {
                         newIndex = i;
                         break; // Encontramos el más centrado
                    }
                }
                // Si el scroll está muy cerca del final, forzar el último índice
                if (testimonialCarousel.scrollLeft + carouselWidth >= testimonialCarousel.scrollWidth - 10) { // -10 es un pequeño umbral
                    newIndex = totalTestimonials - 1;
                }


                if (currentIndex !== newIndex) {
                    currentIndex = newIndex;
                    updateButtonStates();
                    updateIndicators();
                }
            }, 150); // Un pequeño delay para no sobrecargar
        });


        // Inicializar estado de botones e indicadores
        updateButtonStates();
        updateIndicators(); // Asegura que el primer indicador esté activo al cargar

    }
    // --- Fin: Lógica del Carrusel de Testimonios Individual ---
});   
