import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversation_id, thread_id } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const OPENAI_ASSISTANT_ID = Deno.env.get("OPENAI_ASSISTANT_ID");

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    if (!OPENAI_ASSISTANT_ID) {
      throw new Error("OPENAI_ASSISTANT_ID is not configured");
    }

    // Get or create a thread
    let currentThreadId = thread_id;
    
    if (!currentThreadId) {
      // Create a new thread
      const threadResponse = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2",
        },
        body: JSON.stringify({}),
      });

      if (!threadResponse.ok) {
        const errorText = await threadResponse.text();
        console.error("Failed to create thread:", errorText);
        throw new Error("Failed to create thread");
      }

      const threadData = await threadResponse.json();
      currentThreadId = threadData.id;
    }

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || latestMessage.role !== "user") {
      throw new Error("No user message found");
    }

    // Add the message to the thread
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({
        role: "user",
        content: latestMessage.content,
      }),
    });

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text();
      console.error("Failed to add message:", errorText);
      throw new Error("Failed to add message to thread");
    }

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({
        assistant_id: OPENAI_ASSISTANT_ID,
      }),
    });

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error("Failed to run assistant:", errorText);
      throw new Error("Failed to run assistant");
    }

    const runData = await runResponse.json();
    const runId = runData.id;

    // Poll for completion
    let runStatus = runData.status;
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds max wait

    while (runStatus !== "completed" && runStatus !== "failed" && runStatus !== "cancelled" && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs/${runId}`, {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2",
        },
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error("Failed to get run status:", errorText);
        throw new Error("Failed to get run status");
      }

      const statusData = await statusResponse.json();
      runStatus = statusData.status;
      attempts++;

      if (runStatus === "failed") {
        console.error("Run failed:", statusData.last_error);
        throw new Error(statusData.last_error?.message || "Assistant run failed");
      }
    }

    if (runStatus !== "completed") {
      throw new Error("Assistant response timed out");
    }

    // Get the assistant's response
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages?limit=1&order=desc`, {
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
    });

    if (!messagesResponse.ok) {
      const errorText = await messagesResponse.text();
      console.error("Failed to get messages:", errorText);
      throw new Error("Failed to get assistant response");
    }

    const messagesData = await messagesResponse.json();
    const assistantMessage = messagesData.data[0];
    
    let responseText = "I apologize, but I couldn't generate a response. Please try again.";
    
    if (assistantMessage && assistantMessage.role === "assistant" && assistantMessage.content.length > 0) {
      const textContent = assistantMessage.content.find((c: any) => c.type === "text");
      if (textContent) {
        responseText = textContent.text.value;
      }
    }

    console.log(`Chatbot response generated for conversation: ${conversation_id}`);

    return new Response(JSON.stringify({ 
      response: responseText,
      thread_id: currentThreadId 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
