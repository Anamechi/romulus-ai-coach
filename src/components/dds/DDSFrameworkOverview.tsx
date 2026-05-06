import { ChevronRight } from "lucide-react";
import drRomulus from "@/assets/dr-romulus.jpeg";

const STAGES = [
  { label: "Awareness", desc: "Recognize what's broken in your revenue model" },
  { label: "Diagnosis", desc: "Identify the root constraint holding you back" },
  { label: "Clarity", desc: "Map the real problem behind inconsistent income" },
  { label: "Architecture", desc: "Design the right revenue structure" },
  { label: "Systems", desc: "Build repeatable processes that generate income" },
  { label: "Scale", desc: "Grow with confidence on a solid foundation" },
];

const DDSFrameworkOverview = () => (
  <section className="py-20 md:py-28 bg-[hsl(var(--slate-medium))]">
    <div className="container mx-auto px-6 max-w-4xl">
      <div className="text-center mb-14">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
          The DDS Framework™
        </h2>
        <p className="text-lg leading-relaxed max-w-2xl mx-auto" >
          The DDS Framework™ helps founders build predictable revenue by diagnosing structural problems, designing the correct business architecture, and scaling responsibly.
        </p>
      </div>

      {/* Diagnose → Design → Scale visual */}
      <div className="flex items-center justify-center gap-3 md:gap-6 mb-16 flex-wrap">
        {["Diagnose", "Design", "Scale"].map((step, i) => (
          <div key={step} className="flex items-center gap-3 md:gap-6">
            <div className="bg-[hsl(var(--gold))] text-[hsl(var(--slate-deep))] font-semibold px-6 py-3 rounded-lg text-lg">
              {step}
            </div>
            {i < 2 && <ChevronRight className="h-6 w-6 text-[hsl(var(--gold-light))] hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* Expanded 6 stages */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {STAGES.map((stage, i) => (
          <div key={stage.label} className="border border-[hsl(var(--gold)/0.2)] rounded-lg p-5 bg-[hsl(var(--slate-deep)/0.5)]">
            <span className="text-[hsl(var(--gold))] font-mono text-sm mb-1 block">0{i + 1}</span>
            <h3 className="font-display text-lg font-semibold mb-1">{stage.label}</h3>
            <p className="text-sm" >{stage.desc}</p>
          </div>
        ))}
      </div>

      {/* Credibility */}
      <div className="mt-16 flex flex-col sm:flex-row items-center gap-5 justify-center">
        <img
          src={drRomulus}
          alt="Dr. Deanna Romulus, MBA"
          className="w-20 h-20 rounded-full object-cover border-2 border-[hsl(var(--gold)/0.4)]"
          loading="lazy"
        />
        <div className="text-center sm:text-left">
          <p className="font-display font-semibold">Dr. Deanna Romulus, MBA</p>
          <p className="text-sm" >Business Consultant & Revenue Architect</p>
        </div>
      </div>
    </div>
  </section>
);

export default DDSFrameworkOverview;
