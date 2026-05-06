# Brand Theme Refresh — DrRomulusMBA

A pure chromatic + typographic refresh. No layout, copy, structure, or behavior changes. All colors centralized in `src/index.css` as HSL tokens; components updated only where they use hardcoded color/font utilities.

## Scope

- ✅ Colors → official brand palette (navy / gold / cream)
- ✅ Typography → Georgia sitewide (replacing Playfair Display + Inter)
- ✅ Interactive states (hover/active/focus/disabled) remapped
- ❌ No layout, spacing, animation, copy, route, or component-structure changes

---

## 1. Token redefinition (`src/index.css`)

Convert every brand hex to HSL (Tailwind requirement) and redefine the existing `:root` tokens. The token *names* stay the same so all 84+ component files inherit the new palette automatically — no Tailwind class churn.

### Brand → HSL conversions

| Token (semantic name) | Hex | HSL |
|---|---|---|
| `--brand-navy` (primary) | #1A1A2E | `240 28% 14%` |
| `--brand-navy-deep` (footer) | #0F0F1F | `240 35% 9%` |
| `--brand-navy-body` (body text) | #2A2A40 | `240 21% 21%` |
| `--brand-gold` (accent) | #C9A84C | `43 55% 54%` |
| `--brand-cream` (page bg) | #F5F5F0 | `60 17% 95%` |
| `--brand-cream-alt` (callout bg) | #F9F9F6 | `60 23% 97%` |
| `--brand-white` | #FFFFFF | `0 0% 100%` |
| `--brand-border` | #E5E5DC | `54 18% 88%` |
| `--brand-divider-light` | #E8E8E0 | `60 17% 90%` |
| `--brand-muted` | #888899 | `240 8% 57%` |
| `--brand-footer-muted` | #666680 | `240 11% 45%` |
| `--brand-disabled` | #9999B8 | `240 19% 66%` |
| `--brand-footer-fineprint` | #555570 | `240 13% 39%` |

### Semantic tokens (remapped to brand)

```css
--background: var brand-cream             (60 17% 95%)
--foreground: var brand-navy-body         (240 21% 21%)
--card: var brand-white                   (0 0% 100%)
--card-foreground: var brand-navy-body
--popover / popover-foreground: same as card
--primary: var brand-navy                 (240 28% 14%)
--primary-foreground: var brand-gold      (43 55% 54%)   ← per spec: primary buttons text=gold
--secondary: transparent-equivalent / brand-cream-alt
--secondary-foreground: var brand-navy-body
--muted: var brand-divider-light
--muted-foreground: var brand-muted
--accent: var brand-gold
--accent-foreground: var brand-navy
--border: var brand-border
--input: var brand-border
--ring: var brand-gold
--destructive: keep current red
--gold / gold-light / gold-dark: all map to brand-gold (single accent shade per spec)
--cream: var brand-cream
--slate-deep: var brand-navy-deep
--slate-medium: var brand-navy
```

### Sidebar / footer tokens

```
--sidebar-background: brand-navy-deep
--sidebar-foreground: brand-cream
--sidebar-primary: brand-gold
--sidebar-accent: brand-navy
--sidebar-border: brand-navy
```

### Gradients & shadows

