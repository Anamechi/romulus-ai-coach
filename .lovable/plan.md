Rebuild the homepage at `/` as a high-end, editorial publication-style page. Replace the existing hero, about preview, testimonials, and CTA sections entirely. Keep the global Header, Footer, Layout, SEO, and JSON-LD untouched.

## Assets

- Save the uploaded book image to `src/assets/systems-before-scale-book.png` and import it as an ES module.
- Reuse existing portraits already in `src/assets/`:
  - Hero (Section 1): `dr-romulus-hero.png`
  - Authority (Section 2): `dr-romulus-about.png` (or `dr-romulus-desk.png`, whichever reads more "teaching/thinking")
- Use no other portrait images — three total across the page, per the brief's "each image must add authority, not decoration" rule.

## Typography & color (no new fonts)

- Keep Georgia sitewide (per project memory). Achieve the editorial feel through:
  - Larger H1 sizes (clamp ~64–96px), normal weight, tight tracking
  - Italic small-caps tagline with wide letter-spacing (~0.35em)
  - Generous whitespace, narrow measure for body copy (~58ch)
- Use only the existing brand tokens: navy `#1A1A2E`, cream `#F5F5F0`, white `#FFFFFF`, gold `#C9A84C` (hairlines, 1px rules, small marks only).
- Sharp edges — override the rounded look on the hero CTA by passing `rounded-none` to the existing `Button` component (no changes to `button.tsx`). No shadows, no gradients, no orbs, no glows.

## CTAs (per user decision)

- Hero: primary `Get the Checklist` (navy fill, cream text, sharp edges) → `https://checklist.drromulusmba.com/`; secondary `Work With Me` (outline, navy text) → `/contact`.
- Closing section: same pair, centered.
- Use the existing `Button` component with `variant="default"` (primary) and `variant="outline"` (secondary), plus `className="rounded-none"` to enforce sharp corners.

## Sections

### Section 1 — Hero
- 60/40 grid (left text, right portrait), left-aligned, full-bleed cream bg.
- Left column:
  - Eyebrow: `DR. DEANNA ROMULUS, ED.D., MBA` — small caps, gold, tracked.
  - H1: `Dr. Romulus` — display serif, navy.
  - 1px gold horizontal rule, ~60% of column width.
  - Tagline: `SYSTEMS BEFORE SCALE` — navy, all caps, wide tracking.
  - Supporting copy: `Helping service-based founders build structural businesses that generate consistent, predictable revenue.`
  - CTA pair (Checklist primary + Work With Me secondary).
- Right column: `dr-romulus-hero.png`, slight crop, no overlays/filters/floating cards/decorative orbs. Plain image with breathing room.

### Section 2 — Authority / Positioning
- 50/50 grid on white bg.
- Left text:
  - H2: `Most businesses don't have an effort problem. They have a structure problem.`
  - Body (2–3 short paragraphs): inconsistent revenue is structural; systems create predictability; introduce DDS Framework (Diagnose · Design · Scale) inline (no link, just the name).
- Right: `dr-romulus-about.png`, same restrained treatment.

### Section 3 — Method (DDS Framework)
- Cream bg, centered.
- Thin gold rule above small-caps section label `THE METHOD`.
- H2: `Diagnose. Design. Scale.`
- 3-column grid (stacks on mobile). Each column:
  - Small numeral `01 / 02 / 03` (gold, mono-ish small caps via tracking)
  - Step name (serif, navy, large)
  - 1–2 sentence description
- No icons. Thin vertical 1px gold dividers between columns on desktop.

### Section 4 — Book Feature
- 50/50 grid on white bg.
- Left: book mockup image (`systems-before-scale-book.png`), centered in column with generous padding, no shadow/effect (the mockup already has its own depth).
- Right text:
  - Eyebrow: `THE BOOK`
  - H2: `Systems Before Scale`
  - Subtext: `Why your business feels hard — and the structure that makes it predictable.`
  - CTA: `Learn More` (outline, sharp corners) → `/methodology` (closest existing route covering the framework).

### Section 5 — Closing CTA
- Centered on cream bg, generous vertical padding.
- Thin gold rule above
- H2: `If your business feels harder than it should, it's not you. It's the structure.`
- CTA pair: `Get the Checklist` (primary) + `Work With Me` (secondary), centered.

## Files to change

- `src/pages/Index.tsx` — swap section imports for the 5 new ones; keep `<SEOHead>`, `<Helmet>` JSON-LD, and `<Layout>` wrapper untouched.
- New components in `src/components/home/editorial/`:
  - `EditorialHero.tsx`
  - `AuthoritySection.tsx`
  - `MethodSection.tsx`
  - `BookSection.tsx`
  - `ClosingCTA.tsx`
- Add asset: `src/assets/systems-before-scale-book.png` (copied from upload).
- Delete unused: `src/components/home/HeroSection.tsx`, `AboutPreview.tsx`, `TestimonialsSection.tsx`, `CTASection.tsx` (the existing CTASection just wraps `ChecklistCTA`, which is still used elsewhere — only the wrapper goes).

## Out of scope

- No changes to Header, Footer, Layout, routing, SEO/JSON-LD, button variants, brand tokens, or any other page.
- No new fonts loaded; no payment, auth, or data work.
- Memory rules preserved: Georgia sitewide, gold as accent only, checklist-first CTA primary, no pricing on homepage, no school names, She/Her, Ed.D. + MBA (Finance).
