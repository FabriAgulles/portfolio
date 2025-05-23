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
    
   // --- START Testimonial Carousel Logic (Principal) ---
const testimonialCarousel = document.getElementById('testimonial-carousel');
const prevTestimonialButton = document.getElementById('testimonial-prev');
const nextTestimonialButton = document.getElementById('testimonial-next');
const testimonialIndicatorsContainer = document.getElementById('testimonial-indicators');
let testimonialCards = [];
let currentTestimonialIndex = 0; // Este índice será compartido y clave
let testimonialScrollTimeout;
let testimonialResizeTimeout;

// --- START Testimonial Individual Modal Logic ---
const testimonialIndividualModal = document.getElementById('testimonial-individual-modal');
const closeIndividualModalButton = document.getElementById('close-testimonial-individual-modal-button');
const modalTestimonialText = document.getElementById('modal-testimonial-text');
const modalTestimonialAuthor = document.getElementById('modal-testimonial-author');
const modalTestimonialCompany = document.getElementById('modal-testimonial-company');
const modalIndividualPrevButton = document.getElementById('modal-individual-prev');
const modalIndividualNextButton = document.getElementById('modal-individual-next');
const MAX_EXCERPT_LENGTH = 230; // Caracteres para el extracto

// Datos de los testimonios (DEBEN COINCIDIR CON TU HTML Y ORDEN)
const testimonialsData = [
    {
        text: "Fabricio es un excelente profesional; sabe cómo planificar y gestionar un proyecto de punta a punta, siempre con mucha responsabilidad y entusiasmo. Es buen compañero y coordinador de equipos; trabaja siempre con seriedad, tranquilidad y perseverancia, ningún proyecto le da miedo de gestionar, acepta todos los desafíos sin pensarlo. Dentro de sus tantas fortalezas se encuentran, sin duda, su motivación por su profesión y sus ganas de superarse día a día. Todo proyecto delegado en él, es un proyecto que será bien gestionado. Es un placer trabajar con él.",
        author: "Belén Riambau",
        company: "Project Manager"
    },
    {
        text: "Fabricio es un muy buen profesional y un gran compañero de trabajo. Es muy metodológico y organizado en sus tareas. Posee una buena y fluida comunicación con cada miembro del equipo. Tuve la oportunidad de trabajar en varios proyectos a la par y siempre ha sabido ejecutarlo con creces. Posee las palabras indicadas a la hora de negociar con los clientes y ha sabido alcanzar los objetivos en cada uno de los proyectos en los que participó.",
        author: "Sebastián Mergip",
        company: "Technical Business Analyst"
    },
    {
        text: "I had the opportunity to lead Fabricio as part of our Project Management Team for a short period of time, but I can confidently say he is a reliable, skilled PM who is willing to learn constantly. The onboarding process was very smooth, and after a few weeks, Fabricio started working on a project from scratch, making sure to follow the company's best practices. In addition, we had weekly meetings in which we went over doubts and improvements that he proposed. Fabricio conducted the daily meetings with the team and motivated everyone to achieve the defined goals. In less than a month and a half, they were able to launch a new application and present it to beta users! I highly recommend him to any team looking for a warm, dedicated, and nice person to guide and plan projects.",
        author: "Pilar Minue",
        company: "Sr. Project Manager"
    },
    {
        text: "I had the privilege of working with Fabricio Agulles in the Chamber of Senators of the province of Mendoza, where he served as the Private Secretary to the Senator. During our time together, Fabricio demonstrated exceptional organizational and communicative skills. Fabricio stood out for his ability to efficiently coordinate multidisciplinary teams and maintain effective communication with stakeholders. His proactive approach and ability to adapt to challenges in an agile manner were crucial to the success of the projects we collaborated on. Fabricio Agulles is a committed and proactive leader who will undoubtedly bring significant value to any project or team he joins. I recommend Fabricio without reservation, and I am confident that he will continue to achieve new milestones in his career.",
        author: "Enzo Nicolás Vignoli",
        company: "Internationalist"
    },
    {
        text: "I had the privilege of working with Fabricio during my introduction to the world of management, and his impact on my professional development has been immeasurable. Fabri is a true expert in his field, demonstrating unwavering commitment to excellence in every project he undertakes. From day one, he showed himself as a dedicated mentor, willing to share his experience and knowledge to aid in the team's growth. In summary, Fabri is an exceptional professional and an invaluable asset to any team.",
        author: "Francisco Obaya",
        company: "Business Analytics Translator"
    },
    {
        text: "I had the pleasure of working with Fabricio on the development of LeadsCaddy, a key project for our company. From day one, he stood out for his pragmatic approach and ability to organize work efficiently. His clear and direct communication skills were essential in keeping the team aligned and meeting deadlines. He is always available to help when needed, fostering an excellent collaborative environment. On top of that, his positive attitude and great energy make working with him a real pleasure. Without a doubt, he’s a Project Manager who ensures the success of any project he’s involved in. Anyone looking to add a Project Manager to their team should definitely consider him.",
        author: "Shalom Jaskilioff",
        company: "Copywriting, SEO & UX"
    },
    {
        text: "Excelente persona, gran compromiso con todos los proyectos, súper atento y con muy buenas habilidades comunicativas.",
        author: "Pablo Depaoli",
        company: "Fullstack Developer"
    }
];

