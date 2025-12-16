import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star } from "lucide-react";

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
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream/10 border border-cream/20 mb-8 animate-fade-up">
            <div className="flex -space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <span className="font-body text-sm text-cream/80">
              Trusted by 500+ entrepreneurs worldwide
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cream leading-tight mb-6 animate-fade-up delay-100">
            Build a Business That{" "}
            <span className="text-gradient-gold">Runs Without You</span>
          </h1>

          {/* Subheadline */}
          <p className="font-body text-lg md:text-xl text-cream/70 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200">
            Elite coaching, strategic consulting, and AI-powered automation for 
            entrepreneurs ready to scale with clarity, systems, and freedom.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
            <Button variant="gold" size="xl" asChild>
              <Link to="/apply" className="group">
                Apply for Coaching
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/programs" className="group">
                <Play className="w-5 h-5" />
                Explore Programs
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-cream/10 animate-fade-up delay-400">
            {[
              { value: "500+", label: "Clients Coached" },
              { value: "$50M+", label: "Revenue Generated" },
              { value: "15+", label: "Years Experience" },
              { value: "98%", label: "Success Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-gold mb-2">
                  {stat.value}
                </div>
                <div className="font-body text-sm text-cream/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
