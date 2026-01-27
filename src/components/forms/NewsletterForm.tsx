import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewsletterFormProps {
  variant?: "footer" | "inline";
  source?: string;
  className?: string;
}

export function NewsletterForm({ 
  variant = "inline", 
  source = "Website – Weekly Insights",
  className = ""
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to GHL webhook via edge function
      const { data, error } = await supabase.functions.invoke("ghl-newsletter-webhook", {
        body: {
          email: email.trim().toLowerCase(),
          source,
          pageUrl: window.location.href,
          timestamp: new Date().toISOString(),
        },
      });

      if (error) throw error;

      toast({
        title: "You're subscribed!",
        description: "You'll receive weekly insights on business growth and automation.",
      });

      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Subscription failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === "footer") {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col gap-3 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="px-4 py-3 rounded-lg bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/50 font-body text-sm focus:outline-none focus:border-gold transition-colors"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-3 rounded-lg bg-gold-gradient text-slate-deep font-body font-semibold text-sm hover:shadow-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Joining..." : "Join the Mailing List"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-4 max-w-md mx-auto ${className}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-3 rounded-lg border border-border bg-card font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
      />
      <Button type="submit" variant="gold" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Joining..." : "Join the Mailing List"}
      </Button>
    </form>
  );
}
