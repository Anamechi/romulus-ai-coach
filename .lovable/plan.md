

# Link Checklist CTAs to checklist.drromulusmba.com

## Summary
Update all "Download the Checklist" / checklist-related CTAs to point to the external URL `https://checklist.drromulusmba.com` instead of the internal `/checklist` route.

## Changes

### 1. `src/components/home/CTASection.tsx` (Line 62-64)
Replace the internal `<Link to="/checklist">` with an external `<a href="https://checklist.drromulusmba.com" target="_blank" rel="noopener noreferrer">`.

### 2. `src/components/layout/Footer.tsx` (Line 14)
Update the Fundability Checklist href from `/checklist` to `https://checklist.drromulusmba.com`.

### 3. `src/pages/ChecklistThankYou.tsx` (Line 9)
Update the download URL placeholder (`#`) to `https://checklist.drromulusmba.com` so the download button on the thank-you page actually works.

### 4. No route removal
The internal `/checklist` opt-in page and `/checklist/thank-you` routes will remain intact since they serve as a lead capture funnel that saves to the leads table. The CTAs will now send users to the external checklist site directly.

