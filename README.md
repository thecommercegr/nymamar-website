# NymaMar — Website Mockup

A **cinematic, mobile-first maritime** website mockup for **NymaMar** — an Athens-based team of Greek shipping professionals acting as a "stepping stone" for the industry. This static build is the design reference to finalise *before* rebuilding the site in **Squarespace** (Fluid Engine).

All page copy is the **client-approved content** from the Notion *"Website Content — Pages for NymaMar Review"* pages.

---

## How to view it

Plain HTML/CSS/JS — no build step, no dependencies.

- **Easiest:** double-click `index.html`.
- For an accurate preview (webfonts load from Google Fonts, contact form), run a tiny local server from this folder and open <http://localhost:8000>:
  ```
  python3 -m http.server 8000
  ```

Deploy is simply `git push origin main` — GitHub Pages serves the live preview at
<https://thecommercegr.github.io/nymamar-website/> and rebuilds in ~1–2 min.

## Pages

Every page is a complete standalone HTML document (no templating — the `<head>`, header and footer are duplicated across all six).

| File | Page | Slug (Squarespace) |
|------|------|--------------------|
| `index.html` | Home | `/` |
| `who-we-are.html` | About | `/who-we-are` |
| `services.html` | Services | `/services` |
| `partnerships.html` | Partnerships & Representations | `/partnerships` |
| `contact.html` | Contact | `/contact` |
| `ai-context.html` | AI Context (unlinked, `noindex`, JSON-LD for AI/GEO) | `/ai-context` |

Nav: **About · Services · Partnerships** (each with its element's tile) + a **Get in touch** button + a menu button drawn as the logo, which opens a menu laid out as the logo's four quadrants. The footer is the logo opened into four panels.

## What NymaMar does (for context)

People- and expertise-led maritime company. Five service areas: **Mentoring & Coaching**, **Academic & Industry Engagement**, **Environmental & Decarbonization**, **Representations**, and **Technical Management**. Values: Respect, Empathy, Trust, Dependability, Determination — rooted in *philotimo*.

## Design system (v3, "Connect the elements")

- **Mood:** dark, editorial, cinematic. Deep ink canvas (`#06111F`) alternating with warm bone (`#EFEEE9`) light sections; the four NYMA quadrant colours are the only accents.
- **Type:** **Archivo** variable (weight 100–900, *width 62–125%*): heavy tight headlines, a light-weight sky-blue second line, and **expanded, tracked micro-labels**. **DM Sans** for body/UI and indices (tabular figures). Both from Google Fonts.
- **Quadrant pillar palette:** `data-pillar="maritime|sky|propulsion|people"` → navy `#034A9A`, sky `#78B4E2`, green `#5C8336`, red `#A64043`, each with text-safe light/dark variants (resolved automatically on light vs dark sections).
- **Signature pieces:** full-screen quadrant intro (first visit only); interactive 2×2 "elements" grid with a rotating ring badge at the cross; "bridging the gaps" route with a photo collage; service chapters that open on a wide photo band with the logo tile, a pinned lede and second photo, and lists as colour-marked grids.
- **Mark system:** section labels carry the logo in miniature with the section's tile lit; photos stand on a bar in their element's colour with its glyph tile; hero photos stand on the four colours.
- **Buttons:** square, solid with an arrow tile; fill wipes up on hover. A large square "Get in touch" button closes every page.
- **Mobile-first:** base CSS is the phone layout, enhanced at 600 / 900 / 1200px. Tokens live at the top of `css/styles.css`.
- **Official logo:** `assets/logo-mark.svg` (2×2 quadrant mark).

## Built-in behaviours

One dependency-free IIFE (`js/main.js`) plus CSS. **Every effect degrades** under `prefers-reduced-motion`, and with JS off (or if `main.js` fails to load) all content shows.

- **Quadrant curtain:** first page of a session plays a ~1s intro (the four brand panels form the mark, glyphs pop in, panels part like the pinwheel). Internal links close the panels, then the next page opens them.
- **Hero choreography:** photo wipes up and settles, the headline rises word by word, then the lede, buttons and the live HUD (coordinates + Athens time).
- **Scroll motion:** word-by-word heading reveals, image wipes, staggered groups, inner-page hero photos that expand from the content column to full-bleed, clamped parallax on hero photos.
- **Header:** transparent over the hero, frosted glass after scroll, hides on scroll down and returns on scroll up; full-screen mobile menu (scroll-lock, Escape, focus trap).
- **Services:** sticky pill tabs with scroll-spy; each service opens on a photo band; its lede and second photo stay pinned while the lists scroll.
- **Built for busy maritime decision makers:** restrained type scale, scannable structured lists, breadcrumbs on inner pages, a phone-only Call / Get in touch bar in the thumb zone, click-to-call and mailto everywhere, inline form validation with plain-language messages, fast (~0.5s) page transitions and a short first-visit intro.
- Responsive and verified with zero horizontal overflow at 360 / 390 / 430px; all tap targets ≥ 44px.

## ⚠️ Open items to confirm with the client

- **Partner college name/logo:** approved copy names *Business College of Athens (BCA)*, but its use is **pending BCA's written confirmation** — currently shown as "a leading Athens-based business college." Swap back once confirmed.
- **Services "Environmental & Decarbonization":** Notion titles this section *"Efficient Management Representations"* (a likely copy/paste error). Shown here with the content-accurate heading — please confirm.
- **Representation partners** (`partnerships.html`): **Supersoar Marine** is the confirmed new partner (propulsion & steering-gear components, China) — brand assets still to follow. **HSQE** (compliance) and **Crewing** (manning) are generic until final names/logos are provided.
- **Team bios** — placeholder section ready on `who-we-are.html`; individual profiles to be added.
- **Contact details:** `email@nymamar.com` is still a placeholder and **LinkedIn** is to be provided (the street address and landline are real).

## Moving this into Squarespace

1. Set fonts (Archivo + DM Sans), colours and heading sizes in *Design → Site Styles*.
2. Recreate each section with Fluid Engine blocks, using this mockup as the visual target. The motion layer (curtain, word reveals, expanding hero, mobile contact bar) is plain CSS + `js/main.js` and can go in via Code Injection.
3. Use a **Form Block** for the contact form (Name, Company, Email, Subject dropdown, Message).
4. Keep `/ai-context` unlinked with a `noindex` tag (already in the HTML).

See `CLAUDE.md` for the working conventions (nav/footer duplication, quadrant pillar system, copy rules).

---

*Mockup generated as the design reference for the NymaMar Squarespace build.*
