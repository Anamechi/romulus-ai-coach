import { Layout } from "@/components/layout/Layout";
import { Target, Zap, Building2, Users } from "lucide-react";
import { ChecklistCTA } from "@/components/content/ChecklistCTA";
import { SEOHead } from "@/components/seo/SEOHead";

const approaches = [
  {
    icon: Target,
    title: "Strategic Clarity",
    whoFor: "For business owners who feel stuck despite working hard",
    problem: "You're taking action but not seeing proportional results",
    outcome: "Understand exactly what's blocking growth and what to prioritize",
  },
  {
    icon: Zap,
    title: "Operational Systems",
    whoFor: "For entrepreneurs drowning in day-to-day operations",
    problem: "Your business can't run without your constant attention",
    outcome: "Build systems that operate consistently—with or without you",
  },
  {
    icon: Building2,
    title: "Business Foundation",
    whoFor: "For founders ready to scale but lacking structure",
    problem: "Your business isn't set up to access capital or partnerships",
    outcome: "Create a credible, fundable business structure that opens doors",
  },
  {
    icon: Users,
    title: "Consistent Revenue",
    whoFor: "For service providers tired of income rollercoasters",
    problem: "Revenue swings wildly month to month despite your efforts",
    outcome: "Identify and fix the gap causing income inconsistency",
  },
];

export default function Programs() {
  return (
    <Layout>
      <SEOHead
        title="How I Help | Dr. Romulus MBA"
        description="Strategic guidance for entrepreneurs ready to build businesses that are structured, credible, and scalable. Discover if we're the right fit."
        canonicalUrl="/programs"
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
              How I Help
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              Clarity First,{" "}
              <span className="text-gradient-gold">Then Action</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-cream/70 max-w-2xl mx-auto">
              Most entrepreneurs don't have a motivation problem. They have a clarity problem. 
              The right guidance starts with understanding what's actually broken.
            </p>
          </div>
        </div>
      </section>

      {/* Approach Cards */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              The Problems I{" "}
              <span className="text-gradient-gold">Solve</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Each engagement starts with diagnosis. You'll never be asked to choose 
              a package—only to understand your situation more clearly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {approaches.map((approach) => (
              <div
                key={approach.title}
                className="p-8 rounded-2xl bg-card border border-border hover:border-gold/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6">
                  <approach.icon className="w-7 h-7 text-gold" />
                </div>

                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {approach.title}
                </h3>
                
                <p className="font-body text-sm text-gold mb-4">
                  {approach.whoFor}
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      The Problem
                    </p>
                    <p className="font-body text-muted-foreground">
                      {approach.problem}
                    </p>
                  </div>

                  <div>
                    <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      The Outcome
                    </p>
                    <p className="font-body text-foreground">
                      {approach.outcome}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              How We Work Together
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Every engagement begins the same way—with clarity about what's actually happening.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Diagnostic First",
                  description: "We start with the Income Clarity Diagnostic to identify exactly what's causing your challenges.",
                },
                {
                  step: "2",
                  title: "Tailored Path",
                  description: "Based on what we discover, I'll recommend a path forward—coaching, systems work, or foundational changes.",
                },
                {
                  step: "3",
                  title: "Guided Implementation",
                  description: "You'll never be left with a plan and no support. Every recommendation comes with the guidance to execute.",
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

      {/* Philosophy Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Why I Don't List{" "}
                  <span className="text-gradient-gold">Packages</span>
                </h2>
                <p className="font-body text-muted-foreground mb-4 leading-relaxed">
                  Packages assume your problem fits into a predefined box. But your business 
                  is unique, and so is the gap holding it back.
                </p>
                <p className="font-body text-muted-foreground mb-4 leading-relaxed">
                  I don't believe in selling you hours or deliverables. I believe in 
                  solving the actual problem—and that requires understanding it first.
                </p>
                <p className="font-body text-foreground leading-relaxed">
                  That's why every client relationship starts with the same thing: clarity.
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-2xl p-8 border border-border">
                <blockquote className="font-display text-xl text-foreground italic mb-4">
                  "When people understand the system, they can navigate it—and win—on their own terms."
                </blockquote>
                <cite className="font-body text-sm text-gold not-italic">
                  — Dr. Deanna Romulus
                </cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <ChecklistCTA
        variant="dark"
        heading="Not Sure Where to Start?"
        description="The Fundability & Systems Checklist will reveal exactly what's missing in your business—and whether working together is the right next step."
        buttonText="Take the Fundability & Systems Checklist"
      />
    </Layout>
  );
}
