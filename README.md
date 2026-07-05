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

Nav: **Home · About · Services · Partnerships · Contact** (plus a "Get in touch" button).

## What NymaMar does (for context)

People- and expertise-led maritime company. Five service areas: **Mentoring & Coaching**, **Academic & Industry Engagement**, **Environmental & Decarbonization**, **Representations**, and **Technical Management**. Values: Respect, Empathy, Trust, Dependability, Determination — rooted in *philotimo*.

## Design system

- **Display / headings:** Archivo (700/800, tight tracking)  ·  **Body / UI:** DM Sans (400/500/600/700). Both load from Google Fonts.
- **Brand blue:** `#034A9A` (from the NYMA logo) — buttons, labels, links.
- **Quadrant pillar palette:** the four logo colours drive per-section accents via `data-pillar="maritime|sky|propulsion|people"` → navy `#034A9A`, sky `#78B4E2`, green `#5C8336`, red `#A64043` (text-safe variants used where the accent is type).
- **Core palette:** bg `#F4F6F9` · paper `#FFFFFF` · sand `#EAEEF2` · ink `#15202B` · navy `#112A43` · rule `#DCE2E8`.
- **Buttons:** bold, square corners; blue fill / outline / ghost / white variants.
- **Mobile-first:** base CSS is the phone layout, enhanced upward at 600 / 900 / 1200px. All design tokens live at the top of `css/styles.css` (`:root`).
- **Official logo:** `assets/logo-mark.svg` — the 2×2 NYMA quadrant mark (navy / sky / green / red).

## Built-in behaviours

Motion is a single dependency-free IIFE (`js/main.js`) plus CSS; **every effect degrades gracefully** under `prefers-reduced-motion` and with JS off.

- **Cinematic full-bleed hero** — photo settles in on load and parallaxes on scroll, under a directional gradient; the headline wipes up on reveal.
- **Scroll reveals** — clip-wipe headings + staggered content as sections enter view.
- **Living partner marquee** on the Home "Representations" band; **scroll-progress bar**; **image service cards** with hover zoom; **framed, height-capped split photos** with a pillar accent and parallax.
- **Sticky header** (transparent over the hero → solid on scroll) + full-screen mobile menu (scroll-lock, Escape, focus trap).
- **Full-bleed imagery** across the site, using the client's real maritime photography.
- Fully responsive (desktop / tablet / mobile), verified **zero horizontal overflow**.

## ⚠️ Open items to confirm with the client

- **Partner college name/logo:** approved copy names *Business College of Athens (BCA)*, but its use is **pending BCA's written confirmation** — currently shown as "a leading Athens-based business college." Swap back once confirmed.
- **Services "Environmental & Decarbonization":** Notion titles this section *"Efficient Management Representations"* (a likely copy/paste error). Shown here with the content-accurate heading — please confirm.
- **Representation partners** (`partnerships.html`): **Supersoar Marine** is the confirmed new partner (propulsion & steering-gear components, China) — brand assets still to follow. **HSQE** (compliance) and **Crewing** (manning) are generic until final names/logos are provided.
- **Team bios** — placeholder section ready on `who-we-are.html`; individual profiles to be added.
- **Contact details:** `email@nymamar.com` is still a placeholder and **LinkedIn** is to be provided (the street address and landline are real).

## Moving this into Squarespace

1. Set fonts (Archivo + DM Sans), colours and heading sizes in *Design → Site Styles*.
2. Recreate each section with Fluid Engine blocks, using this mockup as the visual target; reproduce the motion with a little Code Injection where needed.
3. Use a **Form Block** for the contact form (Name, Company, Email, Subject dropdown, Message).
4. Keep `/ai-context` unlinked with a `noindex` tag (already in the HTML).

See `CLAUDE.md` for the working conventions (nav/footer duplication, quadrant pillar system, copy rules).

---

*Mockup generated as the design reference for the NymaMar Squarespace build.*
