import { useEffect } from "react";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const scrollToBooking = () => {
  document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
};

/* Architectural blueprint illustration — Diagnose → Design → Scale */
const BlueprintIllustration = () => (
  <svg
    viewBox="0 0 600 480"
    role="img"
    aria-label="Architectural blueprint of the DDS Framework: Diagnose, Design, Scale"
    className="w-full h-auto"
  >
    {/* Grid background */}
    <defs>
      <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#C9A84C" strokeOpacity="0.12" strokeWidth="0.5" />
      </pattern>
      <pattern id="gridMajor" width="120" height="120" patternUnits="userSpaceOnUse">
        <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#C9A84C" strokeOpacity="0.22" strokeWidth="0.75" />
      </pattern>
    </defs>
    <rect width="600" height="480" fill="#1A1A2E" />
    <rect width="600" height="480" fill="url(#grid)" />
    <rect width="600" height="480" fill="url(#gridMajor)" />

    {/* Corner registration marks */}
    {[
      [16, 16],
      [584, 16],
      [16, 464],
      [584, 464],
    ].map(([x, y], i) => (
      <g key={i} stroke="#C9A84C" strokeWidth="1" fill="none">
        <line x1={x - 8} y1={y} x2={x + 8} y2={y} />
        <line x1={x} y1={y - 8} x2={x} y2={y + 8} />
      </g>
    ))}

    {/* Title block */}
    <g fontFamily="Georgia, serif" fill="#C9A84C">
      <text x="40" y="56" fontSize="10" letterSpacing="3">DDS FRAMEWORK™ — SHEET 01</text>
      <line x1="40" y1="66" x2="200" y2="66" stroke="#C9A84C" strokeWidth="0.75" />
    </g>

    {/* Three phase modules */}
    {[
      { x: 60, label: "DIAGNOSE", num: "01" },
      { x: 235, label: "DESIGN", num: "02" },
      { x: 410, label: "SCALE", num: "03" },
    ].map((m, i) => (
      <g key={m.label}>
        {/* Module rectangle */}
        <rect
          x={m.x}
          y={180}
          width={130}
          height={130}
          fill="none"
          stroke="#C9A84C"
          strokeWidth="1.25"
        />
        {/* Inner detail */}
        <rect
          x={m.x + 12}
          y={192}
          width={106}
          height={106}
          fill="none"
          stroke="#C9A84C"
          strokeOpacity="0.45"
          strokeWidth="0.6"
          strokeDasharray="2 3"
        />
        {/* Letter mark */}
        <text
          x={m.x + 65}
          y={258}
          fontFamily="Georgia, serif"
          fontSize="56"
          fill="#C9A84C"
          textAnchor="middle"
        >
          {m.label.charAt(0)}
        </text>
        {/* Phase number */}
        <text
          x={m.x + 65}
          y={172}
          fontFamily="Georgia, serif"
          fontSize="9"
          letterSpacing="2"
          fill="#C9A84C"
          textAnchor="middle"
        >
          PHASE {m.num}
        </text>
        {/* Label */}
        <text
          x={m.x + 65}
          y={340}
          fontFamily="Georgia, serif"
          fontSize="11"
          letterSpacing="3"
          fill="#F5F5F0"
          textAnchor="middle"
        >
          {m.label}
        </text>
        {/* Dimension marks */}
        <line x1={m.x} y1={355} x2={m.x + 130} y2={355} stroke="#C9A84C" strokeOpacity="0.5" strokeWidth="0.5" />
        <line x1={m.x} y1={350} x2={m.x} y2={360} stroke="#C9A84C" strokeOpacity="0.5" strokeWidth="0.5" />
        <line x1={m.x + 130} y1={350} x2={m.x + 130} y2={360} stroke="#C9A84C" strokeOpacity="0.5" strokeWidth="0.5" />
      </g>
    ))}

    {/* Connecting lines between modules */}
    {[
      [190, 365],
      [365, 365],
    ].map(([x], i) => (
      <g key={i} stroke="#C9A84C" strokeWidth="1" fill="none">
        <line x1={x} y1={245} x2={x + 45} y2={245} />
        <polyline points={`${x + 38},239 ${x + 45},245 ${x + 38},251`} />
      </g>
    ))}

    {/* Footer scale bar */}
    <g stroke="#C9A84C" strokeWidth="0.75" fill="none">
      <line x1="40" y1="430" x2="160" y2="430" />
      <line x1="40" y1="425" x2="40" y2="435" />
      <line x1="100" y1="427" x2="100" y2="433" />
      <line x1="160" y1="425" x2="160" y2="435" />
    </g>
    <text x="40" y="450" fontFamily="Georgia, serif" fontSize="9" letterSpacing="2" fill="#C9A84C">
      SEQUENTIAL · NON-SKIPPABLE
    </text>
    <text x="560" y="450" fontFamily="Georgia, serif" fontSize="9" letterSpacing="2" fill="#C9A84C" textAnchor="end">
      DR. DEANNA ROMULUS, MBA
    </text>
  </svg>
);

