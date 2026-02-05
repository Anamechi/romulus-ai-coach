import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Lightbulb, Zap } from "lucide-react";
import drRomulusPhoto from "@/assets/dr-romulus.jpeg";

const approach = [
  {
    icon: Target,
    text: "Pattern Recognition"
  },
  {
    icon: Lightbulb,
    text: "Systems Thinking"
  },
  {
    icon: Zap,
    text: "Clarity Before Action"
  }
];

export function AboutPreview() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Image/Visual Side */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl bg-hero-gradient overflow-hidden relative">
              {/* Dr. Romulus Photo */}
              <img 
                src={drRomulusPhoto} 
                alt="Dr. Deanna Romulus, MBA - Business Strategist and Coach" 
                className="absolute inset-0 w-full h-full object-cover object-center" 
              />
              
              {/* Decorative overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gold/10 rounded-full blur-xl" />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-xl shadow-elevated border border-border max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold text-foreground">Strategic Clarity</div>
                  <div className="font-body text-xs text-muted-foreground">Before Action</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold font-body text-sm font-medium mb-6">
              Meet Your Guide
            </span>
            
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Guidance From Someone Who Sees{" "}
              <span className="text-gradient-gold">The Whole Picture</span>
            </h2>
            
            <p className="font-body text-lg text-muted-foreground mb-6 leading-relaxed">
              Dr. Romulus brings a unique ability to see patterns others miss. With a background 
              spanning finance, education, and operations, she helps entrepreneurs understand 
              why their business behaves the way it does—not just what to do about it.
            </p>
            
            <p className="font-body text-muted-foreground mb-8 leading-relaxed">
              Her approach prioritizes understanding before action, systems over tactics, and 
              clarity over complexity. Because the right answer starts with the right diagnosis.
            </p>

            {/* Approach */}
            <div className="space-y-4 mb-8">
              {approach.map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <span className="font-body text-foreground">{item.text}</span>
                </div>
              ))}
            </div>

            <Button variant="default" size="lg" asChild>
              <Link to="/about">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
