# NymaMar Redesign — Developer Task List

Goal: move the mockup from "generic editorial template" to a distinctive, contemporary site built around the NYMA quadrant identity ("we connect the elements"), **mobile-first**, and still Squarespace-portable.

## Global rules (apply to every task)

- **Mobile-first, always.** Design and verify each component at **360px width first**, then 390, 768, 1024, 1440. Base CSS = mobile; enhance with `@media (min-width: …)`. No component ships if it only looks right on desktop.
- **Six standalone HTML files.** Any change to `<head>`, header/nav, or footer must be replicated in `index.html`, `who-we-are.html`, `services.html`, `partnerships.html`, `contact.html`, `ai-context.html`.
- **Copy is client-approved.** Do not write new body copy. Section labels/microcopy (eyebrows, buttons) may be adjusted; flag anything that needs client sign-off. No em-dashes in body copy.
- **Squarespace-portable.** Only effects reproducible with Fluid Engine blocks + light Code Injection: standard CSS, one small IIFE, no libraries, no canvas/WebGL, no scroll-jacking.
- **Touch is the default input.** Nothing may be reachable only via `:hover`. Use `@media (hover: hover)` for hover-only enhancements.
- `.fullbleed` must stay transform-free (collides with `.reveal`).

---

## Phase 0 — CSS architecture: mobile-first refactor

### T0.1 Invert the media-query structure
**File:** `css/styles.css`
- Currently base styles are desktop and three `@media (max-width: …)` blocks patch downwards. Rewrite so the **base rules are the mobile layout** (single column, stacked, full-width buttons) and enhancements come in at `@media (min-width: 600px)`, `(min-width: 900px)`, `(min-width: 1200px)`.
- Every grid (`.scards`, `.stats`, `.values`, `.footer-top`, `.showcase__grid`, `.split`, `.feature`, `.contact-grid`, `.pcards`) declares its 1-column (or 2-column where appropriate) mobile form as the default, not as an override.
- **Acceptance:** no `max-width` media queries remain except `prefers-reduced-motion`; visual output at 1440px is unchanged or improved; nothing overflows horizontally at 360px.

### T0.2 Token cleanup
**File:** `css/styles.css` `:root`
- Add text-safe pillar colors (see Phase 2): `--green-text: #4A6B2B;` `--red-text: #A64043;` (red passes AA on white as-is at ~6:1; green `#5C8336` is ~4.4:1 and fails, hence the darkened text variant).
- Add a fluid type-scale set of tokens (`--fs-display`, `--fs-h2`, `--fs-h3`, `--fs-body`, `--fs-small`) so sizes are edited in one place (values in T1.2).
- Remove tokens that end up unused after the refactor.
- **Acceptance:** every color and font-size used more than once resolves to a token.

### T0.3 No-JS / pre-JS content visibility
**Files:** `js/main.js`, `css/styles.css`
- `main.js` currently relies on IntersectionObserver to reveal `.reveal` / `[data-stagger]` content; until it fires, sections are blank.
- Add `document.documentElement.classList.add('js')` as the first statement of the IIFE. Scope all hidden initial states to `html.js .reveal { … }` etc., so content is fully visible with JS off or slow.
- **Acceptance:** with JavaScript disabled, every page renders 100% of its content. With JS on, jumping mid-page via anchor never shows an empty viewport.

---

## Phase 1 — Typography reset

### T1.1 Font roles
**Files:** all six HTML `<head>`s, `css/styles.css`
- **Display (h1, h2, key numerals): Lexend Giga** (already self-hosted variable font, `assets/fonts/LexendGiga-Variable.ttf`). It is wide, so use it tight and heavy: weight 550–650, `letter-spacing: -0.03em`, `line-height: 0.98–1.05`, sentence case.
- **Body/UI: DM Sans** (kept).
- **Cormorant Garamond: removed from the type system.** Optionally keep italic only for the single pull-quote block; if kept, subset the Google Fonts request to italic 500 only. Otherwise delete the family from all `<head>`s.
- Update the Google Fonts `<link>` in all six files (DM Sans only, or DM Sans + Cormorant italic subset).
- **Acceptance:** headings across the site render in Lexend Giga; total webfont transfer < 200KB; no page requests unused font weights.

### T1.2 Mobile-first type scale
**File:** `css/styles.css`
- Lexend Giga runs wide; sizes must be tested against real headlines ("We connect the elements.") at 360px. Starting values:
  - `--fs-display: clamp(2rem, 8.5vw, 5rem);` (h1 / hero)
  - `--fs-h2: clamp(1.55rem, 5vw, 3rem);`
  - `--fs-h3: clamp(1.2rem, 3vw, 1.7rem);`
  - body `1rem` at base, `1.06rem` from 900px; `line-height: 1.7`.
