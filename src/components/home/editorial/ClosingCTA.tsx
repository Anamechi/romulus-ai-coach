import { Button } from "@/components/ui/button";

export const ClosingCTA = () => {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-6 lg:px-12 py-24 lg:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <div className="h-px bg-accent w-16 mx-auto mb-10" aria-hidden="true" />
          <h2
            className="text-primary font-normal leading-[1.2] mb-12"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.005em" }}
          >
            If your business feels harder than it should, it's not you.
            It's the structure.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </div>
    </section>
  );
};
