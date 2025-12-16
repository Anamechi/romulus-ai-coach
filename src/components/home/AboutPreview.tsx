import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, BookOpen, Briefcase } from "lucide-react";

const credentials = [
  { icon: Award, text: "Ed.D. in Educational Leadership" },
  { icon: Briefcase, text: "MBA (Finance)" },
  { icon: BookOpen, text: "Adult Org Development Certificate" },
];

export function AboutPreview() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Image/Visual Side */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl bg-hero-gradient overflow-hidden relative">
              {/* Placeholder for actual image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 rounded-full bg-gold/20 mx-auto mb-6 flex items-center justify-center">
                    <span className="font-display text-5xl font-bold text-gold">R</span>
                  </div>
                  <p className="font-body text-cream/60 text-sm">
                    Dr. Romulus MBA
                  </p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gold/10 rounded-full blur-xl" />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-xl shadow-elevated border border-border max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold text-foreground">15+ Years</div>
                  <div className="font-body text-xs text-muted-foreground">Of Industry Experience</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold font-body text-sm font-medium mb-6">
              Meet Your Coach
            </span>
            
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Strategic Guidance from Someone Who's{" "}
              <span className="text-gradient-gold">Been There</span>
            </h2>
            
            <p className="font-body text-lg text-muted-foreground mb-6 leading-relaxed">
              Dr. Romulus brings a unique combination of academic rigor and real-world 
              executive experience to every coaching engagement. Having led multi-million 
              dollar initiatives and built successful businesses from the ground up, 
              he understands the challenges you face.
            </p>
            
            <p className="font-body text-muted-foreground mb-8 leading-relaxed">
              His approach combines proven business frameworks with cutting-edge automation 
              strategies, helping entrepreneurs build systems that scale without sacrificing 
              their sanity or family time.
            </p>

            {/* Credentials */}
            <div className="space-y-4 mb-8">
              {credentials.map((cred) => (
                <div key={cred.text} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <cred.icon className="w-5 h-5 text-gold" />
                  </div>
                  <span className="font-body text-foreground">{cred.text}</span>
                </div>
              ))}
            </div>

            <Button variant="default" size="lg" asChild>
              <Link to="/about">
                Read Full Story
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
