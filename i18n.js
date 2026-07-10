// i18n: toggle ES/EN sin recarga.
// El español vive inline en index.html y se captura del DOM al primer cambio de
// idioma (esCache), así solo hay que mantener este diccionario EN.
// Los valores pueden incluir markup inline (<strong>, <li>, <i>) porque se
// aplican con innerHTML; ningún nodo data-i18n contiene elementos con listeners
// propios más allá del propio nodo.
(function () {
    'use strict';

    const EN = {
        // Navegación
        'nav.home': 'Home',
        'nav.about': 'About Me',
        'nav.services': 'Services',
        'nav.projects': 'Projects',
        'nav.experience': 'Experience',
        'nav.testimonials': 'Testimonials',
        'nav.contact': 'Contact',

        // Hero
        'hero.location': 'Mendoza, Argentina · Remote',
        'hero.tagline': 'AI agents & automation that transform your operations',
        'hero.description': 'I build conversational AI agents and end-to-end automations. With 6+ years leading IT projects, I founded t2xLabs to help companies scale with artificial intelligence and cut operating costs.',
        'hero.cta.projects': 'View My Projects',
        'hero.cta.call': 'Book a Call',

        // Sobre Mí
        'about.title': 'Technology, Strategy & Execution',
        'about.p1': "I'm a Technical Project Manager with 6+ years leading multidisciplinary teams of up to 60 people on end-to-end IT projects, and Founder of t2xLabs, an automation and AI agency. I've designed and deployed conversational agents, RAG pipelines and automation systems for clients in healthcare, tax, banking, politics and logistics.",
        'about.p2': "My approach combines strategic management with hands-on technical capability: I don't just lead teams and manage stakeholders — I also design solution architectures and build the systems.",
        'about.pill.agents': 'AI Agents',
        'about.m1.title': '6+ years',
        'about.m1.desc': 'Leading end-to-end IT projects with agile methodologies',
        'about.m2.title': '26+ projects',
        'about.m2.desc': 'AI agents, web platforms and automation systems delivered',
        'about.m3.title': '5,000+',
        'about.m3.desc': 'Conversations handled by AI agents in production',
        'about.m4.title': '3 countries',
        'about.m4.desc': 'Clients in Spain, Germany and Argentina',
        'about.a1': '6+ Years in IT',

        // Servicios
        'services.title': 'Services for Your Business',
        'services.subtitle': 'AI and automation solutions that deliver measurable results',
        'services.c1.title': 'AI Agents on WhatsApp',
        'services.c1.desc': 'Agents that serve customers 24/7 on WhatsApp: inquiries, appointments and human escalation, integrated with your CRM.',
        'services.c2.title': 'Process Automation with n8n',
        'services.c2.desc': 'I automate end-to-end processes with n8n: fewer manual tasks, fewer errors and faster responses.',
        'services.c3.title': 'Technical AI Consulting',
        'services.c3.desc': 'I assess feasibility, design the architecture and stay with you until AI works in your operation.',
        'services.cta': "Let's talk about your project",

        // Proyectos
        'projects.title': 'Selected Featured Projects',
        'projects.subtitle': 'AI agents and automations in production, with measurable results.',
        'projects.viewDetails': 'View Details',
        'projects.p1.title': 'KanzleiMate AI — Tax AI Agent',
        'projects.p1.meta': 't2xLabs | Legal/Tax Sector | 2025',
        'projects.p1.desc': 'Conversational AI agent on WhatsApp for tax firms in Germany.',
        'projects.p2.banner': 'FC Barcelona Chatbot',
        'projects.p2.title': 'Moviment 42 — FC Barcelona Chatbot',
        'projects.p2.meta': 't2xLabs | Sports Sector | 2024',
        'projects.p2.desc': 'WhatsApp chatbot for an FC Barcelona presidential campaign.',
        'projects.p3.banner': 'AI Pharmacy Agent',
        'projects.p3.title': 'Panacea Health — AI Pharmacy Agent',
        'projects.p3.meta': 't2xLabs | Healthcare Sector | 2024-2025',
        'projects.p3.desc': 'Multilingual AI agent on WhatsApp for pharmaceutical inquiries.',
        'projects.p4.banner': 'AI Visualization SaaS',
        'projects.p4.title': 'DataToDashboard — AI Visualization SaaS',
        'projects.p4.meta': 'Own Project | SaaS | 2024-2025',
        'projects.p4.desc': 'SaaS platform that turns natural-language questions into data visualizations.',
        'projects.p5.title': 'Leads Caddy - AI Assistant',
        'projects.p5.meta': 'Project Lead at Xoor | 2024',
        'projects.p5.desc': 'AI-powered lead management platform.',
        'projects.p6.title': 'MCR - Logistics Platform',
        'projects.p6.desc': 'Platform and app for optimizing and monitoring logistics operations.',

        // Habilidades
        'skills.title': 'My Tools & Skills',
        'skills.ai.title': 'AI & Automation Stack',
        'skills.ai.chatwoot': '<i class="fas fa-check-circle text-green-500 mr-2"></i> Chatwoot (live chat & support)',
        'skills.ai.redis': '<i class="fas fa-check-circle text-green-500 mr-2"></i> Redis / Upstash (cache & sessions)',
        'skills.dev.title': 'Development & Infrastructure',
        'skills.dev.stripe': '<i class="fas fa-check-circle text-green-500 mr-2"></i> Stripe (payments & subscriptions)',
        'skills.pm.title': 'Project Management',
        'skills.pm.docs': '<i class="fas fa-check-circle text-green-500 mr-2"></i> Technical and functional documentation',
        'skills.soft.title': '<i class="fas fa-users mr-2"></i>Soft Skills',
        'skills.soft.s1': '<i class="fas fa-users text-primary mr-2"></i>Team Leadership',
        'skills.soft.s2': '<i class="fas fa-comments text-primary mr-2"></i>Effective Communication',
        'skills.soft.s3': '<i class="fas fa-hands-helping text-primary mr-2"></i>Stakeholder Management',
        'skills.soft.s4': '<i class="fas fa-lightbulb text-primary mr-2"></i>Problem Solving',
        'skills.soft.s5': '<i class="fas fa-chess-king text-primary mr-2"></i>Strategic Thinking',
        'skills.soft.s6': '<i class="fas fa-handshake text-primary mr-2"></i>Negotiation',
        'skills.soft.s7': '<i class="fas fa-cogs text-primary mr-2"></i>Adaptability',
        'skills.lang.title': 'Languages',
        'skills.lang.es': 'Spanish (Native)',
        'skills.lang.en': 'English (C1)',
        'skills.lang.de': 'German (B1)',

        // Experiencia
        'exp.title': 'My Professional Journey in IT',
        'exp.t2x.company': 't2xLabs | AI Automation Agency | Tarragona, Spain',
        'exp.t2x.period': 'Present',
        'exp.t2x.badge': 'Current',
        'exp.t2x.years': '2024 – now',
        'exp.t2x.range': 'since Dec 2024',
        'exp.xoor.range': 'Jul – Oct 2024<span class="md:hidden"> ·</span> <span class="md:block">4 mos</span>',
        'exp.lubee.range': 'Jun 2023 – Jun 2024<span class="md:hidden"> ·</span> <span class="md:block">1 yr 1 mo</span>',
        'exp.jula.range': 'Oct 2022 – Jul 2023<span class="md:hidden"> ·</span> <span class="md:block">10 mos</span>',
        'exp.golpe.range': 'Dec 2021 – Jan 2023<span class="md:hidden"> ·</span> <span class="md:block">1 yr 2 mos</span>',
        'exp.t2x.bullets': '<li>Founded and lead an agency specialized in <strong>AI agents and automation</strong>.</li><li>Design and development of <strong>WhatsApp conversational AI agents</strong> for B2B clients in industries such as healthcare, tax, banking, politics and sports.</li><li>Solution architecture with <strong>n8n, LLMs, RAG pipelines and the WhatsApp Business API</strong>.</li><li>Management of international clients (Germany, Spain).</li>',
        'exp.xoor.company': 'Xoor | Software Factory | Las Vegas, USA (remote)',
        'exp.xoor.bullets': '<li>Led a <strong>team of 8 people</strong> building an AI platform + chatbot that processed leads from text, audio and images.</li><li>Also served as Functional Analyst: requirements gathering, documentation and backlog definition.</li><li>Delivered the project <strong>one month ahead of schedule</strong>, enabling an extended beta with real users.</li>',
        'exp.lubee.bullets': '<li>End-to-end management of <strong>5 simultaneous teams (25 people)</strong> on web and iOS/Android app projects.</li><li>Also served as Product Owner and Scrum Master: backlog and user story management, and facilitation of agile ceremonies.</li><li>Standardized the deployment process and continuous improvement, <strong>significantly reducing production bugs</strong>.</li><li>1-on-1s and retrospectives, achieving aligned teams and long-term talent retention.</li>',
        'exp.jula.bullets': '<li>Managed <strong>12 large-scale projects</strong>, mostly for the Argentine national government (Precios Justos, ANMAC), reaching the entire population.</li><li><strong>First AI projects</strong> in Ecuador and Central America (JudIT).</li><li>End-to-end management of risks, schedules, documentation and goals.</li><li>Trained junior PMs and standardized agile methodologies.</li>',
        'exp.golpe.bullets': '<li>Budget and stakeholder requirements management.</li><li>Full lifecycle management of website and platform projects.</li><li>Team leadership and task management.</li>',

        // Educación
        'edu.title': 'Education',
        'edu.certs.title': 'Certifications & Courses',
        'edu.uni.title': 'University Education',
        'edu.uni.degree': 'Associate Degree in Business Management',
        'edu.uni.grad': 'Graduated',
        'edu.cont.title': 'Continuous Learning',
        'edu.cont.desc': 'Constant learning in technology and management.',
        'edu.cont.pill1': 'AI &amp; Automation',
        'edu.cont.pill3': 'AI-Powered Development',
        'edu.cont.pill4': 'Leadership &amp; Agile',
        'edu.cont.count': '<span class="font-semibold text-darkgray">12+</span> courses and certifications',

        // Testimonios
        'test.title': 'LinkedIn Testimonials',
        'test.readMore': 'Read more...',
        'test.prev': 'Previous',
        'test.next': 'Next',

        // Contacto
        'contact.title': 'Shall we talk about your project?',
        'contact.subtitle': "Tell me your challenge and I'll propose how to solve it with AI and automation.",
        'contact.cta': 'Book a 20-min call',
        'contact.ctaNote': 'Free, no strings attached · Via Cal.com',
        'contact.location': 'Mendoza, Argentina · Remote &nbsp;|&nbsp; t2xLabs: Tarragona, Spain',
        'contact.phones': '+54 261 534 5320 (Argentina) &nbsp;·&nbsp; +34 634 203 081 (Spain)',

        // Footer y CTA flotante
        'footer.rights': 'All rights reserved.',
        'footer.made': 'Made with',
        'floating.cta': 'Shall we talk?',

        // Modales: etiquetas comunes
        'modal.role': '<strong class="text-darkgray">My Role & Contribution:</strong>',
        'modal.stackLabel': '<strong class="text-darkgray">Tech Stack:</strong>',
        'modal.resultsLabel': '<strong class="text-darkgray">Results:</strong>',
        'modal.methodsLabel': '<strong class="text-darkgray">Methodologies & Technologies:</strong>',
        'modal.close': 'Close',

        // Modal KanzleiMate
        'mk.title': 'KanzleiMate AI — AI Agent for Tax Firms',
        'mk.client': '<strong class="text-darkgray">Client/Company:</strong> Steuerkanzlei (Tax Firm) — Germany',
        'mk.sector': '<strong class="text-darkgray">Industry:</strong> Legal / Tax',
        'mk.challenge': '<strong class="text-darkgray">The Challenge:</strong> Build an intelligent conversational WhatsApp agent able to handle client inquiries for a German tax firm, manage appointments, handle DSGVO (GDPR) consent and escalate complex cases to the human team in a structured way.',
        'mk.role': '<li>Design of the full architecture: 7-state state machine, escalation logic, session management.</li><li>Development of the conversational agent with n8n, integrating multiple services.</li><li>RAG pipeline implementation with Qdrant for answers grounded in tax documentation.</li><li>Smart escalation system with sub-states and automatic summaries.</li><li>DSGVO consent management embedded in the conversational flow.</li><li>Google Calendar integration for per-user appointment management.</li><li>Testing with 43 automated test cases.</li>',
        'mk.results': '<li>Agent in production handling tax inquiries in German.</li><li>Robust 7-state state machine with smart escalation.</li><li>Significant reduction of the human team\'s workload by filtering and pre-processing inquiries.</li><li>Full DSGVO compliance.</li>',

        // Modal Moviment 42
        'mm.title': 'Moviment 42 — Chatbot for FC Barcelona',
        'mm.client': '<strong class="text-darkgray">Client/Company:</strong> Moviment 42 — FC Barcelona Presidential Campaign',
        'mm.sector': '<strong class="text-darkgray">Industry:</strong> Sports / Politics',
        'mm.challenge': '<strong class="text-darkgray">The Challenge:</strong> Build a massive, automated WhatsApp communication system to manage the relationship with FC Barcelona members, verify identities and maintain personalized communication with thousands of members simultaneously, in Catalan and Spanish.',
        'mm.role': '<li>Design and development of the bilingual (Catalan/Spanish) conversational chatbot.</li><li>3,700+ autonomous conversations with club members.</li><li>Automatic ID extraction with OpenAI Vision for identity verification.</li><li>RAG pipeline with Pinecone for contextual answers about the campaign.</li><li>Design and execution of massive WhatsApp template campaigns.</li><li>Pipedrive CRM integration: signatures, referrals and voting intention per member.</li>',
        'mm.results': '<li>90% of conversations resolved without human intervention.</li><li>97% open rate for WhatsApp messages.</li><li>~€40,000 saved versus a manual call center for the same operation.</li><li>Bilingual Catalan/Spanish system with automatic language switching.</li>',

        // Modal Panacea (el título reutiliza projects.p3.title)
        'mp.client': '<strong class="text-darkgray">Client/Company:</strong> Panacea Health',
        'mp.sector': '<strong class="text-darkgray">Industry:</strong> Healthcare / Pharmaceutical',
        'mp.challenge': '<strong class="text-darkgray">The Challenge:</strong> Build an intelligent conversational WhatsApp agent that handles pharmaceutical inquiries in three languages, automates user activation and reactivation flows, and keeps an up-to-date knowledge base through RAG.',
        'mp.role': '<li>Architecture design of the "Cea" agent with 4 main workflows (AI Agent, activation, reactivation, knowledge base updates).</li><li>Multilingual development: Spanish, Catalan and English with automatic detection.</li><li>RAG pipeline with Supabase for answers based on verified pharmaceutical information.</li><li>Infrastructure migration from Meta Cloud API to ManyChat.</li><li>GDPR documentation and Terms &amp; Conditions.</li>',
        'mp.results': '<li>Agent in production handling pharmaceutical inquiries 24/7.</li><li>Trilingual support with automatic language switching.</li><li>Significant reduction of customer support workload.</li><li>Knowledge base updatable without technical intervention.</li>',

        // Modal DataToDashboard
        'md.title': 'DataToDashboard — AI-Powered Visualization SaaS',
        'md.client': '<strong class="text-darkgray">Client/Company:</strong> Own project',
        'md.sector': '<strong class="text-darkgray">Industry:</strong> SaaS / Data Visualization / AI',
        'md.challenge': '<strong class="text-darkgray">The Challenge:</strong> Build a SaaS platform that lets non-technical users generate data visualizations by asking questions in natural language.',
        'md.role': '<li>Product design, UX/UI and full technical architecture.</li><li>Full-stack development with Next.js (frontend) and FastAPI (backend).</li><li>Subscription logic implementation with Stripe.</li><li>Performance optimization for large datasets.</li><li>Internationalization system and dark mode.</li>',
        'md.results': '<li>Functional MVP generating visualizations from natural language.</li><li>Integrated subscription and billing system.</li><li>Scalable architecture ready for growth.</li>',

        // Modal Leads Caddy (el título reutiliza projects.p5.title)
        'ml.client': '<strong class="text-darkgray">Client/Company:</strong> Xoor',
        'ml.sector': '<strong class="text-darkgray">Industry:</strong> Software Factory',
        'ml.challenge': '<strong class="text-darkgray">The Challenge:</strong> Build a platform + chatbot for automatic lead management and organization using artificial intelligence, improving the efficiency of business networking.',
        'ml.role': '<li>End-to-end leadership, from conception to deployment.</li><li>Functional analysis and product requirements definition.</li><li>Team coordination (Devs, UX/UI, QA, Copywriter).</li><li>Backlog, sprint and Scrum ceremony management.</li><li>Stakeholder communication for alignment and feedback.</li>',
        'ml.methods': 'Scrum, Jira, Telegram chatbot, Figma, Vertex AI, FE & BE.',
        'ml.results': 'Successful MVP launch in 2 months, resulting in an innovative tool for lead acquisition and management. Early users reported improved prospecting efficiency. Available in multiple languages.',

        // Modal MCR
        'mmcr.title': 'MCR - Logistics Platform',
        'mmcr.client': '<strong class="text-darkgray">Client/Company:</strong> MCR Soluciones Logísticas',
        'mmcr.sector': '<strong class="text-darkgray">Industry:</strong> Logistics & Transportation',
        'mmcr.challenge': '<strong class="text-darkgray">The Challenge:</strong> Implement a TMS (Transportation Management System) to optimize fleet, route and delivery management, reducing costs and improving operations visibility on both the platform and the app.',
        'mmcr.role': '<li>Full project management of the TMS development.</li><li>Stakeholder requirements gathering.</li><li>Management of integrations with existing systems.</li><li>Team leadership (Devs, QA, UX/UI, FA, PO).</li>',
        'mmcr.methods': 'Scrum, Teams, Azure DevOps, API integrations.',
        'mmcr.results': 'TMS implementation on the web platform and iOS/Android app for drivers, achieving improved operational efficiency and reduced logistics costs for MCR.'
    };

    const STORAGE_KEY = 'portfolio-lang';
    const esCache = {};
    let currentLang = 'es';

    function applyTranslations(lang) {
        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (!(key in esCache)) esCache[key] = el.innerHTML;
            const value = lang === 'en' ? EN[key] : esCache[key];
            if (value !== undefined) {
                el.innerHTML = value;
                // El typewriter expone el texto vía aria-label; mantenerlo en sincronía
                if (el.id === 'hero-description') {
                    el.setAttribute('aria-label', el.textContent.trim());
                }
            }
        });
    }

    function updateToggles(lang) {
        document.querySelectorAll('.lang-toggle').forEach((btn) => {
            btn.textContent = lang === 'es' ? 'EN' : 'ES';
        });
    }

    function setLang(lang) {
        currentLang = lang;
        applyTranslations(lang);
        document.documentElement.lang = lang;
        updateToggles(lang);
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) { /* modo privado / storage bloqueado */ }
        document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    }

    window.i18n = {
        get lang() { return currentLang; },
        setLang,
        toggle() { setLang(currentLang === 'es' ? 'en' : 'es'); }
    };

    // Este listener corre antes que el de index.js (i18n.js se carga primero),
    // así el typewriter lee el texto ya traducido si el idioma guardado es EN.
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.lang-toggle').forEach((btn) => {
            btn.addEventListener('click', () => window.i18n.toggle());
        });
        let saved = null;
        try {
            saved = localStorage.getItem(STORAGE_KEY);
        } catch (e) { /* ignorar */ }
        if (saved === 'en') {
            setLang('en');
        } else {
            updateToggles('es');
        }
    });
})();