function setupTestimonialCarousel() {
    if (!testimonialCarousel) return;
    testimonialCards = Array.from(testimonialCarousel.querySelectorAll('.testimonial-card'));
    if (testimonialCards.length === 0) return;

    testimonialCards.forEach((card, index) => {
        const excerptDiv = card.querySelector('.testimonial-excerpt');
        const fullText = testimonialsData[index] ? testimonialsData[index].text : (excerptDiv ? excerptDiv.textContent : '');
        
        const isClamped = excerptDiv && (window.getComputedStyle(excerptDiv).webkitLineClamp === '5' || window.getComputedStyle(excerptDiv).display === '-webkit-box');
        if (excerptDiv) {
            if (!isClamped && fullText.length > MAX_EXCERPT_LENGTH) {
                excerptDiv.textContent = fullText.substring(0, MAX_EXCERPT_LENGTH) + "...";
            } else if (!isClamped) {
                 excerptDiv.textContent = fullText;
            }
            // Si está clamped por CSS, dejamos que CSS haga su trabajo.
            // Si no, y es corto, mostramos el texto completo o el texto original del div.
        }


        const openModalButton = card.querySelector('.open-testimonial-modal-button');
        if (openModalButton) {
            openModalButton.addEventListener('click', () => {
                // currentTestimonialIndex ya debería estar actualizado por el scroll/click del carrusel principal
                // pero lo reconfirmamos desde el data-attribute por si acaso
                const clickedIndex = parseInt(openModalButton.dataset.testimonialIndex);
                currentTestimonialIndex = clickedIndex; // Aseguramos que el índice global esté correcto
                openTestimonialIndividualModal(currentTestimonialIndex);
            });
        }
    });

    function updateTestimonialView(smooth = true) {
        // Asegurarse de que currentTestimonialIndex esté dentro de los límites
        if (currentTestimonialIndex < 0) currentTestimonialIndex = 0;
        if (currentTestimonialIndex >= testimonialCards.length) currentTestimonialIndex = testimonialCards.length - 1;
        
        if (testimonialCards.length > 0 && testimonialCards[currentTestimonialIndex]) {
            const cardToScroll = testimonialCards[currentTestimonialIndex];
            const carouselWidth = testimonialCarousel.offsetWidth;
            const cardLeft = cardToScroll.offsetLeft;
            const cardWidth = cardToScroll.offsetWidth;
            const paddingLeft = testimonialCarousel.paddingLeft ? parseFloat(getComputedStyle(testimonialCarousel).paddingLeft) : 0;
            const targetScrollLeft = cardLeft - (carouselWidth / 2) + (cardWidth / 2) - paddingLeft;
            testimonialCarousel.scrollTo({ left: targetScrollLeft, behavior: smooth ? 'smooth' : 'auto' });
        }
        updateTestimonialControls();
        updateTestimonialIndicators();
    }

    function updateTestimonialControls() {
        if (prevTestimonialButton) prevTestimonialButton.disabled = currentTestimonialIndex === 0;
        if (nextTestimonialButton) nextTestimonialButton.disabled = currentTestimonialIndex >= testimonialsData.length - 1;
    }

    function updateTestimonialIndicators() {
        if (!testimonialIndicatorsContainer) return;
        testimonialIndicatorsContainer.innerHTML = '';
        testimonialsData.forEach((_, index) => { // Usar testimonialsData.length para los indicadores
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
                updateTestimonialView(true);
            });
            testimonialIndicatorsContainer.appendChild(button);
        });
    }
    
    function determineActiveCardOnScroll() {
        clearTimeout(testimonialScrollTimeout);
        testimonialScrollTimeout = setTimeout(() => {
            if (!testimonialCarousel || testimonialCards.length === 0) return;
            const carouselRect = testimonialCarousel.getBoundingClientRect();
            const carouselCenterPoint = carouselRect.left + (carouselRect.width / 2);
            let closestIndex = 0;
            let minDistance = Infinity;

            testimonialCards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                if (!cardRect.width) return; // Skip if card is not rendered properly
                const cardCenterPoint = cardRect.left + (cardRect.width / 2);
                const distance = Math.abs(carouselCenterPoint - cardCenterPoint);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });
            
            if (currentTestimonialIndex !== closestIndex) {
                currentTestimonialIndex = closestIndex; // Actualiza el índice global
                updateTestimonialControls();
                updateTestimonialIndicators();
            }
        }, 150); 
    }

    if (nextTestimonialButton) {
        nextTestimonialButton.addEventListener('click', () => {
            if (currentTestimonialIndex < testimonialsData.length - 1) {
                currentTestimonialIndex++;
                updateTestimonialView(true);
            }
        });
    }
    if (prevTestimonialButton) {
        prevTestimonialButton.addEventListener('click', () => {
            if (currentTestimonialIndex > 0) {
                currentTestimonialIndex--;
                updateTestimonialView(true);
            }
        });
    }
    if (testimonialCarousel) {
        testimonialCarousel.addEventListener('scroll', determineActiveCardOnScroll, { passive: true });
    }
    window.addEventListener('resize', () => {
        clearTimeout(testimonialResizeTimeout);
        testimonialResizeTimeout = setTimeout(() => {
            if (testimonialCards.length > 0) { // Solo si hay cards
                updateTestimonialView(false);
            }
        }, 250);
    });
    
    if (testimonialCards.length > 0) { // Solo si hay cards
        updateTestimonialView(false); // Initial call
    } else { // Si no hay cards, ocultar controles
         if (prevTestimonialButton) prevTestimonialButton.style.display = 'none';
         if (nextTestimonialButton) nextTestimonialButton.style.display = 'none';
         if (testimonialIndicatorsContainer) testimonialIndicatorsContainer.style.display = 'none';
    }
}
// --- END Testimonial Carousel Logic (Principal) ---