- Hero h1 must fit in **max 4 lines at 360px** and never hyphenate/overflow. Adjust clamp midpoints per page if a headline breaks badly; do not add `<br>` in mobile markup.
- Eyebrow style: keep the letter-spaced uppercase label but reduce usage (see T3.2) and bump size to `0.72rem` minimum for legibility.
- **Acceptance:** screenshots at 360/768/1440 for each page; no heading wraps into orphan single words at 360px (use `text-wrap: balance` on h1/h2).

---

## Phase 2 — Color: activate the quadrant system

### T2.1 Pillar mapping
**File:** `css/styles.css` + section markup in all pages
- Map the four logo quadrants to the four service pillars and expose as data attributes:
  - `data-pillar="maritime"` → navy `--brand-navy #034A9A` (Mentoring & Coaching)
  - `data-pillar="sky"` → sky `--brand-sky #78B4E2` (Academic & Industry)
  - `data-pillar="propulsion"` → green `--brand-green #5C8336` (Technical Management / Representations)
  - `data-pillar="people"` → red `--brand-red #A64043` (People-facing services)
  - Final pillar-to-service mapping needs a 5-minute client/PM confirmation; implement behind data attributes so remapping is trivial.
- Implement via CSS custom property switching: `[data-pillar="propulsion"] { --pillar: var(--brand-green); --pillar-text: var(--green-text); }` and have card accents, feature numbers, eyebrow rules, subnav active states, and list markers use `var(--pillar)`.
- **Usage discipline:** pillar colors are *accents* (rules, numerals, tags, hover states, 2–4px bars), never full-section backgrounds. Navy remains the structural dark.
- **Contrast rules:** sky `#78B4E2` never as text on light backgrounds (decorative or on navy only); green as text only via `--green-text`; verify every new pairing ≥ 4.5:1 (normal text) / 3:1 (large text).
- **Acceptance:** all four brand colors visibly used site-wide; grep shows no hardcoded hex in components (tokens only); contrast checks documented.

### T2.2 "Connect the elements" hero/section motif (the signature concept)
**Files:** `index.html`, `css/styles.css`
- Build one homepage block that makes the logo concept literal: a **2×2 quadrant grid on mobile → 4-across from 900px**, one tile per pillar. Each tile: pillar color accent, pillar icon (extract the four glyphs from `assets/logo.svg` as separate inline SVGs), approved service title, link to the service anchor.
- Whole tile is the tap target (min height 44px, realistically full card). This block replaces the current `.scards` overlay-text cards as the primary services entry point on the homepage (see T3.3 for scard redesign elsewhere).
- Squarespace note: this is 4 linked blocks in a grid section, fully portable.
- **Acceptance:** works as 2×2 at 360px with no text truncation; each tile navigable by keyboard with visible focus.

---

## Phase 3 — Layout, composition, section fixes

### T3.1 Hero (all pages)
**Files:** all page HTML, `css/styles.css`
- Remove the Ken Burns zoom (`@keyframes kenburns` and its `animation`).
- Mobile: hero height `min-height: 100svh` is fine on index, but the h1 + lede + both CTAs must fit above the fold at 360×740; if they don't after T1.2, reduce lede to be hidden-below-fold rather than shrinking type further.
- Reduce overlay heaviness: replace the 85%→35% full-bleed wash with a bottom-weighted gradient confined to the text zone (e.g., `linear-gradient(180deg, rgba(8,20,34,0.15), rgba(8,20,34,0.78) 75%)`) so the photography reads in color.
- Page heroes (`.page-hero`): drop from 62vh to a compact banner on mobile (`min-height: 40svh`), keep 62vh from 900px.
- CTA buttons stack full-width on mobile: `.btn { width: 100%; justify-content: center; }` at base, `width: auto` from 600px.
- **Acceptance:** hero photo recognizably visible (not a dark wash) while h1/lede text sits on the ≥0.7 opacity zone; both CTAs tappable without scrolling at 360×740 on index.

### T3.2 Kill label/heading duplication
**Files:** all page HTML
- Remove the eyebrow wherever it repeats the adjacent heading ("OUR SERVICES" above "Our Services"; "LET'S WORK TOGETHER" above "Let's work together."). Keep eyebrows only where they add categorization (e.g., "01 — Service" numbering stays).
- On page heroes, prefer: eyebrow = section category, h1 = page name, never both saying the same thing.
- **Acceptance:** no section anywhere has an eyebrow whose text is a case-variant of its heading.

