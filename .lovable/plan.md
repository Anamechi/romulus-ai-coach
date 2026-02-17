

# Chatbot Update: Silent Qualification Engine + Webinar Lead Capture

## What Changes

The chatbot moves from a simple two-step checklist funnel to a three-pathway qualification engine with branching assessment logic, webinar bypass triggers, and validated lead capture with GHL webhook integration.

## 1. Rewrite System Prompt

**File:** `supabase/functions/chatbot-respond/index.ts`

Replace the entire `SYSTEM_PROMPT` with the new specification covering:

- **Three live pathways only**: Diagnostic Kit ($27), Income Clarity Diagnostic ($297), Webinar interest capture (no link)
- **Quick Assessment Flow**: Triggered only on uncertainty phrases ("Where should I start?", "My income is inconsistent", etc.). NOT triggered when user directly requests a specific offer.
  - Ask: "Is your income currently consistent month to month?"
  - Inconsistent branch: ask if Kit is completed, recommend Kit or Diagnostic (never both)
  - Consistent branch: ask about implementation guidance, then initiate webinar capture
- **Webinar bypass triggers**: Phrases like "Tell me about your program" or "What's Systems Before Scale?" skip assessment entirely and go straight to webinar capture
- **Webinar lead validation**: AI collects name + email, validates email format, confirms with user before emitting `[WEBINAR_LEAD: name=..., email=...]` marker
- **Constraint rules**: One CTA per response, never list multiple offers, never negotiate, never give strategy, max 5 sentences
- **Positioning**: Systems Before Scale not described in detail. Installation Intensive only referenced as "Private implementation support is discussed after a diagnostic session."

## 2. Add Webinar Lead Processing to Edge Function

**File:** `supabase/functions/chatbot-respond/index.ts`

After receiving the AI response, add server-side logic to:

- Detect the `[WEBINAR_LEAD: name=..., email=...]` marker in the AI response text
- If found: extract name and email, insert into `leads` table (source: `chatbot-webinar`), POST to `GHL_NEWSLETTER_WEBHOOK_URL` with tags `["Webinar Interest", "Source - Website Chatbot"]`, strip marker from response, return `webinar_lead_captured: true`
- If not found: return response as normal

Uses the already-configured `GHL_NEWSLETTER_WEBHOOK_URL` secret.

## 3. Remove Auto Lead Form from Frontend

**File:** `src/components/ChatbotWidget.tsx`

- Remove `showLeadForm` state and the auto-trigger after 3 messages
- Remove the lead capture form UI block (the AI now handles lead capture conversationally)
- Update welcome message to: "Welcome. I can help determine the appropriate next step for your business. What brings you here today?"

**File:** `src/hooks/useChatbot.ts`

- Handle `webinar_lead_captured` flag from edge function response (logged; AI confirms in conversation)
- Keep `captureLead` method available for backward compatibility

## Files Changed

| File | Change |
|------|--------|
| `supabase/functions/chatbot-respond/index.ts` | Full rewrite: new system prompt + webinar lead marker detection + GHL webhook |
| `src/components/ChatbotWidget.tsx` | Remove lead form UI, update welcome message |
| `src/hooks/useChatbot.ts` | Handle `webinar_lead_captured` response flag |

## What Stays the Same

- Chat UI layout, styling, scroll behavior
- Conversation persistence in `chatbot_conversations` table
- Admin conversation viewer
- AI model (`google/gemini-2.5-flash`) and gateway endpoint
- All existing secrets
- Error handling for 429/402 responses

