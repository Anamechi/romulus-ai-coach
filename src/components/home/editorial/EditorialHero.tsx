import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-architecture.png";

export const EditorialHero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Architectural background — hidden on mobile for clarity, anchored right on tablet+ */}
      <div
        aria-hidden="true"
        className="hidden sm:block absolute inset-y-0 right-0 w-[55%] lg:w-[55%] bg-no-repeat bg-right bg-cover opacity-90"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      {/* Cream fade from left to guarantee text contrast at every breakpoint */}
      <div
        aria-hidden="true"
        className="hidden sm:block absolute inset-0 bg-gradient-to-r from-background via-background/95 sm:via-background/85 lg:via-background/70 to-transparent"
      />

      <div className="relative z-10 container mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="max-w-2xl">
          <p
            className="text-accent uppercase mb-8"
            style={{ letterSpacing: "0.25em", fontSize: "0.75rem" }}
          >
            Dr. Deanna Romulus, Ed.D., MBA
          </p>
          <h1
            className="text-primary font-normal leading-[1.05] mb-8"
            style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)", letterSpacing: "-0.01em" }}
          >
            Dr<span className="text-accent">.</span> Romulus
          </h1>
          <div className="h-px bg-accent w-3/5 mb-8" aria-hidden="true" />
          <p
            className="text-primary uppercase mb-8"
            style={{ letterSpacing: "0.3em", fontSize: "0.875rem" }}
          >
            Systems Before Scale
          </p>
          <p className="text-primary/80 text-lg lg:text-xl leading-relaxed mb-12 max-w-xl">
            Helping service-based business owners build structural businesses that generate
            consistent, predictable revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-none h-auto px-8 py-4 text-base"
            >
              <a
                href="https://checklist.drromulusmba.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get the Checklist
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-none h-auto px-8 py-4 text-base"
            >
              <a href="/revenue-architecture-session">Work With Me</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
