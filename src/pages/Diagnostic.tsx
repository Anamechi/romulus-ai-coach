import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, Target, Lightbulb } from "lucide-react";
import { ChecklistCTA, CHECKLIST_URL } from "@/components/content/ChecklistCTA";
import { SEOHead } from "@/components/seo/SEOHead";

const benefits = [
  {
    icon: Target,
    title: "Pinpoint the Real Problem",
    description: "Most entrepreneurs treat symptoms, not causes. The diagnostic uncovers the actual bottleneck holding your income hostage.",
  },
  {
    icon: Lightbulb,
    title: "Clarity Before Action",
    description: "Stop guessing which strategy will work. Leave with a clear understanding of what's broken and what to fix first.",
  },
  {
    icon: Clock,
    title: "Time-Saving Focus",
    description: "Instead of trying everything, you'll know exactly where to invest your limited time for maximum return.",
  },
];

const whoThisIsFor = [
  "Service-based business owners tired of income rollercoasters",
  "Entrepreneurs who've tried tactics that didn't stick",
  "Founders ready to understand why revenue stays inconsistent",
  "Business owners who want clarity before committing to solutions",
];

const whatYouLearn = [
  "The specific gap in your business causing income inconsistency",
  "Whether your problem is lead generation, conversion, delivery, or retention",
  "The one system that, once fixed, will stabilize your revenue",
  "A clear next step tailored to your situation",
];

export default function Diagnostic() {
  return (
    <Layout>
      <SEOHead
        title="Income Clarity Diagnostic | Dr. Romulus MBA"
        description="Discover what's really causing your inconsistent income. The Income Clarity Diagnostic reveals the specific gap holding your business back—so you can fix what matters."
        canonicalUrl="/diagnostic"
        ogType="website"
      />

      {/* Hero Section */}
      <section className="py-24 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--gold)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-cream/10 text-gold font-body text-sm font-medium mb-6">
              The First Step to Stable Income
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              The Income Clarity{" "}
              <span className="text-gradient-gold">Diagnostic</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-cream/70 max-w-2xl mx-auto mb-8">
              Stop guessing why your income stays inconsistent. In one focused session, 
              you'll discover the specific gap in your business that's holding revenue hostage.
            </p>
            <Button variant="gold" size="xl" asChild>
              <a 
                href="https://link.drromulusmba.com/widget/booking/RI6rJkfYSIJgaYsVWJGP"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Get Live Income Clarity
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Inconsistent Income Isn't a{" "}
                <span className="text-gradient-gold">Revenue Problem</span>
              </h2>
              <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
                It's a systems problem. And until you identify which system is broken, 
                every tactic you try is just a guess.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="p-8 rounded-2xl bg-card border border-border hover:border-gold/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6">
                    <benefit.icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  This Is For You If...
                </h2>
                <ul className="space-y-4">
                  {whoThisIsFor.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                      <span className="font-body text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  What You'll Discover
                </h2>
                <ul className="space-y-4">
                  {whatYouLearn.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span className="font-body text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              How the Diagnostic Works
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              A focused, strategic conversation—not a sales pitch.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Share Your Situation",
                  description: "We'll discuss your current business model, revenue patterns, and what you've already tried.",
                },
                {
                  step: "2",
                  title: "Identify the Gap",
                  description: "Using a diagnostic framework, we pinpoint which system is causing the income inconsistency.",
                },
                {
                  step: "3",
                  title: "Leave with Clarity",
                  description: "You'll know exactly what needs to change—and whether working together makes sense.",
                },
              ].map((step) => (
                <div key={step.step} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                    <span className="font-display text-2xl font-bold text-gold">{step.step}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="font-body text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Investment Note (Optional - only price on site) */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-body text-muted-foreground mb-2">
              The Income Clarity Diagnostic is a paid strategy session designed to deliver 
              immediate value—whether or not we work together afterward.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <ChecklistCTA
        variant="dark"
        heading="Ready for Clarity?"
        description="Stop trying tactics. Start with the Fundability & Systems Checklist."
        buttonText="Get the Checklist"
      />
    </Layout>
  );
}
