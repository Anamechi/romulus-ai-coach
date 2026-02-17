import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  visitor_id: string;
  lead_id: string | null;
  messages: ChatMessage[];
  status: string;
  converted_to: string | null;
  created_at: string;
  updated_at: string;
}

export function useChatConversations() {
  return useQuery({
    queryKey: ['chatbot-conversations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .select(`
          *,
          lead:leads(id, full_name, email)
        `)
        .order('updated_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        messages: (item.messages as unknown as ChatMessage[]) || [],
      })) as (ChatConversation & { lead: { id: string; full_name: string | null; email: string } | null })[];
    },
  });
}

export function useChatWidget() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getOrCreateConversation = async () => {
    let visitorId = localStorage.getItem('chatbot_visitor_id');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('chatbot_visitor_id', visitorId);
    }

    // Check for existing conversation
    const { data: existing } = await supabase
      .from('chatbot_conversations')
      .select('*')
      .eq('visitor_id', visitorId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);

    if (existing && existing.length > 0) {
      setConversationId(existing[0].id);
      setMessages((existing[0].messages as unknown as ChatMessage[]) ?? []);
      return existing[0].id;
    }

    // Create new conversation
    const { data: newConv, error } = await supabase
      .from('chatbot_conversations')
      .insert({ visitor_id: visitorId, messages: [] } as any)
      .select()
      .single();

    if (error) throw error;
    setConversationId(newConv.id);
    setMessages([]);
    return newConv.id;
  };

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    try {
      let convId = conversationId;
      if (!convId) {
        convId = await getOrCreateConversation();
      }

      const userMessage: ChatMessage = {
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Update conversation in DB
      await supabase
        .from('chatbot_conversations')
        .update({ messages: updatedMessages } as any)
        .eq('id', convId);

      // Call chatbot edge function
      const { data, error } = await supabase.functions.invoke('chatbot-respond', {
        body: { 
          messages: updatedMessages, 
          conversation_id: convId,
        },
      });

      if (error) throw error;
      if (!data || !data.response) {
        console.error('Invalid response from chatbot:', data);
        throw new Error('No response from chatbot');
      }

      if (data.webinar_lead_captured) {
        console.log('Webinar lead captured via chatbot conversation');
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Update conversation with assistant response
      await supabase
        .from('chatbot_conversations')
        .update({ messages: finalMessages } as any)
        .eq('id', convId);

    } finally {
      setIsLoading(false);
    }
  };

  const captureLead = async (name: string, email: string) => {
    // Create lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({ full_name: name, email, source: 'chatbot' })
      .select()
      .single();

    if (leadError) throw leadError;

    // Link to conversation
    if (conversationId) {
      await supabase
        .from('chatbot_conversations')
        .update({ lead_id: lead.id } as any)
        .eq('id', conversationId);
    }

    return lead;
  };

  return {
    messages,
    isLoading,
    sendMessage,
    captureLead,
    getOrCreateConversation,
  };
}
