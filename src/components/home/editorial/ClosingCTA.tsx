import { Button } from "@/components/ui/button";
import { BlueprintGrid } from "./BlueprintGrid";

export const ClosingCTA = () => {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#C9A84C" }}>
      <BlueprintGrid color="#1A1A2E" opacity={0.12} size={48} />
      <div className="container mx-auto px-6 lg:px-12 py-24 lg:py-36 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="uppercase mb-6"
            style={{
              color: "#1A1A2E",
              letterSpacing: "0.3em",
              fontSize: "0.75rem",
            }}
          >
            Next Step
          </p>
          <div
            className="h-px w-16 mx-auto mb-10"
            style={{ backgroundColor: "#1A1A2E" }}
            aria-hidden="true"
          />
          <h2
            className="font-normal leading-[1.15] mb-12"
            style={{
              color: "#1A1A2E",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.005em",
            }}
          >
            If your business feels harder than it should, it's not you. It's the structure<span style={{ color: "#1A1A2E" }}>.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-none h-auto px-8 py-4 text-base"
              style={{ backgroundColor: "#1A1A2E", color: "#C9A84C", border: "2px solid #1A1A2E" }}
            >
              <a href="https://checklist.drromulusmba.com/" target="_blank" rel="noopener noreferrer">
                Get the Checklist
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-none h-auto px-8 py-4 text-base"
              style={{ backgroundColor: "transparent", color: "#1A1A2E", border: "2px solid #1A1A2E" }}
            >
              <a href="/revenue-architecture-session">Work With Me</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
