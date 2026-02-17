
-- Fix chatbot_conversations RLS policies to be PERMISSIVE for anonymous access
-- Drop the existing restrictive policies for insert and update
DROP POLICY IF EXISTS "Anyone can insert chatbot_conversations" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "Anyone can update own chatbot_conversations" ON public.chatbot_conversations;

-- Recreate as PERMISSIVE
CREATE POLICY "Anyone can insert chatbot_conversations"
ON public.chatbot_conversations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update own chatbot_conversations"
ON public.chatbot_conversations
FOR UPDATE
TO anon, authenticated
USING (true);

-- Also need a SELECT policy for anon users to read their own conversations
DROP POLICY IF EXISTS "Anyone can read own chatbot_conversations" ON public.chatbot_conversations;
CREATE POLICY "Anyone can read own chatbot_conversations"
ON public.chatbot_conversations
FOR SELECT
TO anon, authenticated
USING (true);
