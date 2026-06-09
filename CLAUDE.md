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

**No templating — every page is a complete, standalone HTML document.** `index.html`, `who-we-are.html` (the "About" page), `services.html`, `contact.html`, and `ai-context.html` each duplicate the full `<head>`, `<header>` nav, and `<footer>`.
→ **Any change to the nav or footer must be made in all five files.** Likewise the Google Fonts `<link>` and stylesheet link are repeated per page.

- **`css/styles.css`** is the single source of design truth. All design tokens are CSS custom properties under `:root` (palette, fonts, spacing, easing). Change a token there to restyle the whole site. Component classes are namespaced and commented in sections (hero, `.scards` image cards, `.feature` rows, `.values`, `.showcase`, footer, etc.).
- **`js/main.js`** is one IIFE handling everything: sticky/solid header, mobile nav toggle, `.reveal` scroll-in (IntersectionObserver), the scroll indicator, `[data-count]` stat counters, footer year, and the mockup contact form. No dependencies.
- **`assets/logo.svg`** is a placeholder wordmark (real logo pending from client).

### Page-level conventions (wired up by `js/main.js` / CSS)
- `data-dark-zone` on any section over dark imagery → the scroll indicator switches to its light variant while over it.
- `<body data-no-indicator>` → hides the scroll indicator on that page (used on Contact & AI-Context).
- `.reveal` (+ optional `.d1`…`.d4` delay classes) → fades/slides element in on scroll.
- `.fullbleed` → breaks an element out to full viewport width. **It must stay transform-free** (`margin-inline: calc(50% - 50vw)`); using a `transform` here collides with `.reveal`'s transform and breaks the layout.
- `ai-context.html` is intentionally **unlinked from nav and `noindex`** — a GEO/AI-readability page with JSON-LD. Keep it out of the nav.

## Content & copy rules

- **All page copy is client-approved** content from the Notion "Website Content — Pages for NymaMar Review" pages. The visual design system (Cormorant Garamond + DM Sans, palette) traces to the Notion "Squarespace Build Log — NymaMar". **Do not invent body copy** — pull approved text; flag gaps.
- **No em-dashes (—) in body copy** — the client finds them "AI-feeling." Use commas/colons/rewording instead. Exceptions kept on purpose: page `<title>` tags, the `01 — Service` labels, and date ranges (`2024–2025`, en-dash). Do not strip hyphens in real words (`third-party`, `ship-to-shore`).
- **"Business College of Athens (BCA)"** name/logo is withheld pending BCA's written confirmation — currently rendered as "a leading Athens-based business college."
- On the Services page, the section whose Notion heading reads *"Efficient Management Representations"* is rendered with its content-accurate heading **"Environmental & Decarbonization"** (the Notion heading is a known copy/paste error).
- Known placeholders awaiting client input: team bios, representation-partner details, final contact email (`email@nymamar.com`), LinkedIn URL. Address (30A Ifestou Str., Athens) and landline are real.

See `README.md` for the human-facing overview and the Squarespace handoff notes.
