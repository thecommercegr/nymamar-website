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
→ **Any change to the nav or footer must be made in all six files.** Likewise the Google Fonts `<link>` and stylesheet link are repeated per page. The `<head>`, header, and footer are byte-identical across the six files (except the per-page `<title>`/meta and the `aria-current="page"` nav marker). Asset links are cache-busted with `?v=5`; bump it in all six when CSS/JS change.

- **`css/styles.css`** (v3) is the single source of design truth and is **mobile-first**: base rules are the phone layout, enhanced upward with `@media (min-width: 600px | 900px | 1200px)`. No `max-width` queries except `prefers-reduced-motion`. It opens with a numbered table of contents (tokens, header/nav, hero, page hero, ticker, statement, elements quadrant, bento, network, pull quote, about/services, partnerships, contact, CTA, footer, curtain, motion). Tokens: ink/bone canvas, brand quadrant colours, fonts (`--display` Archivo variable incl. `font-stretch`, `--sans` DM Sans, `--mono` JetBrains Mono), fluid type scale, `--edge` (content-column inset), `--header-h`/`--subnav-h`. Photo frames are height-capped so images never tower on wide screens.
- **Quadrant pillar system:** the four NYMA logo colors are exposed as `[data-pillar="maritime|sky|propulsion|people"]` which switch `--pillar` / `--pillar-text` (text-safe variants). Card accents, feature numbers, eyebrow rules, and list markers use `var(--pillar)`. Pillar-to-service mapping is intentionally behind data attributes so it can be remapped in one place (awaiting a final client/PM confirmation).
- **`js/main.js`** is one IIFE (no dependencies): word splitting, the quadrant curtain (intro + page transitions), glass/auto-hiding header, mobile nav (scroll-lock, Escape, focus trap, `aria-expanded`), reveals, parallax, expanding windows, mobile quick-contact bar, inline form validation, scroll progress, services sub-nav spy, Athens clock, magnetic CTA, back-to-top, footer year and the mockup contact form. All motion is gated on `prefers-reduced-motion`.
- **`assets/logo-mark.svg`** is the official 2×2 NYMA quadrant mark (navy/sky/green/red). Its four glyphs (N, waves, pinwheel, person) are re-drawn as small `currentColor` SVGs in `assets/graphics/` and inlined into the homepage elements grid and the curtain panels (in `main.js`).

### Page-level conventions (wired up by `js/main.js` / CSS)
- **Pages were generated once from a throwaway script** (not kept in the repo); edit the HTML directly now, keeping header/footer identical across all six files.
- **`<head>` inline snippet** adds `html.js` before paint and removes it after 3s if `main.js` never set `window.__nymaBooted`, so content can't stay hidden. Keep it in every page.
- **Themes:** dark surfaces are the selector list `.hero, .phero, .section--ink, .section--ink2, .cta, .site-footer`; they swap `--fg`, `--fg-muted`, `--rule-c` and the pillar text colour (`--pillar-fg` → `--p-dark`). Light sections are `.section--bone` / `.section--paper`.
- **`html.is-ready`** is set after the curtain parts (or immediately): hero/page-hero `.intro` items (stagger via inline `--d`) and the hero `[data-split]` headline animate on it.
- **Curtain** (`.curtain`, injected by JS): first page per session plays the intro (`sessionStorage nyma-intro`); internal `.html` link clicks close it and set `nyma-nav`, the next page opens it. Skipped under reduced motion; `pageshow` handles bfcache.
- `[data-split]` → JS wraps each word (keeping inline `<em>`/`<span class="l2">`) in a mask and it rises on reveal; sets `aria-label` with the full text.
- `.reveal` (+ `.d1/.d2/.d3`) fade-up; `[data-stagger]` cascades children; **`.reveal-img` is triggered by its parent** (a fully clipped element never intersects). Hidden states and `.is-in` are both `html.js`-scoped; keep that prefix.
- `[data-parallax="0.08"]` + `data-parallax-scale` on an image inside an `overflow:hidden` frame with matching base `scale()`; travel is clamped to `(S-1)/2S`.
- `[data-expand]` (`.phero__window`) → `--p` 0→1 opens the image from the content column (`--edge`) to full-bleed.
- `[data-clock]` → live Europe/Athens HH:MM. `.magnetic` (+ `data-magnetic` strength) on the CTA orb, fine pointers only.
- **Header:** the glass lives on `.site-header::before`; it hides by changing `top` (`.is-hidden`, mirrored as `body.header-hidden` so the services `.subnav` slides to `top:0`). **Never put `transform`/`filter`/`backdrop-filter` on `.site-header` itself**: the mobile nav panel is a `position:fixed` descendant.
- **UX layer (B2B maritime best practice):** inner-page heroes carry a breadcrumb (`.crumbs`, `aria-current`); a mobile-only quick-contact bar (`.mbar`: Call + Get in touch, Email on the contact page) slides in after the hero and hides at the footer; the contact form validates inline (`.field.is-invalid` + `.field__err`, `aria-invalid`/`aria-describedby`); the services `.subnav` lives *inside* the services section so it stops sticking before the CTA; tap targets ≥ 44px; type scale deliberately restrained (headlines ≤ ~6rem hero / 3.2rem h2).
- **Home "Who we are"** presents the approved sentence as structure: lede + a `.route` of four waypoints (the "bridging the gaps between" list, quadrant-coloured) + a two-photo `.collage`. Wording is the approved copy, only re-punctuated into a list.
- `.fullbleed` must stay transform-free.
- `ai-context.html` is intentionally **unlinked from nav and `noindex`** with JSON-LD. Keep it out of the nav.

## Content & copy rules

- **All page copy is client-approved** content from the Notion "Website Content — Pages for NymaMar Review" pages. The visual design system (**Archivo** display + **DM Sans** body, quadrant palette) traces to the official logo and the Notion "Squarespace Build Log — NymaMar". (The display face was changed from Lexend Giga to **Archivo** in July 2026, per client feedback that the earlier titles read too soft. Since v3 (Oct 2026) Archivo loads as the variable font with its width axis, plus JetBrains Mono for data labels.) **Do not invent body copy** — pull approved text; flag gaps. (Note: there is no numeric stats band — a display-size stats band was intentionally skipped because no client-approved figures exist yet.)
- **No em-dashes (—) in body copy** — the client finds them "AI-feeling." Use commas/colons/rewording instead. Exceptions kept on purpose: page `<title>` tags, the `01 — Service` labels, and date ranges (`2024–2025`, en-dash). Do not strip hyphens in real words (`third-party`, `ship-to-shore`).
- **"Business College of Athens (BCA)"** name/logo is withheld pending BCA's written confirmation — currently rendered as "a leading Athens-based business college."
- On the Services page, the section whose Notion heading reads *"Efficient Management Representations"* is rendered with its content-accurate heading **"Environmental & Decarbonization"** (the Notion heading is a known copy/paste error).
- Known placeholders awaiting client input: team bios, representation-partner details, final contact email (`email@nymamar.com`), LinkedIn URL. Address (30A Ifestou Str., Athens) and landline are real.

See `README.md` for the human-facing overview and the Squarespace handoff notes.