### T3.3 Card redesign: text off the images
**Files:** `index.html`, `services.html`, `css/styles.css`
- Rebuild `.scard` (and review `.showcase__tile`): **image on top (16:10), text in a paper-background body below**, with a 3px pillar-color top bar on the body. Delete the full-card dark gradient scrim and white-on-photo paragraph text.
- "Learn more" affordance: always visible (arrow link in card body). Delete the `opacity: 0` hover-reveal on `.scard__more`. Whole card is the link (`<a>` wrapping, or stretched-link pattern).
- Hover (desktop only, `@media (hover:hover)`): slight image scale + shadow lift, as `.pcard` already does.
- `.showcase__tile` captions: keep on-image but strengthen the bottom scrim to start at 55% height and verify the small `.k` label is ≥ 3:1; or move captions below the tiles on mobile.
- **Acceptance:** no body-size text sits on a photo anywhere on mobile; every card link reachable by tap and keyboard; images no longer dimmed by default.

### T3.4 Section rhythm and asymmetry
**Files:** all page HTML, `css/styles.css`
- Introduce two deliberate scale/composition breaks per page so the layout is not a uniform centered stack, within Fluid Engine limits:
  - Stats band: numerals at display size (Lexend Giga, `clamp(3rem, 10vw, 5.5rem)`), 2×2 on mobile.
  - One offset split section per page: text column starts higher than the image (simple `margin-top` offset from 900px; stacked normally on mobile).
- Fix the homepage navy band where the "See all partnerships" button renders **above** its paragraph: order must be heading → paragraph → button in the DOM (also fixes screen-reader order).
- **Acceptance:** DOM order = visual order everywhere; at 360px every section is a clean single column with consistent `--section-y` rhythm.

### T3.5 Wave divider removal
**Files:** `index.html` (line ~131) + any other instances, `css/styles.css`
- Delete `.wave-divider` markup and CSS site-wide. Replace with either a hard color change or the chart-line divider from Phase 6.
- **Acceptance:** grep for `wave-divider` returns nothing.

---

## Phase 4 — Imagery treatment & performance

### T4.1 One photographic treatment
**Files:** `css/styles.css`, page HTML
- Photos render full-color by default. Scrims only where text overlays (hero, showcase), bottom-weighted, defined once as a utility (`.scrim-b`).
- Delete the per-component ad-hoc gradients (`.scard::after` current version, heavy `.page-hero::after`), replacing with the utility.
- **Acceptance:** exactly one scrim definition in CSS; side-by-side before/after screenshots show photography visibly brighter.

### T4.2 Responsive images (this is the single biggest mobile-performance task)
**Files:** all page HTML, `assets/img/*`
- Every `<img>` gets explicit `width`/`height` attributes (prevents CLS).
- Generate resized variants once with a local script (e.g., `sips` or ImageMagick, committed outputs, no build step): 480w, 960w, 1600w, WebP + original JPEG fallback. Wire with `srcset`/`sizes` (`sizes="(min-width: 900px) 50vw, 100vw"` for split/feature images; `100vw` for heroes).
- Hero image per page: `fetchpriority="high"`, `loading="eager"`; everything below the fold: `loading="lazy" decoding="async"`.
- **Acceptance:** Lighthouse mobile (throttled) LCP < 2.5s on index; total image transfer for index at 360px < 900KB; CLS < 0.05.

---

## Phase 5 — Motion: delete the collection, keep one voice

### T5.1 Deletions
**Files:** `css/styles.css`, `js/main.js`, page HTML
- Remove: Ken Burns (T3.1), `.marquee` (replace partner names with a static wrapped logo/name row), `.scroll-progress` bar, the `.scroll-indicator` bead component **entirely** (it currently overlaps body text on mobile; deleting it also removes `data-dark-zone` / `data-no-indicator` plumbing from all pages and main.js).
- **Acceptance:** grep for `marquee`, `scroll-progress`, `scroll-indicator`, `kenburns`, `data-dark-zone`, `data-no-indicator` returns nothing; main.js shrinks accordingly.

### T5.2 One reveal, calmer
**Files:** `css/styles.css`
- Keep a single reveal style: `opacity 0→1, translateY(14px)→0, 0.5s`, max stagger delay 0.2s. Delete `.reveal--left/right/scale`, `.d3/.d4` deep delays.
- Honor `prefers-reduced-motion` (already present, keep).
- **Acceptance:** no element animates more than once, longer than 0.6s, or from further than 16px.

