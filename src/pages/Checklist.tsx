import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function Checklist() {
  const formSrc = useMemo(() => "https://link.drromulusmba.com/widget/form/YOUR_GHL_FORM_ID", []);
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setTimedOut(false);
    const t = window.setTimeout(() => setTimedOut(true), 7000);
    return () => window.clearTimeout(t);
  }, [formSrc]);

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
        <div className="container max-w-5xl mx-auto px-4">
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

            {/* Right Column - GHL Form */}
            <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
              <h3 className="font-display text-xl font-semibold text-foreground mb-4 text-center">
                Get the Fundability & Systems Checklist
              </h3>

              <div className="w-full rounded-lg" style={{ minHeight: "500px" }}>
                {!loaded && (
                  <div className="h-[500px] w-full grid place-items-center">
                    <div className="text-center max-w-sm px-6">
                      <p className="font-body text-sm text-muted-foreground">
                        Loading form…
                      </p>
                      {timedOut && (
                        <div className="mt-3 space-y-3">
                          <p className="font-body text-sm text-muted-foreground">
                            If you still see a blank area, the form provider may be
                            blocking embeds in this preview.
                          </p>
                          <Button variant="outline" asChild>
                            <a href={formSrc} target="_blank" rel="noreferrer">
                              Open the form in a new tab
                              <ArrowRight className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <iframe
                  src={formSrc}
                  style={{
                    width: "100%",
                    height: "500px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  id="inline-checklist-form"
                  data-layout="{'id':'INLINE'}"
                  data-trigger-type="alwaysShow"
                  data-activation-type="alwaysActivated"
                  data-deactivation-type="neverDeactivate"
                  data-form-name="Fundability & Systems Checklist"
                  data-height="500"
                  title="Fundability & Systems Checklist Form"
                  onLoad={() => setLoaded(true)}
                />
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Your information is secure and will never be shared.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
