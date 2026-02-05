import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, CheckCircle } from "lucide-react";

const benefits = [
  "Identify your income bottleneck",
  "Understand what's really broken",
  "Get a clear next step",
];

export function CTASection() {
  return (
    <section className="py-24 bg-hero-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--gold)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-8">
            <Target className="w-8 h-8 text-gold" />
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-cream mb-6">
            Stop Guessing What's{" "}
            <span className="text-gradient-gold">Holding You Back</span>
          </h2>
          
          <p className="font-body text-lg md:text-xl text-cream/70 max-w-2xl mx-auto mb-8">
            The Income Clarity Diagnostic reveals the specific gap in your business 
            causing inconsistent revenue—so you can finally fix the right thing.
          </p>

          {/* Benefits */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-gold" />
                <span className="font-body text-sm text-cream/80">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gold" size="xl" asChild>
              <Link to="/diagnostic" className="group">
                Take the Income Clarity Diagnostic
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Trust Note */}
          <p className="font-body text-sm text-cream/50 mt-8">
            Clarity before action. Understanding before investment.
          </p>
        </div>
      </div>
    </section>
  );
}
