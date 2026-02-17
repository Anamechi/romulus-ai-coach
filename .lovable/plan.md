

# Update Website Chatbot with Knowledge Base

## Overview

Replace the current OpenAI Assistants API implementation with a Lovable AI-powered chatbot that uses a comprehensive system prompt as its knowledge base. This eliminates the thread/polling complexity and gives full control over the chatbot's behavior, tone, and offer routing.

## What Changes

### 1. Rewrite Edge Function (`supabase/functions/chatbot-respond/index.ts`)

Replace the entire OpenAI Assistants API flow (threads, runs, polling) with a single Lovable AI Gateway call using a detailed system prompt.

**Key aspects:**
- Uses `LOVABLE_API_KEY` (already configured) instead of `OPENAI_API_KEY`
- Sends full conversation history for context (no more thread management)
- System prompt contains the complete knowledge base: offer ladder, decision logic, constraint rules, CTA rules, and style rules
- Handles 429/402 rate limit errors properly
- Non-streaming (matches current widget behavior)

**System prompt will encode:**
- Identity: Dr. Deanna Romulus, MBA -- Systems and Income Clarity Strategist
- Tone rules: calm, structured, professional, direct, no emojis, 3-6 sentences max
- All four offers with exact pricing ($27, $297, $1,997, $10,000)
- Decision routing logic (inconsistent income -> Kit, completed kit -> Diagnostic, etc.)
- Constraint rules (no negotiating, no discounts, no custom advice)
- CTA rules (one per response, exact URLs)
- Fallback response for unknown topics

### 2. Simplify Frontend Hook (`src/hooks/useChatbot.ts`)

- Remove `threadId` state and all thread-related logic
- The hook no longer sends/receives `thread_id` -- just `messages` and `conversation_id`
- Everything else (conversation persistence, lead capture) stays the same

### 3. Update Chat Widget (`src/components/ChatbotWidget.tsx`)

- Update the welcome message to match the new tone: "Welcome. I can help you understand which program may be the right fit. What brings you here today?"
- Update header subtitle from "Ask me anything" to "Program Guidance"

## Files Changed

| File | Action |
|------|--------|
| `supabase/functions/chatbot-respond/index.ts` | Rewrite -- Lovable AI with knowledge base system prompt |
| `src/hooks/useChatbot.ts` | Edit -- remove thread_id logic |
| `src/components/ChatbotWidget.tsx` | Edit -- update welcome message and subtitle |

## What Stays the Same

- Conversation persistence in `chatbot_conversations` table
- Lead capture flow
- Chat UI layout and styling
- Admin conversation viewer
- `config.toml` entry (already has `verify_jwt = false`)
