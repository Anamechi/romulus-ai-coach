import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import drRomulusDesk from "@/assets/dr-romulus-hero.png";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--gold)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Content Side */}
          <div className="text-center lg:text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream/10 border border-cream/20 mb-8 animate-fade-up">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <span className="font-body text-sm text-cream/80">
                Trusted by entrepreneurs worldwide
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-cream leading-tight mb-6 animate-fade-up delay-100">
              Inconsistent Income Is a{" "}
              <span className="text-gradient-gold">Systems Problem</span>
            </h1>

            {/* Subheadline */}
            <p className="font-body text-lg md:text-xl text-cream/70 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-up delay-200">
              You don't need another tactic. You need to understand what's actually 
              broken—so you can fix the right thing, once.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 animate-fade-up delay-300">
              <Button variant="gold" size="xl" asChild>
                <a href="https://checklist.drromulusmba.com/" target="_blank" rel="noopener noreferrer" className="group">
                  Get the Checklist
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative hidden lg:flex items-end justify-center animate-fade-up delay-200 min-h-[600px]">
            {/* Ambient glow behind subject */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[420px] h-[420px] rounded-full bg-gold/20 blur-[100px]" />
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[380px] h-[380px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />

            {/* Subtle radial spotlight */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 60%, hsl(var(--gold) / 0.08) 0%, transparent 60%)",
              }}
            />

            {/* Portrait — transparent PNG, no frame */}
            <img
              src={drRomulusDesk}
              alt="Dr. Deanna Romulus, MBA - Business Strategist"
              className="relative z-10 w-full max-w-lg h-auto object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
            />

            {/* Floating credential card */}
            <div className="absolute bottom-8 right-0 z-20 bg-card/90 backdrop-blur-md p-4 rounded-xl shadow-elevated border border-gold/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Star className="w-5 h-5 fill-gold text-gold" />
                </div>
                <div>
                  <div className="font-display text-sm font-semibold text-foreground">Ed.D. & MBA</div>
                  <div className="font-body text-xs text-muted-foreground">Business Strategist</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Props instead of stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-12 border-t border-cream/10 animate-fade-up delay-400 max-w-4xl mx-auto">
          {[
            { title: "Clarity First", description: "Understand the real problem before taking action" },
            { title: "Systems Thinking", description: "Fix root causes, not just symptoms" },
            { title: "Guided Path", description: "Know exactly what to do next" },
          ].map((prop) => (
            <div key={prop.title} className="text-center">
              <div className="font-display text-lg md:text-xl font-bold text-gold mb-2">
                {prop.title}
              </div>
              <div className="font-body text-sm text-cream/60">{prop.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
