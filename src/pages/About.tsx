import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, BookOpen, Briefcase, GraduationCap, Target, Users } from "lucide-react";

const timeline = [
  {
    year: "2008",
    title: "MBA Graduation",
    description: "Completed MBA with honors, specializing in strategic management and operations.",
  },
  {
    year: "2010",
    title: "Fortune 500 Executive",
    description: "Led transformation initiatives at major corporations, driving $50M+ in value creation.",
  },
  {
    year: "2015",
    title: "Entrepreneur Transition",
    description: "Founded first consulting practice, helping SMBs implement enterprise-grade strategies.",
  },
  {
    year: "2018",
    title: "Automation Pioneer",
    description: "Began integrating AI and automation into coaching, multiplying client results.",
  },
  {
    year: "2023",
    title: "Dr. Romulus MBA Today",
    description: "Coaching 500+ entrepreneurs worldwide with a 98% success rate.",
  },
];

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description: "Every strategy, every system, every session is designed to move the needle on your most important metrics.",
  },
  {
    icon: Users,
    title: "Client-Centric",
    description: "Your business is unique. Cookie-cutter solutions don't work. We build custom roadmaps for your specific situation.",
  },
  {
    icon: GraduationCap,
    title: "Continuous Learning",
    description: "The business landscape evolves constantly. We stay at the cutting edge so you don't have to.",
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Content */}
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold font-body text-sm font-medium mb-6">
                About Dr. Romulus
              </span>
              
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                From Executive Boardrooms to{" "}
                <span className="text-gradient-gold">Entrepreneurial Freedom</span>
              </h1>
              
              <p className="font-body text-lg text-muted-foreground mb-6 leading-relaxed">
                After 15+ years in corporate leadership and strategic consulting, 
                Dr. Romulus discovered that the most rewarding work wasn't optimizing 
                Fortune 500 processes—it was helping ambitious entrepreneurs build 
                businesses that give them freedom.
              </p>
              
              <p className="font-body text-muted-foreground mb-8 leading-relaxed">
                Today, he combines world-class business education with practical 
                automation expertise to help founders escape the "busy trap" and 
                build enterprises that run—and grow—without constant oversight.
              </p>

              <Button variant="gold" size="lg" asChild>
                <Link to="/apply">
                  Work With Dr. Romulus
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl bg-hero-gradient overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-40 h-40 rounded-full bg-gold/20 mx-auto mb-6 flex items-center justify-center">
                      <span className="font-display text-6xl font-bold text-gold">R</span>
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-cream mb-2">
                      Dr. Romulus
                    </h3>
                    <p className="font-body text-cream/60 text-sm">
                      Executive Coach & Business Strategist
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Credentials Card */}
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-elevated border border-border">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-gold" />
                  <div>
                    <div className="font-body text-sm font-semibold text-foreground">Harvard MBA</div>
                    <div className="font-body text-xs text-muted-foreground">Strategic Management</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Guiding <span className="text-gradient-gold">Principles</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              These values inform every coaching session, every system we build, 
              and every strategic recommendation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-8 rounded-2xl bg-card border border-border hover:border-gold/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              The <span className="text-gradient-gold">Journey</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-body text-xs font-bold text-gold">{item.year}</span>
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="font-body text-lg text-cream/70 max-w-2xl mx-auto mb-8">
            Let's discuss how strategic coaching and automation can transform your business.
          </p>
          <Button variant="gold" size="xl" asChild>
            <Link to="/apply">
              Apply for Coaching
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
