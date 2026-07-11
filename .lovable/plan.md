## Add Certified AI Consultant badge

### 1. Upload badge as Lovable Asset
- Upload `user-uploads://AI-Certification-Badge-transparent.png` via `lovable-assets` CLI → `src/assets/ai-consultant-badge.png.asset.json`.

### 2. Sitewide footer (subtle, ~64px)
**File:** `src/components/layout/Footer.tsx`
- Add badge (h-16 / 64px, transparent PNG) in an unobtrusive spot within the existing footer layout (e.g., near credentials/trust markers or aligned right on the copyright row).
- Wrap in `<img>` with alt "Certified AI Consultant — International Association of Artificial Intelligence Consultants".
- No layout restructure; only additive.

### 3. Revenue Architecture Session hero
**File:** `src/pages/RevenueArchitectureSession.tsx`
- Insert the same badge (h-16) directly under the italic byline block ("Dr. Deanna Romulus, MBA — Revenue Architect · Business Strategist / Author, Systems Before Scale™…"), left-aligned to match the hero content column.
- Small gold-tinted caption line beneath is not needed; the badge speaks for itself.

### 4. No other changes
- No new routes, no tracking changes, no design token edits, no other pages touched.
