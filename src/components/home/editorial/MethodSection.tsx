import { BlueprintGrid } from "./BlueprintGrid";

const steps = [
  {
    number: "01",
    name: "Diagnose",
    letter: "D",
    description:
      "Identify the single structural constraint preventing predictable revenue. Most service-based business owners are solving the wrong problem.",
  },
  {
    number: "02",
    name: "Design",
    letter: "D",
    description:
      "Build the system that resolves the constraint — offers, pricing, delivery, and operations engineered to work together.",
  },
  {
    number: "03",
    name: "Scale",
    letter: "S",
    description:
      "Apply pressure to a structure that can hold it. Revenue compounds because the underlying system is sound.",
  },
];

export const MethodSection = () => {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#1A1A2E" }}>
      <BlueprintGrid opacity={0.06} size={32} />
      <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-32 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <p
            className="uppercase mb-6"
            style={{
              color: "#C9A84C",
              letterSpacing: "0.3em",
              fontSize: "0.75rem",
            }}
          >
            The Method
          </p>
          <div className="h-px bg-accent w-16 mx-auto mb-8" aria-hidden="true" />
          <h2
            className="font-normal leading-[1.15]"
            style={{
              color: "#F5F5F0",
              fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
              letterSpacing: "-0.005em",
            }}
          >
            Diagnose<span style={{ color: "#C9A84C" }}>.</span> Design<span style={{ color: "#C9A84C" }}>.</span> Scale<span style={{ color: "#C9A84C" }}>.</span>
          </h2>
          <p
            className="mt-6 text-lg"
            style={{ color: "rgba(245,245,240,0.7)" }}
          >
            Three stages. Sequential. Non-skippable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-8 lg:p-10 text-center relative"
              style={{ border: "1px solid #C9A84C" }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 uppercase"
                style={{
                  backgroundColor: "#1A1A2E",
                  color: "#C9A84C",
                  letterSpacing: "0.3em",
                  fontSize: "0.7rem",
                }}
              >
                Phase {step.number}
              </div>
              <div
                className="mb-4 mx-auto leading-none"
                style={{ color: "#C9A84C", fontSize: "4.5rem" }}
              >
                {step.letter}
              </div>
              <h3
                className="mb-5 uppercase"
                style={{
                  color: "#F5F5F0",
                  letterSpacing: "0.25em",
                  fontSize: "0.95rem",
                }}
              >
                {step.name}
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: "rgba(245,245,240,0.72)" }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
