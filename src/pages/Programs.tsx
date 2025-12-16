import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles, Users, Zap, Building2 } from "lucide-react";

const programs = [
  {
    id: "coaching",
    icon: Sparkles,
    title: "1:1 Executive Coaching",
    subtitle: "For founders ready to break through",
    description: "Personalized strategic guidance designed for ambitious entrepreneurs who want to scale with intention, not just effort.",
    price: "Starting at $2,500/mo",
    features: [
      "Weekly 60-minute strategy sessions",
      "Unlimited async support via Voxer",
      "Custom quarterly roadmap",
      "Access to exclusive frameworks",
      "Monthly business audit",
      "Priority response within 24 hours",
    ],
    outcomes: [
      "Clear 90-day action plan",
      "Identified revenue levers",
      "Optimized time allocation",
      "Accountability partnership",
    ],
    featured: true,
  },
  {
    id: "mastermind",
    icon: Users,
    title: "Elite Mastermind",
    subtitle: "Community of growth-minded founders",
    description: "Join a curated group of 12 entrepreneurs sharing insights, challenges, and victories in a confidential setting.",
    price: "$997/mo",
    features: [
      "2x monthly group calls",
      "Private community access",
      "Monthly guest expert sessions",
      "Peer accountability partners",
      "Quarterly in-person retreat",
      "Resource library access",
    ],
    outcomes: [
      "Expanded network",
      "Diverse perspectives",
      "Shared best practices",
      "Ongoing support system",
    ],
    featured: false,
  },
  {
    id: "automation",
    icon: Zap,
    title: "Automation & AI Setup",
    subtitle: "Done-for-you systems",
    description: "We build and implement custom automation workflows that save you 20+ hours weekly on repetitive operations.",
    price: "Starting at $5,000",
    features: [
      "Full operations audit",
      "Custom workflow design",
      "AI tool integration",
      "Team training included",
      "60-day optimization support",
      "Documentation & SOPs",
    ],
    outcomes: [
      "20+ hours saved weekly",
      "Reduced error rates",
      "Scalable systems",
      "Team efficiency gains",
    ],
    featured: false,
  },
  {
    id: "consulting",
    icon: Building2,
    title: "Business Structure Consulting",
    subtitle: "Entity, credit & tax optimization",
    description: "Optimize your business foundation for maximum protection, fundability, and tax efficiency.",
    price: "Starting at $3,000",
    features: [
      "Entity structure analysis",
      "Business credit building plan",
      "Tax strategy session",
      "Asset protection review",
      "Banking relationship guidance",
      "Quarterly check-ins (first year)",
    ],
    outcomes: [
      "Optimized entity structure",
      "Improved fundability score",
      "Tax savings identified",
      "Protected assets",
    ],
    featured: false,
  },
];

export default function Programs() {
  return (
    <Layout>
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
              Programs & Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              Choose Your Path to{" "}
              <span className="text-gradient-gold">Business Freedom</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-cream/70 max-w-2xl mx-auto">
              Whether you need strategic clarity, hands-on support, or complete system 
              overhauls, we have a solution tailored to your growth stage.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {programs.map((program) => (
              <div
                key={program.id}
                id={program.id}
                className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                  program.featured
                    ? "bg-primary text-primary-foreground border-gold/30 lg:col-span-2"
                    : "bg-card border-border hover:border-gold/30"
                }`}
              >
                {program.featured && (
                  <div className="absolute -top-3 right-8 px-4 py-1 rounded-full bg-gold-gradient text-slate-deep font-body text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className={`grid ${program.featured ? "lg:grid-cols-2 gap-12" : ""}`}>
                  {/* Main Content */}
                  <div>
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                      program.featured ? "bg-gold/20" : "bg-gold/10"
                    }`}>
                      <program.icon className="w-7 h-7 text-gold" />
                    </div>

                    <h2 className={`font-display text-2xl font-bold mb-2 ${
                      program.featured ? "text-cream" : "text-foreground"
                    }`}>
                      {program.title}
                    </h2>
                    
                    <p className={`font-body text-sm mb-4 ${
                      program.featured ? "text-gold" : "text-gold"
                    }`}>
                      {program.subtitle}
                    </p>

                    <p className={`font-body mb-6 leading-relaxed ${
                      program.featured ? "text-cream/70" : "text-muted-foreground"
                    }`}>
                      {program.description}
                    </p>

                    <div className={`font-display text-2xl font-bold mb-6 ${
                      program.featured ? "text-gold" : "text-foreground"
                    }`}>
                      {program.price}
                    </div>

                    <Button
                      variant={program.featured ? "gold" : "default"}
                      size="lg"
                      asChild
                    >
                      <Link to="/apply">
                        Apply Now
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>

                  {/* Features & Outcomes */}
                  <div className={program.featured ? "" : "mt-8"}>
                    <div className="mb-6">
                      <h4 className={`font-body text-sm font-semibold uppercase tracking-wider mb-4 ${
                        program.featured ? "text-cream/60" : "text-muted-foreground"
                      }`}>
                        What's Included
                      </h4>
                      <ul className="space-y-3">
                        {program.features.map((feature) => (
                          <li key={feature} className={`flex items-start gap-3 font-body text-sm ${
                            program.featured ? "text-cream/80" : "text-foreground"
                          }`}>
                            <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className={`font-body text-sm font-semibold uppercase tracking-wider mb-4 ${
                        program.featured ? "text-cream/60" : "text-muted-foreground"
                      }`}>
                        Expected Outcomes
                      </h4>
                      <ul className="space-y-2">
                        {program.outcomes.map((outcome) => (
                          <li key={outcome} className={`flex items-center gap-2 font-body text-sm ${
                            program.featured ? "text-cream/80" : "text-foreground"
                          }`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  q: "How do I know which program is right for me?",
                  a: "Book a free strategy call and we'll assess your current situation, goals, and recommend the best fit. Most founders start with 1:1 coaching for personalized guidance."
                },
                {
                  q: "What's the time commitment?",
                  a: "1:1 coaching is 1 hour/week. Mastermind is 2-3 hours/month. Automation setup requires 3-5 hours of your time over 4-6 weeks for discovery and feedback."
                },
                {
                  q: "Do you offer refunds?",
                  a: "We offer a 30-day satisfaction guarantee on coaching programs. If you're not seeing value, we'll refund your investment or extend your engagement."
                },
                {
                  q: "Can I combine programs?",
                  a: "Absolutely. Many clients pair 1:1 coaching with automation setup for maximum impact. We offer package discounts for combined services."
                },
              ].map((faq) => (
                <div key={faq.q} className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {faq.q}
                  </h3>
                  <p className="font-body text-muted-foreground">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-6">
            Not Sure Where to Start?
          </h2>
          <p className="font-body text-lg text-cream/70 max-w-2xl mx-auto mb-8">
            Book a free 30-minute strategy session and get personalized recommendations.
          </p>
          <Button variant="gold" size="xl" asChild>
            <Link to="/apply">
              Schedule Your Call
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