// --- START Testimonial Individual Modal Functions ---
function loadTestimonialInModal(index) {
    if (!testimonialsData[index] || !modalTestimonialText || !modalTestimonialAuthor || !modalTestimonialCompany) {
         console.error("Error loading testimonial data or modal elements for index:", index);
         return;
    }

    const testimonial = testimonialsData[index];
    modalTestimonialText.textContent = testimonial.text;
    modalTestimonialAuthor.textContent = testimonial.author;
    modalTestimonialCompany.textContent = testimonial.company;

    if (modalIndividualPrevButton) modalIndividualPrevButton.disabled = index === 0;
    if (modalIndividualNextButton) modalIndividualNextButton.disabled = index >= testimonialsData.length - 1;
    
    const modalContentArea = document.getElementById('testimonial-individual-modal-content');
    if (modalContentArea) {
        modalContentArea.scrollTop = 0;
    }
}

function openTestimonialIndividualModal(index) {
    if (!testimonialIndividualModal) return;
    if (index < 0 || index >= testimonialsData.length) {
        console.error("Invalid index for opening testimonial modal:", index);
        return;
    }
    currentTestimonialIndex = index; 
    loadTestimonialInModal(index);
    testimonialIndividualModal.classList.remove('hidden');
    setTimeout(() => testimonialIndividualModal.classList.remove('opacity-0'), 10);
    document.body.style.overflow = 'hidden';
}

