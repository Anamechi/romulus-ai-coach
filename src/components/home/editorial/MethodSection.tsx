const steps = [
  {
    number: "01",
    name: "Diagnose",
    description:
      "Identify the single structural constraint preventing predictable revenue. Most service-based business owners are solving the wrong problem.",
  },
  {
    number: "02",
    name: "Design",
    description:
      "Build the system that resolves the constraint — offers, pricing, delivery, and operations engineered to work together.",
  },
  {
    number: "03",
    name: "Scale",
    description:
      "Apply pressure to a structure that can hold it. Revenue compounds because the underlying system is sound.",
  },
];

export const MethodSection = () => {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="h-px bg-accent w-16 mx-auto mb-8" aria-hidden="true" />
          <p className="text-accent uppercase mb-6" style={{ letterSpacing: "0.3em", fontSize: "0.75rem" }}>
            The Method
          </p>
          <h2
            className="text-primary font-normal leading-[1.15]"
            style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)", letterSpacing: "-0.005em" }}
          >
            Diagnose<span className="text-accent">.</span> Design<span className="text-accent">.</span> Scale<span className="text-accent">.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className={`px-0 md:px-10 ${idx > 0 ? "md:border-l md:border-accent/40" : ""}`}
            >
              <p className="text-accent mb-6" style={{ letterSpacing: "0.2em", fontSize: "0.875rem" }}>
                {step.number}
              </p>
              <h3
                className="text-primary font-normal mb-5"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
              >
                {step.name}
              </h3>
              <p className="text-primary/75 text-base leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
