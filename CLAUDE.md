# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A **hand-coded static HTML/CSS/JS mockup** for the NymaMar website (an Athens-based Greek maritime company). It is a **design reference**, not the production site — the approved design is later rebuilt in **Squarespace (Fluid Engine)**. There is **no framework, no build step, no package.json, no tests**. Keep changes Squarespace-portable (avoid effects that can't be reproduced with Squarespace blocks + a little Code Injection).

## Commands

```bash
# Preview locally (no build needed)
python3 -m http.server 8000          # then open http://localhost:8000
# or just open index.html in a browser

# Deploy: there is no deploy step — pushing to main IS the deploy.
git push origin main                  # GitHub Pages auto-rebuilds in ~1–2 min
```

- **`gh` lives at `~/.local/bin/gh`** (not on PATH; prefix with `export PATH="$HOME/.local/bin:$PATH"`). Authed as GitHub user **thecommercegr**.
- **Live preview link:** https://thecommercegr.github.io/nymamar-website/ (GitHub Pages, served from `main` / root). The repo is **public** because Pages requires that on the free plan. `robots.txt` is Disallow-all so the preview stays out of search engines.

## Architecture

**No templating — every page is a complete, standalone HTML document.** `index.html`, `who-we-are.html` (the "About" page), `services.html`, `partnerships.html`, `contact.html`, and `ai-context.html` each duplicate the full `<head>`, `<header>` nav, and `<footer>`.
→ **Any change to the nav or footer must be made in all six files.** Likewise the Google Fonts `<link>` and stylesheet link are repeated per page. The `<head>`, header, and footer are byte-identical across the six files (except the per-page `<title>`/meta and the `aria-current="page"` nav marker).

- **`css/styles.css`** is the single source of design truth and is **mobile-first**: base rules are the phone layout, enhanced upward with `@media (min-width: 600px | 900px | 1200px)`. No `max-width` queries except `prefers-reduced-motion`. All design tokens are CSS custom properties under `:root` (palette, quadrant pillar colors, fonts, fluid type scale, spacing, `--header-h`/`--subnav-h`). Component classes are namespaced and commented in sections (hero, `.quad` motif, `.scard` image cards, `.feature` rows, `.values`, `.pcard` partner cards, course line, footer, etc.).
- **Quadrant pillar system:** the four NYMA logo colors are exposed as `[data-pillar="maritime|sky|propulsion|people"]` which switch `--pillar` / `--pillar-text` (text-safe variants). Card accents, feature numbers, eyebrow rules, and list markers use `var(--pillar)`. Pillar-to-service mapping is intentionally behind data attributes so it can be remapped in one place (awaiting a final client/PM confirmation).
- **`js/main.js`** is one IIFE: adds `html.js` first (so no-JS/pre-JS content stays visible), sticky/solid header, mobile nav (scroll-lock, Escape, focus trap, `aria-expanded`), `.reveal` scroll-in + the voyage course-line draw (shared IntersectionObserver), services sub-nav active state + auto-scroll, footer year, and the mockup contact form. No dependencies.
- **`assets/logo-mark.svg`** is the official 2×2 NYMA quadrant mark (navy/sky/green/red). Its four glyphs (N, waves, pinwheel, person) are re-drawn as small `currentColor` SVGs in `assets/graphics/` and inlined into the homepage quadrant tiles.

### Page-level conventions (wired up by `js/main.js` / CSS)
- `.reveal` (+ optional `.d1`/`.d2` delay classes) → fades element in on scroll. **The hidden state and the `.is-in` reveal are both scoped to `html.js`** so JS-off shows everything AND `.is-in` out-specifies the hidden rule (do not drop the `html.js` prefix from `.is-in`, or content stays at `opacity:0`).
- `data-pillar` on a section/card/tile → sets that block's accent color (see quadrant pillar system above).
- `.course` (voyage course line) draws on scroll via the same observer; static under `prefers-reduced-motion` and no-JS.
- `.fullbleed` → breaks an element out to full viewport width. **It must stay transform-free** (`margin-inline: calc(50% - 50vw)`); a `transform` here collides with `.reveal`'s transform and breaks the layout.
- The mobile nav panel is a `position:fixed` descendant of the header — **do not put `backdrop-filter`/`filter`/`transform` on `.site-header`**, or it becomes the nav's containing block and the full-screen panel collapses to header height.
- `ai-context.html` is intentionally **unlinked from nav and `noindex`** — a GEO/AI-readability page with JSON-LD. Keep it out of the nav.

## Content & copy rules

- **All page copy is client-approved** content from the Notion "Website Content — Pages for NymaMar Review" pages. The visual design system (**Archivo** display + **DM Sans** body, quadrant palette) traces to the official logo and the Notion "Squarespace Build Log — NymaMar". (The display face was changed from Lexend Giga to **Archivo** in July 2026, per client feedback that the earlier titles read too soft; Archivo loads from Google Fonts in each page `<head>`.) **Do not invent body copy** — pull approved text; flag gaps. (Note: there is no numeric stats band — a display-size stats band was intentionally skipped because no client-approved figures exist yet.)
- **No em-dashes (—) in body copy** — the client finds them "AI-feeling." Use commas/colons/rewording instead. Exceptions kept on purpose: page `<title>` tags, the `01 — Service` labels, and date ranges (`2024–2025`, en-dash). Do not strip hyphens in real words (`third-party`, `ship-to-shore`).
- **"Business College of Athens (BCA)"** name/logo is withheld pending BCA's written confirmation — currently rendered as "a leading Athens-based business college."
- On the Services page, the section whose Notion heading reads *"Efficient Management Representations"* is rendered with its content-accurate heading **"Environmental & Decarbonization"** (the Notion heading is a known copy/paste error).
- Known placeholders awaiting client input: team bios, representation-partner details, final contact email (`email@nymamar.com`), LinkedIn URL. Address (30A Ifestou Str., Athens) and landline are real.

See `README.md` for the human-facing overview and the Squarespace handoff notes.
