import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Sparkles, Award, ShieldCheck } from "lucide-react";
import drRomulusDesk from "@/assets/dr-romulus-hero.png";

export function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center bg-hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--gold)) 1px, transparent 0)`,
          backgroundSize: '44px 44px'
        }} />
      </div>

      {/* Subtle vignette overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.4)_100%)] pointer-events-none" />

      {/* Gradient Orbs */}
      <div className="absolute top-20 right-1/4 w-[28rem] h-[28rem] bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center max-w-7xl mx-auto">
          {/* Content Side */}
          <div className="text-center lg:text-left">
            {/* Premium Eyebrow Label */}
            <div className="inline-flex items-center gap-2.5 mb-8 animate-fade-up">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-gold">
                Dr. Deanna Romulus, MBA
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold/60" />
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-cream leading-[1.05] tracking-tight mb-8 animate-fade-up delay-100">
              Inconsistent Income
              <br />
              Is a{" "}
              <span className="relative inline-block">
                <span className="text-gradient-gold">Systems Problem</span>
                <span className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
              </span>
            </h1>

            {/* Subheadline */}
            <p className="font-body text-lg md:text-xl text-cream/75 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-up delay-200">
              You don't need another tactic. You need to understand what's actually
              broken—so you can fix the right thing, once.
            </p>

            {/* Trust Bar */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-10 animate-fade-up delay-200">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <div className="h-4 w-px bg-cream/20" />
              <span className="font-body text-sm text-cream/60">
                Trusted by founders worldwide
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 animate-fade-up delay-300">
              <Button variant="gold" size="xl" asChild>
                <a href="https://checklist.drromulusmba.com/" target="_blank" rel="noopener noreferrer" className="group">
                  Get the Checklist
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <div className="flex items-center gap-2 text-cream/50 font-body text-sm">
                <ShieldCheck className="w-4 h-4 text-gold/70" />
                <span>Free · No credit card required</span>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative hidden lg:flex items-end justify-center animate-fade-up delay-200">
            <div className="relative w-full max-w-md">
              {/* Outer gold accent glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-gold/20 via-transparent to-gold/10 rounded-[2rem] blur-2xl opacity-60" />

              {/* Framed portrait container — editorial gold-bordered frame */}
              <div className="relative aspect-[4/5] rounded-[1.75rem] bg-gradient-to-br from-cream via-cream/85 to-muted/50 overflow-hidden shadow-elevated ring-1 ring-gold/30">
                {/* Inner highlight ring */}
                <div className="absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-cream/40 pointer-events-none z-30" />

                {/* Ambient gold glows contained within frame */}
                <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-radial from-gold/25 via-gold/8 to-transparent blur-3xl" />
                <div className="absolute top-10 right-10 w-56 h-56 bg-gold/15 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />

                {/* Pedestal accent */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-24 bg-gradient-to-t from-gold/20 to-transparent rounded-[50%] blur-2xl" />

                {/* Main portrait */}
                <img
                  src={drRomulusDesk}
                  alt="Dr. Deanna Romulus, MBA - Business Strategist & Empowerment Architect"
                  width={1088}
                  height={1446}
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                  className="absolute inset-x-0 bottom-0 mx-auto h-[97%] w-auto object-contain [filter:drop-shadow(0_25px_35px_rgb(0_0_0/0.3))]"
                  style={{ imageRendering: 'auto' }}
                />

                {/* Subtle corner accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold/40 rounded-tl-lg z-30" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold/40 rounded-br-lg z-30" />
              </div>

              {/* Floating credential card */}
              <div className="absolute bottom-10 -left-6 z-20 bg-card/95 backdrop-blur-md p-4 rounded-xl shadow-elevated border border-gold/30 animate-fade-up delay-500">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center ring-1 ring-gold/30">
                    <Award className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="font-display text-sm font-semibold text-foreground">Ed.D. & MBA</div>
                    <div className="font-body text-xs text-muted-foreground">Business Strategist</div>
                  </div>
                </div>
              </div>

              {/* Floating accolade card — top right */}
              <div className="absolute top-12 -right-6 z-20 bg-card/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-elevated border border-gold/30 animate-fade-up delay-700">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <div className="font-display text-[11px] font-semibold text-gold uppercase tracking-[0.15em]">Trusted Strategist</div>
                </div>
                <div className="font-body text-xs text-muted-foreground">For Founders Worldwide</div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 pt-12 border-t border-cream/10 animate-fade-up delay-400 max-w-5xl mx-auto">
          {[
            { number: "01", title: "Clarity First", description: "Understand the real problem before taking action" },
            { number: "02", title: "Systems Thinking", description: "Fix root causes, not just symptoms" },
            { number: "03", title: "Guided Path", description: "Know exactly what to do next" },
          ].map((prop) => (
            <div key={prop.title} className="text-center md:text-left group">
              <div className="font-display text-xs font-semibold tracking-[0.2em] text-gold/60 mb-2">
                {prop.number}
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-cream mb-2 group-hover:text-gold transition-colors">
                {prop.title}
              </div>
              <div className="font-body text-sm text-cream/60 leading-relaxed">{prop.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