Per spec: "Do NOT use shadows or gradients that weren't already in the design." Existing gradient/shadow *tokens* are kept (so layouts don't break) but recolored to brand:

```
--gradient-hero: linear-gradient(135deg, navy-deep 0%, navy 50%, navy-deep 100%)
                 → effectively a flat-feel navy hero
--gradient-gold: solid brand-gold (collapses gradient to single color)
--gradient-card: solid brand-white
--gradient-subtle: cream → cream-alt
--shadow-* : recolor shadow tint from slate to navy-deep alpha
```

### Dark mode

Map dark theme to inverted brand: bg=navy-deep, fg=cream, primary=gold, card=navy. Same token names, brand-correct values.

---

## 2. Typography refresh

### `src/index.css`

- Remove the Google Fonts `@import` for Playfair Display + Inter (no longer needed; Georgia is system-installed).
- `body` font-family → `Georgia, "Times New Roman", serif`
- `body` line-height → `1.7`, letter-spacing → `0.02em`
- `h1, h2, h3, h4, h5, h6` font-family → Georgia
- `h1, h2` → `font-weight: 400` (normal, per spec)
- `h3` and below → keep existing semibold (spec allows bold)
- `.font-display` and `.font-body` utilities → both resolve to Georgia stack (preserves all `font-display`/`font-body` class usages without component edits)

### `tailwind.config.ts`

```ts
fontFamily: {
  display: ['Georgia', '"Times New Roman"', 'serif'],
  body: ['Georgia', '"Times New Roman"', 'serif'],
  serif:  ['Georgia', '"Times New Roman"', 'serif'],
}
```

### Eyebrow / mini-label utility

Add a new utility class `.eyebrow` in `index.css` for uppercase mini-labels:

```css
.eyebrow {
  font-family: Georgia, serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: hsl(var(--brand-gold));
}
```

(Optional adoption — existing eyebrow elements already use `text-gold` + `uppercase` + `tracking-wide`, which now inherit the brand gold automatically.)

---

## 3. Component state mapping

All component files already use semantic tokens or Tailwind brand-aware utilities (`bg-primary`, `text-gold`, `border-gold`, `bg-card`, etc.), so retoning the tokens cascades automatically. A small set of files use hardcoded `amber-*` / `slate-*` Tailwind utilities and need targeted replacement.

### `src/components/ui/button.tsx`

Variants rewritten to brand state spec:

| Variant | Resting | Hover |
|---|---|---|
| `default` (primary) | `bg-primary text-primary-foreground border-2 border-accent` | `bg-accent text-primary` |
| `outline` (secondary) | `bg-transparent border-2 border-accent text-foreground` | `bg-accent/10 text-primary` |
| `gold` | `bg-accent text-primary border-2 border-accent` | `bg-primary text-accent` |
| `hero` | `bg-primary text-primary-foreground border-2 border-accent` | `bg-accent text-primary` |
| `heroOutline` | `bg-transparent border-2 border-accent text-cream` | `bg-accent text-primary` |
| `premium` | `bg-primary text-accent border border-accent/40` | `border-accent` |
| `link` | `text-primary underline decoration-accent` | `text-accent` |

All hardcoded `amber-*` / `slate-*` / `yellow-*` references in this file → tokens.

### Files with hardcoded `amber-*` / `slate-*` utilities (replace with tokens)

Top files identified by scan (≈20 files, ~150 occurrences total):

- `src/pages/DiagnosticKit.tsx`
- `src/pages/DiagnosticKitThankYou.tsx`
- `src/pages/IncomeClarityDiagnostic.tsx`
- `src/pages/IncomeSystemsDiagnostic.tsx`
- `src/pages/ContentClarityDiagnostic.tsx`
- `src/pages/RevenueArchitectureSession.tsx`
- `src/pages/Diagnostic.tsx`
- `src/pages/Programs.tsx`
- `src/pages/About.tsx`
- `src/pages/Apply.tsx`
- `src/pages/BlogPost.tsx`
- `src/pages/Terms.tsx`, `src/pages/Privacy.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/home/HeroSection.tsx`, `AboutPreview.tsx`, `CTASection.tsx`, `TestimonialsSection.tsx`
- `src/components/dds/*.tsx`
- Admin pages flagged in scan (kept on-brand for consistency)

Replacement rules (mechanical):

```
text-amber-50            → text-cream
text-amber-500/600       → text-accent (gold)
bg-amber-500/600         → bg-accent
border-amber-500/*       → border-accent
from/to-amber-*          → from/to-accent (collapse gradients to flat accent per spec)
text-slate-900/800       → text-primary
bg-slate-900/950         → bg-primary  (or bg-[hsl(var(--slate-deep))] for footer)
text-slate-700/600       → text-foreground
text-slate-500/400       → text-muted-foreground
border-slate-*           → border-border
text-yellow-*            → text-accent
bg-yellow-*              → bg-accent
```

### Header / Nav

`src/components/layout/Header.tsx`: `bg-primary text-cream` with gold accent dividers (`border-accent`). No structural change.

### Footer

`src/components/layout/Footer.tsx`: `bg-[hsl(var(--slate-deep))]` (= navy-deep #0F0F1F). Headings `text-accent`, body `text-cream`, fine print uses new `--brand-footer-fineprint` token via `text-[hsl(var(--brand-footer-fineprint))]`.

### Hero / dark sections

Already use `--gradient-hero` (now navy-deep ↔ navy). Add 4px gold rule above/below hero headline where one already exists; spec allows but does not require adding new ones — keep existing rules, just retoned via `bg-accent`.

### Cards / panels

`bg-card border border-border` — already correct; tokens reroute to white + brand border automatically.

### Forms

`src/components/ui/input.tsx`, `textarea.tsx`, `select.tsx`: already use `border-input` + `ring-ring`. Tokens now resolve to `--brand-border` and gold ring → spec-compliant. No file edits needed.

---

## 4. Files to edit (final list)

**Core theme (2 files — drives 90% of impact):**
1. `src/index.css` — token redefinition + typography + remove font imports
2. `tailwind.config.ts` — fontFamily collapse to Georgia

**Component palette cleanup (~22 files — replace hardcoded `amber-*` / `slate-*` / `yellow-*`):**
3. `src/components/ui/button.tsx`
4. `src/components/layout/Header.tsx`
5. `src/components/layout/Footer.tsx`
6. `src/components/home/HeroSection.tsx`, `AboutPreview.tsx`, `CTASection.tsx`, `TestimonialsSection.tsx`
7. `src/components/dds/DDSHeroSection.tsx`, `DDSQuiz.tsx`, `DDSLeadForm.tsx`, etc.
8. `src/pages/DiagnosticKit.tsx`, `DiagnosticKitThankYou.tsx`, `IncomeClarityDiagnostic.tsx`, `IncomeSystemsDiagnostic.tsx`, `ContentClarityDiagnostic.tsx`, `RevenueArchitectureSession.tsx`, `Diagnostic.tsx`
9. `src/pages/About.tsx`, `Apply.tsx`, `Programs.tsx`, `BlogPost.tsx`, `Terms.tsx`, `Privacy.tsx`

**Untouched (already token-pure):** all `src/components/ui/*` shadcn primitives besides button, all admin pages that already use tokens, all hooks/edge functions/integration files.

---

## 5. Contrast verification (WCAG)

Will verify after edit; expected outcomes:

| Combo | Ratio | Pass |
|---|---|---|
| Navy #1A1A2E on Cream #F5F5F0 | ~14.8:1 | ✅ AAA |
| Navy on White | ~16:1 | ✅ AAA |
| Gold #C9A84C on Navy #1A1A2E | ~6.8:1 | ✅ AA normal |
| Gold on Cream | ~2.6:1 | ⚠️ FAIL for body text — only safe as accent (lines, icons, large text 18pt+). Spec already restricts gold to accents, so compliant. |
| Muted #888899 on Cream | ~3.4:1 | ⚠️ Large text only — current usage is metadata/captions, acceptable. |
| Disabled #9999B8 on Cream | ~2.5:1 | Disabled text is exempt from WCAG. |

Any flagged combination from automated check after build will be reported back.

---

## 6. Verification plan

After implementation:
1. Visit `/`, `/about`, `/programs`, `/apply`, `/contact`, `/blog`, `/blog/<slug>`, `/dds-framework`, `/dds-scorecard`, `/diagnostic`, `/diagnostickit`, `/income-clarity-diagnostic`.
2. Screenshot dark hero, footer, primary button (resting + hover), card surface, form input (focus state), eyebrow label.
3. Confirm no element renders with browser-default colors.
4. Report: (a) variable list, (b) pages verified, (c) contrast warnings, (d) any unmigrated hex values (expect zero).

---

## What stays exactly the same

- Every route, component file structure, prop, copy string, image, SEO tag, schema, animation, breakpoint, spacing scale.
- Functionality: chatbot, quiz, forms, GHL webhooks, admin tools, edge functions.
- Shadows and gradients: tokens kept; only their *colors* shift to brand. No new shadows or gradients introduced.
