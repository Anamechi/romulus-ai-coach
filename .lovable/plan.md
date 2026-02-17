

# New Sales Funnel: Complete Income Systems Diagnostic Kit

## Summary
Create two brand-new standalone pages -- a high-converting sales page and a post-purchase delivery page -- at new routes, leaving the existing `/diagnostic` page completely untouched.

## Files to Create/Edit

| File | Action | Description |
|------|--------|-------------|
| `src/pages/DiagnosticKit.tsx` | **Create** | Standalone sales page (no Layout wrapper) |
| `src/pages/DiagnosticKitThankYou.tsx` | **Create** | Standalone post-purchase delivery page |
| `src/App.tsx` | **Edit** | Add 2 lazy imports + 2 new routes |

## Route Mapping

| Route | Component | Navigation |
|-------|-----------|------------|
| `/diagnostickit` | `DiagnosticKit` | No header/footer |
| `/diagnostickit-thank-you` | `DiagnosticKitThankYou` | No header/footer |
| `/diagnostic` | Existing -- **unchanged** | Unchanged |

## Sales Page (`/diagnostickit`) -- 7 Sections

1. **Hero** -- Headline, subheadline, authority line (Dr. Deanna Romulus, MBA), gold CTA button with `PAYMENT_URL` placeholder constant, same-tab link
2. **Who This Is For** -- 5 bullet points + muted "Not For" block
3. **Reframe** -- "Most Entrepreneurs Are Trying to Scale Chaos" with 4 punchy lines
4. **What You Get** -- 4 cards (Checklist, Video, Guide, Audio) with Lucide icons and 1-2 sentence descriptions
5. **What Happens After** -- 3-step expectation block with check icons
6. **Guarantee** -- 7-Day Clarity Guarantee with shield icon
7. **Final CTA** -- Repeat gold CTA button

## Thank You Page (`/diagnostickit-thank-you`)

1. **Hero** -- Confirmation with checkmark icon
2. **4-step delivery** -- Download checklist button placeholder, video embed placeholder, guide button placeholder, audio embed placeholder
3. **Next step** -- Subtle upsell to Income Systems Review with placeholder button
4. **Footer note** -- Minimal brand attribution

## Technical Details

- **No Layout wrapper** on either page -- standalone, distraction-free
- **Design tokens**: `bg-slate-900`, `bg-slate-800/50`, `text-white`, `text-slate-300`, `text-amber-400`, `font-display` (Playfair Display), `font-body` (Inter)
- **CTA buttons**: Existing `variant="gold"` from the button component
- **SEO**: `SEOHead` on sales page with canonical `/diagnostickit`; thank-you page gets `noindex: true`
- **Payment link**: `const PAYMENT_URL = "#PASTE_GHL_PAYMENT_LINK_HERE"` -- replace after build
- **Redirect setup**: In GHL, set redirect to `https://drromulusmba.com/diagnostickit-thank-you`
- **Existing `/diagnostic` page**: Zero changes

