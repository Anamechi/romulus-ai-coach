

# Part 1: Update Thank You Page + Part 2: New Booking Page

## Part 1 -- Update `/diagnostickit-thank-you`

Replace the existing "Interpretation Session" section (lines 158-220) with the new copy. All other sections remain untouched.

**Changes to `src/pages/DiagnosticKitThankYou.tsx`:**

- Update the `UPSELL_URL` constant (line 14) from `"#PASTE_UPSELL_LINK_HERE"` to `"/income-clarity-diagnostic"`
- Replace the Interpretation Session section content:
  - Headline: "Want Expert Guidance Reviewing Your Results?"
  - Two positioning lines: "The Diagnostic Kit gives you clarity." / "The Income Clarity Diagnostic provides structured review."
  - Updated bullet points: Confirm constraint, Identify highest-leverage correction, Clarify repair sequence, Determine Systems Before Scale appropriateness
  - New qualifier line: "This is a focused evaluation session -- not open coaching."
  - Investment: $297
  - Button text: "Proceed to Diagnostic Booking" linking to `/income-clarity-diagnostic`
  - Subtext: "Limited weekly availability to ensure focused evaluation."
- Add increased top spacing (`pt-8`) to the section for visual breathing room

The "When You're Finished..." section above it stays exactly as-is. The "Next Step" section also remains unchanged.

---

## Part 2 -- Create `/income-clarity-diagnostic`

**New file: `src/pages/IncomeClarityDiagnostic.tsx`**

A standalone page (no Layout wrapper, no top navigation) with the same dark navy aesthetic.

### Sections:

1. **Hero** -- "Income Clarity Diagnostic" headline, subheadline about structured 60-minute evaluation, authority line with Dr. Deanna Romulus, MBA

2. **What This Session Is** -- 4 bullet points (review diagnostic, identify constraint, clarify sequence, determine SBS appropriateness) + two qualifier lines: "This is not an open coaching call. It is a structured evaluation."

3. **Who This Is For** -- 4 bullet points (completed Diagnostic Kit, serious about stabilizing revenue, want expert clarity, prepared for structured action)

4. **Investment** -- $297 with three descriptors: One-time session, No subscription, Focused evaluation

5. **Calendar Embed** -- "Schedule Your Session" heading with a styled placeholder block for GHL calendar embed code

6. **Final Note** -- "Please complete your booking only if you are prepared to engage seriously in structured implementation."

7. **Footer** -- Minimal brand attribution

### SEO:
- Title: "Income Clarity Diagnostic | Dr. Romulus MBA"
- Description: "Book a structured 60-minute evaluation session to identify your highest-leverage next step."
- Canonical: `/income-clarity-diagnostic`

**Update `src/App.tsx`:**
- Add lazy import for `IncomeClarityDiagnostic`
- Add route `/income-clarity-diagnostic`

---

## Files Summary

| File | Action |
|------|--------|
| `src/pages/DiagnosticKitThankYou.tsx` | Edit -- replace Interpretation Session section + update UPSELL_URL |
| `src/pages/IncomeClarityDiagnostic.tsx` | Create -- new standalone booking page |
| `src/App.tsx` | Edit -- add lazy import + route |

