import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight, ClipboardCheck, Eye, Route, Clock } from "lucide-react";

const IncomeSystemsDiagnostic = () => {
  return (
    <>
      <SEOHead
        title="Income Systems Diagnostic™ | Dr. Deanna Romulus"
        description="Get expert insight on what's missing in your business. Personalized review of your diagnostic responses with clear next steps. $79."
        canonicalUrl="/income-systems-diagnostic"
        ogType="website"
      />

      <div className="min-h-screen bg-[hsl(var(--slate-deep))] text-[hsl(var(--cream))] font-body">
        {/* Header */}
        <header className="py-6 border-b border-[hsl(var(--gold)/0.1)]">
          <div className="container mx-auto px-6 text-center">
            <p className="text-[hsl(var(--gold))] font-display text-lg font-semibold tracking-wide">
              Dr. Deanna Romulus, MBA
            </p>
          </div>
        </header>

        {/* Hero */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-[hsl(var(--gold)/0.1)] text-[hsl(var(--gold))] font-body text-sm font-medium mb-6">
              Income Systems Diagnostic™
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Get Expert Insight on What's Missing in Your Business
            </h1>
            <p className="text-lg md:text-xl mb-8" style={{ color: "hsl(220 15% 70%)" }}>
              You've identified your gaps—now let's make sure you're focusing on the right ones.
            </p>
            <Button
              variant="gold"
              size="lg"
              onClick={() => document.getElementById("cta-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              Submit Your Diagnostic for Review — $79
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="py-16 md:py-20 border-t border-[hsl(var(--gold)/0.1)]">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">
              Who This Is For
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: ClipboardCheck, text: "Completed the checklist or diagnostic" },
                { icon: Eye, text: "Want confirmation before taking action" },
                { icon: Route, text: "Unsure what to fix first" },
              ].map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  className="bg-[hsl(var(--slate-medium))] border border-[hsl(var(--gold)/0.15)] rounded-xl p-6 text-center"
                >
                  <Icon className="h-8 w-8 text-[hsl(var(--gold))] mx-auto mb-4" />
                  <p className="text-[hsl(var(--cream))]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-16 md:py-20 border-t border-[hsl(var(--gold)/0.1)]">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">
              What You Get
            </h2>
            <div className="space-y-5">
              {[
                { icon: Eye, text: "Personalized review of your responses" },
                { icon: Route, text: "Identification of missed gaps" },
                { icon: ClipboardCheck, text: "Clear next step" },
                { icon: Clock, text: "Short video or written feedback within 48 hours" },
              ].map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-[hsl(var(--slate-medium))] border border-[hsl(var(--gold)/0.15)] rounded-xl p-5"
                >
                  <Icon className="h-6 w-6 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                  <p className="text-[hsl(var(--cream))] text-lg">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What This Is NOT */}
        <section className="py-16 md:py-20 border-t border-[hsl(var(--gold)/0.1)]">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">
              What This Is <span className="text-[hsl(var(--gold))]">NOT</span>
            </h2>
            <div className="space-y-4">
              {[
                "Not a full business audit",
                "Not implementation",
                "Not ongoing coaching",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <XCircle className="h-5 w-5 flex-shrink-0" style={{ color: "hsl(220 15% 50%)" }} />
                  <p style={{ color: "hsl(220 15% 65%)" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta-section" className="py-20 md:py-28 border-t border-[hsl(var(--gold)/0.1)]">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <div className="bg-[hsl(var(--slate-medium))] border border-[hsl(var(--gold)/0.2)] rounded-2xl p-8 md:p-12">
              <ClipboardCheck className="h-10 w-10 text-[hsl(var(--gold))] mx-auto mb-6" />
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Submit Your Diagnostic for Review
              </h2>
              <p className="text-lg mb-2 text-[hsl(var(--gold))] font-semibold">$79</p>
              <p className="mb-8" style={{ color: "hsl(220 15% 65%)" }}>
                Get personalized expert feedback on your diagnostic results within 48 hours.
              </p>
              {/* Placeholder CTA — replace with payment link */}
              <Button variant="gold" size="lg">
                Submit Your Diagnostic for Review — $79
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <p className="mt-8 text-sm italic" style={{ color: "hsl(220 15% 50%)" }}>
              "If deeper issues are identified, next steps may include a Content Clarity Diagnostic or Revenue Architecture Session."
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-[hsl(var(--gold)/0.1)]">
          <div className="container mx-auto px-6 text-center text-sm" style={{ color: "hsl(220 15% 45%)" }}>
            © {new Date().getFullYear()} Dr. Deanna Romulus, MBA. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default IncomeSystemsDiagnostic;
