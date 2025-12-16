import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Zap, Building2 } from "lucide-react";

const programs = [
  {
    icon: Sparkles,
    title: "1:1 Executive Coaching",
    description: "Personalized strategic guidance for founders ready to break through their next revenue ceiling.",
    features: ["Weekly 1:1 Sessions", "Custom Roadmap", "Unlimited Support"],
    href: "/programs#coaching",
    featured: true,
  },
  {
    icon: Users,
    title: "Group Mastermind",
    description: "Join an elite community of growth-minded entrepreneurs sharing insights and accountability.",
    features: ["Monthly Calls", "Private Community", "Guest Experts"],
    href: "/programs#mastermind",
    featured: false,
  },
  {
    icon: Zap,
    title: "Automation & AI Setup",
    description: "Done-for-you business automation systems that save 20+ hours weekly on operations.",
    features: ["Custom Workflows", "AI Integration", "Ongoing Support"],
    href: "/programs#automation",
    featured: false,
  },
  {
    icon: Building2,
    title: "Business Structure Consulting",
    description: "Optimize your business entity, fundability, and tax strategy for maximum protection and growth.",
    features: ["Entity Setup", "Credit Building", "Tax Planning"],
    href: "/programs#consulting",
    featured: false,
  },
];

export function ProgramsPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold font-body text-sm font-medium mb-6">
            Programs & Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Tailored Solutions for{" "}
            <span className="text-gradient-gold">Every Stage</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground">
            Whether you need strategic clarity, operational systems, or hands-on support, 
            we have a program designed for your specific growth phase.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {programs.map((program, index) => (
            <Link
              key={program.title}
              to={program.href}
              className={`group relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                program.featured
                  ? "bg-primary text-primary-foreground border-gold/30 hover:border-gold/60"
                  : "bg-card border-border hover:border-gold/30"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {program.featured && (
                <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gold-gradient text-slate-deep font-body text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                program.featured ? "bg-gold/20" : "bg-gold/10"
              }`}>
                <program.icon className={`w-7 h-7 ${program.featured ? "text-gold" : "text-gold"}`} />
              </div>

              <h3 className={`font-display text-xl font-semibold mb-3 ${
                program.featured ? "text-cream" : "text-foreground"
              }`}>
                {program.title}
              </h3>

              <p className={`font-body text-sm mb-6 leading-relaxed ${
                program.featured ? "text-cream/70" : "text-muted-foreground"
              }`}>
                {program.description}
              </p>

              <ul className="space-y-2 mb-6">
                {program.features.map((feature) => (
                  <li key={feature} className={`flex items-center gap-2 font-body text-sm ${
                    program.featured ? "text-cream/80" : "text-foreground"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      program.featured ? "bg-gold" : "bg-gold"
                    }`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className={`flex items-center gap-2 font-body text-sm font-medium group-hover:gap-3 transition-all ${
                program.featured ? "text-gold" : "text-gold"
              }`}>
                Learn More
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="default" size="lg" asChild>
            <Link to="/programs">
              View All Programs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