const RevenueArchitectureSession = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).pintrk) {
      (window as any).pintrk("track", "checkout", {
        event_id: "eventId0001",
        value: 3500,
        order_quantity: 1,
        currency: "USD",
        lead_type: "RevenueArchitectureBlueprint",
        line_items: [{ product_price: 3500 }],
      });
    }
  }, []);

  return (
    <>
      <SEOHead
        title="Revenue Architecture Blueprint Session | Dr. Deanna Romulus, MBA"
        description="A 90-minute working diagnostic with Dr. Deanna Romulus, MBA. Receive a written Revenue Architecture Blueprint within 5 business days. $3,500, credits in full toward Phase 2 build."
        canonicalUrl="/revenue-architecture-session"
        ogType="website"
      />

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#1A1A2E" }}>
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />
        <div className="container mx-auto px-6 lg:px-12 py-24 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p
                className="uppercase mb-6"
                style={{
                  color: "#C9A84C",
                  fontFamily: "Georgia, serif",
                  letterSpacing: "0.3em",
                  fontSize: "0.75rem",
                }}
              >
                Revenue Architecture Blueprint Session
              </p>
              <h1
                className="font-normal leading-[1.1] mb-8"
                style={{
                  color: "#F5F5F0",
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(2.25rem, 5vw, 4rem)",
                  letterSpacing: "-0.01em",
                }}
              >
                Install the authority and revenue infrastructure your business actually needs
                <span style={{ color: "#C9A84C" }}>.</span>
              </h1>
              <p
                className="mb-10 leading-relaxed"
                style={{
                  color: "rgba(245,245,240,0.78)",
                  fontFamily: "Georgia, serif",
                  fontSize: "1.125rem",
                  maxWidth: "54ch",
                }}
              >
                For service-based business owners earning six figures who are ready to stabilize, scale,
                and systemize income on infrastructure that holds. A 90-minute working diagnostic with
                Dr. Deanna Romulus, MBA — followed by a written Blueprint delivered within 5 business
                days.
              </p>
              <Button
                size="xl"
                onClick={scrollToBooking}
                style={{ backgroundColor: "#C9A84C", color: "#1A1A2E", border: "2px solid #C9A84C" }}
                className="hover:!bg-transparent hover:!text-[#C9A84C]"
              >
                Book Your Blueprint Session
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <p
                className="mt-6 text-sm italic"
                style={{ color: "rgba(245,245,240,0.6)", fontFamily: "Georgia, serif" }}
              >
                Dr. Deanna Romulus, MBA — Revenue Architect · Business Strategist
                <br />
                Author, Systems Before Scale™ — Launching August 11, 2026
              </p>
            </div>
            <div className="lg:pl-8">
              <BlueprintIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* THE STRUCTURAL PROBLEM */}
      <section style={{ backgroundColor: "#F5F5F0" }}>
        <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto">
            <h2
              className="font-normal leading-[1.15] mb-10 text-center"
              style={{
                color: "#1A1A2E",
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.005em",
              }}
            >
              Your revenue shouldn't depend on you showing up every day.
            </h2>
            <ul className="space-y-3 mb-12" style={{ fontFamily: "Georgia, serif" }}>
              {[
                "Revenue volatility month to month",
                "Personal brand tied directly to income",
                "Website that looks like a brochure instead of an authority engine",
                "Manual client acquisition",
                "No clear automation strategy",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-4 p-5 border-l-2"
                  style={{ borderColor: "#C9A84C", color: "#1A1A2E", backgroundColor: "white" }}
                >
                  <span style={{ color: "#C9A84C", letterSpacing: "0.15em", fontSize: "0.8rem" }}>—</span>
                  <span className="text-base lg:text-lg">{item}</span>
                </li>
              ))}
            </ul>
            <div className="text-center border-t border-b py-8" style={{ borderColor: "rgba(26,26,46,0.15)" }}>
              <p
                className="text-lg mb-2"
                style={{ color: "rgba(26,26,46,0.7)", fontFamily: "Georgia, serif" }}
              >
                This is not a marketing problem.
              </p>
              <p
                className="font-normal"
                style={{
                  color: "#1A1A2E",
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                }}
              >
                It's a structural revenue architecture problem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DDS FRAMEWORK METHODOLOGY */}
      <section style={{ backgroundColor: "#1A1A2E" }} className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
        <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-28 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p
              className="uppercase mb-6"
              style={{
                color: "#C9A84C",
                fontFamily: "Georgia, serif",
                letterSpacing: "0.3em",
                fontSize: "0.75rem",
              }}
            >
              The Methodology
            </p>
            <h2
              className="font-normal leading-[1.15] mb-5"
              style={{
                color: "#F5F5F0",
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
              }}
            >
              The DDS Framework<span style={{ color: "#C9A84C" }}>™</span>
              <span style={{ color: "#C9A84C" }}>.</span>
            </h2>
            <p
              className="text-lg"
              style={{ color: "rgba(245,245,240,0.75)", fontFamily: "Georgia, serif" }}
            >
              Three stages. Sequential. Non-skippable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-16">
            {[
              {
                letter: "D",
                word: "Diagnose",
                line: "What is the structural constraint?",
              },
              {
                letter: "D",
                word: "Design",
                line: "What does the architecture look like?",
              },
              {
                letter: "S",
                word: "Scale",
                line: "How does the business run without you in every conversation?",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-8 lg:p-10 text-center relative"
                style={{ border: "1px solid #C9A84C" }}
              >
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 text-xs uppercase"
                  style={{
                    backgroundColor: "#1A1A2E",
                    color: "#C9A84C",
                    fontFamily: "Georgia, serif",
                    letterSpacing: "0.3em",
                  }}
                >
                  Phase 0{idx + 1}
                </div>
                <div
                  className="mb-4 mx-auto leading-none"
                  style={{
                    color: "#C9A84C",
                    fontFamily: "Georgia, serif",
                    fontSize: "4.5rem",
                  }}
                >
                  {step.letter}
                </div>
                <h3
                  className="mb-4 uppercase"
                  style={{
                    color: "#F5F5F0",
                    fontFamily: "Georgia, serif",
                    letterSpacing: "0.25em",
                    fontSize: "0.95rem",
                  }}
                >
                  {step.word}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "rgba(245,245,240,0.75)", fontFamily: "Georgia, serif" }}
                >
                  {step.line}
                </p>
              </div>
            ))}
          </div>

          <blockquote className="max-w-3xl mx-auto text-center">
            <p
              className="italic leading-relaxed mb-4"
              style={{
                color: "#C9A84C",
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.125rem, 1.75vw, 1.375rem)",
              }}
            >
              "AI installed on top of unstructured workflows produces faster chaos, not predictable
              revenue. Structure first. Always."
            </p>
            <cite
              className="not-italic text-sm uppercase"
              style={{
                color: "rgba(245,245,240,0.6)",
                fontFamily: "Georgia, serif",
                letterSpacing: "0.25em",
              }}
            >
              — Dr. Deanna Romulus, MBA
            </cite>
          </blockquote>
        </div>
      </section>

      {/* DELIVERABLES GRID */}
      <section style={{ backgroundColor: "white" }}>
        <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p
              className="uppercase mb-6"
              style={{
                color: "#C9A84C",
                fontFamily: "Georgia, serif",
                letterSpacing: "0.3em",
                fontSize: "0.75rem",
              }}
            >
              What You Receive
            </p>
            <h2
              className="font-normal leading-[1.15]"
              style={{
                color: "#1A1A2E",
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
              }}
            >
              Four deliverables. One working diagnostic<span style={{ color: "#C9A84C" }}>.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[
              {
                num: "Deliverable 01",
                title: "Live Working Diagnostic (90 Minutes)",
                body: "Together we walk through your current operations, your team structure, your sector expansion plans, and the gaps between where you are and where you're heading. No slide deck. No prepared talk. A working session.",
              },
              {
                num: "Deliverable 02",
                title: "Written Revenue Architecture Blueprint",
                body: "A documented diagnostic delivered within 5 business days of the session. Names the structural constraint. Ranks the Revenue Leaks for your specific business. Sequences the build order. Yours to act on with or without me.",
              },
              {
                num: "Deliverable 03",
                title: "Phase 2 Scope of Work",
                body: "If you choose to install the systems we diagnose, the Blueprint includes a written Phase 2 scope with deliverables, 12-week schedule, and Founder Access pricing. Decision is yours — no pressure, no upsell during the session.",
              },
              {
                num: "Deliverable 04",
                title: "Credit Toward Build",
                body: "The full $3,500 Blueprint investment credits toward the Systems Installation Intensive if you choose to build. Your diagnostic is not a separate cost — it's a structured deposit on the build.",
              },
            ].map((card) => (
              <article
                key={card.num}
                className="p-8 lg:p-10 relative"
                style={{
                  backgroundColor: "#F5F5F0",
                  borderTop: "4px solid #C9A84C",
                }}
              >
                <p
                  className="uppercase mb-4"
                  style={{
                    color: "#C9A84C",
                    fontFamily: "Georgia, serif",
                    letterSpacing: "0.3em",
                    fontSize: "0.7rem",
                  }}
                >
                  {card.num}
                </p>
                <h3
                  className="mb-4 leading-tight"
                  style={{
                    color: "#1A1A2E",
                    fontFamily: "Georgia, serif",
                    fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{
                    color: "rgba(26,26,46,0.78)",
                    fontFamily: "Georgia, serif",
                    fontSize: "1rem",
                  }}
                >
                  {card.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* INVESTMENT ANCHOR */}
      <section style={{ backgroundColor: "#F5F5F0" }}>
        <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p
              className="uppercase mb-6"
              style={{
                color: "#C9A84C",
                fontFamily: "Georgia, serif",
                letterSpacing: "0.3em",
                fontSize: "0.75rem",
              }}
            >
              Investment
            </p>
            <h2
              className="font-normal leading-[1.15]"
              style={{
                color: "#1A1A2E",
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
              }}
            >
              $3,500 — anchored to strategist-grade pricing<span style={{ color: "#C9A84C" }}>.</span>
            </h2>
          </div>

          <div
            className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2"
            style={{ border: "1px solid #1A1A2E" }}
          >
            {/* Standard column */}
            <div className="p-8 lg:p-10" style={{ backgroundColor: "white" }}>
              <p
                className="uppercase mb-6"
                style={{
                  color: "rgba(26,26,46,0.5)",
                  fontFamily: "Georgia, serif",
                  letterSpacing: "0.25em",
                  fontSize: "0.7rem",
                }}
              >
                Standard Consulting Discovery
              </p>
              <ul className="space-y-4" style={{ fontFamily: "Georgia, serif", color: "rgba(26,26,46,0.7)" }}>
                {[
                  "Hourly billing across multiple sessions",
                  "$8,000 – $15,000 typical engagement",
                  "4–6 weeks to a written deliverable",
                  "Strategy document, not a working plan",
                ].map((line) => (
                  <li key={line} className="flex gap-3 leading-relaxed">
                    <span style={{ color: "rgba(26,26,46,0.35)" }}>—</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Blueprint column — highlighted */}
            <div
              className="p-8 lg:p-10 relative"
              style={{
                backgroundColor: "#1A1A2E",
                border: "2px solid #C9A84C",
              }}
            >
              <p
                className="uppercase mb-6"
                style={{
                  color: "#C9A84C",
                  fontFamily: "Georgia, serif",
                  letterSpacing: "0.25em",
                  fontSize: "0.7rem",
                }}
              >
                Blueprint Session
              </p>
              <ul className="space-y-4" style={{ fontFamily: "Georgia, serif", color: "rgba(245,245,240,0.85)" }}>
                {[
                  "Fixed price $3,500",
                  "90-minute working session + written Blueprint",
                  "5 business days to delivery",
                  "Credits in full toward Phase 2 build if you proceed",
                ].map((line) => (
                  <li key={line} className="flex gap-3 leading-relaxed">
                    <span style={{ color: "#C9A84C" }}>—</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p
            className="max-w-3xl mx-auto mt-12 text-center leading-relaxed"
            style={{
              color: "#1A1A2E",
              fontFamily: "Georgia, serif",
              fontSize: "1.0625rem",
            }}
          >
            The Blueprint Session is priced at my AI consultant speaking base rate because the
            diagnostic IS the IP. You receive a documented Revenue Architecture Blueprint — actionable
            with or without me on retainer. If you choose to install the systems together, the full
            investment credits toward your Systems Installation Intensive.
          </p>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section style={{ backgroundColor: "white" }}>
        <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto">
            <h2
              className="font-normal leading-[1.15] mb-12 text-center"
              style={{
                color: "#1A1A2E",
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
              }}
            >
              Who this is for<span style={{ color: "#C9A84C" }}>.</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                "Consultants",
                "Coaches",
                "Fractional Executives",
                "Agency Owners",
                "Service-based business owners earning $150K+",
              ].map((item) => (
                <div
                  key={item}
                  className="p-4 flex gap-3"
                  style={{
                    borderLeft: "2px solid #C9A84C",
                    backgroundColor: "#F5F5F0",
                    fontFamily: "Georgia, serif",
                    color: "#1A1A2E",
                  }}
                >
                  <span style={{ color: "#C9A84C" }}>—</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p
              className="text-center italic"
              style={{
                color: "rgba(26,26,46,0.55)",
                fontFamily: "Georgia, serif",
                fontSize: "0.95rem",
              }}
            >
              Not for early-stage business owners or hobby businesses.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS TIMELINE */}
      <section style={{ backgroundColor: "white" }}>
        <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-28 border-t" style={{ borderColor: "rgba(26,26,46,0.1)" }}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p
              className="uppercase mb-6"
              style={{
                color: "#C9A84C",
                fontFamily: "Georgia, serif",
                letterSpacing: "0.3em",
                fontSize: "0.75rem",
              }}
            >
              What to Expect
            </p>
            <h2
              className="font-normal leading-[1.15]"
              style={{
                color: "#1A1A2E",
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
              }}
            >
              From booking to Blueprint in 2 weeks<span style={{ color: "#C9A84C" }}>.</span>
            </h2>
          </div>

          <ol className="max-w-3xl mx-auto relative">
            {[
              {
                n: "01",
                t: "Book and complete pre-session intake",
                b: "After booking, you receive a short intake form covering your current revenue baseline, team structure, tools, and one desired outcome. Submit 48 hours before the session.",
              },
              {
                n: "02",
                t: "90-minute working session with Dr. Romulus",
                b: "Live working diagnostic. No prepared slides. We walk through your operations, name the structural gaps, and identify the single fix that unlocks everything downstream.",
              },
              {
                n: "03",
                t: "Receive your Revenue Architecture Blueprint",
                b: "Within 5 business days of the session, your written Blueprint is delivered. Named constraint, ranked leaks, sequenced build order. Actionable as-is.",
              },
              {
                n: "04",
                t: "Decide your next move",
                b: "You decide whether to install the systems together (with the $3,500 crediting toward Phase 2), implement the Blueprint yourself, or hand it to another team. The diagnostic is yours either way.",
              },
            ].map((step, idx, arr) => (
              <li
                key={step.n}
                className="grid grid-cols-[auto_1fr] gap-6 lg:gap-10 pb-12 relative"
                style={{
                  borderLeft: idx === arr.length - 1 ? "none" : "1px solid rgba(201,168,76,0.3)",
                  marginLeft: "1.5rem",
                  paddingLeft: "2rem",
                }}
              >
                <div
                  className="absolute -left-[1.4rem] top-0 w-14 h-14 flex items-center justify-center"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #C9A84C",
                    color: "#C9A84C",
                    fontFamily: "Georgia, serif",
                    fontSize: "1.125rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  {step.n}
                </div>
                <div className="col-span-2 pl-12">
                  <h3
                    className="mb-3"
                    style={{
                      color: "#1A1A2E",
                      fontFamily: "Georgia, serif",
                      fontSize: "1.375rem",
                    }}
                  >
                    {step.t}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{
                      color: "rgba(26,26,46,0.75)",
                      fontFamily: "Georgia, serif",
                      fontSize: "1rem",
                    }}
                  >
                    {step.b}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FINAL CTA REINFORCEMENT */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#C9A84C" }}>
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(#1A1A2E 1px, transparent 1px), linear-gradient(90deg, #1A1A2E 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />
        <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-28 relative z-10 text-center">
          <h2
            className="font-normal leading-[1.1] mb-6 max-w-3xl mx-auto"
            style={{
              color: "#1A1A2E",
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              letterSpacing: "-0.01em",
            }}
          >
            Stop guessing. Start building<span style={{ color: "#1A1A2E" }}>.</span>
          </h2>
          <p
            className="mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{
              color: "rgba(26,26,46,0.85)",
              fontFamily: "Georgia, serif",
              fontSize: "1.125rem",
            }}
          >
            Your Revenue Architecture Blueprint is waiting on the other side of one 90-minute session.
          </p>
          <Button
            size="xl"
            onClick={scrollToBooking}
            style={{ backgroundColor: "#1A1A2E", color: "#C9A84C", border: "2px solid #1A1A2E" }}
            className="hover:!bg-transparent hover:!text-[#1A1A2E]"
          >
            Book Your Blueprint Session
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
          <p
            className="mt-6 italic"
            style={{
              color: "rgba(26,26,46,0.75)",
              fontFamily: "Georgia, serif",
              fontSize: "0.95rem",
            }}
          >
            $3,500 credits in full toward Systems Installation Intensive if you choose to build.
          </p>
        </div>
      </section>

      {/* BOOKING CALENDAR — DO NOT MODIFY */}
      <section id="booking-section" className="py-24" style={{ backgroundColor: "white" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2
              className="text-center mb-8 font-normal"
              style={{
                color: "#1A1A2E",
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              }}
            >
              Schedule Your Session
            </h2>
            <div className="rounded-xl overflow-auto -webkit-overflow-scrolling-touch" style={{ height: "1400px" }}>
              <iframe
                src="https://link.drromulusmba.com/widget/booking/wlTCpuAi2QG0tn0BVVBG"
                style={{ width: "100%", minHeight: "1400px", border: "none" }}
                scrolling="yes"
                title="Book Revenue Architecture Blueprint Session"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center" style={{ backgroundColor: "#1A1A2E" }}>
        <p
          style={{
            color: "rgba(245,245,240,0.55)",
            fontFamily: "Georgia, serif",
            fontSize: "0.8rem",
          }}
        >
          © {new Date().getFullYear()} Dr. Deanna Romulus, MBA · drromulusmba.com
        </p>
      </footer>
    </>
  );
};

export default RevenueArchitectureSession;
