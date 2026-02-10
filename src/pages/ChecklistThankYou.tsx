import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ChecklistThankYou() {
  // TODO: Replace with actual checklist download URL
  const checklistDownloadUrl = "https://checklist.drromulusmba.com";

  const steps = [
    {
      number: "1",
      title: "Download the checklist",
      description: "Click the button below to get your copy.",
    },
    {
      number: "2",
      title: "Complete it honestly",
      description: "Go through each item and answer truthfully.",
    },
    {
      number: "3",
      title: "Pay attention to where you checked 'no'",
      description: "These are the gaps affecting your income consistency.",
    },
  ];

  return (
    <Layout>
      <SEOHead
        title="You're In - Download Your Checklist"
        description="Download your Fundability & Systems Checklist and discover what's blocking consistent income in your business."
        canonicalUrl="/checklist/thank-you"
        noindex={true}
      />

      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              You're In.
            </h1>
            <p className="text-2xl text-gold font-display">
              Here's What to Do Next
            </p>
          </div>

          {/* Download Button */}
          <div className="text-center mb-12">
            <Button
              asChild
              variant="gold"
              size="xl"
              className="gap-2"
            >
              <a href={checklistDownloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="w-5 h-5" />
                Download the Checklist
              </a>
            </Button>
          </div>

          {/* Steps */}
          <div className="bg-card border border-border rounded-xl p-8 mb-12">
            <h2 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
              How to Use Your Checklist
            </h2>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/10 text-gold font-bold flex items-center justify-center text-sm">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Step CTA */}
          <div className="bg-slate-deep text-cream rounded-xl p-8 text-center">
            <BookOpen className="w-10 h-10 text-gold mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-4">
              If Your Checklist Shows Gaps...
            </h2>
            <p className="text-cream/80 mb-6 max-w-xl mx-auto">
              The next step is understanding the system behind them. Learn how the right structure creates consistent income — without working harder.
            </p>
            <Button
              asChild
              variant="gold"
              size="lg"
              className="gap-2"
            >
              <Link to="/programs">
                Learn How to Fix What This Revealed
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Return Home Link */}
          <div className="text-center mt-8">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
