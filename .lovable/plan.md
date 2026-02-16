

# Complete Income Systems Diagnostic Kit -- Sales Page Build

## Overview
Replace the existing `/diagnostic` page with a high-converting standalone sales page (no site navigation), and create a new `/diagnostic-thank-you` post-purchase delivery page. Both pages use a deep navy + white + muted gray palette with premium typography and strong whitespace.

## Pages to Create/Modify

### 1. `/diagnostic` -- Sales Page (rewrite `src/pages/Diagnostic.tsx`)
- **No Header/Footer** -- renders without the `<Layout>` wrapper; standalone page with zero navigation distractions
- **Color palette**: Deep navy (`#0f172a` / slate-900) backgrounds, white text, muted gray (`slate-400`) secondary text, amber/gold CTA accents
- **7 sections in order:**
  1. **Hero** -- Headline, subheadline, authority line (Dr. Deanna Romulus, MBA), gold CTA button linking to GHL payment URL placeholder (same-tab, no `target="_blank"`)
  2. **Who This Is For** -- 5 bullet points + subtle "This Is Not For" block below in muted styling
  3. **Reframe** -- "Most Entrepreneurs Are Trying to Scale Chaos" with 4 short punchy lines
  4. **What You Get** -- 4 clean cards (Checklist, Video, Guide, Audio) with icons, 1-2 sentence descriptions
  5. **What Happens After** -- 3-step expectation block with check icons
  6. **Guarantee** -- 7-Day Clarity Guarantee with shield icon
  7. **Final CTA** -- Repeat CTA button with same payment link

### 2. `/diagnostic-thank-you` -- Thank You Page (create `src/pages/DiagnosticThankYou.tsx`)
- **No Header/Footer** -- standalone delivery page
- **Sections:**
  1. **Hero** -- Confirmation message with checkmark
  2. **4-step delivery** -- Download checklist (button placeholder), Watch video (embed placeholder), Review guide (button placeholder), Listen to audio (embed placeholder)
  3. **Next step** -- Subtle upsell to Income Systems Review with placeholder button
  4. **Footer note** -- Minimal brand attribution

### 3. Route Registration (`src/App.tsx`)
- Add lazy import for `DiagnosticThankYou`
- Add route `/diagnostic-thank-you`
- Existing `/diagnostic` route stays, just points to the rewritten component

## Technical Details

### File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/Diagnostic.tsx` | **Rewrite** | Full replacement with standalone sales page (no Layout wrapper) |
| `src/pages/DiagnosticThankYou.tsx` | **Create** | New post-purchase delivery page |
| `src/App.tsx` | **Edit** | Add lazy import + route for `/diagnostic-thank-you` |

### Design Tokens Used
- Backgrounds: inline `bg-slate-900`, `bg-slate-800`, `bg-white`
- Text: `text-white`, `text-slate-300`, `text-slate-400`, `text-slate-900`
- Accents: existing `variant="gold"` button, `text-amber-400`
- Typography: existing `font-display` (Playfair Display) for headlines, `font-body` (Inter) for body
- Cards: `bg-slate-800/50 border border-slate-700` for dark cards, `bg-slate-50 border border-slate-200` for light sections

### SEO
- `SEOHead` with title "Complete Income Systems Diagnostic Kit | Dr. Romulus MBA" and description targeting "income systems diagnostic for service business owners"
- `noindex: true` on the thank-you page
- Canonical URL set to `/diagnostic`

### Payment Link
- A constant `PAYMENT_URL` placeholder string (`"#PASTE_GHL_PAYMENT_LINK_HERE"`) used in both CTA buttons
- Opens in same tab (no `target="_blank"`)
- User replaces placeholder after generation

### Existing Page Preservation
- The current `/diagnostic` content is fully replaced (it was the "Income Clarity Diagnostic" booking page)
- The booking link from the old page (`https://link.drromulusmba.com/widget/booking/RI6rJkfYSIJgaYsVWJGP`) is removed since this is now a product sales page, not a booking page

