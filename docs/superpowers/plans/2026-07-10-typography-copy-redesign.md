# Rediseño Tipográfico (Sora+Figtree) y Pase de Copy — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar Poppins por un sistema tipográfico Sora (titulares) + Figtree (texto) y aplicar el pase de copy aprobado (ES + EN) según el spec `docs/superpowers/specs/2026-07-10-typography-copy-redesign-design.md`.

**Architecture:** Sitio estático de un solo `index.html` con Tailwind precompilado y **embebido inline** en `<style id="tailwind-compiled">`. El español vive inline en el HTML; el inglés en el diccionario `EN` de `i18n.js` (aplicado por `innerHTML` vía `data-i18n`). No hay framework ni tests automatizados: la verificación es por comandos `grep`, build de CSS y revisión visual en el dev server.

**Tech Stack:** HTML + Tailwind CSS 3.4 (CLI `npm run build:css`), vanilla JS, Google Fonts, Vite (solo dev server).

## Global Constraints

- **Workflow de CSS obligatorio (CLAUDE.md):** tras añadir/quitar cualquier clase Tailwind en `index.html` o `index.js`: (1) `npm run build:css`, (2) reemplazar el contenido de `<style id="tailwind-compiled">` en `index.html` con `assets/tailwind.css`.
- Fuentes exactas: `Sora:wght@600;700` y `Figtree:wght@400;500;600` desde `fonts.googleapis.com`, un solo `<link>`, `display=swap`. Poppins se elimina por completo.
- Todo copy nuevo en ES va inline en `index.html`; su traducción EN va en `i18n.js` bajo la misma clave `data-i18n`. Los textos son los del spec, verbatim.
- Prohibido tocar layout (estructura de secciones, grids, espaciados) y comportamiento JS.
- Working tree: la rama `design/improvements` tiene cambios sin commitear de la fase anterior (paleta, contacto, hero, a11y). La Task 1 los commitea primero para que los commits de tipografía queden limpios.
- Directorio de trabajo: `/Users/fabri/projects/portfolio`.

---

### Task 1: Commit del trabajo previo + fuentes y configuración base

**Files:**
- Modify: `index.html` (línea ~31: `<link>` de Google Fonts; línea ~36: `font-family` del body)
- Modify: `tailwind.config.js` (bloque `fontFamily`)

**Interfaces:**
- Produces: clase `font-display` disponible (Sora) y `font-sans`/body en Figtree, usadas por Task 2.

- [ ] **Step 1: Commitear el trabajo pendiente de la fase anterior**

```bash
git add index.html index.js i18n.js tailwind.config.js assets/tailwind.css
git commit -m "Mejoras de diseño: jerarquía de contacto, hero compacto, paleta AA y a11y

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git status --short
```
Expected: working tree limpio (sin `M` en esos 5 archivos).

- [ ] **Step 2: Reemplazar el link de Google Fonts en `index.html`**