function closeTestimonialIndividualModal() {
    if (!testimonialIndividualModal) return;
    testimonialIndividualModal.classList.add('opacity-0');
    setTimeout(() => {
        testimonialIndividualModal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

if (closeIndividualModalButton) {
    closeIndividualModalButton.addEventListener('click', closeTestimonialIndividualModal);
}
if (testimonialIndividualModal) {
     testimonialIndividualModal.addEventListener('click', (event) => {
        if (event.target === testimonialIndividualModal) {
            closeTestimonialIndividualModal();
        }
    });
}

if (modalIndividualNextButton) {
    modalIndividualNextButton.addEventListener('click', () => {
        if (currentTestimonialIndex < testimonialsData.length - 1) {
            currentTestimonialIndex++;
            loadTestimonialInModal(currentTestimonialIndex);
            
            if (testimonialCards.length > 0 && testimonialCards[currentTestimonialIndex]) {
                 const mainCarouselCard = testimonialCards[currentTestimonialIndex];
                 const carouselWidth = testimonialCarousel.offsetWidth;
                 const cardLeft = mainCarouselCard.offsetLeft;
                 const cardWidth = mainCarouselCard.offsetWidth;
                 const paddingLeft = testimonialCarousel.paddingLeft ? parseFloat(getComputedStyle(testimonialCarousel).paddingLeft) : 0;
                 const targetScrollLeft = cardLeft - (carouselWidth / 2) + (cardWidth / 2) - paddingLeft;
                 testimonialCarousel.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                 updateTestimonialIndicators(); // Estas funciones ya están definidas en setupTestimonialCarousel
                 updateTestimonialControls();   // y usan el currentTestimonialIndex global
            }
        }
    });
}

if (modalIndividualPrevButton) {
    modalIndividualPrevButton.addEventListener('click', () => {
        if (currentTestimonialIndex > 0) {
            currentTestimonialIndex--;
            loadTestimonialInModal(currentTestimonialIndex);
             if (testimonialCards.length > 0 && testimonialCards[currentTestimonialIndex]) {
                 const mainCarouselCard = testimonialCards[currentTestimonialIndex];
                 const carouselWidth = testimonialCarousel.offsetWidth;
                 const cardLeft = mainCarouselCard.offsetLeft;
                 const cardWidth = mainCarouselCard.offsetWidth;
                 const paddingLeft = testimonialCarousel.paddingLeft ? parseFloat(getComputedStyle(testimonialCarousel).paddingLeft) : 0;
                 const targetScrollLeft = cardLeft - (carouselWidth / 2) + (cardWidth / 2) - paddingLeft;
                 testimonialCarousel.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                 updateTestimonialIndicators();
                 updateTestimonialControls();
             }
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (!testimonialIndividualModal || testimonialIndividualModal.classList.contains('hidden')) return;
    if (event.key === 'Escape') {
        closeTestimonialIndividualModal();
    }
    if (event.key === 'ArrowRight') {
        if (modalIndividualNextButton && !modalIndividualNextButton.disabled) {
            modalIndividualNextButton.click();
        }
    }
    if (event.key === 'ArrowLeft') {
        if (modalIndividualPrevButton && !modalIndividualPrevButton.disabled) {
            modalIndividualPrevButton.click();
        }
    }
});
// --- END Testimonial Individual Modal Functions ---

// Initialize the main carousel
// Esta llamada se hace aquí, dentro del DOMContentLoaded,
// porque setupTestimonialCarousel y las funciones del modal ahora están definidas en este ámbito.
setupTestimonialCarousel();
});   
