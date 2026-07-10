# Rediseño tipográfico y pase de copy

**Fecha:** 2026-07-10 · **Estado:** aprobado por Fabricio · **Rama:** design/improvements

## Contexto

El portfolio usa Poppins para todo (titulares, cuerpo, UI), lo que se percibe
"básico-genérico". Varios copys son largos o cliché. Este spec define un sistema
tipográfico Sora + Figtree y un pase de edición de copy sitio completo, sin
tocar layout ni comportamiento JS. Se construye sobre las mejoras ya aplicadas
en esta rama (jerarquía de contacto, hero comprimido, paleta `#0069d9`, a11y).

Decisiones del usuario:
- Tipografía: **Opción B — Sora (titulares) + Figtree (texto)**, elegida sobre
  muestras visuales con contenido real.
- Tono de copy: **híbrido** — directo en hero/servicios/proyectos/contacto,
  conversacional en Sobre Mí.
- Alcance: **Enfoque 2** — sistema tipográfico completo + pase de copy total
  (ES + EN sincronizados). Sin cambios de layout (descartado Enfoque 3).

## 1. Sistema tipográfico

**Fuentes** (Google Fonts, un solo `<link>`, `display=swap`, reemplaza a Poppins):
`Sora:wght@600;700` + `Figtree:wght@400;500;600`.

**Config Tailwind:** `fontFamily.sans` → `['Figtree', 'sans-serif']` (heredada
por todo el sitio); nueva `fontFamily.display` → `['Sora', 'sans-serif']`
(aplicada explícitamente con `font-display`).

**Escala de roles:**

| Rol | Fuente/peso | Tracking | Se aplica a |
|---|---|---|---|
| Display | Sora 700 | -0.02em, leading 1.1 | H1 del hero |
| Título de sección | Sora 700 | -0.01em | H2 de las 8 secciones |
| Subtítulo/tagline | Sora 600 | normal | Tagline hero, H3 de cards, títulos timeline |
| Kicker | Sora 600 | uppercase, tracking-widest, xs | Kicker hero, labels de sección |
| Cuerpo | Figtree 400 | normal, leading-relaxed | Párrafos, descripciones, testimonios |
| UI/meta | Figtree 500–600 | normal | Botones, nav, tags, fechas, footer |

**Detalles:**
- Números de métricas (+6 años, +26 proyectos, +5.000, 3 países) en Sora 700.
- Marca del nav ("Fabricio Agulles") en Sora 600.
- Testimonios: quitar `italic`; citas en Figtree 400; comillas decorativas
  (`fa-quote-left`) se mantienen.
- Tracking negativo solo en ≥30px (Sora se aprieta mal en tamaños chicos).
- `body { font-family }` del `<style>` inline pasa a Figtree.

## 2. Pase de copy

Cada cambio en ES (inline en `index.html`) se replica en el diccionario EN de
`i18n.js`. Textos finales:

### Contacto (directo)
- `contact.title`: "¡Conectemos y Creemos Algo Increíble!" →
  **"¿Hablamos de tu proyecto?"** / EN: **"Shall we talk about your project?"**
- `contact.subtitle`: →
  **"Contame tu desafío y te propongo cómo resolverlo con IA y automatización."**
  / EN: **"Tell me your challenge and I'll propose how to solve it with AI and automation."**

### Proyectos (directo)
- `projects.subtitle`: →
  **"Agentes de IA y automatizaciones en producción, con resultados medibles."**
  / EN: **"AI agents and automations in production, with measurable results."**

### Servicios (directo, ~20 palabras, verbo primero)
- `services.c1.desc`: →
  **"Agentes que atienden clientes 24/7 por WhatsApp: consultas, citas y escalación a humanos, integrados a tu CRM."**
  / EN: **"Agents that serve customers 24/7 on WhatsApp: inquiries, appointments and human escalation, integrated with your CRM."**
- `services.c2.desc`: →
  **"Automatizo procesos end-to-end con n8n: menos tareas manuales, menos errores y respuestas más rápidas."**
  / EN: **"I automate end-to-end processes with n8n: fewer manual tasks, fewer errors and faster responses."**
- `services.c3.desc`: →
  **"Evalúo viabilidad, diseño la arquitectura y te acompaño hasta que la IA funciona en tu operación."**
  / EN: **"I assess feasibility, design the architecture and stay with you until AI works in your operation."**

### Sobre Mí (conversacional, solo respiración)
- `about.p1` se divide en dos oraciones (mismo contenido, sin pérdida de datos):
  **"Soy Technical Project Manager con +6 años liderando equipos multidisciplinarios de hasta 60 personas en proyectos IT end-to-end, y Founder de t2xLabs, agencia de automatización e inteligencia artificial. He diseñado y desplegado agentes conversacionales, pipelines RAG y sistemas de automatización para clientes de salud, fiscal, banca, política y logística."**
  / EN: **"I'm a Technical Project Manager with 6+ years leading multidisciplinary teams of up to 60 people on end-to-end IT projects, and Founder of t2xLabs, an automation and AI agency. I've designed and deployed conversational agents, RAG pipelines and automation systems for clients in healthcare, tax, banking, politics and logistics."**
- `about.p2` queda igual.

### Se mantienen intactos
Hero (ya editado en esta rama; solo se ajusta si Sora quiebra mal alguna
línea), bullets de experiencia, testimonios (citas de terceros), botón
flotante "¿Charlamos?", formación académica.

## 3. Implementación

1. `index.html`: link de Google Fonts, `font-family` del body, clases
   `font-display`/tracking en ~25 titulares, copys nuevos, quitar `italic` de
   testimonios.
2. `tailwind.config.js`: `fontFamily.sans` y `fontFamily.display`.
3. `i18n.js`: claves EN actualizadas (contact.title, contact.subtitle,
   projects.subtitle, services.c1-c3.desc, about.p1).
4. Rebuild obligatorio: `npm run build:css` + re-embebido en
   `<style id="tailwind-compiled">` de `index.html` (workflow de CLAUDE.md).

## Riesgos

- Sora es más ancha que Poppins: titulares largos pueden quebrar distinto.
  Mitigación: verificación visual por sección a 375px y 1280px; ajustar
  tamaño o quiebre donde haga falta.
- Claves i18n: si una clave EN queda desincronizada, el toggle muestra texto
  viejo. Mitigación: prueba en vivo del toggle ES↔EN.

## Testing

- Recorrido visual completo (8 secciones) en 375px y 1280px vía preview.
- Toggle ES↔EN en vivo sobre las claves modificadas.
- Modales y carruseles (tipografía dentro de modales hereda de body/headings).
- Sin errores de consola.

## Fuera de alcance

Cambios de layout, migración de imágenes de imgur, grid de proyectos en
desktop (pendientes de la crítica original, para un ciclo posterior).