Buscar exactamente:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```
Reemplazar por:
```html
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Figtree:wght@400;500;600&display=swap" rel="stylesheet">
```

- [ ] **Step 3: Cambiar la fuente del body en el `<style>` inline de `index.html`**

Buscar exactamente:
```css
        body {
            font-family: 'Poppins', sans-serif;
```
Reemplazar por:
```css
        body {
            font-family: 'Figtree', sans-serif;
```

- [ ] **Step 4: Actualizar `tailwind.config.js`**

Buscar exactamente:
```js
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
```
Reemplazar por:
```js
      fontFamily: {
        sans: ['Figtree', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      },
```

- [ ] **Step 5: Verificar que no queda ninguna referencia a Poppins**

```bash
npm run build:css
grep -ci poppins index.html tailwind.config.js assets/tailwind.css || echo "OK: sin Poppins"
```
Expected: `index.html:1` (solo el preflight embebido viejo, se corrige en el Step 6) y `tailwind.config.js:0`, `assets/tailwind.css:0`. Nota: `grep -c` lista el conteo por archivo; lo único aceptable distinto de 0 es el CSS embebido viejo de `index.html`.

- [ ] **Step 6: Re-embeber el CSS compilado en `index.html`**

```bash
python3 - <<'EOF'
import re
html = open('index.html').read()
css = open('assets/tailwind.css').read().strip()
new_html, n = re.subn(
    r'(<style id="tailwind-compiled">).*?(</style>)',
    lambda m: m.group(1) + css + m.group(2),
    html, count=1, flags=re.S)
assert n == 1
open('index.html','w').write(new_html)
print('embedded ok')
EOF
grep -ci poppins index.html || echo "OK: index.html sin Poppins"
grep -c "font-family:Figtree" index.html
```
Expected: `embedded ok`, luego `0`/`OK: index.html sin Poppins`, luego `1` (el preflight ahora usa Figtree).

- [ ] **Step 7: Verificación en el navegador**

Con el dev server corriendo (`preview_start` → `portfolio-dev`), recargar y comprobar:
- `preview_inspect` sobre `body` → `font-family` contiene `Figtree`.
- Sin errores en `preview_console_logs`.
Expected: body en Figtree; los titulares siguen en Figtree (aún sin `font-display`, se aplica en Task 2).

- [ ] **Step 8: Commit**

```bash
git add index.html tailwind.config.js assets/tailwind.css
git commit -m "feat: Figtree como fuente base y Sora disponible como font-display

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Aplicar Sora a titulares, métricas y UI de marca

**Files:**
- Modify: `index.html` (todos los `<h1>/<h2>/<h3>`, marca del nav, kickers, números de métricas, citas de testimonios)

**Interfaces:**
- Consumes: clase `font-display` (Sora) de Task 1.
- Produces: HTML final tipográfico sobre el que Task 3 edita solo texto (sin clases nuevas).

- [ ] **Step 1: Añadir `font-display` a todos los h1/h2/h3 por script**

```bash
python3 - <<'EOF'
import re
html = open('index.html').read()
def add(m):
    cls = m.group(2)
    if 'font-display' in cls: return m.group(0)
    return m.group(1) + 'font-display ' + cls + m.group(3)
new_html, n = re.subn(r'(<h[123][^>]*class=")([^"]*)(")', add, html)
open('index.html','w').write(new_html)
print('headings actualizados:', n)
EOF
```
Expected: `headings actualizados:` ≥ 25 (hero h1/h2, 8 h2 de sección, h3 de cards de servicios/proyectos/skills/timeline/modales).

- [ ] **Step 2: Tracking en display y títulos de sección**

Ediciones manuales (Edit tool, ocurrencia exacta):
1. Hero h1 — buscar `class="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-darkgray mb-3"` y añadir `tracking-tight` al final de la lista de clases.
2. Títulos de sección — para cada h2 cuyas clases empiecen con `font-display text-3xl font-bold` o `font-display text-4xl` (secciones: sobre-mí, servicios, proyectos, habilidades, experiencia, educación, testimonios, contacto), añadir `tracking-[-0.01em]`. Localizarlos con:
```bash
grep -n '<h2 class="font-display' index.html
```
Expected: 8-9 líneas; cada una recibe `tracking-[-0.01em]` (el hero h2/tagline NO — mantiene su tamaño menor sin tracking).

- [ ] **Step 3: Marca del nav, kickers y métricas a Sora**

Ediciones manuales exactas:
1. Nav: `<a href="#hero" class="text-2xl font-semibold text-primary">` → `<a href="#hero" class="font-display text-2xl font-semibold text-primary">`
2. Kicker hero: en `class="text-xs sm:text-sm font-semibold text-primary uppercase tracking-widest mb-2"` añadir `font-display` al inicio.
3. Kicker sobre-mí: en `class="text-sm font-semibold text-primary uppercase tracking-widest mb-3"` añadir `font-display` al inicio.
4. Métricas (4 ocurrencias): `class="text-2xl font-bold text-darkgray"` → `class="font-display text-2xl font-bold text-darkgray"` (son los `<p>` con `data-i18n="about.m1.title"` … `about.m4.title`).

- [ ] **Step 4: Quitar itálica de los testimonios**

```bash
grep -n 'italic' index.html | grep -v tailwind-compiled
```
Expected: las citas de testimonios (sección `#testimonios` y modal de testimonio). Para cada una, quitar la clase `italic` (solo la palabra `italic` en la lista de clases del `<p>` de la cita; NO tocar el CSS embebido). Verificar después:
```bash
grep -c 'class="[^"]*\bitalic\b[^"]*"' index.html
```
Expected: `0`.

- [ ] **Step 5: Rebuild + re-embeber + verificación visual**

```bash
npm run build:css
python3 - <<'EOF'
import re
html = open('index.html').read()
css = open('assets/tailwind.css').read().strip()
new_html, n = re.subn(
    r'(<style id="tailwind-compiled">).*?(</style>)',
    lambda m: m.group(1) + css + m.group(2),
    html, count=1, flags=re.S)
assert n == 1
open('index.html','w').write(new_html)
print('embedded ok')
EOF
grep -c 'font-display{font-family:Sora' assets/tailwind.css
```
Expected: `embedded ok` y `1` (la clase compilada existe).

En el preview: recargar; `preview_inspect` sobre `#hero h1` → `font-family` contiene `Sora`; recorrer 375px y 1280px con screenshots de hero, sobre-mí (métricas en Sora), servicios y testimonios (sin itálica). Si algún titular quiebra mal con Sora (más ancha que Poppins), reducir un paso de tamaño responsive en ese titular puntual y repetir este step.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/tailwind.css
git commit -m "feat: sistema tipográfico Sora para titulares, kickers y métricas

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Pase de copy ES + EN

**Files:**
- Modify: `index.html` (textos ES inline: contacto, proyectos, servicios, sobre-mí)
- Modify: `i18n.js` (claves EN correspondientes)

**Interfaces:**
- Consumes: HTML tipográfico de Task 2 (edita solo contenido de texto, no clases).
- Produces: contenido final del sitio; Task 4 solo verifica.

- [ ] **Step 1: Copys ES en `index.html`** (Edit tool, texto exacto actual → texto nuevo del spec)

1. Contacto título (`data-i18n="contact.title"`):
   `¡Conectemos y Creemos Algo Increíble!` → `¿Hablamos de tu proyecto?`
2. Contacto subtítulo (`data-i18n="contact.subtitle"`):
   `Estoy entusiasmado por conocer nuevos desafíos y explorar cómo mi experiencia puede aportar valor a tus objetivos de negocio. No dudes en contactarme.` → `Contame tu desafío y te propongo cómo resolverlo con IA y automatización.`
3. Proyectos subtítulo (`data-i18n="projects.subtitle"`):
   `Un vistazo a cómo he ayudado a empresas a alcanzar sus objetivos a través de la digitalización y la gestión de sus proyectos.` → `Agentes de IA y automatizaciones en producción, con resultados medibles.`
4. Servicios card 1 (`data-i18n="services.c1.desc"`):
   `Diseño y desarrollo de agentes conversacionales inteligentes sobre WhatsApp Business API. Atención al cliente 24/7, gestión de citas, recolección de datos y escalación inteligente con integración a CRMs y calendarios.` → `Agentes que atienden clientes 24/7 por WhatsApp: consultas, citas y escalación a humanos, integrados a tu CRM.`
5. Servicios card 2 (`data-i18n="services.c2.desc"`):
   `Automatización end-to-end de procesos de negocio: desde workflows internos hasta integraciones complejas entre plataformas. Reducí tareas manuales, errores y tiempos de respuesta con flujos inteligentes.` → `Automatizo procesos end-to-end con n8n: menos tareas manuales, menos errores y respuestas más rápidas.`
6. Servicios card 3 (`data-i18n="services.c3.desc"`):
   `Asesoramiento para integrar inteligencia artificial en tu operación. Evaluación de viabilidad, diseño de arquitectura, selección de modelos y acompañamiento en la implementación.` → `Evalúo viabilidad, diseño la arquitectura y te acompaño hasta que la IA funciona en tu operación.`
7. Sobre Mí p1 (`data-i18n="about.p1"`):
   `Soy Technical Project Manager con +6 años de experiencia liderando equipos multidisciplinarios de hasta 60 personas en proyectos IT end-to-end, y Founder de t2xLabs, agencia especializada en automatización e inteligencia artificial. He diseñado y desplegado agentes conversacionales de IA, pipelines RAG y sistemas de automatización para clientes en sectores como salud, fiscal, banca, política y logística.` → `Soy Technical Project Manager con +6 años liderando equipos multidisciplinarios de hasta 60 personas en proyectos IT end-to-end, y Founder de t2xLabs, agencia de automatización e inteligencia artificial. He diseñado y desplegado agentes conversacionales, pipelines RAG y sistemas de automatización para clientes de salud, fiscal, banca, política y logística.`

- [ ] **Step 2: Claves EN en `i18n.js`** (Edit tool, valor exacto actual → nuevo)

1. `'contact.title'`: `"Let's Connect and Build Something Amazing!"` → `'Shall we talk about your project?'`
2. `'contact.subtitle'`: valor actual completo → `"Tell me your challenge and I'll propose how to solve it with AI and automation."`
3. `'projects.subtitle'`: valor actual → `'AI agents and automations in production, with measurable results.'`
4. `'services.c1.desc'`: valor actual → `'Agents that serve customers 24/7 on WhatsApp: inquiries, appointments and human escalation, integrated with your CRM.'`
5. `'services.c2.desc'`: valor actual → `'I automate end-to-end processes with n8n: fewer manual tasks, fewer errors and faster responses.'`
6. `'services.c3.desc'`: valor actual → `'I assess feasibility, design the architecture and stay with you until AI works in your operation.'`
7. `'about.p1'`: valor actual → `"I'm a Technical Project Manager with 6+ years leading multidisciplinary teams of up to 60 people on end-to-end IT projects, and Founder of t2xLabs, an automation and AI agency. I've designed and deployed conversational agents, RAG pipelines and automation systems for clients in healthcare, tax, banking, politics and logistics."`

- [ ] **Step 3: Verificar el toggle ES↔EN en vivo**

En el preview, recargar y ejecutar con `preview_eval`:
```js
(()=>{document.querySelector('.lang-toggle').click();
return JSON.stringify({
  title: document.querySelector('[data-i18n="contact.title"]').textContent,
  s1: document.querySelector('[data-i18n="services.c1.desc"]').textContent.slice(0,40)})})()
```
Expected: `title` = `Shall we talk about your project?`, `s1` empieza con `Agents that serve customers 24/7`. Ejecutar `.click()` de nuevo y verificar que vuelve a `¿Hablamos de tu proyecto?`.

- [ ] **Step 4: Commit**

```bash
git add index.html i18n.js
git commit -m "feat: pase de copy híbrido ES/EN (contacto, proyectos, servicios, sobre-mí)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Verificación integral final

**Files:**
- Modify: ninguno salvo ajustes puntuales que surjan (mismo workflow de rebuild si tocan clases).

**Interfaces:**
- Consumes: sitio completo de Tasks 1-3.

- [ ] **Step 1: Recorrido visual completo**

Con el preview: recargar y capturar screenshots de las 8 secciones (hero, sobre-mí, servicios, proyectos, habilidades, experiencia+educación, testimonios, contacto) a 1280×800 y 375×812. Antes de cada screenshot forzar `document.querySelectorAll('.fade-in-section').forEach(e=>e.classList.add('is-visible'))`. Revisar: quiebres de línea de titulares en Sora, métricas en Sora, testimonios sin itálica, copys nuevos renderizados.

- [ ] **Step 2: Modales y consola**

Abrir un modal de proyecto (`preview_eval`: `document.querySelector('[data-modal-target="modal-kanzleimate"]').click()`), verificar título en Sora y cuerpo en Figtree. Cerrar. `preview_console_logs` nivel error → Expected: sin errores.

- [ ] **Step 3: Checklist de regresión rápida**

```bash
grep -ci poppins index.html i18n.js index.js tailwind.config.js assets/tailwind.css
grep -c 'font-display' index.html
git status --short
```
Expected: todos `0` en la primera línea (por archivo); segunda ≥ 25; tercera: working tree limpio (todo commiteado).

- [ ] **Step 4: Commit final (solo si hubo ajustes en Step 1-2)**

```bash
git add index.html assets/tailwind.css
git commit -m "fix: ajustes de quiebre de titulares tras verificación visual

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
