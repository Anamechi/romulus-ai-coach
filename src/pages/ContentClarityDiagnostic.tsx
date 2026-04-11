import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight, Target, Compass, MessageSquare, Zap } from "lucide-react";

const ContentClarityDiagnostic = () => {
  return (
    <>
      <SEOHead
        title="Content Clarity Diagnostic™ | Dr. Deanna Romulus"
        description="Fix the one thing blocking your content from converting. Get clear direction on what to post and what to fix first. $297 diagnostic session."
        canonicalUrl="/content-clarity-diagnostic"
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
              Content Clarity Diagnostic™
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Fix the One Thing Blocking Your Content from Converting
            </h1>
            <p className="text-lg md:text-xl mb-8" style={{ color: "hsl(220 15% 70%)" }}>
              Stop guessing what to post. Get clear direction on what's not working—and what to fix first.
            </p>
            <Button
              variant="gold"
              size="lg"
              onClick={() => document.getElementById("cta-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              Book Your Diagnostic — $297
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
                { icon: MessageSquare, text: "Posting content but not generating leads" },
                { icon: Compass, text: "Unsure what content converts" },
                { icon: Target, text: "Feels misaligned but can't identify why" },
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
                "Identification of your #1 constraint",
                "Clear direction on what to post",
                "Messaging + platform alignment",
                "Immediate next step",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-[hsl(var(--slate-medium))] border border-[hsl(var(--gold)/0.15)] rounded-xl p-5"
                >
                  <CheckCircle2 className="h-6 w-6 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                  <p className="text-[hsl(var(--cream))] text-lg">{item}</p>
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
                "Not ongoing coaching",
                "Not implementation",
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
              <Zap className="h-10 w-10 text-[hsl(var(--gold))] mx-auto mb-6" />
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Book Your Content Clarity Diagnostic
              </h2>
              <p className="text-lg mb-2 text-[hsl(var(--gold))] font-semibold">$297</p>
              <p className="mb-8" style={{ color: "hsl(220 15% 65%)" }}>
                One focused session to uncover what's blocking your content from converting.
              </p>
              {/* Placeholder CTA — replace with booking calendar or payment link */}
              <Button variant="gold" size="lg">
                Book Your Content Clarity Diagnostic — $297
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <p className="mt-8 text-sm italic" style={{ color: "hsl(220 15% 50%)" }}>
              "If deeper structural issues are identified, next steps will be outlined for a Revenue Architecture Session."
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

export default ContentClarityDiagnostic;
