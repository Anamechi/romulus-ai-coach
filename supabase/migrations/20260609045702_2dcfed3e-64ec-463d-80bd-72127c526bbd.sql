DROP POLICY IF EXISTS "Anyone can update own chatbot_conversations" ON public.chatbot_conversations;

-- Remove client_messages from realtime publication; no client subscribes to it
-- and exposing it via realtime risks cross-tenant message leakage.
ALTER PUBLICATION supabase_realtime DROP TABLE public.client_messages;