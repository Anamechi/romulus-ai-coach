import { useState, useRef, useEffect } from "react";
import { useChatWidget } from "@/hooks/useChatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", email: "" });
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, sendMessage, captureLead, getOrCreateConversation } = useChatWidget();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOpen = async () => {
    setIsOpen(true);
    if (messages.length === 0) {
      await getOrCreateConversation();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput("");
    await sendMessage(message);
    
    // Show lead form after 3 messages if not already shown
    if (messages.length >= 2 && !showLeadForm) {
      setShowLeadForm(true);
    }
  };

  const handleLeadSubmit = async () => {
    if (!leadForm.name || !leadForm.email) return;
    await captureLead(leadForm.name, leadForm.email);
    setShowLeadForm(false);
    await sendMessage(`Hi, I'm ${leadForm.name}. I just shared my contact info.`);
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={handleOpen}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 transition-all",
          isOpen && "scale-0 opacity-0"
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 w-[380px] h-[520px] bg-background border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/20 rounded-full">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Dr. Romulus Assistant</h3>
              <p className="text-xs opacity-80">Ask me anything</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 px-4 py-3">
          <div className="space-y-4">
            {/* Welcome Message */}
            {messages.length === 0 && !isLoading && (
              <div className="flex gap-3">
                <div className="p-1.5 bg-primary/10 rounded-full h-fit shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted px-3 py-2 rounded-lg rounded-tl-none max-w-[85%]">
                  <p className="text-sm leading-relaxed">
                    Hello! I'm here to help you with questions about business coaching, 
                    consulting, and our programs. How can I assist you today?
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn("flex gap-3", msg.role === "user" && "justify-end")}
              >
                {msg.role === "assistant" && (
                  <div className="p-1.5 bg-primary/10 rounded-full h-fit shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "px-3 py-2 rounded-lg max-w-[85%]",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted rounded-tl-none"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-headings:text-sm prose-headings:font-semibold">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="p-1.5 bg-muted rounded-full h-fit shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="p-1.5 bg-primary/10 rounded-full h-fit shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted px-3 py-2 rounded-lg rounded-tl-none">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Lead Capture Form */}
            {showLeadForm && (
              <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg space-y-2">
                <p className="text-sm font-medium">Want personalized help? Share your info:</p>
                <Input
                  placeholder="Your name"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="h-9 text-sm"
                />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  className="h-9 text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleLeadSubmit} className="flex-1 h-8 text-xs">
                    Submit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowLeadForm(false)} className="h-8 text-xs">
                    Skip
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="px-4 py-3 border-t bg-muted/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 h-9 text-sm bg-background"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-9 w-9 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
