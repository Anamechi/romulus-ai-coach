import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle } from "lucide-react";

export default function Checklist() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!trimmedEmail.includes("@")) {
      toast({
        title: "Please enter a valid email",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to leads table
      const { error } = await supabase.from("leads").insert({
        full_name: trimmedName,
        email: trimmedEmail,
        source: "Fundability & Systems Checklist",
        status: "new",
      });

      if (error) throw error;

      // Redirect to thank-you page
      navigate("/checklist/thank-you");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    "A clear view of where your business lacks structure",
    "Insight into why income feels harder than it should",
    "Clarity on what to fix first (not everything at once)",
    "A simple way to stop guessing and start deciding",
  ];

  return (
    <Layout>
      <SEOHead
        title="The Fundability & Systems Checklist"
        description="Discover what's blocking consistent income in your business. This checklist helps you identify the exact gaps keeping your revenue inconsistent."
        canonicalUrl="/checklist"
      />

      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-gold/10 text-gold rounded-full text-sm font-medium mb-6">
              Free Diagnostic Tool
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              The Fundability & Systems Checklist
            </h1>
            <p className="text-2xl md:text-3xl text-gold font-display mb-8">
              Discover What's Blocking Consistent Income in Your Business
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column - Copy */}
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  If your income feels unpredictable, the issue usually isn't effort or talent.
                </p>
                <p className="text-lg text-foreground font-medium">
                  It's missing structure.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This checklist helps you identify the exact gaps keeping your revenue inconsistent.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  What You'll Get:
                </h2>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-6">
                <p className="text-sm text-muted-foreground italic">
                  <strong className="text-foreground not-italic">Important:</strong> This checklist will not fix your business. It will show you why it isn't working yet — clearly and objectively.
                </p>
              </div>
            </div>

            {/* Right Column - CTA */}
            <div className="bg-card border border-border rounded-xl p-8 shadow-lg flex flex-col items-center justify-center text-center">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                Get the Fundability & Systems Checklist
              </h3>
              <p className="text-muted-foreground mb-8">
                Start identifying the structural gaps holding your revenue back.
              </p>
              <Button variant="gold" size="lg" asChild>
                <a href="https://checklist.drromulusmba.com/" target="_blank" rel="noopener noreferrer">
                  Get the Checklist
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
