
# Embed GHL Calendar on Income Clarity Diagnostic Page

## Change

Replace the placeholder block in the "Schedule Your Session" section with the actual GoHighLevel calendar booking widget, using an iframe approach consistent with how the contact page handles GHL embeds (iframe-only, no external script tag to avoid CSS injection issues in preview).

## Technical Detail

**File:** `src/pages/IncomeClarityDiagnostic.tsx` (lines 121-125)

**Before:**
```tsx
<div className="bg-slate-800/50 rounded-xl p-12 md:p-16 border border-slate-700 text-center">
  <p className="text-slate-500 text-sm">
    [GHL CALENDAR EMBED CODE WILL BE INSERTED HERE]
  </p>
</div>
```

**After:**
```tsx
<div className="rounded-xl overflow-hidden" style={{ height: '1400px' }}>
  <iframe
    src="https://link.drromulusmba.com/widget/booking/RI6rJkfYSIJgaYsVWJGP"
    style={{ width: '100%', height: '100%', border: 'none', overflow: 'hidden' }}
    scrolling="no"
    id="RI6rJkfYSIJgaYsVWJGP_1771307168463"
    title="Book Income Clarity Diagnostic Session"
  />
</div>
```

The iframe uses a fixed `1400px` height (matching the pattern from the contact page) to maximize visibility and reduce internal scrollbars. The external `form_embed.js` script is intentionally omitted to avoid CSS injection issues in the preview environment.
