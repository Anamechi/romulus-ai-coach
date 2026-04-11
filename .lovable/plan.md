

## Plan: Update DDS Scorecard Routing + Build Two New Landing Pages

### Summary
Update the DDS Founder Scorecard to route users to different offers based on score, add `recommendedOffer` to the GHL webhook, update result messaging, and build two new distraction-free landing pages.

### Changes

#### 1. Update Scorecard Result Logic (`src/pages/DDSScorecard.tsx`)
- Replace the single Diagnostic Kit link with score-based routing:
  - **0-3**: Link to `/diagnostickit` with CTA "Identify your primary constraint"
  - **4-7**: Link to `/content-clarity-diagnostic` with CTA "Fix your next constraint"
  - **8-10**: Link to `/revenue-architecture-session` with CTA "Build your revenue blueprint"
- Update result messages to match the new copy provided
- Update the `getResult` function with new stage names, messages, CTAs, URLs, and button labels

#### 2. Update DDSQuiz Component (`src/components/dds/DDSQuiz.tsx`)
- Apply the same routing logic and messaging updates so the quiz on `/dds-framework` also routes correctly

#### 3. Update GHL Webhook (`supabase/functions/ghl-dds-webhook/index.ts`)
- Add `recommendedOffer` field to the webhook payload interface
- Map scores: 0-3 = "Diagnostic Kit", 4-7 = "Content Clarity Diagnostic", 8-10 = "Revenue Architecture Session"
- Include `recommendedOffer` in the GHL `customField` payload
- Redeploy the edge function

#### 4. Build Content Clarity Diagnostic Page (`src/pages/ContentClarityDiagnostic.tsx`)
- New distraction-free landing page at `/content-clarity-diagnostic`
- Follows the same design pattern as existing distraction-free pages (no header/footer nav)
- Sections: Hero, Who This Is For, What You Get, What This Is NOT, CTA ($297), Footer note about RAS upsell
- Uses a GoHighLevel booking calendar or payment link (will need to confirm which CTA mechanism to use)

#### 5. Build Income Systems Diagnostic Page (`src/pages/IncomeSystemsDiagnostic.tsx`)
- New distraction-free landing page at `/income-systems-diagnostic`
- Same design pattern: Hero, Who This Is For, What You Get, What This Is NOT, CTA ($79), Footer note about upsell paths
- NOT linked from the scorecard (used as upsell/follow-up only)

#### 6. Register Routes (`src/App.tsx`)
- Add lazy imports and routes for:
  - `/content-clarity-diagnostic` → `ContentClarityDiagnostic`
  - `/income-systems-diagnostic` → `IncomeSystemsDiagnostic`

### What Will NOT Change
- Scoring system (0-10, same questions, same point values)
- Lead capture flow
- Page layouts outside result screen and new pages
- Any other site functionality

### Technical Details
- Both new pages use the distraction-free pattern (standalone layout, no `<Layout>` wrapper)
- The webhook function adds one new optional field (`recommendedOffer`) — backward compatible
- All three result paths use internal site links (not external payment links) for the 0-3 and 8-10 tiers; the 4-7 tier routes to the new page

### Open Question
The Content Clarity Diagnostic ($297) and Income Systems Diagnostic ($79) pages need a CTA mechanism. The existing Income Clarity Diagnostic page uses a GHL booking calendar embed. Should these new pages also embed a booking calendar, or link to an external payment/booking URL? I will build them with a placeholder CTA button that can be updated once you provide the booking calendar ID or payment link.

