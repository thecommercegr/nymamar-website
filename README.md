# NymaMar — Website Mockup

A minimal, editorial **maritime** website mockup for **NymaMar**, a Greece-based ship-management and representation company. This static build is the design reference to finalise *before* rebuilding the site in **Squarespace** (Utica / Fluid Engine template).

It follows the design system recorded in the Notion *Squarespace Build Log — NymaMar*.

---

## How to view it

It's plain HTML/CSS/JS — no build step, no installation.

- **Easiest:** double-click `index.html` to open it in your browser.
- Or, for a more accurate preview (so the contact form and fonts behave), run a tiny local server from this folder:
  ```
  python3 -m http.server 8000
  ```
  then open <http://localhost:8000>.

## Pages

| File | Page | Slug (for Squarespace) |
|------|------|------------------------|
| `index.html` | Home | `/` |
| `who-we-are.html` | Who We Are | `/who-we-are` |
| `what-we-do.html` | What We Do | `/what-we-do` |
| `services.html` | Services | `/services` |
| `contact.html` | Contact | `/contact` |
| `ai-context.html` | AI Context (unlinked, `noindex`) | `/ai-context` |

Navigation order matches the build log: **Home · Who We Are · What We Do · Services · Contact**.

## Design system (matches the build log)

- **Headings:** Cormorant Garamond, weight 300, letter-spacing −0.02em (H1 5rem · H2 3.2rem · H3 2.2rem · H4 1.6rem)
- **Body / UI:** DM Sans 400, line-height 1.8
- **Buttons:** DM Sans 500, letter-spacing 0.02em, **square corners** (radius 0)
- **Palette:** Background `#F8F7F4` · Text `#111111` · Navy `#1A2E44` · Warm rule `#E8E4DC` · White `#FFFFFF`

All tokens live at the top of `css/styles.css` under `:root` — change them in one place.

## Built-in behaviours

- Sticky header that is transparent over the hero and turns solid on scroll
- Animated **scroll indicator** — colour switches (white on dark / navy on light), fades as you scroll, reverses near the page bottom; **excluded** from Contact and AI-Context pages (per build log)
- Reveal-on-scroll animations, mobile menu, mockup contact form
- Fully responsive (desktop / tablet / mobile)

## ⚠️ Placeholders to confirm with the client

These mirror the open items in the build log — search the code for `TODO` / `NOTE`:

- **Contact email** `email@nymamar.com` is a placeholder — confirm the real address.
- **LinkedIn URL** not yet provided.
- **Team bios** skipped for v1 — section is built and ready to populate (`who-we-are.html`).
- **Representation partners** — placeholder section in `services.html`; needs company names/descriptions/logos.
- **BCA logo/name** — do **not** use until written confirmation from BCA.
- **Logo** — `assets/logo.svg` is a placeholder wordmark; replace with the client's `nyma_logo_horizontal.png` when supplied.
- **Hero photography** — currently editorial Unsplash maritime images (free, commercial licence). Swap for brand photography when available.

## Photography

Images are hot-linked from Unsplash (free, commercial licence). To make the site fully self-contained, download them into `assets/` and update the `src` paths. Sources used:

- Hero / cargo ship aerial — `unsplash.com/s/photos/cargo-ship`
- Engine room — `unsplash.com/s/photos/ship-engine`
- Port aerial — `unsplash.com/s/photos/shipping-port-aerial`

## Moving this into Squarespace

1. Set the **fonts, colours and heading sizes** above in *Design → Site Styles*.
2. Recreate each page section with Fluid Engine blocks, using this mockup as the visual target.
3. Use a **Form Block** for the contact form; the HTML form here is a non-functional mockup.
4. Paste the scroll-indicator script into *Settings → Advanced → Code Injection → Footer* (logic is in `js/main.js`).
5. Keep `/ai-context` **unlinked** and inject a `noindex` tag (already in the HTML head here).

---

*Mockup generated as the design reference for the NymaMar Squarespace build.*
