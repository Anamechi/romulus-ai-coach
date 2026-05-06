## Goal
Replace the homepage hero's right-column portrait with a refined, editorial architectural background (cream-toned column + steps) anchored to the right side. The background must whisper, never shout — text hierarchy stays: Dr. Romulus → Systems Before Scale → environment.

## Mobile-first principle
Per your direction, the design starts at mobile and scales up. The image must never compromise text legibility on small screens.

## Implementation

### 1. Generate the background image
Use AI image generation (`premium` quality) to produce a **wide 1920×1080** PNG saved to `src/assets/hero-architecture.png`.

**Prompt direction:**
- Single fluted classical stone column (Doric/Ionic, no capital visible) rising from a tiered stone base/steps, anchored on the **right** side of the frame
- Composition leaves the **left 60% empty** — soft, slightly out-of-focus cream wall
- Palette: cream `#F5F5F0`, soft warm off-white, very pale stone neutrals — no greys, no shadows darker than ~15%
- Matte limestone finish, soft natural daylight, very subtle film grain
- Background falls off softly toward the center (gentle falloff so text area is essentially flat cream)
- No people, no modern architecture, no glass, no dramatic chiaroscuro, no gradients
- Slight grounding shadow under the steps for realism — nothing harsh

QA the rendered image: confirm right-side composition, confirm left 60% is near-uniform cream, confirm no harsh contrast. Regenerate if it returns a centered or symmetrical comp.

### 2. Restructure `EditorialHero.tsx`
Convert from a 12-column grid to a **single full-bleed section with the architectural image as a CSS background** layered behind the text. Text sits in a constrained left column.

```text
Mobile (<640):  text only, no image (background: cream)
Tablet (≥640):  image visible, anchored hard-right, 35% width, opacity ~85%
Desktop (≥1024): image visible, anchored hard-right, 45-50% width, opacity 100%
```

**Approach:** Use a `<div aria-hidden>` absolutely positioned to the right with the image as `background-image`, `background-position: right center`, `background-repeat: no-repeat`, `background-size: contain` (or `cover` with right anchor). The image div is `hidden sm:block` so mobile gets pure cream + text. Add a **left-to-right cream fade overlay** (`bg-gradient-to-r from-background via-background/95 to-transparent`) behind the text column to guarantee navy headline contrast even if the image's left edge brightens.

Section becomes `relative overflow-hidden bg-background`. Text content keeps existing typography exactly as-is, just contained in `relative z-10 max-w-2xl` instead of a grid column.

### 3. Relocate the portrait
Move `dr-romulus-hero.png` (the current hero portrait) to `AuthoritySection.tsx`, replacing the `dr-romulus-about.png` currently shown there. Rationale: the hero portrait is the stronger headshot and pairs naturally with the "structure problem" statement. The displaced `dr-romulus-about.png` stays in `src/assets/` (used by About page elsewhere — no deletions).

Update the alt text to remain accurate to Dr. Romulus.

### 4. Responsive verification
After implementation, screenshot at 375px, 768px, 1024px, and 1294px to confirm:
- Mobile: clean cream, no image, text fully legible
- Tablet: column visible on right, text breathing on left, no overlap
- Desktop: full architectural composition, headline reads first

## Files touched
- **New**: `src/assets/hero-architecture.png` (AI-generated)
- **Edited**: `src/components/home/editorial/EditorialHero.tsx` (layout swap, no copy changes)
- **Edited**: `src/components/home/editorial/AuthoritySection.tsx` (swap image import + alt)

## What will NOT change
- Hero copy (eyebrow, H1, "Systems Before Scale", body, both CTAs) — pixel-identical
- Brand tokens, font, navy/gold/cream palette — no new colors
- All other sections, routes, components
- The displaced `dr-romulus-about.png` file (kept; just unreferenced in this section)

## Risks & mitigations
- **AI image returns wrong composition** → regenerate with stricter right-anchor language; fallback is to use the uploaded reference directly via `code--copy`.
- **Image bleeds under text on tablet** → cream gradient overlay on the text column eliminates contrast risk regardless of image content.
- **Mobile performance** → image is `hidden sm:block` on the background div, so mobile users never download/render it (use a CSS `@media` rule via Tailwind `sm:` background utility, not just `display:none` on a downloaded `<img>`).
