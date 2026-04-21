# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Fabricio Agulles (IT Project Manager). Static site deployed to GitHub Pages at `fabriagulles.github.io/portfolio`.

## Development Commands

```bash
npm install       # Install dependencies
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
```

Requires `GEMINI_API_KEY` in `.env.local` (exposed as `process.env.API_KEY` and `process.env.GEMINI_API_KEY` via Vite).

## Architecture

This is a single-page static site with no framework — vanilla HTML/JS with Tailwind CSS via CDN:

- **index.html** — The entire site content (single large HTML file with inline styles and Tailwind classes). Written in Spanish.
- **index.js** — Client-side interactivity: mobile menu toggle, scroll animations (IntersectionObserver), modal logic for project details.
- **index.css** — Currently empty; styles are inline in HTML or via Tailwind CDN.
- **index.tsx** — Placeholder entry point (Apache-2.0 license header only).
- **vite.config.ts** — Vite config with `@` alias to root and Gemini API key injection.

External dependencies loaded via CDN: Tailwind CSS, Google Fonts (Poppins), Font Awesome icons.

## Deployment

Hosted on GitHub Pages. The `.nojekyll` file disables Jekyll processing.
