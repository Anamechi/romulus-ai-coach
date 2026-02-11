import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const CHECKLIST_URL = "https://checklist.drromulusmba.com/checklist";

interface ChecklistCTAProps {
  /** Heading text */
  heading?: string;
  /** Subheading / description */
  description?: string;
  /** Primary button text */
  buttonText?: string;
  /** Show contact link */
  showContact?: boolean;
  /** Show phone line */
  showPhone?: boolean;
  /** Visual variant */
  variant?: "section" | "inline" | "dark";
}

export function ChecklistCTA({
  heading = "Want to Know What You're Missing?",
  description = "Start with the Fundability & Systems Checklist to uncover what's blocking your growth.",
  buttonText = "Get the Checklist",
  showContact = true,
  showPhone = true,
  variant = "inline",
}: ChecklistCTAProps) {
  if (variant === "dark") {
    return (
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-6">
            {heading}
          </h2>
          <p className="font-body text-lg text-cream/70 max-w-2xl mx-auto mb-8">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gold" size="xl" asChild>
              <a href={CHECKLIST_URL} target="_blank" rel="noopener noreferrer" className="group">
                {buttonText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            {showContact && (
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            )}
          </div>
          {showPhone && (
            <p className="font-body text-sm text-cream/50 mt-6 flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Questions? Call or text{" "}
              <a href="tel:+18774126215" className="underline hover:text-cream/80">
                1-877-412-6215
              </a>
            </p>
          )}
        </div>
      </section>
    );
  }

  if (variant === "section") {
    return (
      <section className="py-24 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--gold)) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-cream mb-6">
            {heading}
          </h2>
          <p className="font-body text-lg md:text-xl text-cream/70 max-w-2xl mx-auto mb-8">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gold" size="xl" asChild>
              <a href={CHECKLIST_URL} target="_blank" rel="noopener noreferrer" className="group">
                {buttonText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            {showContact && (
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            )}
          </div>
          {showPhone && (
            <p className="font-body text-sm text-cream/50 mt-6 flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Questions? Call or text{" "}
              <a href="tel:+18774126215" className="underline hover:text-cream/80">
                1-877-412-6215
              </a>
            </p>
          )}
        </div>
      </section>
    );
  }

  // Inline variant (for within content areas)
  return (
    <div className="text-center bg-muted/50 rounded-2xl p-8">
      <h2 className="text-xl font-display font-semibold mb-4">{heading}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href={CHECKLIST_URL} target="_blank" rel="noopener noreferrer">
          <Button size="lg">
            {buttonText}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </a>
        {showContact && (
          <Link to="/contact">
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </Link>
        )}
      </div>
      {showPhone && (
        <p className="font-body text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
          <Phone className="w-4 h-4" />
          Questions? Call or text{" "}
          <a href="tel:+18774126215" className="text-gold hover:underline">
            1-877-412-6215
          </a>
        </p>
      )}
    </div>
  );
}

export { CHECKLIST_URL };
