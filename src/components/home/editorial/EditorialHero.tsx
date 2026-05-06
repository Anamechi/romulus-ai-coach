import { Button } from "@/components/ui/button";
import heroImage from "@/assets/dr-romulus-hero.png";

export const EditorialHero = () => {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 max-w-2xl">
            <p className="text-accent uppercase mb-8" style={{ letterSpacing: "0.25em", fontSize: "0.75rem" }}>
              Dr. Deanna Romulus, Ed.D., MBA
            </p>
            <h1
              className="text-primary font-normal leading-[1.05] mb-8"
              style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)", letterSpacing: "-0.01em" }}
            >
              Dr. Romulus
            </h1>
            <div className="h-px bg-accent w-3/5 mb-8" aria-hidden="true" />
            <p className="text-primary uppercase mb-8" style={{ letterSpacing: "0.3em", fontSize: "0.875rem" }}>
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
                <a href="https://checklist.drromulusmba.com/" target="_blank" rel="noopener noreferrer">
                  Get the Checklist
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-none h-auto px-8 py-4 text-base"
              >
                <a href="/contact">Work With Me</a>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <img
              src={heroImage}
              alt="Dr. Deanna Romulus, business strategist and author"
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
