import { useEffect } from "react";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, AlertTriangle, TrendingUp, Shield, Layers } from "lucide-react";

const scrollToBooking = () => {
  document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
};

const RevenueArchitectureSession = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).pintrk) {
      (window as any).pintrk('track', 'checkout', {
        event_id: 'eventId0001',
        value: 500,
        order_quantity: 1,
        currency: 'USD',
        lead_type: 'RevenueArchitecture',
        line_items: [{ product_price: 500 }]
      });
    }
  }, []);

  return (
    <>
      <SEOHead
        title="Revenue Architecture for Service-Based Business Owners | Dr. Romulus"
        description="Book a $500 Revenue Architecture Session to map your authority positioning, offer clarity, revenue flow structure, and 30-day execution roadmap."
        canonicalUrl="/revenue-architecture-session"
        ogType="website"
      />

      {/* SECTION 1 – HERO */}
      <section className="py-24 md:py-32 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--gold)) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-cream/10 text-gold font-body text-sm font-medium mb-6">
              Revenue Architecture Session™
            </span>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-cream mb-6 leading-tight">
              Install the Authority & Revenue Infrastructure{" "}
              <span className="text-gradient-gold">Your Business Actually Needs</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-cream/70 max-w-2xl mx-auto mb-10">
              For service-based business owners earning six figures who are ready to stabilize, scale,
              and systemize income using AI-ready infrastructure.
            </p>
            <Button variant="gold" size="xl" onClick={scrollToBooking}>
              Book Your Revenue Architecture Session
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 2 – THE STRUCTURAL PROBLEM */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
              Your Revenue Shouldn't Depend on{" "}
              <span className="text-gradient-gold">You Showing Up Every Day</span>
            </h2>

            <div className="space-y-4 mb-12">
              {[
                "Revenue volatility month to month",
                "Personal brand tied directly to income",
                "Website that looks like a brochure instead of an authority engine",
                "Manual client acquisition",
                "No clear automation strategy",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
                >
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                  <p className="font-body text-foreground">{item}</p>
                </div>
              ))}
            </div>

            <div className="bg-muted/50 rounded-2xl p-8 border border-border text-center">
              <p className="font-body text-muted-foreground text-lg mb-2">
                This is not a marketing problem.
              </p>
              <p className="font-display text-xl md:text-2xl font-bold text-foreground">
                It's a structural revenue architecture problem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 – THE SESSION */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold font-body text-sm font-medium mb-6">
                What You Get
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                The Authority & Revenue{" "}
                <span className="text-gradient-gold">Architecture Session™</span>
              </h2>
              <p className="font-body text-lg text-muted-foreground">
                A 60–90 minute deep dive mapping your complete revenue infrastructure.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {[
                { icon: Shield, label: "Authority positioning" },
                { icon: Layers, label: "Offer clarity and pricing architecture" },
                { icon: TrendingUp, label: "Revenue flow structure" },
                { icon: AlertTriangle, label: "Automation and AI integration gaps" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-gold/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <p className="font-body text-foreground font-medium">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 p-6 rounded-xl bg-card border border-border mb-10">
              <CheckCircle2 className="w-6 h-6 text-gold shrink-0" />
              <p className="font-body text-foreground font-medium">
                30-day execution roadmap included
              </p>
            </div>

            <div className="text-center">
              <p className="font-display text-3xl font-bold text-foreground mb-6">
                Investment: <span className="text-gradient-gold">$500</span>
              </p>
              <Button variant="gold" size="xl" onClick={scrollToBooking}>
                Book Your Revenue Architecture Session
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 – WHO THIS IS FOR */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
              Who This Is <span className="text-gradient-gold">For</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                "Consultants",
                "Coaches",
                "Fractional Executives",
                "Agency Owners",
                "Service-Based Business Owners earning $150K+",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                  <p className="font-body text-foreground">{item}</p>
                </div>
              ))}
            </div>

            <p className="font-body text-sm text-muted-foreground text-center italic">
              Not for early-stage business owners or hobby businesses.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 – WHY IT MATTERS */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Why This <span className="text-gradient-gold">Matters</span>
            </h2>

            <div className="space-y-8">
              {[
                {
                  title: "Revenue Volatility Gap",
                  description:
                    "Without predictable revenue infrastructure, income swings wildly based on effort rather than systems. Architecture eliminates the guesswork.",
                },
                {
                  title: "Expansion Gap",
                  description:
                    "Most service-based business owners hit a ceiling not because of demand, but because their business structure cannot absorb growth. Scaling without systems creates collapse.",
                },
                {
                  title: "Structural Risk vs. Scalable Authority",
                  description:
                    "A business built on personal hustle is structurally fragile. Authority-driven infrastructure creates durability, credibility, and leverage.",
                },
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-2xl bg-card border border-border">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 – NEXT STEP */}
      <section className="py-24 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--gold)) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-6">
              What Happens After the Session
            </h2>
            <p className="font-body text-lg text-cream/70 mb-4 leading-relaxed">
              If alignment exists after the session, we discuss next steps together.
            </p>
            <p className="font-body text-lg text-cream/70 mb-10 leading-relaxed">
              If not, you leave with a fully documented blueprint you can execute independently.
            </p>
            <Button variant="gold" size="xl" onClick={scrollToBooking}>
              Book Your Revenue Architecture Session
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* BOOKING CALENDAR */}
      <section id="booking-section" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-8">
              Schedule Your Session
            </h2>
            <div className="rounded-xl overflow-hidden" style={{ height: "1400px" }}>
              <iframe
                src="https://link.drromulusmba.com/widget/booking/wlTCpuAi2QG0tn0BVVBG"
                style={{ width: "100%", height: "100%", border: "none", overflow: "hidden" }}
                scrolling="no"
                title="Book Revenue Architecture Session"
              />
            </div>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="py-10 bg-background text-center">
        <p className="text-muted-foreground text-xs font-body">
          © {new Date().getFullYear()} Dr. Romulus MBA. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default RevenueArchitectureSession;
