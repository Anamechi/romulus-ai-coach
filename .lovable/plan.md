

## Plan: Reposition Content Clarity Diagnostic → 7-Day Content-to-Cash Setup™

### Summary
Update the messaging and positioning of the existing `/content-clarity-diagnostic` offer from a **diagnostic** to a **guided implementation mini course**. Only text/copy changes—no layout or structural modifications.

### Changes Required

#### 1. Update Landing Page (`src/pages/ContentClarityDiagnostic.tsx`)

**SEO & Header:**
- Title: `"7-Day Content-to-Cash Setup™ | Dr. Deanna Romulus"`
- Description: `"Build a working content → lead → conversion system in 7 days. Follow a step-by-step system to turn your content into leads and revenue."`
- Badge label: `"7-Day Content-to-Cash Setup™"`

**Hero Section:**
- Headline: `"Build a Content-to-Cash System in 7 Days"`
- Subheadline: `"Stop guessing what to post. Follow a step-by-step system to turn your content into leads and revenue."`
- CTA: `"Get the 7-Day Content-to-Cash Setup — $297"`

**Who This Is For** (remove diagnostic language):
- "Posting content but not generating leads" → keep
- "Unsure what content converts" → keep  
- "Feels misaligned but can't identify why" → "Ready to implement a proven content system"

**What You Get** (implementation-focused):
- "A 7-day step-by-step implementation system"
- "Content workflow templates and frameworks"
- "Lead capture sequence setup guide"
- "Daily action checklists to maintain momentum"

**What This Is NOT** (clarify non-diagnostic nature):
- "Not a diagnostic or audit" (NEW)
- "Not personalized feedback or coaching" (NEW)
- "Not a live session or consultation" (NEW)
- Remove: "Not a full business audit", "Not ongoing coaching", "Not implementation"

**CTA Section:**
- Headline: `"Get the 7-Day Content-to-Cash Setup"`
- Description: `"A structured system to build your content → lead → conversion workflow in 7 days."`
- Button: `"Get the 7-Day Content-to-Cash Setup — $297"`

**Footer Note:**
- Remove the RAS upsell reference entirely (or update to general next-step language if preferred)

---

#### 2. Update Scorecard Result Logic (`src/pages/DDSScorecard.tsx` + `src/components/dds/DDSQuiz.tsx`)

**Score 4–7 (Design Stage) Updates:**

```typescript
// Button label change:
"Get the 7-Day Content-to-Cash Setup — $297"

// Recommended offer for GHL webhook:
"7-Day Content-to-Cash Setup"
```

**Note:** URL remains `/content-clarity-diagnostic` (no routing change required). The `message` and `cta` fields in the score result can stay as-is since they describe the business stage, not the specific offer.

---

### What Will NOT Change
- Page layout, colors, spacing, or visual structure
- URL (`/content-clarity-diagnostic`)
- Score ranges (0–3, 4–7, 8–10)
- Routing logic (still routes to same URL)
- Any other offers or pages

---

### Files to Edit
1. `src/pages/ContentClarityDiagnostic.tsx` — Full copy rewrite per specifications
2. `src/pages/DDSScorecard.tsx` — Update `buttonLabel` and `recommendedOffer` for score 4–7
3. `src/components/dds/DDSQuiz.tsx` — Same updates as DDSScorecard