### T5.3 Signature interaction: the course line
**Files:** `css/styles.css`, `js/main.js`, `index.html`
- One memorable, portable effect: an inline SVG "voyage course line" (thin stroke, one or two waypoint dots, coordinate label) used as a section divider on the homepage. Draw-on-scroll via `stroke-dasharray`/`stroke-dashoffset` toggled by the existing IntersectionObserver; static (fully drawn) under reduced-motion and no-JS.
- Squarespace note: ships as one Code Injection snippet + SVG block. Keep total JS for this < 30 lines.
- **Acceptance:** effect runs once per page load, 60fps on a throttled mid-range phone (test at 4× CPU throttle), fully visible without JS.

---

## Phase 6 — Maritime graphic layer

### T6.1 Asset set
**Files:** new `assets/graphics/*.svg`
- Create 3–4 small SVGs from the brand world, in `--rule`-gray or pillar colors at low opacity: course/route line (T5.3), coordinate marker ("37°58'N / 23°43'E" — Athens; typeset in DM Sans), chart tick pattern, and the four logo quadrant glyphs isolated from `assets/logo.svg`.
- **Acceptance:** each SVG < 3KB, `currentColor`-driven where possible so pillar colors apply via CSS.

### T6.2 Deployment
**Files:** all page HTML, `css/styles.css`
- Use sparingly, max one graphic element per section: footer gets the coordinates line under the address; stats band gets the tick pattern as a faint background; section dividers use the course line. Never behind body text at < 900px (mobile keeps backgrounds clean).
- **Acceptance:** graphics visible on desktop, reduced or hidden on mobile where they would crowd 360px layouts; no contrast interference with text.

---

## Phase 7 — Mobile UX details

### T7.1 Navigation
**Files:** all page HTML, `js/main.js`, `css/styles.css`
- Keep the full-screen panel. Add: body scroll-lock while open (`overflow: hidden` on `body.nav-open` if not present), close on `Escape`, focus moves into the panel on open and returns to the toggle on close, `aria-expanded` kept in sync on the toggle button.
- Panel links: min 44px tap height, current-page item visually marked.
- **Acceptance:** keyboard-only user can open, traverse, and close the menu; background cannot scroll while open.

### T7.2 Touch targets & inputs
**Files:** `css/styles.css`, `contact.html`
- Audit every interactive element for ≥ 44×44px effective target (footer links, subnav items, card links). Increase padding, not font size, where short.
- Services `.subnav`: keep horizontal scroll; add `scroll-snap-type: x proximity` and edge fade masks so scrollability is discoverable; active item auto-scrolls into view (small main.js addition).
- Contact form inputs: `font-size: 16px` minimum (prevents iOS zoom — current 1rem is fine, lock it in with a comment), `autocomplete` attributes (`name`, `email`, `organization`, `tel`), and `inputmode` where relevant.
- **Acceptance:** tap-target audit (Chrome DevTools or manual) passes; iOS Safari does not zoom on field focus.

### T7.3 Sticky header on mobile
**Files:** `css/styles.css`
- Solid-state header at reduced height (~56px) on mobile from first scroll; subnav sticky offset (`top`) and `scroll-margin-top` values updated to match the real header height at each breakpoint (currently hardcoded `58px` / `120px`).
- **Acceptance:** anchored section headings are never hidden under the sticky stack at any width.

---

## Phase 8 — QA & regression (definition of done)

1. **Widths:** 360, 390, 414, 768, 1024, 1280, 1440 — no horizontal overflow, no text truncation, on all six pages.
2. **Cross-file consistency:** diff the `<head>`, header, footer blocks across all six HTML files — must be identical except title/meta/canonical.
3. **Contrast:** every text/background pair ≥ 4.5:1 (≥ 3:1 for ≥ 24px text), including text over the new lighter scrims. Spot-check with a contrast tool, not by eye.
4. **No-JS:** all content visible, nav usable (panel may degrade to visible list), form submits its mockup state.
5. **Reduced motion:** `prefers-reduced-motion` shows zero animation including course line.
6. **Keyboard:** full tab-through of each page, visible focus everywhere, logical order (DOM = visual).
7. **Performance:** Lighthouse mobile ≥ 90 performance / ≥ 95 accessibility on index and services.
8. **Copy integrity:** no em-dashes introduced into body copy; no invented copy; "BCA" still rendered as "a leading Athens-based business college"; `ai-context.html` still unlinked + noindex.
9. **Squarespace portability review:** for each new pattern, one line in the PR description stating the Fluid Engine equivalent (block type or Code Injection snippet).
10. **Deploy check:** after push to `main`, verify GitHub Pages build (~2 min) at the live preview URL on a real phone.

## Suggested implementation order

Phase 0 → 1 → 2 (foundation, biggest visual delta) → 3 → 4 → 5 → 6 → 7 → 8. Phases 0–2 land as one PR (the "new skin"), 3–5 as a second, 6–7 as a third, Phase 8 gates each merge.
