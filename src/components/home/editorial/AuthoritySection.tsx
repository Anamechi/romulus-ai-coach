import aboutImage from "@/assets/dr-romulus-about.png";

export const AuthoritySection = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-xl">
            <h2
              className="text-primary font-normal leading-[1.15] mb-10"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.005em" }}
            >
              Most businesses don't have an effort problem. They have a structure problem.
            </h2>
            <div className="space-y-6 text-primary/80 text-lg leading-relaxed" style={{ maxWidth: "58ch" }}>
              <p>
                Inconsistent revenue is rarely a marketing failure or a discipline failure.
                It's a structural failure — the absence of a system designed to produce a
                predictable result.
              </p>
              <p>
                When the underlying structure is right, growth stops feeling like a series
                of personal heroics. Decisions become clearer. Cash flow becomes legible.
                The business begins to operate independently of motivation.
              </p>
              <p>
                That structure has a name: the DDS Framework — Diagnose, Design, Scale.
                Every engagement begins there.
              </p>
            </div>
          </div>
          <div>
            <img
              src={aboutImage}
              alt="Dr. Romulus working with service-based business owners on business systems"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
