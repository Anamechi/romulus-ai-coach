

# Restrict Chatbot to Checklist-First Funnel

## What and Why

The current system prompt exposes all four offers with pricing ($27, $297, $1,997, $10,000). You want the chatbot to only guide visitors through two steps:

1. **First** -- Point them to the free Fundability and Systems Checklist (https://checklist.drromulusmba.com/)
2. **Then** -- If they have completed the checklist and need deeper help, recommend the Income Clarity Diagnostic (/diagnostic)

The chatbot should never mention Systems Before Scale, the Installation Intensive, or any pricing for those programs. This keeps the conversation focused on the diagnostic-first conversion funnel.

## Technical Detail

**File:** `supabase/functions/chatbot-respond/index.ts`

Rewrite the `SYSTEM_PROMPT` constant with the following changes:

- **Remove** the full "Offer Ladder" listing all four products and their prices
- **Replace** with a two-step funnel:
  - **Step 1 (Default):** Always start by recommending the Fundability and Systems Checklist at `https://checklist.drromulusmba.com/`
  - **Step 2 (After checklist):** If the visitor has already completed the checklist and wants expert guidance interpreting results or determining next steps, recommend the Income Clarity Diagnostic at `https://drromulusmba.com/diagnostic`
- **Decision logic** updated:
  - Any question about income, offers, structure, growth, or getting started -> Recommend the Checklist first
  - Visitor says they completed the checklist -> Recommend the Income Clarity Diagnostic
  - If asked about other programs or pricing -> Respond: "The best place to start is the Fundability and Systems Checklist. From there, we can determine the right next step."
- **CTA rules** simplified to only two URLs:
  - Checklist: `https://checklist.drromulusmba.com/`
  - Income Clarity Diagnostic: `https://drromulusmba.com/diagnostic`
- **Constraint rules** updated: Never disclose pricing or details of Systems Before Scale or the Installation Intensive. If asked directly, redirect to the checklist or diagnostic as the appropriate starting point.
- All other rules (tone, style, fallback, identity) remain unchanged.

No other files need to change.

