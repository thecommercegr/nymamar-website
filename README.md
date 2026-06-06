# NymaMar — Website Mockup

A **bold, modern maritime** website mockup for **NymaMar** — an Athens-based team of Greek shipping professionals acting as a "stepping stone" for the industry. This static build is the design reference to finalise *before* rebuilding the site in **Squarespace** (Fluid Engine).

All page copy is the **client-approved content** from the Notion *"Website Content — Pages for NymaMar Review"* pages.

---

## How to view it

Plain HTML/CSS/JS — no build step.

- **Easiest:** double-click `index.html`.
- For an accurate preview (fonts, form), run a tiny local server from this folder and open <http://localhost:8000>:
  ```
  python3 -m http.server 8000
  ```

## Pages

| File | Page | Slug (Squarespace) |
|------|------|--------------------|
| `index.html` | Home | `/` |
| `who-we-are.html` | About | `/who-we-are` |
| `services.html` | Services | `/services` |
| `contact.html` | Contact | `/contact` |
| `ai-context.html` | AI Context (unlinked, `noindex`) | `/ai-context` |

Nav: **Home · About · Services · Contact** (plus a "Get in touch" button).

## What NymaMar does (for context)

People- and expertise-led maritime company. Five service areas: **Mentoring & Coaching**, **Academic & Industry Engagement**, **Environmental & Decarbonization**, **Representations**, and **Technical Management**. Values: Respect, Empathy, Trust, Dependability, Determination — rooted in *philotimo*.

## Design system — "Bold Modern Maritime"

- **Headings:** Cormorant Garamond (500)  ·  **Body/UI:** DM Sans (400/500/600/700)
- **Accent:** strong maritime blue `#0C5FA6` (buttons, labels, links)
- **Palette:** bg `#F4F6F9` · paper `#FFFFFF` · ink `#15202B` · navy `#112A43` · rule `#DCE2E8`
- **Buttons:** bold, square corners, blue fill / outline / ghost variants
- **Type-led, uppercase section labels** with an accent rule

All tokens live at the top of `css/styles.css` (`:root`).

## Built-in behaviours

- Cinematic full-screen hero with slow **Ken Burns** image zoom
- Sticky header (transparent over hero → solid on scroll) + mobile menu
- **Image-backed service cards** with hover zoom + reveal
- **Full-bleed imagery** on every page (heroes, statement band, showcase gallery)
- Scroll-reveal animations, animated stat-counter helper, animated scroll indicator
  (excluded on Contact & AI-Context, per the build log)
- Fully responsive (desktop / tablet / mobile), verified zero horizontal overflow

## ⚠️ Open items to confirm with the client

Search the code for `TODO` / `NOTE`:

- **Partner college name/logo:** approved copy names *Business College of Athens (BCA)*, but its use is **pending BCA's confirmation** — currently shown as "a leading Athens-based business college." Swap back once confirmed.
- **Services "Environmental & Decarbonization":** Notion titles this section *"Efficient Management Representations"* (a likely copy/paste error). Shown here with the content-accurate heading — please confirm.
- **Team bios** — optional for v1; placeholder section ready (`who-we-are.html`).
- **Representation partners** — placeholder; needs company names/descriptions/logos (`services.html`).
- **Contact email** `email@nymamar.com` is still a placeholder (address & landline are real). **LinkedIn** to be provided.
- **Logo** — `assets/logo.svg` is a placeholder wordmark; replace with the real logo when supplied.
- **Photography** — editorial Unsplash images (free, commercial licence); swap for brand photography later.

## Moving this into Squarespace

1. Set fonts, colours and heading sizes in *Design → Site Styles*.
2. Recreate each section with Fluid Engine blocks, using this mockup as the visual target.
3. Use a **Form Block** for the contact form (Name, Company, Email, Subject dropdown, Message).
4. Keep `/ai-context` unlinked with a `noindex` tag (already in the HTML).

---

*Mockup generated as the design reference for the NymaMar Squarespace build.*
